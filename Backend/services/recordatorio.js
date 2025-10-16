import nodemailer from 'nodemailer';

export const RecordatorioEmail = async (email, nombreUsuario, mensaje, tipo_recordatorio) => {
    const transporter = nodemailer.createTestAccount({
        service: 'gmail', auth:{
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"Nubii" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Recordatorio',
        html: `
        <div style="font-family:sans-serif;color:#333">
            <p>Hola ${nombreUsuario},<br>Te recordamos que tienes un recordatorio
            pendiente por culminar el cual es ${mensaje} el cual corresponde a ${tipo_recordatorio}.
            <br>Esperamos puedas terminar tus tareas.</p>
        </div>`,
    });
};
