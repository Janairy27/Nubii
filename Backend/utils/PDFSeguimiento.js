import PDFDocument from "pdfkit";

import fs from "fs";
import path from "path";

const LOGO_FILE_PATH = "F:\\Estadia\\Nubii\\Backend\\utils\\logo.png";


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
  peligro: "#67121A"         
};

function getEmocionData(id) {
  return EMOCIONES_MAPA[id] || { nombre: `Emoción ID ${id}`, color: COLORES.textoClaro };
}

// Helper 
const drawLine = (doc, x, y, width, color = COLORES.borde, thickness = 1) => {
  doc.moveTo(x, y).lineTo(x + width, y).strokeColor(color).lineWidth(thickness).stroke();
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return isNaN(date) ? "Fecha Inválida" : date.toLocaleDateString("es-ES", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Definición de Tipos de Test
const TipoTest = [
    { value: 1, nombre: "GAD-7", color: "#42a5f5" },
    { value: 2, nombre: "BAI", color: "#29b6f6" },
    { value: 3, nombre: "STAI", color: "#26c6da" },
    { value: 4, nombre: "PHQ-9", color: "#ef5350" },
    { value: 5, nombre: "BDI-II", color: "#e53935" },
    { value: 6, nombre: "CES-D", color: "#ab47bc" },
    { value: 7, nombre: "PSS", color: "#66bb6a" },
    { value: 8, nombre: "DASS-21", color: "#ffa726" },
    { value: 9, nombre: "Escala de estrés", color: "#9ccc65" },
];

// Definición de Categorías de Resultado
const ResultadoMap = [
    { value: 1, nombre: "Normal", color: "#66bb6a" },
    { value: 2, nombre: "Leve", color: "#9ccc65" },
    { value: 3, nombre: "Moderado", color: "#eddb36ff" },
    { value: 4, nombre: "Severo", color: "#ff7043" },
    { value: 5, nombre: "Extremo", color: "#e53935" },
];

//  Funciones de ayuda para mapear los tests y categorías
function getTestTypeData(value) {
   const numericValue = parseInt(value, 10);
  const testT = TipoTest.find(t => t.value === numericValue);
  // Si no se encuentra, devuelve un objeto por defecto
  return testT || { nombre: `Test ID ${value}`, color: COLORES.textoClaro, value: numericValue };
}

function getCategoryData(value) {
  const category = ResultadoMap.find(c => c.value === value);
  return category || { nombre: `Cat. ID ${value}`, color: COLORES.textoClaro };
}

export async function generarPDF(datos, grafico, nombrePaciente, tipoReporte) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        margin: 40, 
        size: "A4",
        info: {
          Title: `Reporte Seguimiento - ${nombrePaciente}`,
          Author: "Sistema de Seguimiento ",
          Creator: "Nubii "
        }
      });
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      const headerY = doc.y;

      // Fondo de encabezado con color sólido moderno
      doc.fillColor(COLORES.primario)
        .rect(0, headerY - 20, doc.page.width, 80)
        .fill();

      //  Logo en la esquina superior izquierda
      if (typeof fs !== 'undefined' && fs.existsSync(LOGO_FILE_PATH)) {
        doc.image(LOGO_FILE_PATH, 50, headerY - 10, { fit: [40, 40] });
      }

       //  Título
      doc.fillColor('#FFFFFF')
        .font("Helvetica-Bold")
        .fontSize(15)
        .text("Reporte de seguimiento emocional individual", 0, headerY - 5, { align: "center" });
      
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
          doc.strokeColor(COLORES.borde)
            .lineWidth(1)
            .rect(45, chartY, doc.page.width - 90, CHART_HEIGHT)
            .stroke();
            
          doc.image(img, 50, chartY + 5, {
            fit: [doc.page.width - 100, CHART_HEIGHT - 10], 
            align: "center",
          });

      doc.y = chartY + CHART_HEIGHT + 10; 
          
    
       
          // Título del gráfico 
          doc.font("Helvetica-Bold")
            .fontSize(12)
            .fillColor(COLORES.texto)
            .text("Seguimiento emocional", { align: "center" });
            
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
        .text("Registros detallados", startX, startY);
        
      startY = doc.y + 15;
        // Encabezado de la tabla
      const columnWidths = [80, 150, 130, 135];
      const headers = ["Fecha", "Emoción", "Promedio de intensidad", "Frecuencia de la emoción"];
      
       
      const getColumnX = (index) => {
          return columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
      };

      doc.fillColor(COLORES.primario)
        .rect(startX, startY, pageWidth, 25)
        .fill();

      // Texto del encabezado
      doc.fillColor('#FFFFFF')
        .font("Helvetica-Bold")
        .fontSize(10);
        
      headers.forEach((header, i) => {
        doc.text(header, 
          startX + getColumnX(i) + 5,
          startY + 8,
          {
            width: columnWidths[i] - 10,
            align: "left"
          }
        );
        });
        // Línea separadora del encabezado
      drawLine(doc, startX, startY + 25, pageWidth, COLORES.secundario, 1.5);

      doc.font("Helvetica").fontSize(10);
      startY += 30;

      const rowHeight = 28; 

      let currentY = startY;

      datos.forEach((row, index) => {
       // const y = startY + index * rowHeight;
        const textYOffset = 9;

        // Verificar si necesita nueva página
        if (currentY + rowHeight > doc.page.height - 50) {
          doc.addPage();
          //y= 50
          currentY = 50;
          
          // Repetir encabezado en nueva página
          doc.fillColor(COLORES.primario)
            .rect(startX, currentY, pageWidth, 25)
            .fill();
            
          doc.fillColor('#FFFFFF')
            .font("Helvetica-Bold")
            .fontSize(10);
            
          headers.forEach((header, i) => {
            doc.text(header, startX + getColumnX(i) + 5, currentY + 8, {
              width: columnWidths[i] - 10,
              align: "left"
            });
          });
          
          drawLine(doc, startX, currentY + 25, pageWidth, COLORES.secundario, 1.5);
          currentY += 30;
        }

        const y = currentY;
        const fecha =  formatDate(row.tiempo || row.periodo);
        const emocion = getEmocionData(row.emocion);
        const promedio = Number(row.promedio_intensidad).toFixed(2);
        const frecuencia = row.frecuencia_emocion;

        if (index % 2 !== 0) {
          doc.fillColor(COLORES.fondoAlternado)
            .rect(startX, y, pageWidth, rowHeight)
            .fill();
        } else { 
           doc.fillColor(COLORES.fondo)
            .rect(startX, y, pageWidth, rowHeight)
            .fill();
        }

         // Columna Fecha
        doc.fillColor(COLORES.texto)
          .text(fecha, startX + getColumnX(0) + 5, y + textYOffset, {
            width: columnWidths[0] - 10, // Usar índice 0
            align: "left"
          });
          // Columna Emoción 
        doc.fillColor(emocion.color)
          .font("Helvetica-Bold")
          .text(emocion.nombre, startX + getColumnX(1) + 5, y + textYOffset, {
            width: columnWidths[1] - 10, // Usar índice 1
            align: "left"
          })
          .font("Helvetica");

          doc.fillColor(COLORES.texto)
          .text(promedio.toString(), startX + getColumnX(2) + 5, y + textYOffset, {
            width: columnWidths[2] - 10, // Usar índice 2
            align: "center"
          });

          doc.fillColor(COLORES.texto)
          .text(frecuencia.toString(), startX + getColumnX(3) + 5, y + textYOffset, {
            width: columnWidths[3] - 10, // Usar índice 3
            align: "center"
          });
        
      drawLine(doc, startX, y + rowHeight, pageWidth, COLORES.borde, 0.1);
          currentY += rowHeight;
       });

      //  Pie de página
      doc.y = doc.page.height - 40; 
      
      doc.fillColor(COLORES.textoClaro)
        .fontSize(8)
        .text("Reporte generado automáticamente - Sistema de Seguimiento Emocional", 
              50, doc.y, { align: "center" });
      
      doc.text(`Página ${doc.page.number}`, 50, doc.y + 12, { align: "center" });

      doc.end();


    } catch (err) {
      console.error("Error generando PDF:", err);
      reject(err);
    }
  });
};


