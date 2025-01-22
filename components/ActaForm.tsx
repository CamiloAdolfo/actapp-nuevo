"use client"

import React, { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Combobox } from "@headlessui/react"

type FormData = {
  numeroActa: string
  fechaDia: string
  fechaMes: string
  fechaAno: string
  horaInicial: string
  minutoInicial: string
  periodoInicial: string
  horaFinal: string
  minutoFinal: string
  periodoFinal: string
  comuna: string
  lugar: string
  objetivo: string
  ordenDelDia: string[]
  desarrollo: string
  asistentes: string[]
}

const lugares = [
  "Cancha Multiple Barrio El Guabal",
  "Cancha Multiple San Judas I",
  "Parque Recreativo El Guabal",
  "Polideportivo Pasoancho",
  "Unidad Recreativa Los Castores",
]

const comunas = [
  "Comuna 1",
  "Comuna 2",
  "Comuna 3",
  "Comuna 4",
  "Comuna 5",
  "Comuna 6",
  "Comuna 7",
  "Comuna 8",
  "Comuna 9",
  "Comuna 10",
  "Comuna 11",
  "Comuna 12",
  "Comuna 13",
  "Comuna 14",
  "Comuna 15",
  "Comuna 16",
  "Comuna 17",
  "Comuna 18",
  "Comuna 19",
  "Comuna 20",
  "Comuna 21",
  "Comuna 22",
  "Corregimiento Montebello",
]

const asistentesDB = [
  "Camilo Mosquera - Contratista",
  "Jorge De la Cruz - Contratista",
  "Alexander Cubillos - Contratista",
  "Andrés Felipe Quintero - Contratista",
  "Elver Villa - Contratista",
  "Harold Mosquera - Contratista",
  "Jaime Manzano - Contratista",
  "Oscar Pérez - Contratista",
  "Ramón Zapata - Contratista",
  "Oliver Castrillón - Contratista",
  "Sandra Perea - Contratista",
  "Walter Sánchez - Contratista",
  "Rigoberto Guerrero - Contratista",
  "Paula Lenis - Contratista",
  "Diego Camacho - Contratista",
]

const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
const dias = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"))
const anos = Array.from({ length: 21 }, (_, i) => (2020 + i).toString())
const horas = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"))
const minutos = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"))

