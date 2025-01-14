import { transporter } from "../config/nodemailer";
import ejs from 'ejs';
import path from 'path';

export const sendEmail = async (to: string, subject: string, templateName: string,templateData:object) => {
    try {
        const templatePath = path.join(__dirname,`../templates/${templateName}.ejs`);
        const htmlContent = await ejs.renderFile(templatePath,templateData);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: htmlContent,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfullly:', info.response)
    } catch (error) {
        console.error('Error in sending email:', error);
    }
}