import nodemailer from "nodemailer";
import path from "path";

export const sendInicioSesion = async (email, nombreUsuario) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Ruta absoluta del logo
  const logoPath = path.resolve("F:\\Estadia\\Nubii\\frontend\\public\\logo.png");

  // Contenido HTML del correo
  const htmlContent = `
    <div style="background-color:#f4f6f8;padding:40px 0;display:flex;justify-content:center;">
      <div style="max-width:640px;width:100%;background:#ffffff;border-radius:20px;
                  box-shadow:0 6px 24px rgba(9,33,129,0.08);overflow:hidden;
                  font-family:'Segoe UI',sans-serif;color:#2d5d7b;">

        <!-- Encabezado -->
        <div style="background-color:#092181;text-align:center;padding:30px 20px;">
          <img src="cid:logoNubii" alt="Nubii Logo" width="100" style="margin-bottom:12px;" />
          <h1 style="margin:0;color:#ffffff;font-size:26px;letter-spacing:0.6px;">
            ¡Bienvenid@ a Nubii!
          </h1>
        </div>

        <!-- Cuerpo -->
        <div style="padding:40px 45px;">
          <p style="font-size:17px;margin-bottom:12px;">Hola <strong>${nombreUsuario}</strong>,</p>
          <p style="font-size:15px;line-height:1.7;color:#3b5161;">
            Detectamos un inicio de sesión en tu cuenta Nubii. Esperamos que tu experiencia sea excelente 💙.
          </p>

          <div style="background-color:#eef3fa;border-left:5px solid #092181;padding:15px 20px;
                      border-radius:10px;margin:25px 0;color:#444;line-height:1.6;">
            <em>¿No fuiste tú? No te preocupes. Cambia tu contraseña desde el siguiente enlace:</em>
          </div>

          <div style="text-align:center;margin:35px 0;">
            <a href="http://else.mx/forgot-password" target="_blank"
               style="background-color:#092181;color:#fff;text-decoration:none;
                      padding:14px 40px;border-radius:12px;font-weight:600;
                      font-size:16px;display:inline-block;
                      box-shadow:0 4px 10px rgba(9,33,129,0.25);
                      transition:background-color 0.3s ease;">
              Recuperar contraseña
            </a>
          </div>

          <p style="font-size:14px;color:#777;text-align:center;margin-top:20px;">
            Si el botón no funciona, copia y pega este enlace en tu navegador:<br/>
            <a href="http://else.mx/forgot-password" style="color:#092181;text-decoration:none;">
              http://else.mx/forgot-password
            </a>
          </p>
        </div>

        <!-- Pie de página -->
        <div style="background-color:#f1f3f8;padding:16px;text-align:center;color:#555;
                    font-size:13px;border-top:1px solid #d9e2ec;">
          © ${new Date().getFullYear()} <strong>Nubii</strong> — Cuidamos tu bienestar emocional 💙
        </div>
      </div>
    </div>
  `;

  // Enviar correo
  await transporter.sendMail({
    from: `"Nubii" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Inicio de sesión detectado",
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
