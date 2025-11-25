import nodemailer from "nodemailer";

export const sendEmailNotification = async (email, nombrePaciente, nombreProfesional) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',  auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });


 // Ruta absoluta del logo (ajústar si se cambia la ubicación)
      const logoPath = path.resolve("F:\\Estadia\\Nubii\\frontend\\public\\logo.png");
      
    
      // Contenido HTML del correo
 const htmlContent = `
  <div style="background-color:#F4F6F8;padding:40px 0;display:flex;justify-content:center;">
    <div style="max-width:640px;width:100%;background:#ffffff;border-radius:16px;
                box-shadow:0 6px 20px rgba(45,93,123,0.1);overflow:hidden;">

      <div style="background-color:#0A2361;text-align:center;padding:25px;">
        <img src="cid:logoNubii" alt="Nubii Logo" width="100" style="margin-bottom:10px;" />
        <h1 style="margin:0;color:#F5E3E9;font-size:24px;letter-spacing:0.5px;">
          Notificación de Mensaje en Chat
        </h1>
      </div>

      <div style="padding:35px 45px;font-family:'Segoe UI',sans-serif;color:#2D5D7B;">
        <p style="font-size:17px;margin-bottom:15px;">Hola <strong>${nombreReceptor}</strong>,</p>
        
        <p style="font-size:16px;line-height:1.7;color:#355C7D;">
          ¡Tienes un mensaje nuevo esperando en tu chat de Nubii!
        </p>

        <div style="background-color:#f3e5f5;border-left:5px solid #7e57c2;padding:20px 25px;
                    border-radius:8px;margin:25px 0;color:#311b92;">
          <h3 style="margin-top:0;font-size:18px;">Mensaje de ${nombreRemitente}</h3>
          <p style="margin-bottom:0;font-size:15px;font-weight:600;">
            El mensaje te espera en la plataforma. Por favor, ingresa para leerlo y responder cuando puedas.
          </p>
        </div>

        <p style="font-size:15px;color:#555;margin-top:20px;">
          Recuerda que estas notificaciones se envían cuando has estado inactivo en la plataforma por más de un día.
        </p>

        <div style="text-align:center;margin:30px 0;">
          <a href="http://else.mx/login" 
             style="background-color:#092181;color:#fff;text-decoration:none;
                    padding:14px 36px;border-radius:10px;font-weight:600;
                    display:inline-block;font-size:16px;box-shadow:0 3px 8px rgba(9,33,129,0.3);">
            Ir al Chat y Responder
          </a>
        </div>

        <p style="font-size:14px;color:#777;text-align:center;margin-top:25px;">
          Si el botón no funciona, copia y pega este enlace en tu navegador:<br/>
          <a href="http://else.mx/login" style="color:#0A2361;text-decoration:none;">
            http://else.mx/login
          </a>
        </p>
      </div>

      <div style="background-color:#F5E3E9;padding:15px;text-align:center;color:#67121A;
                  font-size:13px;border-top:1px solid #CBD4D8;">
        © ${new Date().getFullYear()} Nubii. Cuidamos tu bienestar emocional. 💙
      </div>
    </div>
  </div>
`;

    await transporter.sendMail({
        from: `"Nubii" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Nuevo chat',
        html: htmlContent,
    attachments: [
      {
        filename: "logo.png",
        path: logoPath,
        cid: "logoNubii", 
      },
    ],
  });

};
