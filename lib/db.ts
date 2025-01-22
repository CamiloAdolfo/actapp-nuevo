import sqlite3 from "sqlite3"
import { open } from "sqlite"

let db: any

async function openDb() {
  if (!db) {
    db = await open({
      filename: "./actas.sqlite",
      driver: sqlite3.Database,
    })
    await db.exec(`
      CREATE TABLE IF NOT EXISTS actas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numeroActa TEXT,
        fecha TEXT,
        horaInicial TEXT,
        horaFinal TEXT,
        comuna TEXT,
        lugar TEXT,
        objetivo TEXT,
        ordenDelDia TEXT,
        desarrollo TEXT,
        asistentes TEXT
      )
    `)

    // Verificar si la columna 'comuna' existe, si no, agregarla
    const tableInfo = await db.all("PRAGMA table_info(actas)")
    const comunaExists = tableInfo.some((column) => column.name === "comuna")
    if (!comunaExists) {
      await db.exec("ALTER TABLE actas ADD COLUMN comuna TEXT")
    }
  }
  return db
}

export async function saveActa(data: any) {
  const db = await openDb()
  const { numeroActa, fecha, horaInicial, horaFinal, comuna, lugar, objetivo, ordenDelDia, desarrollo, asistentes } =
    data
  await db.run(
    `INSERT INTO actas (numeroActa, fecha, horaInicial, horaFinal, comuna, lugar, objetivo, ordenDelDia, desarrollo, asistentes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [numeroActa, fecha, horaInicial, horaFinal, comuna, lugar, objetivo, ordenDelDia, desarrollo, asistentes],
  )
}

