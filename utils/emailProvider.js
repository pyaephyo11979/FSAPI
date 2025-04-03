const nodemailer = require('nodemailer');
const sendEmail = async (to,subject,text,html)=>{
    try{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSWORD
            }
          });
          const mailOptions = {
            from: process.env.EMAIL,
            to: to,
            subject: subject,
            text: text,
            html: html
          };
          const info = await transporter.sendMail(mailOptions);
          return info;
    }catch(err){
        return err;
    }
}
module.exports = sendEmail;