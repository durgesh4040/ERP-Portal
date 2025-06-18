import nodemailer from "nodemailer"

export const transporter =nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "finaldig1234@gmail.com",
    pass: "jxfg uwtr zual emmz",
  }
});