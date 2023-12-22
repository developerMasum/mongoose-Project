import nodemailer from 'nodemailer'
import config from '../config';

export const sendEmail = async(to: string,html:string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === ' production',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "farhan.adnan1952@gmail.com",
    pass: "odogzppnxqlrgqjr ",
    },
  });



await transporter.sendMail({
    from: 'farhan.adnan1952@gmail.com', 
    to, 
    subject: "Reset your password within 10 Days? ✔",
    text: "Reset your password ",
    html, 
  });




};
