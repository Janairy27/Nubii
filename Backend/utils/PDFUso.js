import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const LOGO_FILE_PATH = "F:\\Estadia\\Nubii\\Backend\\utils\\logo.png";

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
  peligro: "#67121A"         
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
// Reporte que se le mostrará al administrador
export async function generarPDF(datos, grafico, tipoReporte,) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: "A4", layout: "landscape",
        info: {
          Title: `Reporte de uso de sistema `,
          Author: "Sistema de Seguimiento Emocional",
          Creator: "Nubii "
        }
       });
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      const headerY = doc.y;

        doc.fillColor(COLORES.primario)
        .rect(0, headerY - 20, doc.page.width, 80)
        .fill();

      //  Logo en la esquina superior izquierda
     if (typeof fs !== 'undefined' && fs.existsSync(LOGO_FILE_PATH)) {
             doc.image(LOGO_FILE_PATH, 50, headerY - 10, { fit: [40, 40] });
           }

      // Título del reporte
      doc.fillColor('#FFFFFF')
      .font("Helvetica-Bold")
      .fontSize(20).
      text("Reporte de uso del sistema", 0, headerY - 5,  { align: "center" });

      // Línea decorativa bajo el título
      doc.strokeColor(COLORES.secundario)
        .lineWidth(2)
        .moveTo(doc.page.width / 4, headerY + 15)
        .lineTo((doc.page.width / 4) * 3, headerY + 15)
        .stroke();

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
          
          // Contenedor para el gráfico 
          doc.strokeColor(COLORES.borde)
            .lineWidth(1)
            .rect(45, chartY, doc.page.width - 90, CHART_HEIGHT)
            .stroke();

        doc.image(img, 50, chartY + 5, {
         fit: [doc.page.width - 100, CHART_HEIGHT - 10],
          align: "center",
          valign: "center",
        });
        doc.y = chartY + CHART_HEIGHT + 10; 

         doc.font("Helvetica-Bold")
            .fontSize(12)
            .fillColor(COLORES.texto)
            .text("Comparativo del uso del sistema ", { align: "center" });
            
          doc.moveDown(2); 
      }  catch (error) {
          console.error("Error al cargar el gráfico:", error);
          doc.fillColor(COLORES.peligro)
            .text("Error al cargar el gráfico", { align: "center" });
          doc.moveDown(2);
        }
      }

       // Tabla de datos
      const startX = 50;
     //let currentY = doc.y + 15; 
      const pageWidth = doc.page.width - 100;
      
      // Título de la sección de datos
      doc.fillColor(COLORES.texto)
        .font("Helvetica-Bold")
        .fontSize(14)
        .text("Registros detallados", startX, doc.y);
        
     let currentY = doc.y + 15;
      // Encabezado de la tabla
      const columnWidths = [120, 60, 70, 110, 110, 110, 70, 90];
      const headers = ["Nombre", "Rol", "No. Test realizados", "No. Actividades completadas", "Promedio satisfacción", "No. actividades publicadas", "No. Test aplicados", "Ultima actividad"];
      const headerHeight = 40;
      const rowHeight = 28; 
      const textYOffset = 9;
      doc.fillColor(COLORES.primario)
        .rect(startX, currentY, pageWidth, headerHeight)
        .fill();

      // Texto del encabezado
      doc.fillColor('#FFFFFF')
        .font("Helvetica-Bold")
        .fontSize(10);
        

       headers.forEach((header, i) => {
        doc.text(header, 
          startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, 
          currentY + 5, 
          {
            width: columnWidths[i] - 10,
            align: "center",
            lineGap: -4
          }
        );
      });
      // Línea separadora del encabezado
      drawLine(doc, startX, currentY + headerHeight, pageWidth, COLORES.secundario, 1.5);

      currentY += headerHeight + 3;
      doc.font("Helvetica").fontSize(10);
      //let yPosition = currentY;
      //const textYOffset = 9;

      //const rowHeight = 28; 

      datos.forEach((row, index) => {
        //const y = yPosition + index * rowHeight; 

       // const textYOffset = 9;

          // Verificar si necesita nueva página
        if (currentY + rowHeight > doc.page.height - 50) {
          doc.addPage();
          currentY = 50;
          
          // Repetir encabezado en nueva página
          doc.fillColor(COLORES.primario)
            .rect(startX, currentY, pageWidth, headerHeight)
            .fill();
            
          doc.fillColor('#FFFFFF')
            .font("Helvetica-Bold")
            .fontSize(10);
            
          headers.forEach((header, i) => {
            doc.text(header, startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, currentY + 8, {
              width: columnWidths[i] - 10,
              align: "center",
              lineGap: -4
            });
          });
          
          //drawLine(doc, startX, currentY + 25, pageWidth, COLORES.secundario, 1.5);
        currentY += headerHeight + 3;

        doc.font("Helvetica").fontSize(10); 
        doc.fillColor(COLORES.texto);
        }

        if (index % 2 !== 0) {
        doc.fillColor(COLORES.fondoAlternado)
            .rect(startX, currentY, pageWidth, rowHeight)
            .fill();
    }

    doc.fillColor(COLORES.texto);



        const nombre = row.nombreUsuario || '';
        const rol = row.tipo_usuario || '';
        const testReal = row.total_test_realizados || 0;
        const actReal = row.actividades_completadas || 0;
        const promSatis = Number(row.promedio_satisfaccion).toFixed(2) || "N/A";
        const actPublic = row.actividades_publicadas || 0;
        const test = row.test_aplicados || 0;
        const fecha = row.ultima_actividad ? new Date(row.ultima_actividad).toLocaleDateString("es-ES") : "N/A";

        const fila = [nombre, rol, String(testReal), String(actReal), promSatis, String(actPublic), String(test), fecha];

       fila.forEach((text, i) => {
          const currentX = startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
          const columnW = columnWidths[i];
          const textPadding = 5; 

          doc.text(String(text), 
          currentX + textPadding, 
          currentY + textYOffset, 
          {
            width: columnW - (textPadding * 2),
            align: "left",
            ellipsis: true,
          }
      );
        });

      // Línea separadora HORIZONTAL entre filas
        doc.strokeColor(COLORES.borde)
           .lineWidth(1)
           .moveTo(startX, currentY + rowHeight)
           .lineTo(startX + pageWidth, currentY + rowHeight)
           .stroke();
        currentY += rowHeight;
      });
      // Pie de página
      doc.y = currentY + 10;
      
      doc.fillColor(COLORES.textoClaro)
        .fontSize(8)
        .text("Reporte generado automáticamente - Sistema de Seguimiento Emocional", 
              50, doc.y, { align: "center" });
      
      doc.text(`Página ${doc.page.number}`, 50, doc.y + 12, { align: "center" });


      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

