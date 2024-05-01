import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    studentid: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const MessageModel = mongoose.model("messagemodel", MessageSchema);
