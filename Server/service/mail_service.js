const nodemailer = require("nodemailer");

class MailService {
    
    async sendMail(to, activationLink) {
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
              user: process.env.SMTP_USER, // generated ethereal user
              pass: process.env.SMTP_PASSWORD, // generated ethereal password
            },
        });
        
        await transporter.sendMail({
            from: process.env.SMTP_USER, // sender address
            to, // list of receivers
            subject: "Активация аккаунта на " + process.env.FRONT_END_URL, // Subject line
            text: "", // plain text body
            html:`
                <div>
                    <h1>Активация аккаунта по ссылке :</h1>
                    <a href= ${activationLink}>${activationLink}</a>
                </div>
            `, // html body
        });
    }
}

module.exports = new MailService();