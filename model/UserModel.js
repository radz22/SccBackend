import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    cloudnaryid: {
      type: String,
    },
    images: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    section: {
      type: String,
      default: "empty",
    },

    usertype: {
      type: String,
      default: "client",
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("user", UserSchema);
