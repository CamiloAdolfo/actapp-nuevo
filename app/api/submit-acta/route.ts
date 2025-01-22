import { NextResponse } from "next/server"
import { createDocument } from "@/lib/docxTemplater"
import { saveActa } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Función para asegurar que el input sea un array
    const asegurarArray = (input: any): string[] => {
      if (Array.isArray(input)) {
        return input
      }
      if (typeof input === "object" && input !== null) {
        return Object.values(input)
      }
      return []
    }

    // Formatear los campos dinámicos para que coincidan exactamente con la plantilla
    const formatearAsistentes = (asistentes: any) => {
      const asistentesArray = asegurarArray(asistentes)
      const asistentesFormateados: Record<string, string> = {}
      asistentesArray.forEach((asistente, index) => {
        if (asistente) {
          asistentesFormateados[`asistentes${index + 1}`] = asistente
        }
      })
      return asistentesFormateados
    }

    const formatearOrdenDelDia = (ordenDelDia: any) => {
      const ordenArray = asegurarArray(ordenDelDia)
      const ordenFormateado: Record<string, string> = {}
      ordenArray.forEach((item, index) => {
        if (item) {
          ordenFormateado[`ordenDelDia${index + 1}`] = item
        }
      })
      return ordenFormateado
    }

    // Crear el objeto de datos formateado
    const formattedData = {
      numeroActa: data.numeroActa,
      fecha: `${data.fechaDia}/${data.fechaMes}/${data.fechaAno}`,
      horaInicial: `${data.horaInicial}:${data.minutoInicial} ${data.periodoInicial}`,
      horaFinal: `${data.horaFinal}:${data.minutoFinal} ${data.periodoFinal}`,
      lugar: `${data.lugar}, ${data.comuna}`,
      objetivo: data.objetivo,
      desarrollo: data.desarrollo,
      ...formatearAsistentes(data.asistentes),
      ...formatearOrdenDelDia(data.ordenDelDia),
    }

    // Guardar en la base de datos
    await saveActa({
      ...data,
      ordenDelDia: asegurarArray(data.ordenDelDia).join("\n"),
      asistentes: asegurarArray(data.asistentes).join(", "),
    })

    // Generar el documento
    const docBuffer = await createDocument(formattedData)

    return new NextResponse(docBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "attachment; filename=acta.docx",
      },
    })
  } catch (error) {
    console.error("Error en submit-acta:", error)
    return NextResponse.json(
      {
        message: "Error al generar el acta",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}