export default function ActaForm() {
  const { register, control, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      numeroActa: "",
      fechaDia: "",
      fechaMes: "",
      fechaAno: "",
      horaInicial: "",
      minutoInicial: "",
      periodoInicial: "",
      horaFinal: "",
      minutoFinal: "",
      periodoFinal: "",
      comuna: "",
      lugar: "",
      objetivo: "",
      ordenDelDia: [""],
      desarrollo: "",
      asistentes: ["", ""],
    },
  })
  const [queryLugar, setQueryLugar] = useState("")
  const [queryComuna, setQueryComuna] = useState("")
  const [queryAsistentes, setQueryAsistentes] = useState(["", ""])

  const filteredLugares =
    queryLugar === "" ? lugares : lugares.filter((lugar) => lugar.toLowerCase().includes(queryLugar.toLowerCase()))

  const filteredComunas =
    queryComuna === "" ? comunas : comunas.filter((comuna) => comuna.toLowerCase().includes(queryComuna.toLowerCase()))

  const filteredAsistentes = (query: string) =>
    query === ""
      ? asistentesDB
      : asistentesDB.filter((asistente) => asistente.toLowerCase().includes(query.toLowerCase()))

  const onSubmit = async (data: FormData) => {
    try {
      const formattedData = {
        ...data,
        fecha: `${data.fechaDia}/${data.fechaMes}/${data.fechaAno}`,
        horaInicial: `${data.horaInicial}:${data.minutoInicial} ${data.periodoInicial}`,
        horaFinal: `${data.horaFinal}:${data.minutoFinal} ${data.periodoFinal}`,
        ordenDelDia: data.ordenDelDia.filter(Boolean),
        asistentes: data.asistentes.filter(Boolean),
      }

      const response = await fetch("/api/submit-acta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = "acta.docx"
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        const errorData = await response.json()
        console.error("Error response:", errorData)
        alert(`Error al generar el acta: ${errorData.message}`)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al generar el acta")
    }
  }

  const ordenDelDia = watch("ordenDelDia")
  const asistentes = watch("asistentes")

  const addOrdenDelDia = () => {
    if (ordenDelDia.length < 10) {
      setValue("ordenDelDia", [...ordenDelDia, ""])
    }
  }

  const removeOrdenDelDia = (index: number) => {
    setValue(
      "ordenDelDia",
      ordenDelDia.filter((_, i) => i !== index),
    )
  }

  const addAsistente = () => {
    if (asistentes.length < 5) {
      setValue("asistentes", [...asistentes, ""])
      setQueryAsistentes([...queryAsistentes, ""])
    }
  }

  const removeAsistente = (index: number) => {
    setValue(
      "asistentes",
      asistentes.filter((_, i) => i !== index),
    )
    setQueryAsistentes(queryAsistentes.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="numeroActa" className="block text-sm font-medium text-gray-700">
            Número de Acta
          </label>
          <input
            type="text"
            id="numeroActa"
            {...register("numeroActa", { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-900"
          />
        </div>

        {/* Fecha */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label htmlFor="fechaDia" className="block text-sm font-medium text-gray-700">
              Día
            </label>
            <select
              id="fechaDia"
              {...register("fechaDia", { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-900"
            >
              <option value="">Seleccione</option>
              {dias.map((dia) => (
                <option key={dia} value={dia}>
                  {dia}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="fechaMes" className="block text-sm font-medium text-gray-700">
              Mes
            </label>
            <select
              id="fechaMes"
              {...register("fechaMes", { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-900"
            >
              <option value="">Seleccione</option>
              {meses.map((mes) => (
                <option key={mes} value={mes}>
                  {mes}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="fechaAno" className="block text-sm font-medium text-gray-700">
              Año
            </label>
            <select
              id="fechaAno"
              {...register("fechaAno", { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-900"
            >
              <option value="">Seleccione</option>
              {anos.map((ano) => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hora Inicial */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label htmlFor="horaInicial" className="block text-sm font-medium text-gray-700">
              Hora Inicial
            </label>
            <select
              id="horaInicial"
              {...register("horaInicial", { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-900"
            >
              <option value="">Seleccione</option>
              {horas.map((hora) => (
                <option key={hora} value={hora}>
                  {hora}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="minutoInicial" className="block text-sm font-medium text-gray-700">
              Minuto
            </label>
            <select
              id="minutoInicial"
              {...register("minutoInicial", { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-900"
            >
              <option value="">Seleccione</option>
              {minutos.map((minuto) => (
                <option key={minuto} value={minuto}>
                  {minuto}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="periodoInicial" className="block text-sm font-medium text-gray-700">
              AM/PM
            </label>
            <select
              id="periodoInicial"
              {...register("periodoInicial", { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-900"
            >
              <option value="">Seleccione</option>
              <option value="am">AM</option>
              <option value="pm">PM</option>
            </select>
          </div>
        </div>

        {/* Hora Final */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label htmlFor="horaFinal" className="block text-sm font-medium text-gray-700">
              Hora Final
            </label>
            <select
              id="horaFinal"
              {...register("horaFinal", { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-900"
            >
              <option value="">Seleccione</option>
              {horas.map((hora) => (
                <option key={hora} value={hora}>
                  {hora}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="minutoFinal" className="block text-sm font-medium text-gray-700">
              Minuto
            </label>
            <select
              id="minutoFinal"
              {...register("minutoFinal", { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-900"
            >
              <option value="">Seleccione</option>
              {minutos.map((minuto) => (
                <option key={minuto} value={minuto}>
                  {minuto}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="periodoFinal" className="block text-sm font-medium text-gray-700">
              AM/PM
            </label>
            <select
              id="periodoFinal"
              {...register("periodoFinal", { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-900"
            >
              <option value="">Seleccione</option>
              <option value="am">AM</option>
              <option value="pm">PM</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="comuna" className="block text-sm font-medium text-gray-700">
            Comuna
          </label>
          <Controller
            name="comuna"
            control={control}
            render={({ field }) => (
              <Combobox value={field.value} onChange={field.onChange}>
                <div className="relative mt-1">
                  <Combobox.Input
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-900"
                    onChange={(event) => {
                      setQueryComuna(event.target.value)
                      field.onChange(event.target.value)
                    }}
                  />
                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredComunas.map((comuna) => (
                      <Combobox.Option
                        key={comuna}
                        value={comuna}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? "bg-indigo-600 text-white" : "text-gray-900"
                          }`
                        }
                      >
                        {comuna}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </div>
              </Combobox>
            )}
          />
        </div>

        <div>
          <label htmlFor="lugar" className="block text-sm font-medium text-gray-700">
            Lugar
          </label>
          <Controller
            name="lugar"
            control={control}
            render={({ field }) => (
              <Combobox value={field.value} onChange={field.onChange}>
                <div className="relative mt-1">
                  <Combobox.Input
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-900"
                    onChange={(event) => {
                      setQueryLugar(event.target.value)
                      field.onChange(event.target.value)
                    }}
                  />
                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredLugares.map((lugar) => (
                      <Combobox.Option
                        key={lugar}
                        value={lugar}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? "bg-indigo-600 text-white" : "text-gray-900"
                          }`
                        }
                      >
                        {lugar}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </div>
              </Combobox>
            )}
          />
        </div>
      </div>

      <div>
        <label htmlFor="objetivo" className="block text-sm font-medium text-gray-700">
          Objetivo
        </label>
        <input
          type="text"
          id="objetivo"
          {...register("objetivo")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Orden del Día</label>
        {ordenDelDia.map((item, index) => (
          <div key={index} className="flex items-center mt-2">
            <span className="mr-2">{index + 1}.</span>
            <input
              type="text"
              {...register(`ordenDelDia.${index}` as const)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-900"
            />
            {index > 0 && (
              <button type="button" onClick={() => removeOrdenDelDia(index)} className="ml-2">
                <span className="text-red-500 text-xl">-</span>
              </button>
            )}
            {index === ordenDelDia.length - 1 && ordenDelDia.length < 10 && (
              <button type="button" onClick={addOrdenDelDia} className="ml-2">
                <span className="text-green-500 text-xl">+</span>
              </button>
            )}
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="desarrollo" className="block text-sm font-medium text-gray-700">
          Desarrollo
        </label>
        <textarea
          id="desarrollo"
          {...register("desarrollo")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-900"
          rows={6}
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Asistentes</label>
        {asistentes.map((asistente, index) => (
          <div key={index} className="flex items-center mt-2">
            <Controller
              name={`asistentes.${index}` as const}
              control={control}
              render={({ field }) => (
                <Combobox value={field.value} onChange={field.onChange}>
                  <div className="relative w-full">
                    <Combobox.Input
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-900"
                      onChange={(event) => {
                        const newQueryAsistentes = [...queryAsistentes]
                        newQueryAsistentes[index] = event.target.value
                        setQueryAsistentes(newQueryAsistentes)
                        field.onChange(event.target.value)
                      }}
                    />
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {filteredAsistentes(queryAsistentes[index]).map((asistente) => (
                        <Combobox.Option
                          key={asistente}
                          value={asistente}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? "bg-indigo-600 text-white" : "text-gray-900"
                            }`
                          }
                        >
                          {asistente}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  </div>
                </Combobox>
              )}
            />
            {index > 1 && (
              <button type="button" onClick={() => removeAsistente(index)} className="ml-2">
                <span className="text-red-500 text-xl">-</span>
              </button>
            )}
            {index === asistentes.length - 1 && asistentes.length < 5 && (
              <button type="button" onClick={addAsistente} className="ml-2">
                <span className="text-green-500 text-xl">+</span>
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Generar Acta
      </button>
    </form>
  )
}

