import express from "express";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import { UserModel } from "../model/UserModel.js";
import "dotenv/config";
import { cloudinaryExport } from "../cloudnary/cloudnary.js";
const GoogleRoutes = express.Router();

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await UserModel.findOne({ email: profile.email });

//         if (!user) {
//           const uploadedResponse = await cloudinaryExport.uploader.upload(
//             profile.picture,
//             {
//               upload_preset: "LibraryBook",
//             }
//           );

//           if (uploadedResponse) {
//             user = new UserModel({
//               cloudnaryid: uploadedResponse.public_id,
//               images: uploadedResponse.secure_url,
//               name: profile.displayName,
//               email: profile.emails[0].value,
//             });
//           }

//           await user.save();
//         }

//         return done(null, user);
//       } catch (error) {
//         return done(error, null);
//       }
//     }
//   )
// );

// GoogleRoutes.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// GoogleRoutes.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login/failed" }),
//   (req, res) => {
//     res.redirect("http://localhost:5173/");
//   }
// );

// GoogleRoutes.get("/user", async (req, res) => {
//   try {
//     const getDataFromGoogle = req.user.email;

//     const findEmail = await UserModel.findOne({ email: getDataFromGoogle });
//     if (!findEmail) {
//       return res.status(401).send({ data: "errors" });
//     }
//     const findId = findEmail._id;
//     const findbyEmail = findEmail.email;
//     return res.status(200).send({
//       data: findEmail,
//       status: "true",
//       userid: findId,
//       email: findbyEmail,
//     });
//   } catch {
//     return res.status(400).send({ error: "erorr" });
//   }
// });
// GoogleRoutes.get("/logout", (req, res, next) => {
//   req.logout(function (err) {
//     if (err) {
//       return next(err);
//     }
//     res.redirect("https://sccfrontend.onrender.com/");
//   });
// });

// GoogleRoutes.get("/login/failed", (req, res) => {
//   res.status(401).json({
//     success: false,
//     message: "failure",
//   });
// });

GoogleRoutes.post("/googlecreated", async (req, res) => {
  try {
    const { email, name, images } = req.body;
    const existingEmail = await UserModel.findOne({ email: email });
    if (existingEmail) {
      return res.json({ data: existingEmail });
    } else {
      const newEmail = new UserModel({
        email: email,
        name: name,
        images: images,
      });
      await newEmail.save();
      return res.json({ data: newEmail });
    }
  } catch (error) {
    console.log(error);
  }
});

GoogleRoutes.post("/googledata", async (req, res) => {
  try {
    const { email } = req.body;

    const findByEmail = await UserModel.findOne({ email: email });

    if (findByEmail) {
      res.status(200).send({ data: findByEmail });
    }
  } catch {
    res.status(400).send({ msg: "server error" });
  }
});
export default GoogleRoutes;
