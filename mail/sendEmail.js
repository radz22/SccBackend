import nodemailer from "nodemailer";
import "dotenv/config";

// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   port: 25,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.PASSWORD,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// const sendEmail = async (data) => {
//   await transporter.sendMail(data);
// };

// export { sendEmail };

let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendEmail = async (data) => {
  let info = await transporter.sendMail(data);
  console.log(data);

  console.log("Message sent: %s", info.messageId);
};
export { sendEmail };
