import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import UserRoutes from "./routes/UserRoutes.js";
import GoogleRoutes from "./routes/GoogleRoutes.js";
import session from "express-session";
import passport from "passport";
import StudentFormRoutes from "./routes/StudentFormRoutes.js";
const app = express();
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
// app.use(
//   session({
//     secret: "keyboard cat",
//     resave: false,
//     saveUninitialized: false,
//   })
// );
app.use(session({ secret: "keyboard cat", cookie: { maxAge: 60000 } }));

// app.set("view engine", "ejs");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // if you're using cookies or sessions
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use("/UserRoutes", UserRoutes);
app.use("/auth", GoogleRoutes);
app.use("/studentform", StudentFormRoutes);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("connected to database");
    app.listen(process.env.PORT, () => {
      console.log(`running port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
