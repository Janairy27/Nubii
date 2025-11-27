import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { format } from "date-fns";

import dotenv from "dotenv";
dotenv.config();

// Definición de la ruta absoluta de la carpeta donde se almacenarán los respaldos
const CARPETA_RESPALDO = path.resolve("backups");

// En caso de no existir el respaldo, se crea la carpeta
if (!fs.existsSync(CARPETA_RESPALDO)) {
  fs.mkdirSync(CARPETA_RESPALDO);
}

// Función para crear respaldo en la base de datos
export const crearRespaldo = () => {
  console.log("Accediendo a promise");
  const promise = new Promise((resolve, reject) => {
    // Obtener la fecha actual para crear el nombre del archivo
    const fecha = format(new Date(), "yyy-MM-dd_HH-mm-ss");
    const nombreDocumento = `Respaldo_${fecha}.sql`; // Nombre del archivo de respaldo
    const ruta = path.join(CARPETA_RESPALDO, nombreDocumento); // Ruta completa del archivo

    const mysqldumpPath = process.env.MYSQL_PATH || "mysqldump";

    // Comando para hacer el dump de la base de datos
    const comando = `"${mysqldumpPath}" -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} Nubii --result-file="${ruta}"`;

    // Ejecución del comando en la terminal
    exec(comando, (err) => {
      if (err) return reject(err); //Rechazo en caso que exista un error
      resolve(nombreDocumento);
    });
  });
  return promise;
};

// Función para restaurar la base de datos desde un archivo de respaldo
export const restaurarBD = (nombreDocumento) => {
  const promise = new Promise((resolve, reject) => {
    const ruta = path.join(CARPETA_RESPALDO, nombreDocumento); // Ruta del archivo de respaldo

    // Verificar existencia del archivo
    if (!fs.existsSync(ruta)) {
      return reject(new Error("El archivo no existe"));
    }

    // Comando para restaurar la base de datos
    const mysqlPath = process.env.MYSQL_CLIENTE_PATH || "mysql";
    const comando = `${mysqlPath} -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} Nubii < "${ruta}"`;
    const shellComando =
      process.platform === "win32" ? `cmd /c ${comando}` : comando;

    exec(shellComando, (error) => {
      if (error) return reject(error); // Rechaza si hay un error
      resolve();
    });
  });
  return promise;
};

export const lista = () => {
  return fs
    .readdirSync(CARPETA_RESPALDO)
    .filter((f) => f.endsWith(".sql"))
    .sort((a, b) => {
      // Extracción del nombre donde se encuentra la fecha
      const formato_fecha = /(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})/;
      const fecha1 = a.match(formato_fecha);
      const fecha2 = b.match(formato_fecha);

      if (!fecha1 || !fecha2) return 0;

      // Convertir a objetos Date para comparar
      const date1 = new Date(
        `${fecha1[1]}-${fecha1[2]}-${fecha1[3]}T${fecha1[4]}:${fecha1[5]}:${fecha1[6]}`
      );
      const date2 = new Date(
        `${fecha2[1]}-${fecha2[2]}-${fecha2[3]}T${fecha2[4]}:${fecha2[5]}:${fecha2[6]}`
      );

      // Retornar el más reciente prinmero
      return date2 - date1;
    });
};
