import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStudentByClerkId } from "@/sanity/lib/student/getStudentByClerkId";
import { createEnrollment } from "@/sanity/lib/student/createEnrollment";

// ✅ Stripe initialization with the latest stable API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const headersList = await headers(); // ✅ Await this
        const signature = headersList.get("stripe-signature");

        if (!signature) {
            return new NextResponse("No signature found", { status: 400 });
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
            console.error(`Webhook signature verification failed: ${errorMessage}`);
            return new NextResponse(`Webhook Error: ${errorMessage}`, {
                status: 400,
            });
        }

        // ✅ Handle the checkout.session.completed event
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;

            const courseId = session.metadata?.courseId;
            const userId = session.metadata?.userId;

            if (!courseId || !userId) {
                return new NextResponse("Missing metadata", { status: 400 });
            }

            const student = await getStudentByClerkId(userId);

            if (!student || !student.data) {
                return new NextResponse("Student not found", { status: 400 });
            }

            await createEnrollment({
                studentId: student.data._id,
                courseId,
                paymentId: session.id,
                amount: session.amount_total! / 100, // Convert cents to dollars
            });

            return new NextResponse(null, { status: 200 });
        }

        // ✅ If not handled, return 200 anyway
        return new NextResponse(null, { status: 200 });
    } catch (error) {
        console.error("Error in webhook handler:", error);
        return new NextResponse("Webhook handler failed", { status: 500 });
    }
}
