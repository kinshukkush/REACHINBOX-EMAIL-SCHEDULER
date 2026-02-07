import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const createTransporter = async () => {
    return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER || 'prince.senger76@ethereal.email',
            pass: process.env.SMTP_PASS || 'mw3rRHE8vJe1kfdETA',
        },
    });
};
