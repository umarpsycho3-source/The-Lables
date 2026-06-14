const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'umarpsycho3@gmail.com',
    pass: 'yhzhdapbmzzhraej'
  }
});

const mailOptions = {
  from: `"The Label Support" <umarpsycho3@gmail.com>`,
  to: 'umarxgamer04@gmail.com',
  subject: 'Test Email',
  text: 'Testing Nodemailer credentials'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Email sent:', info.response);
  }
});
