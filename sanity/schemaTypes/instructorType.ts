import { defineField, defineType } from "sanity";
import { type SchemaTypeDefinition } from "sanity";

export const instructorType: SchemaTypeDefinition = {
    name: "instructor",
    type: "document",
    title: "Instructor",
    fields: [
        {
            name: "name",
            type: "string",
            title: "Name",
            validation: (rule) => rule.required(),
        },
        {
            name: "bio",
            type: "text",
            title: "Biography",
        },
        {
            name: "photo",
            type: "image",
            title: "Photo",
        },
    ],
};