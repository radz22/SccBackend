import express from "express";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { cloudinaryExport } from "../cloudnary/cloudnary.js";
import { UserModel } from "../model/UserModel.js";
import { sendEmail } from "../mail/sendEmail.js";
const UserRoutes = express.Router();
const saltRound = 10;

function generateRandomSixDigits() {
  // Generate a random number between 100000 and 999999 (inclusive)
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return randomNumber;
}

UserRoutes.post("/otp", async (req, res) => {
  try {
    const { email, name } = req.body;
    const randomOTP = generateRandomSixDigits();
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    let info = await transporter.sendMail({
      from: process.env.EMAIL, // Sender address
      to: email, // List of recipients
      subject: "OTP FOR CREATING ACCOUNT", // Subject line
      text: `Hello ${name}

      Your OTP : ${randomOTP}`, // Plain text body
    });

    console.log("Message sent: %s", info.messageId);
    res.status(200).send({ OTP: randomOTP });
  } catch {
    res.status(400).send({ msg: "server error" });
  }
});

UserRoutes.post("/resetotp", async (req, res) => {
  try {
    const { email } = req.body;
    const randomOTP = generateRandomSixDigits();
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    let info = await transporter.sendMail({
      from: process.env.EMAIL, // Sender address
      to: email, // List of recipients
      subject: "OTP FOR RESET PASSWORD", // Subject line
      text: `Your OTP : ${randomOTP}`, // Plain text body
    });
    console.log("Message sent: %s", info.messageId);
    res.status(200).send({ OTP: randomOTP });
  } catch {
    res.status(400).send({ msg: "server error" });
  }
});
UserRoutes.post("/signup", async (req, res) => {
  try {
    const hash = await bcrypt.genSalt(saltRound);
    const { images, name, email, password } = req.body;

    const findEmail = await UserModel.findOne({ email: email });

    if (!findEmail) {
      const uploadedResponse = await cloudinaryExport.uploader.upload(images, {
        upload_preset: "LibraryBook",
      });

      if (uploadedResponse) {
        const data = {
          cloudnaryid: uploadedResponse.public_id,
          images: uploadedResponse.secure_url,
          name: name,
          email: email,
          password: await bcrypt.hash(password, hash),
        };

        const createUser = await UserModel.create(data);
        if (createUser) {
          return res.status(200).send({ msg: "sucess created " });
        }
      }
    } else {
      res.status(401).send({ msg: "existing user" });
    }
  } catch {
    res.status(400).send({ msg: "server error" });
  }
});

UserRoutes.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const findByEmail = await UserModel.findOne({ email });
    const findPassword = findByEmail.password;
    const findUsertype = findByEmail.usertype;
    const findId = findByEmail._id;
    const findEmail = findByEmail.email;

    if (!findPassword) {
      res.status(401).send({ msg: "not user found" });
    }

    const comparePassword = await bcrypt.compare(password, findPassword);

    if (comparePassword) {
      const token = jwt.sign({ email: findByEmail.email }, process.env.JWTKEY, {
        expiresIn: "1d",
      });

      if (token) {
        res.status(200).send({
          token: token,
          status: "Sucess Login",
          usertype: findUsertype,
          userid: findId,
          email: findEmail,
        });
      }
    }
  } catch {
    res.status(400).send({ msg: "server error" });
  }
});

UserRoutes.post("/userdata", async (req, res) => {
  try {
    const { token } = req.body;

    const user = jwt.verify(token, process.env.JWTKEY, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    if (user == "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }

    const findEmail = user.email;
    const findByEmail = await UserModel.findOne({ email: findEmail });

    if (findByEmail) {
      res.status(200).send({ data: findByEmail });
    }
  } catch {
    res.status(400).send({ msg: "server error" });
  }
});

UserRoutes.post("/googlefindUser", async (req, res) => {
  try {
    const { email, name, images } = req.body;
    let user = await UserModel.findOne({ email: email });

    if (!user) {
      const uploadedResponse = await cloudinaryExport.uploader.upload(images, {
        upload_preset: "LibraryBook",
      });

      if (uploadedResponse) {
        user = new UserModel({
          cloudnaryid: uploadedResponse.public_id,
          images: uploadedResponse.secure_url,
          name: name,
          email: email,
        });
      }

      await user.save();
    }

    return res.send({
      status: "Success",
      usertype: user.usertype,
      userid: user._id,
      email: user.email,
    });
  } catch {
    return res.status(400).send({ msg: "server erorr" });
  }
});
UserRoutes.post("/googledata", async (req, res) => {
  try {
    const { email } = req.body;

    const findByEmail = await UserModel.findOne({ email: email });

    res.status(200).send({ data: findByEmail });
  } catch {
    res.status(400).send({ msg: "server error" });
  }
});
UserRoutes.post("/edituser", async (req, res) => {
  try {
    const { id, images, name } = req.body;

    const findByOne = await UserModel.findOne({ _id: id });
    const findCloudNary = findByOne.cloudnaryid;

    const destroy = await cloudinaryExport.uploader.destroy(findCloudNary);
    if (destroy) {
      const uploadedResponse = await cloudinaryExport.uploader.upload(images, {
        upload_preset: "LibraryBook",
      });
      if (uploadedResponse) {
        const user = await UserModel.findOneAndUpdate(
          { _id: id },
          {
            name: name,
            cloudnaryid: uploadedResponse.public_id,
            images: uploadedResponse.secure_url,
          },
          { new: true }
        );
        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).send("sucess");
      }
    }
  } catch {
    res.status(400).send({ msg: "server error" });
  }
});

UserRoutes.post("/deleteuser", async (req, res) => {
  try {
    const { email } = req.body;

    const findEmailDelete = await UserModel.findOneAndDelete({ email: email });
    if (!findEmailDelete) {
      res.status(401).send({ msg: "not user found" });
    }

    res.status(200).send({ msg: "sucess" });
  } catch {
    res.status(400).send({ msg: "server error" });
  }
});

UserRoutes.post("/resetpassword", async (req, res) => {
  try {
    const hash = await bcrypt.genSalt(saltRound);

    const { email, password } = req.body;
    const resetPassword = await UserModel.findOneAndUpdate(
      { email: email },
      {
        password: await bcrypt.hash(password, hash),
      },
      { new: true }
    );

    if (!resetPassword) {
      return res.status(401).send({ msg: "not sucess" });
    }
    return res.status(200).send({ msg: "sucess" });
  } catch {
    return res.status(400).send({ msg: "server error" });
  }
});

UserRoutes.get("/", async (req, res) => {
  try {
    const getAllUser = await UserModel.find({});
    return res.status(200).send(getAllUser);
  } catch {
    return res.status(400).send({ error: "server error" });
  }
});

export default UserRoutes;
