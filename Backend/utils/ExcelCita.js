import ExcelJS from "exceljs";

// --- Definiciones de Mapeo
const especialidadMap = [
  { value: 1, nombre: "Psicólogo", color: "#ab47bc" },
  { value: 2, nombre: "Psiquiatra", color: "#42a5f5" },
  { value: 3, nombre: "Terapeuta", color: "#26a69a" },
  { value: 4, nombre: "Neurólogo", color: "#ef5350" },
  { value: 5, nombre: "Médico General", color: "#66bb6a" },
  { value: 6, nombre: "Psicoterapeuta", color: "#ffa726" },
  { value: 7, nombre: "Psicoanalista", color: "#8d6e63" },
  { value: 8, nombre: "Consejero", color: "#29b6f6" },
  { value: 9, nombre: "Trabajador Social", color: "#ffa726" },
];

const estadoCitaMap = [
  { value: 1, nombre: "Pendiente de aceptar", color: "#dacb49" },
  { value: 2, nombre: "Aceptada", color: "#21d127" },
  { value: 3, nombre: "En progreso", color: "#81D4FA" },
  { value: 4, nombre: "Concluido", color: "#66bc05" },
  { value: 5, nombre: "Cancelado por el paciente", color: "#ec4656" },
  { value: 6, nombre: "Cancelado por el profesional", color: "#bf3e3e" },
  { value: 7, nombre: "No asistió el paciente", color: "#da9a3a" },
  { value: 8, nombre: "No asistió el profesional", color: "#b137c6" },
  { value: 9, nombre: "Reprogramado", color: "#079db1" },
  { value: 10, nombre: "Rechazada", color: "#aa0e44" },
  { value: 11, nombre: "Expirada", color: "#fa0404" },
  { value: 12, nombre: "En espera", color: "#c39b23" },
];

const modalidadMap = [
  { value: 1, nombre: "Presencial", color: "#4CAF50" },
  { value: 2, nombre: "Virtual", color: "#2196F3" },
];

// Función utilitaria que busca el valor sin importar si es número o string.
const getMapValue = (map, value, property = "nombre") => {
  if (value === null || value === undefined) return value;

  let searchVal = value;
  if (typeof value === "string") {
    const cleanedValue = value.trim();
    const parsedInt = parseInt(cleanedValue);
    if (!isNaN(parsedInt)) {
      searchVal = parsedInt;
    } else {
      return value;
    }
  }

  const item = map.find((i) => i.value === searchVal);

  return item ? item[property] : value;
};

export async function generarExcel(datos, nombreHoja = "Reporte de Datos") {
  if (!Array.isArray(datos) || datos.length === 0) {
    throw new Error(
      " La entrada debe ser un array con datos para generar el reporte."
    );
  }
  console.log("Datos de entrada (Primer elemento):", datos[0]);

  const libro = new ExcelJS.Workbook();
  const hoja = libro.addWorksheet(nombreHoja);

  const estadoCitaColumnKey = "estado";
  const especialidadColumnKey = "especialidad";
  const modalidadColumnKey = "modalidad";
  const fechaColumnKey = "fecha_cita";

  const getMapValueName = (map, value) => getMapValue(map, value, "nombre");
  const getMapValueColor = (map, value) => getMapValue(map, value, "color");

  //  Detección y Configuración de Cabeceras
  const keys = Object.keys(datos[0]);
  const keyToColId = {};

  const columnsConfig = keys.map((key, index) => {
    let headerText =
      key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");
    let width = 25;

    if (key === estadoCitaColumnKey) headerText = "Estado de la Cita";
    if (key === modalidadColumnKey) headerText = "Modalidad";
    if (key === especialidadColumnKey) headerText = "Especialidad";

    keyToColId[key] = index + 1;

    return { header: headerText, key: key, width: width };
  });

  hoja.columns = columnsConfig;

  // Estilos de Encabezado
  const headerRow = hoja.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4F81BD" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  // Inserción de Datos con Mapeo y Estilos Condicionales
  datos.forEach((rowData) => {
    // Construir el array de valores
    const rowValues = columnsConfig.map((col) => {
      const key = col.key;
      let value = rowData[key];

      // Aplicar Mapeo a Nombre
      if (key === estadoCitaColumnKey && rowData.hasOwnProperty(key)) {
        return getMapValueName(estadoCitaMap, value);
      } else if (key === especialidadColumnKey && rowData.hasOwnProperty(key)) {
        return getMapValueName(especialidadMap, value);
      } else if (key === modalidadColumnKey && rowData.hasOwnProperty(key)) {
        return getMapValueName(modalidadMap, value);
      } else if (
        key === fechaColumnKey &&
        typeof value === "string" &&
        value.includes("T")
      ) {
        // Convertir la cadena ISO a un objeto Date de JavaScript
        return new Date(value);
      }

      // Retorna el valor original si no es un campo mapeado
      return value;
    });

    // Agregar la fila de valores mapeados.
    const row = hoja.addRow(rowValues);
    const fechaCellIndex = keyToColId[fechaColumnKey];

    if (fechaCellIndex) {
      const cell = row.getCell(fechaCellIndex);
      // Establece el formato de número de Excel para mostrar solo la fecha
      cell.numFmt = "yyyy-mm-dd";
      cell.alignment = { horizontal: "center" };
    }

    // Estilo para Estado de Cita
    if (
      rowData.hasOwnProperty(estadoCitaColumnKey) &&
      keyToColId[estadoCitaColumnKey]
    ) {
      const estadoId = rowData[estadoCitaColumnKey];
      const color = getMapValueColor(estadoCitaMap, estadoId);

      // Acceso por índice numérico
      const cell = row.getCell(keyToColId[estadoCitaColumnKey]);

      if (color && cell) {
        const cleanColor = String(color).toUpperCase().replace("#", "");
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: `FF${cleanColor}` },
        };
        cell.font = {
          bold: true,
          color: {
            argb: ["21D127", "66BC05", "81D4FA"].includes(cleanColor)
              ? "FF000000"
              : "FFFFFFFF",
          },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      }
    }

    // Estilo para especialidad
    if (
      rowData.hasOwnProperty(especialidadColumnKey) &&
      keyToColId[especialidadColumnKey]
    ) {
      const especialidadId = rowData[especialidadColumnKey];
      const color = getMapValueColor(especialidadMap, especialidadId);

      // Acceso por índice numérico
      const cell = row.getCell(keyToColId[especialidadColumnKey]);

      if (color && cell) {
        const cleanColor = String(color).toUpperCase().replace("#", "");
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: `FF${cleanColor}` },
        };
        cell.font = {
          bold: true,
          color: {
            argb: ["21D127", "66BC05", "81D4FA"].includes(cleanColor)
              ? "FF000000"
              : "FFFFFFFF",
          },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      }
    }

    // Estilo para modalidad
    if (
      rowData.hasOwnProperty(modalidadColumnKey) &&
      keyToColId[modalidadColumnKey]
    ) {
      const modalidadId = rowData[modalidadColumnKey];
      const color = getMapValueColor(modalidadMap, modalidadId);

      // Acceso por índice numérico
      const cell = row.getCell(keyToColId[modalidadColumnKey]);

      if (color && cell) {
        const cleanColor = String(color).toUpperCase().replace("#", "");
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: `FF${cleanColor}` },
        };
        cell.font = {
          bold: true,

          color: {
            argb: ["21D127", "66BC05", "81D4FA"].includes(cleanColor)
              ? "FF000000"
              : "FFFFFFFF",
          },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      }
    }
  });

  //  Generación del buffer del archivo
  const buffer = await libro.xlsx.writeBuffer();
  return buffer;
}
