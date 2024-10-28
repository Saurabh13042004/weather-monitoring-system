const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail(to, subject, text) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
}

module.exports = new EmailService();