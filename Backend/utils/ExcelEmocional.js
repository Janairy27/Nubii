import ExcelJS from "exceljs";

// ===== MAPS =====
const estadoCitaMap = [
  { value: 1, nombre: "Pendiente de aceptar", color: "#DACB49" },
  { value: 2, nombre: "Aceptada", color: "#21D127" },
  { value: 3, nombre: "En progreso", color: "#81D4FA" },
  { value: 4, nombre: "Concluido", color: "#66BC05" },
  { value: 5, nombre: "Cancelado por el paciente", color: "#EC4656" },
  { value: 6, nombre: "Cancelado por el profesional", color: "#BF3E3E" },
  { value: 7, nombre: "No asistió el paciente", color: "#DA9A3A" },
  { value: 8, nombre: "No asistió el profesional", color: "#B137C6" },
  { value: 9, nombre: "Reprogramado", color: "#079DB1" },
  { value: 10, nombre: "Rechazada", color: "#AA0E44" },
  { value: 11, nombre: "Expirada", color: "#FA0404" },
  { value: 12, nombre: "En espera", color: "#C39B23" },
];

const modalidadMap = [
  { value: 1, nombre: "🏥 Presencial", color: "#4CAF50" },
  { value: 2, nombre: "💻 Virtual", color: "#2196F3" },
];

const especialidadMap = [
  { value: 1, nombre: "🧠 Psicólogo", color: "#AB47BC" },
  { value: 2, nombre: "💊 Psiquiatra", color: "#42A5F5" },
  { value: 3, nombre: "👐 Terapeuta", color: "#26A69A" },
  { value: 4, nombre: "🩺 Neurólogo", color: "#EF5350" },
  { value: 5, nombre: "❤️ Médico General", color: "#66BB6A" },
  { value: 6, nombre: "🧘 Psicoterapeuta", color: "#FFA726" },
  { value: 7, nombre: "💡 Psicoanalista", color: "#8D6E63" },
  { value: 8, nombre: "🤝 Consejero", color: "#29B6F6" },
  { value: 9, nombre: "👥 Trabajador Social", color: "#FFA726" },
];

// Función principal
export async function generarExcel(datos) {
  if (!datos || datos.length === 0) {
    throw new Error("No hay datos para generar el reporte");
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Reporte Emocional");

  //Encabezados
  sheet.columns = [
    { header: "ID Cita", key: "idCita", width: 12 },
    { header: "Estado", key: "estado", width: 25 },
    { header: "Modalidad", key: "modalidad", width: 18 },
    { header: "Especialidad", key: "especialidad", width: 22 },
    { header: "Fecha", key: "fecha", width: 20 },
    { header: "Paciente", key: "paciente", width: 25 },
  ];

  // Estilo de encabezado
  const headerRow = sheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1565C0" },
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin", color: { argb: "FF90A4AE" } },
      bottom: { style: "thin", color: { argb: "FF90A4AE" } },
    };
  });

  // Filas
  datos.forEach((item) => {
    const estado = estadoCitaMap.find((e) => e.value === item.estado);
    const modalidad = modalidadMap.find((m) => m.value === item.modalidad);
    const especialidad = especialidadMap.find((e) => e.value === item.especialidad);

    const row = sheet.addRow({
      idCita: item.idCita,
      estado: estado ? estado.nombre : "Desconocido",
      modalidad: modalidad ? modalidad.nombre : "N/A",
      especialidad: especialidad ? especialidad.nombre : "N/A",
      fecha: item.fecha,
      paciente: item.paciente,
    });

    // Estilo según estado
    const estadoColor = estado ? estado.color.replace("#", "FF") : "FFFFFFFF";
    row.getCell("estado").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: estadoColor },
    };

    // Bordes y alineación
    row.eachCell((cell) => {
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.border = {
        bottom: { style: "thin", color: { argb: "FFE0E0E0" } },
      };
      cell.font = { size: 11 };
    });
  });

  // Congelar encabezado
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  //Estilo generla
  sheet.getColumn("estado").alignment = { horizontal: "center" };
  sheet.getColumn("modalidad").alignment = { horizontal: "center" };

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}
