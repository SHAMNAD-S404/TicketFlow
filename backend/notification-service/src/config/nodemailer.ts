import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//VERIFY CONNECTION CONFIG
transporter.verify((error, success) => {
  if (error) {
    console.error("Error in configuring email transporter", error);
  } else {
    console.log("✅ Email transporter configured successfully", success);
  }
});
