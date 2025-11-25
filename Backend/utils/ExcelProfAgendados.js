import ExcelJS from "exceljs";

export async function generarExcel(datos){

    if(!datos || datos.length === 0){
        throw new Error("No hay datos para generar el reporte");
    }

    const libro = new ExcelJS.Workbook();
    const hoja = libro.addWorksheet("Reporte de profesionales más agendados");

    const keys = Object.keys(datos[0]);
    hoja.columns = Object.keys(datos[0]).map(key => ({header: key, key}));
    const especialidadColIndex = keys.findIndex(key => key === 'especialidad') + 1;
     // Estilos de Encabezado
    const headerRow = hoja.getRow(1);
    headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    datos.forEach(row => {
        const dataRow = { ...row }; 
        
        //  Verificar si la especialidad contiene el separador '$$'
        if (dataRow.especialidad && dataRow.especialidad.includes('$$')) {
            const [nombre, hexColor] = dataRow.especialidad.split('$$');
            dataRow.especialidad = nombre;
            
            // Añadir la fila
            const newRow = hoja.addRow(dataRow);
            
            // Aplicar el formato
            const cell = newRow.getCell(especialidadColIndex);
            
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF' + hexColor }
            };
            cell.font = {
                color: { argb: 'FF000000' } 
            };

        } else {
            hoja.addRow(dataRow);
        }
    });
    const buffer = await libro.xlsx.writeBuffer();
    return buffer;
};
