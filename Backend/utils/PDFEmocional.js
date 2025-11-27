import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Configuración estándar para obtener la carpeta actual (__dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  Definir la ruta del logo
// Como la imagen está en la misma carpeta que este archivo, solo ponemos el nombre.
const LOGO_FILE_PATH = path.join(__dirname, "logo.png");

console.log(LOGO_FILE_PATH);

const EMOCIONES_MAPA = {
  1: { nombre: "Ansiedad Generalizada", color: "#E74C3C" },
  2: { nombre: "Ataque de Pánico", color: "#C0392B" },
  3: { nombre: "Inquietud", color: "#E67E22" },
  4: { nombre: "Evitación", color: "#D35400" },
  5: { nombre: "Estrés Agudo", color: "#F39C12" },
  6: { nombre: "Irritabilidad", color: "#F1C40F" },
  7: { nombre: "Agobio", color: "#E67E22" },
  8: { nombre: "Tensión Muscular", color: "#D68910" },
  9: { nombre: "Tristeza Persistente", color: "#3498DB" },
  10: { nombre: "Apatía", color: "#2980B9" },
  11: { nombre: "Desesperanza", color: "#2471A3" },
  12: { nombre: "Fatiga Crónica", color: "#1B4F72" },
  13: { nombre: "Problemas de Sueño", color: "#27AE60" },
  14: { nombre: "Cambios Apetito", color: "#229954" },
  15: { nombre: "Dificultad Concentración", color: "#1E8449" },
  16: { nombre: "Síntomas Somáticos", color: "#145A32" },
};

//  Paleta de colores
const COLORES = {
  primario: "#092181",
  secundario: "#2D5D7B",
  acento: "#355C7D",
  fondo: "#F4F6F8",
  fondoAlternado: "#F5E3E9",
  texto: "#092181",
  textoClaro: "#777777",
  borde: "#CBD4D8",
  exito: "#27AE60",
  advertencia: "#F39C12",
  peligro: "#67121A",
};

function getEmocionData(id) {
  return (
    EMOCIONES_MAPA[id] || {
      nombre: `Emoción ID ${id}`,
      color: COLORES.textoClaro,
    }
  );
}

// Helper
const drawLine = (doc, x, y, width, color = COLORES.borde, thickness = 1) => {
  doc
    .moveTo(x, y)
    .lineTo(x + width, y)
    .strokeColor(color)
    .lineWidth(thickness)
    .stroke();
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return isNaN(date)
    ? "Fecha Inválida"
    : date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
};

export async function generarPDF(datos, grafico, nombrePaciente, tipoReporte) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 40,
        size: "A4",
        info: {
          Title: `Reporte Emocional - ${nombrePaciente}`,
          Author: "Sistema de Seguimiento Emocional",
          Creator: "Nubii ",
        },
      });

      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      // Encabezado
      const headerY = doc.y;

      // Fondo de encabezado con color sólido moderno
      doc
        .fillColor(COLORES.primario)
        .rect(0, headerY - 20, doc.page.width, 80)
        .fill();

      // Logo en la esquina superior izquierda
      if (typeof fs !== "undefined" && fs.existsSync(LOGO_FILE_PATH)) {
        doc.image(LOGO_FILE_PATH, 50, headerY - 10, { fit: [40, 40] });
      }

      //  Título
      doc
        .fillColor("#FFFFFF")
        .font("Helvetica-Bold")
        .fontSize(18)
        .text("Reporte emocional del paciente", 0, headerY - 5, {
          align: "center",
        });

      // Línea decorativa bajo el título
      doc
        .strokeColor(COLORES.secundario)
        .lineWidth(2)
        .moveTo(doc.page.width / 4, headerY + 15)
        .lineTo((doc.page.width / 4) * 3, headerY + 15)
        .stroke();

      // Información del paciente mejorada
      doc
        .fontSize(11)
        .font("Helvetica")
        .text(
          `Paciente: ${nombrePaciente || "No especificado"}`,
          0,
          headerY + 25,
          { align: "center" }
        );

      doc.text(
        `Tipo de Reporte: ${
          tipoReporte || "General"
        } | Fecha: ${new Date().toLocaleDateString("es-ES")}`,
        0,
        headerY + 40,
        { align: "center" }
      );

      doc.moveDown(2);
      doc.fillColor(COLORES.texto);

      // Gráfico
      if (grafico) {
        try {
          const img = Buffer.from(grafico.split(",")[1], "base64");

          const CHART_HEIGHT = 200;
          const chartY = doc.y;

          doc
            .strokeColor(COLORES.borde)
            .lineWidth(1)
            .rect(45, chartY, doc.page.width - 90, CHART_HEIGHT)
            .stroke();

          doc.image(img, 50, chartY + 5, {
            fit: [doc.page.width - 100, CHART_HEIGHT - 10],
            align: "center",
          });

          doc.y = chartY + CHART_HEIGHT + 10;

          // Título del gráfico
          doc
            .font("Helvetica-Bold")
            .fontSize(12)
            .fillColor(COLORES.texto)
            .text("Evoluión de intensidad emocional", { align: "center" });

          doc.moveDown(2);
        } catch (error) {
          console.error("Error al cargar el gráfico:", error);
          doc
            .fillColor(COLORES.peligro)
            .text("Error al cargar el gráfico", { align: "center" });
          doc.moveDown(2);
        }
      }

      // Tabla de datos
      const startX = 50;
      let startY = doc.y;
      const pageWidth = doc.page.width - 100;

      // Título de la sección de datos
      doc
        .fillColor(COLORES.texto)
        .font("Helvetica-Bold")
        .fontSize(14)
        .text("Registros detallados", startX, startY);

      startY = doc.y + 15;

      // Configuración de columnas
      const columnWidths = [90, 90, 140, 90, 70];
      const headers = [
        "Paciente",
        "Fecha",
        "Emoción",
        "Intensidad",
        "Registros",
      ];

      doc
        .fillColor(COLORES.primario)
        .rect(startX, startY, pageWidth, 25)
        .fill();

      // Texto del encabezado
      doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(10);

      headers.forEach((header, i) => {
        doc.text(
          header,
          startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5,
          startY + 8,
          {
            width: columnWidths[i] - 10,
            align: "left",
          }
        );
      });

      // Línea separadora del encabezado
      drawLine(doc, startX, startY + 25, pageWidth, COLORES.secundario, 1.5);

      doc.font("Helvetica").fontSize(10);
      startY += 30;

      const rowHeight = 28;

      //Datos de la tabla
      datos.forEach((row, index) => {
        const y = startY + index * rowHeight;
        const textYOffset = 9;
        if (y + rowHeight > doc.page.height - 50) {
          doc.addPage();
          startY = 50;

          // Repetir encabezado en nueva página
          doc
            .fillColor(COLORES.primario)
            .rect(startX, startY, pageWidth, 25)
            .fill();

          doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(10);

          headers.forEach((header, i) => {
            doc.text(
              header,
              startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5,
              startY + 8,
              {
                width: columnWidths[i] - 10,
                align: "left",
              }
            );
          });

          drawLine(
            doc,
            startX,
            startY + 25,
            pageWidth,
            COLORES.secundario,
            1.5
          );
          startY += 30;
        }

        const emocionData = getEmocionData(row.emocion);
        const paciente = nombrePaciente || "N/A";
        const fecha = formatDate(row.tiempo || row.periodo);
        const promedio = Number(row.promedio_intensidad || 0).toFixed(2);
        const cantidad =
          row.cantidad || row.cantidad_registros || row.total_registros || 0;

        // Fondo alternado para filas para mejor legibilidad
        if (index % 2 !== 0) {
          doc
            .fillColor(COLORES.fondoAlternado)
            .rect(startX, y, pageWidth, rowHeight)
            .fill();
        } else {
          doc
            .fillColor(COLORES.fondo)
            .rect(startX, y, pageWidth, rowHeight)
            .fill();
        }

        // Columna Paciente
        doc
          .fillColor(COLORES.texto)
          .text(paciente, startX + 5, y + textYOffset, {
            width: columnWidths[0] - 10,
            align: "left",
          });

        // Columna Fecha
        doc
          .fillColor(COLORES.texto)
          .text(fecha, startX + columnWidths[0] + 5, y + textYOffset, {
            width: columnWidths[1] - 10,
            align: "left",
          });

        // Columna Emoción
        doc
          .fillColor(emocionData.color)
          .font("Helvetica-Bold")
          .text(
            emocionData.nombre,
            startX + columnWidths.slice(0, 2).reduce((a, b) => a + b, 0) + 5,
            y + textYOffset,
            {
              width: columnWidths[2] - 10,
              align: "left",
            }
          )
          .font("Helvetica");

        // Columna Intensidad
        const intensidad = parseFloat(promedio);
        let colorIntensidad = COLORES.exito;
        if (intensidad > 7) colorIntensidad = COLORES.peligro;
        else if (intensidad > 4) colorIntensidad = COLORES.advertencia;

        doc
          .fillColor(colorIntensidad)
          .text(
            promedio,
            startX + columnWidths.slice(0, 3).reduce((a, b) => a + b, 0) + 5,
            y + textYOffset,
            {
              width: columnWidths[3] - 10,
              align: "center",
            }
          );

        // Columna Registros
        doc
          .fillColor(COLORES.texto)
          .text(
            cantidad.toString(),
            startX + columnWidths.slice(0, 4).reduce((a, b) => a + b, 0) + 5,
            y + textYOffset,
            {
              width: columnWidths[4] - 10,
              align: "center",
            }
          );

        // Línea separadora entre filas
        drawLine(doc, startX, y + rowHeight, pageWidth, COLORES.borde, 0.1);
      });

      // Pie de página
      doc.y = doc.page.height - 40;

      doc
        .fillColor(COLORES.textoClaro)
        .fontSize(8)
        .text(
          "Reporte generado automáticamente - Sistema de Seguimiento Emocional",
          50,
          doc.y,
          { align: "center" }
        );

      doc.text(`Página ${doc.page.number}`, 50, doc.y + 12, {
        align: "center",
      });

      doc.end();
    } catch (err) {
      console.error("Error generando PDF:", err);
      reject(err);
    }
  });
}

