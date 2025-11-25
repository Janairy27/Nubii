import dotenv from "dotenv";
dotenv.config();

import mysql from "mysql2/promise";


console.log({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.BD_PORT
});
console.log(" Conexión exitosa a la base de datos:", process.env.DB_NAME);

export const db = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
     port: Number(process.env.DB_PORT),  
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});