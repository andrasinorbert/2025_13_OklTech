import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.resolve(__dirname, "../db/schema.sql");

const dbConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "blog_app"
};

let pool;

function replaceDatabaseName(schemaSql, databaseName) {
  const escaped = `\`${databaseName.replace(/`/g, "``")}\``;

  return schemaSql
    .replace(
      /CREATE DATABASE IF NOT EXISTS\s+[`"]?[a-zA-Z0-9_]+[`"]?/i,
      `CREATE DATABASE IF NOT EXISTS ${escaped}`
    )
    .replace(/USE\s+[`"]?[a-zA-Z0-9_]+[`"]?\s*;/i, `USE ${escaped};`);
}

export async function initializeDatabase() {
  const schemaSql = fs.readFileSync(schemaPath, "utf8").replace(/^\uFEFF/, "");
  const sqlWithConfiguredDb = replaceDatabaseName(schemaSql, dbConfig.database);

  const bootstrapConnection = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    multipleStatements: true
  });

  await bootstrapConnection.query(sqlWithConfiguredDb);
  await bootstrapConnection.end();

  pool = mysql.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: "utf8mb4"
  });
}

export function getDb() {
  if (!pool) {
    throw new Error("Adatbazis pool nincs inicializalva.");
  }

  return pool;
}

