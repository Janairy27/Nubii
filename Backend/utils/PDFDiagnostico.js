import PDFDocument from "pdfkit";

import fs from "fs";
import path from "path";

//Se cambia la ruta del logo según la ubicación del archivo
const LOGO_FILE_PATH = "F:\\Estadia\\Nubii\\Backend\\utils\\logo.png";


const COLORES = {
  primario: "#092181",   
  secundario: "#2D5D7B",   
  fondo: "#FFFFFF",       
  fondoAlternado: "#F4F6F8",
  texto: "#0A2361",         
  textoClaro: "#777777",    
  borde: "#CBD4D8",         
  exito: "#66bb6a",        
  advertencia: "#FFA726",   
  peligro: "#67121A",       
};

const TipoTest = [
  { value: 1, nombre: "GAD-7", color: "#42a5f5" },
  { value: 2, nombre: "BAI", color: "#29b6f6", },
  { value: 3, nombre: "STAI", color: "#26c6da", },
  { value: 4, nombre: "PHQ-9", color: "#ef5350" },
  { value: 5, nombre: "BDI-II", color: "#e53935" },
  { value: 6, nombre: "CES-D", color: "#ab47bc" },
  { value: 7, nombre: "PSS", color: "#66bb6a" },
  { value: 8, nombre: "DASS-21", color: "#ffa726" },
  { value: 9, nombre: "Escala de estres", color: "#9ccc65" },
];

const resultadoMap = [
  { value: 1, nombre: "Normal", color: "#66bb6a", },
  { value: 2, nombre: "Leve", color: "#9ccc65", },
  { value: 3, nombre: "Moderado", color: "#eddb36ff", },
  { value: 4, nombre: "Severo", color: "#ff7043", },
  { value: 5, nombre: "Extremo", color: "#e53935", },
];


// --- Helper Functions para Mapeo ---

const getTipoTestInfo = (value) =>
  TipoTest.find((t) => t.value === Number(value)) || {
    nombre: "Desconocido",
    color: "#777777",
  };

const getResultadoInfo = (value) =>
  resultadoMap.find((r) => r.value === Number(value)) || {
    nombre: "N/A",
    color: "#777777",
  };
