import nodemailer from 'nodemailer';

export async function Recuperacion(to, subject, html) {
    try{
         const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS},
        });

        await transporter.sendMail({
            from: `"Soporte" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log("correo enviado correctamente a ", to);
    }catch(error){
        console.error("Error enviando correo:", error);
        throw error; 
    }
}