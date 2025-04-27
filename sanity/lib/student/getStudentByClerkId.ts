import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function getStudentByClerkId(clerkId: string) {
    console.log("Executing getStudentByClerkId with clerkId:", clerkId);

    const getStudentByClerkIdQuery = defineQuery(
        `*[_type == "student" && clerkId == $clerkId][0]`
    );

    try {
        const student = await sanityFetch({
            query: getStudentByClerkIdQuery,
            params: { clerkId },
        });

        console.log("Sanity query result for student:", student);

        // Return the full student object for debugging
        return student;
    } catch (error) {
        console.error("Error fetching student by clerkId:", error);
        throw new Error("Failed to fetch student by clerkId");
    }
}