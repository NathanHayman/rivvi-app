import { BsFiletypePdf } from "react-icons/bs";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "patientForm",
  title: "Patient Forms",
  type: "document",
  icon: BsFiletypePdf,
  fields: [
    defineField({
      name: "title",
      title: "Form Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      title: "Form Type",
      type: "string",
      options: {
        list: [
          { title: "Patient Form", value: "patientForm" },
          { title: "Imaging Form", value: "imagingForm" },
          { title: "Medical Records Form", value: "medicalRecordsForm" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "form",
      title: "Form",
      type: "file",
      options: {
        accept: ".pdf",
        storeOriginalFilename: false,
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title,
      };
    },
  },
});
