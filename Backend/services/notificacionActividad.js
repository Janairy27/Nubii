import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const sendNotificacion = async (
  email,
  nombrePaciente,
  nombreProfesional
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //Obtenemos la ruta del directorio actual: .../Nubii/Backend/utils
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Construimos la ruta al logo.
  // Usamos '../..' para salir de 'utils' -> 'Backend' -> Raíz del proyecto.
  // Desde la raíz, entramos a 'frontend/public/logo.png'.
  const logoPath = path.join(
    __dirname,
    "../..",
    "frontend",
    "public",
    "logo.png"
  );
  if (!fs.existsSync(logoPath)) {
    console.error("¡ALERTA! El sistema no encuentra la imagen en:", logoPath);
  }
  // Contenido HTML del correo
  const htmlContent = `
    <div style="background-color:#F4F6F8;padding:40px 0;display:flex;justify-content:center;">
      <div style="max-width:640px;width:100%;background:#ffffff;border-radius:16px;
                  box-shadow:0 6px 20px rgba(45,93,123,0.1);overflow:hidden;">

        <!-- Encabezado con logo -->
        <div style="background-color:#0A2361;text-align:center;padding:25px;">
          <img src="cid:logoNubii" alt="Nubii Logo" width="100" style="margin-bottom:10px;" />
          <h1 style="margin:0;color:#F5E3E9;font-size:24px;letter-spacing:0.5px;">
            Bienvenid@ a Nubii
          </h1>
        </div>

        <!-- Cuerpo principal -->
        <div style="padding:35px 45px;font-family:'Segoe UI',sans-serif;color:#2D5D7B;">
          <p style="font-size:17px;margin-bottom:10px;">Hola <strong>${nombrePaciente}</strong>,<br>Esperamos que te encuentres muy bien.</p>
          <p style="font-size:15px;line-height:1.7;color:#355C7D;">
            Queremos informarte que el profesional <strong>${nombreProfesional}</strong> ha compartido una nueva actividad diseñada para apoyar y
            fortalecer tu salud mental.
          </p>

          <div style="background-color:#CBD4D8;border-left:5px solid #2D5D7B;padding:15px 20px;
                      border-radius:8px;margin:25px 0;color:#555;">
            <em>Creemos que esta actividad puede ser de gran utilidad en tu proceso de bienestar, 
            por lo que te invitamos a conocer todos los detalles ingresando en el siguiente enlace: </em>
          </div>

          <div style="text-align:center;margin:30px 0;">
            <a href="http://else.mx/login" 
               style="background-color:#092181;color:#fff;text-decoration:none;
                      padding:14px 36px;border-radius:10px;font-weight:600;
                      display:inline-block;font-size:16px;box-shadow:0 3px 8px rgba(9,33,129,0.3);">
              Iniciar sesión en Nubii
            </a>
          </div>

          <p style="font-size:14px;color:#777;text-align:center;margin-top:25px;">
            Si el botón no funciona, copia y pega este enlace en tu navegador:<br/>
            <a href="http://else.mx/login" style="color:#0A2361;text-decoration:none;">
              http://else.mx/login
            </a>
          </p>
        </div>

        <!-- Pie de página -->
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
    subject: "Nueva actividad para tu bienestar emocional",
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
