const nodemailer = require("nodemailer");
const {google} = require('googleapis');
class MailService {
    
    async sendMail(to, activationLink) {

        const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
        oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN});
        const accessToken = await oAuth2Client.getAccessToken();
 
        let transporter = nodemailer.createTransport({
            
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.SENDER_EMAIL,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.res.data.access_token
            },
        });
        
        return await transporter.sendMail({
            from: process.env.SENDER_EMAIL, // sender address
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