const drawLine = (doc, x, y, width, color, thickness) => {
  doc.strokeColor(color)
    .lineWidth(thickness)
    .moveTo(x, y)
    .lineTo(x + width, y)
    .stroke();
};
// Función para formatear la fecha 
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return isNaN(date) ? "Fecha Inválida" : date.toLocaleDateString("es-ES", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
export async function generarPDF(datos, grafico, nombrePaciente, tipoReporte) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: "A4" });
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      const headerY = doc.y;

      // Encabezados
      doc.fillColor(COLORES.primario)
        .rect(0, headerY - 20, doc.page.width, 80)
        .fill();

      // Logo
       if (typeof fs !== 'undefined' && fs.existsSync(LOGO_FILE_PATH)) {
        doc.image(LOGO_FILE_PATH, 50, headerY - 10, { fit: [40, 40] });
      }

      // Título
      doc.fillColor('#FFFFFF')
        .font("Helvetica-Bold")
        .fontSize(18)
        .text("Reporte de Diagnósticos del Paciente", 0, headerY - 5, { align: "center" });

      // Línea decorativa
      doc.strokeColor(COLORES.secundario)
        .lineWidth(2)
        .moveTo(doc.page.width / 4, headerY + 15)
        .lineTo((doc.page.width / 4) * 3, headerY + 15)
        .stroke();

      // Información del paciente
      doc.fontSize(10)
        .font("Helvetica")
        .text(`Reporte generado el ${new Date().toLocaleDateString('es-ES')}`, 
               0, headerY + 25, { align: "center" });

      doc.moveDown(2);
      doc.fillColor(COLORES.texto);


      //  Gráfico
      if (grafico) {
        try {
          const img = Buffer.from(grafico.split(",")[1], "base64");

          const CHART_HEIGHT = 200;
          const chartY = doc.y;

          doc.strokeColor(COLORES.borde)
            .lineWidth(1)
            .rect(45, chartY, doc.page.width - 90, CHART_HEIGHT)
            .stroke();

          doc.image(img, 50, chartY + 5, {
            fit: [doc.page.width - 100, CHART_HEIGHT - 10],
            align: "center",
          });

          doc.y = chartY + CHART_HEIGHT + 10;

          doc.font("Helvetica-Bold")
            .fontSize(12)
            .fillColor(COLORES.texto)
            .text("Distribución y Promedios de Test Aplicados", { align: "center" });

          doc.moveDown(2);
        } catch (error) {
          console.error("Error al cargar el gráfico:", error);
          doc.fillColor(COLORES.peligro)
            .text("Error al cargar el gráfico", { align: "center" });
          doc.moveDown(2);
        }
      }

      // Tabla de datos
      const startX = 50;
      let startY = doc.y;
      const pageWidth = doc.page.width - 100;

      // Título de la sección de datos
      doc.fillColor(COLORES.texto)
        .font("Helvetica-Bold")
        .fontSize(14)
        .text("Resultados Detallados por Test", startX, startY);

      startY = doc.y + 15;

      // Columnas
      const columnWidths = [70, 50, 60, 60, 70, 100, 90];
      const headers = ["Tipo de Test", "Total de aplicaciones", "Promedio del puntaje", "Ultima aplicación", "Categorias del resultado", "Interpretaciones", "Recomendaciones"];
      const HEADER_HEIGHT = 50;
      const textYOffset = 5;
      doc.fillColor(COLORES.primario)
        .rect(startX, startY, pageWidth, HEADER_HEIGHT)
        .fill();

      doc.fillColor('#FFFFFF')
        .font("Helvetica-Bold")
        .fontSize(9); 

      headers.forEach((header, i) => {
        doc.text(header,
          startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 3,
          startY + textYOffset,
          {
            width: columnWidths[i] - 6,
            align: "center",
            height: HEADER_HEIGHT - textYOffset,
            valign: 'top'
          }
        );
      });

      drawLine(doc, startX, startY + HEADER_HEIGHT, pageWidth, COLORES.secundario, 1.5);

      doc.font("Helvetica").fontSize(9);
      startY += HEADER_HEIGHT + 5;

      const rowHeight = 40; 


      datos.forEach((row, index) => {
        let y = startY + index * rowHeight;

        // Manejo de paginación
        if (y + rowHeight > doc.page.height - 50) {
          doc.addPage();
          y = 50;
          startY = 50;
          // Repetir encabezado de tabla en nueva página
          doc.fillColor(COLORES.primario).rect(startX, startY, pageWidth, 25).fill();
          doc.fillColor('#FFFFFF').font("Helvetica-Bold").fontSize(9);
          headers.forEach((header, i) => {
            doc.text(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 3, startY + 8, {
              width: columnWidths[i] - 6, align: "center"
            });
          });
          drawLine(doc, startX, startY + 25, pageWidth, COLORES.secundario, 1.5);
          y = startY + 30;
        }

        const tipoTestInfo = getTipoTestInfo(row.tipo_test);
        const resultadoInfo = getResultadoInfo(row.categorias_resultado);

        // Fondo alternado
        if (index % 2 !== 0) {
          doc.fillColor(COLORES.fondoAlternado)
            .rect(startX, y, pageWidth, rowHeight)
            .fill();
        }
        doc.fillColor(COLORES.texto).font("Helvetica");

        let currentX = startX;

        //  Test
        doc.fillColor(tipoTestInfo.color)
          .font("Helvetica-Bold")
          .text(tipoTestInfo.nombre, currentX + 3, y + textYOffset, {
            width: columnWidths[0] - 6, align: "center"
          });
        currentX += columnWidths[0];

        // Total Aplicaciones
        doc.fillColor(COLORES.texto)
          .font("Helvetica")
          .text(String(row.total_aplicaciones), currentX + 3, y + textYOffset, {
            width: columnWidths[1] - 6, align: "center"
          });
        currentX += columnWidths[1];

        // Promedio
        doc.text(Number(row.promedio_puntaje).toFixed(2), currentX + 3, y + textYOffset, {
          width: columnWidths[2] - 6, align: "center"
        });
        currentX += columnWidths[2];

        //  Última Fecha
        doc.text(formatDate(row.ultima_fecha), currentX + 3, y + textYOffset, {
          width: columnWidths[3] - 6, align: "center"
        });
        currentX += columnWidths[3];

        // Categoría
        doc.fillColor(resultadoInfo.color)
          .font("Helvetica-Bold")
          .text(resultadoInfo.nombre, currentX + 3, y + textYOffset, {
            width: columnWidths[4] - 6, align: "center"
          })
          .font("Helvetica");
        currentX += columnWidths[4];

        //  Interpretación 
        doc.fillColor(COLORES.texto)
          .text(row.interpretaciones || "N/A", currentX + 3, y + textYOffset, {
            width: columnWidths[5] - 6, align: "left"
          });
        currentX += columnWidths[5];

        //  Recomendación 
        doc.text(row.recomendaciones || "N/A", currentX + 3, y + textYOffset, {
          width: columnWidths[6] - 6, align: "left"
        });

        drawLine(doc, startX, y + rowHeight, pageWidth, COLORES.borde, 0.1);
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};


// Reporte que estará viendo el profesional
export async function PDFProfesional(datos, grafico, tipoReporte,) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: "A4" });
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      const headerY = doc.y;

      //Encabezado
      doc.fillColor(COLORES.primario)
        .rect(0, headerY - 20, doc.page.width, 80)
        .fill();

      //Logo
       if (typeof fs !== 'undefined' && fs.existsSync(LOGO_FILE_PATH)) {
        doc.image(LOGO_FILE_PATH, 50, headerY - 10, { fit: [40, 40] });
      }

      // Título
      doc.fillColor('#FFFFFF')
        .font("Helvetica-Bold")
        .fontSize(18)
        .text("Diagnósticos", 0, headerY - 5, { align: "center" });

      // Línea decorativa
      doc.strokeColor(COLORES.secundario)
        .lineWidth(2)
        .moveTo(doc.page.width / 4, headerY + 15)
        .lineTo((doc.page.width / 4) * 3, headerY + 15)
        .stroke();

      // Información del reporte
      doc.fontSize(11)
        .font("Helvetica")
        .text(`Reporte de los diagnósticos`, 0, headerY + 25, { align: "center" });

      doc.text(`Fecha de Generación: ${new Date().toLocaleDateString('es-ES')}`,
        0, headerY + 40, { align: "center" });

      doc.moveDown(2);
      doc.fillColor(COLORES.texto);

      //  Gráfico
      if (grafico) {
        try {
          const img = Buffer.from(grafico.split(",")[1], "base64");

          const CHART_HEIGHT = 200;
          const chartY = doc.y;

          doc.strokeColor(COLORES.borde)
            .lineWidth(1)
            .rect(45, chartY, doc.page.width - 90, CHART_HEIGHT)
            .stroke();

          doc.image(img, 50, chartY + 5, {
            fit: [doc.page.width - 100, CHART_HEIGHT - 10],
            align: "center",
          });

          doc.y = chartY + CHART_HEIGHT + 10;

          doc.font("Helvetica-Bold")
            .fontSize(12)
            .fillColor(COLORES.texto)
            .text("Distribución de Promedios de Test por Paciente", { align: "center" });

          doc.moveDown(2);
        } catch (error) {
          console.error("Error al cargar el gráfico:", error);
          doc.fillColor(COLORES.peligro)
            .text("Error al cargar el gráfico", { align: "center" });
          doc.moveDown(2);
        }
      }

      //Tabla de datos
      const startX = 50;
      let startY = doc.y;
      const pageWidth = doc.page.width - 100;

      // Título de la sección de datos
      doc.fillColor(COLORES.texto)
        .font("Helvetica-Bold")
        .fontSize(14)
        .text("Registros de Pacientes Detallados", startX, startY);

      startY = doc.y + 15;

      // Columnas
      const columnWidths = [120, 90, 70, 70, 60, 100];
      const headers = ["Paciente", "Tipo de test", "Total de aplicaciones", "Promedio del puntaje", "Edad del paciente", "Fecha de aplicación"];

      const HEADER_HEIGHT = 35;
      const textYOffset = 5;

      doc.fillColor(COLORES.primario)
        .rect(startX, startY, pageWidth, HEADER_HEIGHT) 
        .fill();

      doc.fillColor('#FFFFFF')
        .font("Helvetica-Bold")
        .fontSize(10);

      headers.forEach((header, i) => {
        doc.text(header,
          startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5,
          startY + textYOffset,
          {
            width: columnWidths[i] - 10,
            align: "center",
            height: HEADER_HEIGHT - textYOffset, 
            valign: 'top'
          }
        );
      });

      drawLine(doc, startX, startY + HEADER_HEIGHT, pageWidth, COLORES.secundario, 1.5);

      doc.font("Helvetica").fontSize(10);
      startY += HEADER_HEIGHT + 5;

      const rowHeight = 28;


      datos.forEach((row, index) => {
        let y = startY + index * rowHeight;

        // Manejo de paginación
        if (y + rowHeight > doc.page.height - 50) {
          doc.addPage();
          y = 50;
          startY = 50;
          // Repetir encabezado
          doc.fillColor(COLORES.primario).rect(startX, startY, pageWidth, 25).fill();
          doc.fillColor('#FFFFFF').font("Helvetica-Bold").fontSize(10);
          headers.forEach((header, i) => {
            doc.text(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, startY + 8, {
              width: columnWidths[i] - 10, align: "center"
            });
          });
          drawLine(doc, startX, startY + 25, pageWidth, COLORES.secundario, 1.5);
          y = startY + 30;
        }

        const tipoTestInfo = getTipoTestInfo(row.tipo_test);

        // Fondo alternado
        if (index % 2 !== 0) {
          doc.fillColor(COLORES.fondoAlternado)
            .rect(startX, y, pageWidth, rowHeight)
            .fill();
        }
        doc.fillColor(COLORES.texto).font("Helvetica");

        let currentX = startX;

        //  Paciente
        doc.fillColor(COLORES.primario)
          .font("Helvetica-Bold")
          .text(row.nombrePaciente || "N/A", currentX + 5, y + textYOffset, {
            width: columnWidths[0] - 10, align: "left"
          });
        currentX += columnWidths[0];

        //  Test 
        doc.fillColor(tipoTestInfo.color)
          .font("Helvetica-Bold")
          .text(tipoTestInfo.nombre, currentX + 5, y + textYOffset, {
            width: columnWidths[1] - 10, align: "center"
          })
          .font("Helvetica");
        currentX += columnWidths[1];

        //  Total Aplicaciones
        doc.fillColor(COLORES.texto)
          .text(String(row.total_aplicaciones), currentX + 5, y + textYOffset, {
            width: columnWidths[2] - 10, align: "center"
          });
        currentX += columnWidths[2];

        //  Promedio
        doc.text(Number(row.promedio_puntaje).toFixed(2), currentX + 5, y + textYOffset, {
          width: columnWidths[3] - 10, align: "center"
        });
        currentX += columnWidths[3];

        //  Edad
        doc.text(String(row.edad), currentX + 5, y + textYOffset, {
          width: columnWidths[4] - 10, align: "center"
        });
        currentX += columnWidths[4];

        // Última Fecha
        doc.text(formatDate(row.ultima_fecha), currentX + 5, y + textYOffset, {
          width: columnWidths[5] - 10, align: "center"
        });

        drawLine(doc, startX, y + rowHeight, pageWidth, COLORES.borde, 0.1);
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