// Reporte que estará viendo el profesional
export async function PDFProfesional(datos, grafico) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        margin: 40, 
        size: "A4", 
        layout: "landscape",
        info: {
          Title: `Reporte Profesional - Seguimiento de Pacientes`,
          Author: "Sistema de Seguimiento Emocional",
          Creator: "Nubii "
        }
      });
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      const headerY = doc.y;
      // Fondo y logo en el encabezado
      doc.fillColor(COLORES.primario)
        .rect(0, headerY - 20, doc.page.width, 80)
        .fill();

      if (typeof fs !== 'undefined' && fs.existsSync(LOGO_FILE_PATH)) {
        doc.image(LOGO_FILE_PATH, 50, headerY - 10, { fit: [40, 40] });
      }

      //Título
      doc.fillColor('#FFFFFF')
        .font("Helvetica-Bold")
        .fontSize(16)
        .text("Reporte de Seguimiento de Pacientes", 0, headerY - 5, { align: "center" });

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
      if (doc.y < 110) { 
        doc.y = 110; 
      }
      doc.moveDown(1); 
      doc.fillColor(COLORES.texto);

      //  Gráfico
      if (grafico) {
        try {

           if (typeof Buffer !== 'undefined') {
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
            .text("Distribución General de Emociones y Tests", { align: "center" });
            
          doc.moveDown(2);
           } else {
             throw new Error("Buffer no disponible para procesar imagen.");
          }


        } catch (error) {
          console.error("Error al cargar el gráfico:", error);
          doc.fillColor(COLORES.peligro)
            .text("Error al cargar el gráfico", { align: "center" });
          doc.moveDown(2);
        }
      }

      const startX = 50;
      let startY = doc.y;
      const pageWidth = doc.page.width - 100;
      doc.fillColor(COLORES.texto)
        .font("Helvetica-Bold")
        .fontSize(14)
        .text("Seguimiento Detallado por Paciente", startX, startY);
        
      startY = doc.y + 15;
      // Encabezado de la tabla
      const columnWidths = [90, 60, 80, 90, 110, 80, 80, 70, 82];
      const headers = ["Paciente", "Fecha", "Total de síntomas", "Promedio intensidad", "Emoción predominante", "Promedio historial", "Último test", "Puntaje test", "Categoría tets"];
      const headerHeight = 40;
      const getColumnX = (index) => {
          return columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
      };

      doc.fillColor(COLORES.primario)
        .rect(startX, startY, pageWidth, headerHeight)
        .fill();

      doc.fillColor('#FFFFFF')
        .font("Helvetica-Bold")
        .fontSize(10);

      headers.forEach((header, i) => {
        doc.text(header, 
          startX + getColumnX(i) + 5,
          startY + 8, 
          {
            width: columnWidths[i] - 10,
            align: "center",
            lineGap: -4
          }
        );
      });

     drawLine(doc, startX, startY + headerHeight, pageWidth, COLORES.secundario, 1.5);

      doc.font("Helvetica").fontSize(10);
      startY += headerHeight + 3;

      const rowHeight = 28; 
      let currentY = startY;

      datos.forEach((row, index) => {

        const textYOffset = 9;

        // Manejo de nueva página
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
            doc.text(header, startX + getColumnX(i) + 3, currentY + 8, {
              width: columnWidths[i] - 10,
              align: "center",
              lineGap: -4
            });
          });
          
          drawLine(doc, startX, currentY + headerHeight, pageWidth, COLORES.secundario, 1.5);
          currentY += headerHeight +3; 
        }
        
        const y = currentY;


        const nombrePaciente = row.nombrePaciente;
        const fecha = new Date(row.fecha_ultimo_test).toLocaleDateString("es-ES");
        const sintomas = row.total_sintomas;
        const promEmocion = Number(row.promedio_intensidad_emocional).toFixed(2);
        const emocion = getEmocionData(row.emocion_predominante);
        const promhist = Number(row.intensidad_prom_historial).toFixed(2);
        const dominante = row.nivel_dominante_historial;
        const test = getTestTypeData(row.ultimo_test);
        const puntaje = row.puntaje_test;
        const categ = getCategoryData(row.categoria_test);
        const fila = [nombrePaciente, fecha, sintomas, promEmocion, emocion, promhist, dominante, test, puntaje, categ];


          const dataRow = [
          { value: nombrePaciente, align: "left", color: COLORES.texto, widthIndex: 0 },
          { value: fecha, align: "center", color: COLORES.texto, widthIndex: 1 },
          { value: sintomas, align: "center", color: COLORES.texto, widthIndex: 2 },
          { value: promEmocion, align: "center", color: COLORES.texto, widthIndex: 3 },
          { value: emocion.nombre, align: "center", color: emocion.color, bold: true, widthIndex: 4 },
          { value: promhist, align: "center", color: COLORES.texto, widthIndex: 5 },
          { value: test.nombre, align: "center", color: test.color, bold: true, widthIndex: 6 },
          { value: puntaje, align: "center", color: COLORES.texto, widthIndex: 7 },
          { value: categ.nombre, align: "center", color: categ.color, bold: true, widthIndex: 8 },
        ];
        // Fondo alternado
        if (index % 2 !== 0) { 
          doc.fillColor(COLORES.fondoAlternado)
            .rect(startX, y, pageWidth, rowHeight)
            .fill();
        } else { 
           doc.fillColor(COLORES.fondo)
            .rect(startX, y, pageWidth, rowHeight)
            .fill();
        }

      
        dataRow.forEach((cell, i) => {
            const columnIndex = i;
            const columnWidth = columnWidths[columnIndex];
            const columnX = startX + getColumnX(columnIndex);
            
            // Establecer color y fuente
    doc.fillColor(cell.color);
    doc.font(cell.bold ? "Helvetica-Bold" : "Helvetica");

     
            doc.text(
              String(cell.value),
              columnX + 5,
              y + textYOffset,
              {
                width: columnWidth - 10,
                align: cell.align || "center",
                lineBreak: false,
                ellipsis: true, 
              }
            );
        });
        
        doc.font("Helvetica"); 

        drawLine(doc, startX, y + rowHeight, pageWidth, COLORES.borde, 0.1);

        currentY += rowHeight; // Incrementar Y para la siguiente fila
       });

       

      // Añadir pie de página de forma segura en caso de que el documento tenga muchas páginas
      doc.on('pageAdded', () => {
          doc.y = doc.page.height - 40; 
          doc.fillColor(COLORES.textoClaro)
            .fontSize(8)
            .text("Reporte generado automáticamente para uso profesional - Sistema de Seguimiento Emocional", 
                  40, doc.page.height - 30, { align: "center", width: doc.page.width - 80 });
          
          doc.text(`Página ${doc.page.number}`, 40, doc.page.height - 18, { align: "center", width: doc.page.width - 80 });
      });

      // Asegurar que el pie de página esté en la última página
      if (doc.page.number > 0) {
          doc.y = doc.page.height - 40; 
          doc.fillColor(COLORES.textoClaro)
            .fontSize(8)
            .text("Reporte generado automáticamente para uso profesional - Sistema de Seguimiento Emocional", 
                  40, doc.page.height - 30, { align: "center", width: doc.page.width - 80 });
          
          doc.text(`Página ${doc.page.number}`, 40, doc.page.height - 18, { align: "center", width: doc.page.width - 80 });
      }


      doc.end();
    } catch (err) {
      console.error("Error generando PDF Profesional:", err);
      reject(err);
    }
  });
};
