import nodemailer from 'nodemailer';
const sendMail = async (req, res) => {
  const passw = process.env.MAIL_PASSW;
  //   connect with smtp

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: 465,
    port: 465,
    auth: {
      user: 'sahilsrawat67@gmail.com',
      pass: passw,
    },
  });

  var mailOptions = {
    from: 'sahilsrawat67@gmail.com',
    to: 'rwtshail1@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!',
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
export default sendMail;
