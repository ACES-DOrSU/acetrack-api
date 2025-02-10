import nodemailer from "nodemailer";
// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    // user: "japinanclarence@gmail.com",
    // pass:"uzfufenwxeiufdli",
  },
});

export const sendMail = async (to, subject, msg) => {
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: msg,
  });
};
