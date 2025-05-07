const nodemailer = require('nodemailer');

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendMail(to, subject, text) {
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: to,
            subject: subject,
            text: text
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
        } catch (error) {
            console.log('Error sending email:', error);
            throw error;
        }
    }
}

module.exports = new MailService();
