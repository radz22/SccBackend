import express from "express";
import { MessageModel } from "../model/MessageModel.js";

const MessageRoutes = express.Router();

MessageRoutes.post("/", async (req, res) => {
  try {
    const { email, message, studentid } = req.body;

    const data = {
      studentid: studentid,
      email: email,
      message: message,
    };
    const messageCreate = await MessageModel.create(data);
    if (!messageCreate) {
      return res.status(401).send({ msg: "no sucess" });
    }
    return res.status(200).send({ msg: " sucess" });
  } catch {
    return res.status(400).send({ msg: " server error" });
  }
});
MessageRoutes.post("/findusers", async (req, res) => {
  try {
    const { id } = req.body;
    //  Use Mongoose to find two users based on the provided criteria
    const findId = await MessageModel.find({ studentid: id });

    res.json(findId);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
export default MessageRoutes;