// Reporte que estará viendo el profesional
export async function PDFProfesional(
  datos,
  graficoBase64,
  nombreReporte = "Reporte de Gestión Emocional",
  tipoReporte = "Agregado"
) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 40,
        size: "A4",
        info: {
          Title: nombreReporte,
          Author: "Sistema de Seguimiento Emocional",
          Creator: "Nubii App",
        },
      });

      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      //Encabezado
      const headerY = doc.y;

      // Fondo de encabezado con color sólido moderno
      doc
        .fillColor(COLORES.primario)
        .rect(0, headerY - 20, doc.page.width, 80)
        .fill();

      //  Logo en la esquina superior izquierda
      if (
        typeof fs !== "undefined" &&
        LOGO_FILE_PATH &&
        fs.existsSync(LOGO_FILE_PATH)
      ) {
        doc.image(LOGO_FILE_PATH, 50, headerY - 10, { fit: [40, 40] });
      }
      //  Título
      doc
        .fillColor("#FFFFFF")
        .font("Helvetica-Bold")
        .fontSize(18)
        .text(nombreReporte, 0, headerY - 5, { align: "center" });

      // Línea decorativa bajo el título
      doc
        .strokeColor(COLORES.secundario)
        .lineWidth(2)
        .moveTo(doc.page.width / 4, headerY + 15)
        .lineTo((doc.page.width / 4) * 3, headerY + 15)
        .stroke();

      // Información del reporte
      doc
        .fontSize(11)
        .font("Helvetica")
        .text(
          `Alcance: ${tipoReporte} (Múltiples Pacientes)`,
          0,
          headerY + 25,
          { align: "center" }
        );

      doc.text(
        `Fecha de Generación: ${new Date().toLocaleDateString("es-ES")}`,
        0,
        headerY + 40,
        { align: "center" }
      );

      doc.moveDown(2);
      doc.fillColor(COLORES.texto);

      // Gráfico
      if (graficoBase64) {
        try {
          const img = Buffer.from(graficoBase64.split(",")[1], "base64");

          const CHART_HEIGHT = 200;
          const chartY = doc.y;

          doc
            .strokeColor(COLORES.borde)
            .lineWidth(1)
            .rect(45, chartY, doc.page.width - 90, CHART_HEIGHT)
            .stroke();

          doc.image(img, 50, chartY + 5, {
            fit: [doc.page.width - 100, CHART_HEIGHT - 10],
            align: "center",
          });

          doc.y = chartY + CHART_HEIGHT + 10;

          doc
            .font("Helvetica-Bold")
            .fontSize(12)
            .fillColor(COLORES.texto)
            .text("Evolución de intensidad emocional Agregada", {
              align: "center",
            });

          doc.moveDown(2);
        } catch (error) {
          console.error("Error al cargar el gráfico:", error);
          doc
            .fillColor(COLORES.peligro)
            .text("Error al cargar el gráfico", { align: "center" });
          doc.moveDown(2);
        }
      }

      // Tabla de datos
      const startX = 50;
      let startY = doc.y;
      const pageWidth = doc.page.width - 100;

      // Título de la sección de datos
      doc
        .fillColor(COLORES.texto)
        .font("Helvetica-Bold")
        .fontSize(14)
        .text("Registros de Pacientes Detallados", startX, startY);

      startY = doc.y + 15;

      // Configuración de columnas

      const columnWidths = [120, 90, 110, 90, 70];
      const tableHeaders = [
        "Paciente",
        "Período",
        "Emoción",
        "Intensidad",
        "Registros",
      ];

      doc
        .fillColor(COLORES.primario)
        .rect(startX, startY, pageWidth, 25)
        .fill();

      // Texto del encabezado
      doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(10);

      tableHeaders.forEach((header, i) => {
        doc.text(
          header,
          startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5,
          startY + 8,
          {
            width: columnWidths[i] - 10,
            align: "left",
          }
        );
      });

      // Línea separadora del encabezado
      drawLine(doc, startX, startY + 25, pageWidth, COLORES.secundario, 1.5);

      doc.font("Helvetica").fontSize(10);
      startY += 30;

      const rowHeight = 28;

      //Datos de la tabla
      datos.forEach((row, index) => {
        let y = startY + index * rowHeight;
        const textYOffset = 9;

        // Paginación
        if (y + rowHeight > doc.page.height - 50) {
          doc.addPage();
          y = 50;
          startY = 50;

          // Repetir encabezado en nueva página
          doc
            .fillColor(COLORES.primario)
            .rect(startX, startY, pageWidth, 25)
            .fill();

          doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(10);

          tableHeaders.forEach((header, i) => {
            doc.text(
              header,
              startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5,
              startY + 8,
              {
                width: columnWidths[i] - 10,
                align: "left",
              }
            );
          });

          drawLine(
            doc,
            startX,
            startY + 25,
            pageWidth,
            COLORES.secundario,
            1.5
          );
          y = startY + 30;
        }

        const emocionData = getEmocionData(row.emocion);
        const pacienteCell = row.nombrePaciente || "N/A";

        const fecha = formatDate(row.tiempo || row.periodo);
        const promedio = Number(row.promedio_intensidad || 0).toFixed(2);
        const cantidad =
          row.cantidad || row.cantidad_registros || row.total_registros || 0;

        // Fondo alternado para filas
        if (index % 2 !== 0) {
          doc
            .fillColor(COLORES.fondoAlternado)
            .rect(startX, y, pageWidth, rowHeight)
            .fill();
        } else {
          doc
            .fillColor(COLORES.fondo)
            .rect(startX, y, pageWidth, rowHeight)
            .fill();
        }

        let currentX = startX;

        //  Columna Paciente
        doc
          .fillColor(COLORES.texto)
          .text(pacienteCell, currentX + 5, y + textYOffset, {
            width: columnWidths[0] - 10,
            align: "left",
          });
        currentX += columnWidths[0];

        // Columna Fecha/Período
        doc
          .fillColor(COLORES.texto)
          .text(fecha, currentX + 5, y + textYOffset, {
            width: columnWidths[1] - 10,
            align: "left",
          });
        currentX += columnWidths[1];

        //  Columna Emoción
        doc
          .fillColor(emocionData.color)
          .font("Helvetica-Bold")
          .text(emocionData.nombre, currentX + 5, y + textYOffset, {
            width: columnWidths[2] - 10,
            align: "left",
          })
          .font("Helvetica");
        currentX += columnWidths[2];

        // Columna Intensidad
        const intensidad = parseFloat(promedio);
        let colorIntensidad = COLORES.exito;
        if (intensidad > 7) colorIntensidad = COLORES.peligro;
        else if (intensidad > 4) colorIntensidad = COLORES.advertencia;

        doc
          .fillColor(colorIntensidad)
          .text(promedio, currentX + 5, y + textYOffset, {
            width: columnWidths[3] - 10,
            align: "center",
          });
        currentX += columnWidths[3];

        //  Columna Registros
        doc
          .fillColor(COLORES.texto)
          .text(
            cantidad.toString(),
            startX + columnWidths.slice(0, 4).reduce((a, b) => a + b, 0) + 5,
            y + textYOffset,
            {
              width: columnWidths[4] - 10,
              align: "center",
            }
          );

        // Línea separadora entre filas
        drawLine(doc, startX, y + rowHeight, pageWidth, COLORES.borde, 0.1);
      });

      // Pie de página
      doc.y = doc.page.height - 40;

      doc
        .fillColor(COLORES.textoClaro)
        .fontSize(8)
        .text(
          "Reporte generado automáticamente - Sistema de Seguimiento Emocional",
          50,
          doc.y,
          { align: "center" }
        );

      doc.text(`Página ${doc.page.number}`, 50, doc.y + 12, {
        align: "center",
      });

      doc.end();
    } catch (err) {
      console.error("Error generando PDF Profesional:", err);
      reject(err);
    }
  });
}
