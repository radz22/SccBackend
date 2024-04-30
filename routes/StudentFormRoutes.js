import express from "express";
import { StudentFormModel } from "../model/StudentFormModel.js";
import { UserModel } from "../model/UserModel.js";
const StudentFormRoutes = express.Router();

StudentFormRoutes.post("/", async (req, res) => {
  try {
    const {
      studentid,
      firstname,
      lastname,
      middlename,
      lrn,
      idstudent,
      course,
      gradelevel,
      schoolyear,
      type,
    } = req.body;

    const data = {
      studentid,
      firstname,
      lastname,
      middlename,
      lrn,
      idstudent,
      course,
      gradelevel,
      schoolyear,
      type,
    };

    const createUser = await StudentFormModel.create(data);

    if (!createUser) {
      return res.status(401).send("not sucess");
    }

    return res.status(200).send(createUser);
  } catch {
    return res.status(400).send({ msg: "server error" });
  }
});

StudentFormRoutes.get("/", async (req, res) => {
  try {
    const getAllUser = await StudentFormModel.find({});
    return res.status(200).send(getAllUser);
  } catch {
    return res.status(400).send({ msg: "server error" });
  }
});

StudentFormRoutes.post("/studentsection", async (req, res) => {
  try {
    const { id, section } = req.body;
    const findbyId = await StudentFormModel.findOneAndUpdate(
      { studentid: id },
      {
        section: section,
      },
      { new: true }
    );
    if (!findbyId) {
      return res.status(401).send("not sucess");
    }

    const findUser = await UserModel.findOneAndUpdate(
      { _id: id },
      {
        section: section,
      },
      { new: true }
    );
    return res.status(200).send(findbyId, { msg: findUser });
  } catch {
    return res.status(400).send({ msg: "server error" });
  }
});

StudentFormRoutes.post("/yourprofile", async (req, res) => {
  try {
    const { id } = req.body;

    const findById = await StudentFormModel.findOne({ studentid: id });
    if (!findById) {
      return res.status(401).send("not sucess");
    }
    return res.status(200).send(findById);
  } catch {
    return res.status(400).send("server error");
  }
});

StudentFormRoutes.post("/studentdelete", async (req, res) => {
  try {
    const { id } = req.body;
    const findByIdandDelete = await StudentFormModel.findByIdAndDelete({
      _id: id,
    });
    if (!findByIdandDelete) {
      return res.status(401).send("not sucess");
    }
    return res.status(200).send(" sucess");
  } catch {
    return res.status(401).send("server error");
  }
});
export default StudentFormRoutes;
