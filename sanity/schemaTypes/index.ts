import { type SchemaTypeDefinition } from 'sanity'
import { studentType } from './studentType'
import { courseType } from './courseType'
import { blockContent } from './blockContent'
import { categoryType } from './categoryType'
import { enrollmentType } from './enrollmentType'
import { instructorType } from './instructorType'
import { moduleType } from './moduleType'
import { lessonType } from './lessonType'
import { lessonCompletionType } from './lessonCompletionType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [studentType, courseType, blockContent, categoryType, enrollmentType, instructorType, moduleType, lessonType, lessonCompletionType],
}
