import mongoose from "mongoose";
const studentFormSchema = new mongoose.Schema(
  {
    studentid: {
      type: String,
    },
    firstname: {
      type: String,
      required: true,
    },

    lastname: {
      type: String,
      required: true,
    },
    middlename: {
      type: String,
      required: true,
    },

    lrn: {
      type: String,
      required: true,
    },

    idstudent: {
      type: String,
      required: true,
    },

    course: {
      type: String,
      required: true,
    },
    gradelevel: {
      type: String,
      required: true,
    },

    schoolyear: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      default: "empty",
    },
  },
  {
    timestamps: true,
  }
);

export const StudentFormModel = mongoose.model(
  "studentformdata",
  studentFormSchema
);
