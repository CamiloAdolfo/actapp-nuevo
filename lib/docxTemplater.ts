import PizZip from "pizzip"
import Docxtemplater from "docxtemplater"
import fs from "fs"
import path from "path"

export async function createDocument(data: any) {
  // Leer la plantilla
  const template = fs.readFileSync(path.resolve("./public/template.docx"), "binary")

  const zip = new PizZip(template)

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  })

  // Renderizar el documento
  doc.render(data)

  // Generar el documento final
  const buf = doc.getZip().generate({ type: "nodebuffer" })

  return buf
}

