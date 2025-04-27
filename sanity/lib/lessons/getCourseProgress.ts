import { defineQuery } from "groq";
import { sanityFetch } from "../live";
import { getStudentByClerkId } from "../student/getStudentByClerkId";
import { calculateCourseProgress } from "@/lib/courseProgress";
import { Module } from "@/sanity.types";

export async function getCourseProgress(clerkId: string, courseId: string) {
  console.log("Fetching student with clerkId:", clerkId);

  // First get the student's Sanity ID
  const student = await getStudentByClerkId(clerkId);

  if (!student?.data?._id) {
    console.error("Student not found for clerkId:", clerkId);
    return {
      completedLessons: [],
      courseProgress: 0, // Default progress
    };
  }

  console.log("Student found:", student.data);

  const progressQuery = defineQuery(`{
    "completedLessons": *[_type == "lessonCompletion" && student._ref == $studentId && course._ref == $courseId] {
      ...,
      "lesson": lesson->{...},
      "module": module->{...}
    },
    "course": *[_type == "course" && _id == $courseId][0] {
      ...,
      "modules": modules[]-> {
        ...,
        "lessons": lessons[]-> {...}
      }
    }
  }`);

  const result = await sanityFetch({
    query: progressQuery,
    params: { studentId: student.data._id, courseId },
  });

  console.log("Sanity fetch result:", result);

  const { completedLessons = [], course } = result.data;

  // Calculate overall course progress
  const courseProgress = calculateCourseProgress(
    (course?.modules as unknown as Module[]) || [],
    completedLessons
  );

  return {
    completedLessons,
    courseProgress,
  };
}