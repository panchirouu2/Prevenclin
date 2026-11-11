
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import Sidebar from "../components/Sidebar";
import "../styles/SeguimientoPaciente.css";

//indicadores
const indicadores = {

  general: {
    nombre: "Evolución general",
    unidad: "% de variación",
    lineas: [
        {
        campo: "sistolica",
        nombre: "Presión sistólica",
        color: "#008779",
        },
        {
        campo: "diastolica",
        nombre: "Presión diastólica",
        color: "#448bc1",
        },
        {
        campo: "glucosa",
        nombre: "Glucosa",
        color: "#df9836",
        },
        {
        campo: "frecuenciaCardiaca",
        nombre: "Frecuencia cardíaca",
        color: "#c75b60",
        },
        {
        campo: "frecuenciaRespiratoria",
        nombre: "Frecuencia respiratoria",
        color: "#7d83be",
        },
    ],
   },  

  presion: {
    nombre: "Presión arterial",
    unidad: "mmHg",
    lineas: [
      {
        campo: "sistolica",
        nombre: "Sistólica",
        color: "#008779",
      },
      {
        campo: "diastolica",
        nombre: "Diastólica",
        color: "#448bc1",
      },
    ],
  },
  glucosa: {
    nombre: "Glucosa",
    unidad: "mg/dL",
    lineas: [
      {
        campo: "glucosa",
        nombre: "Glucosa",
        color: "#df9836",
      },
    ],
  },
  frecuenciaCardiaca: {
    nombre: "Frecuencia cardíaca",
    unidad: "lpm",
    lineas: [
      {
        campo: "frecuenciaCardiaca",
        nombre: "Frecuencia cardíaca",
        color: "#c75b60",
      },
    ],
  },
  frecuenciaRespiratoria: {
    nombre: "Frecuencia respiratoria",
    unidad: "rpm",
    lineas: [
      {
        campo: "frecuenciaRespiratoria",
        nombre: "Frecuencia respiratoria",
        color: "#7d83be",
      },
    ],
  },
};

// Evitamos desfases horarios al mostrar fechas
function formatearFecha(fecha) {
  if (!fecha) return "Sin fecha";

  const [anio, mes, dia] = fecha
    .slice(0, 10)
    .split("-")
    .map(Number);

  if (!anio || !mes || !dia) return "Sin fecha";

  return new Date(anio, mes - 1, dia).toLocaleDateString(
    "es-CL",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function formatearMes(mes) {
  const [anio, numeroMes] = mes.split("-").map(Number);

  return new Date(anio, numeroMes - 1, 1)
    .toLocaleDateString("es-CL", {
      month: "long",
      year: "numeric",
    });
}

function SeguimientoPaciente({
  registros = [],
  historiaClinica = null,
}) {
  const navigate = useNavigate();

  const [indicadorActivo, setIndicadorActivo] =
    useState("general");

  const [mesSeleccionado, setMesSeleccionado] =
    useState("todos");

  const [registroSeleccionado, setRegistroSeleccionado] =
    useState(null);

  // Ordenamos los registros cronológicamente
  const registrosOrdenados = [...registros]
    .filter(
      (registro) =>
        typeof registro.fecha === "string" &&
        /^\d{4}-\d{2}-\d{2}/.test(registro.fecha)
    )
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  // Obtenemos los meses que tienen registros
  const meses = [
    ...new Set(
      registrosOrdenados.map((registro) =>
        registro.fecha.slice(0, 7)
      )
    ),
  ].sort().reverse();

  // Filtramos los registros según el mes
  const registrosFiltrados = registrosOrdenados.filter(
    (registro) =>
      mesSeleccionado === "todos" ||
      registro.fecha.startsWith(mesSeleccionado)
  );

  const configuracion = indicadores[indicadorActivo];

  const camposMediciones = [
    "sistolica",
    "diastolica",
    "glucosa",
    "frecuenciaCardiaca",
    "frecuenciaRespiratoria",
  ];

  const referencia = registrosFiltrados[0];

  const datosGrafico = registrosFiltrados.map((registro) => {
    const punto = { ...registro, etiqueta: formatearFecha(registro.fecha),
        valoresReales: registro,
    };

    if (indicadorActivo !== "general" || !referencia) {
        return punto;
    }
    camposMediciones.forEach((campo) => {
        const valorInicial = referencia[campo];
        const valorActual = registro[campo];

    punto[campo]=valorInicial > 0 && Number.isFinite(valorActual)
        ? Number(
            (
              ((valorActual - valorInicial) /
                valorInicial) *
              100
            ).toFixed(2)
          )
        : null;
  });
    return punto;
  });

  // Último registro disponible
  const ultimoRegistro = registrosOrdenados.at(-1);

  // Registro mostrado en el panel derecho
  const detalleRegistro =
    registrosFiltrados.find(
      (registro) => registro.id === registroSeleccionado
    ) || registrosFiltrados.at(-1);

  // Antecedentes de la historia clínica
  const antecedentes = [
    historiaClinica?.hipertension && "Hipertensión",
    historiaClinica?.prediabetes && "Prediabetes",
    historiaClinica?.otros && "Otros antecedentes",
  ].filter(Boolean);

  const nombrePaciente =
    historiaClinica?.nombres?.trim() || "Paciente";

  // Exportación local de datos de prueba
  const exportarCSV = () => {
    if (registrosFiltrados.length === 0) return;

    const encabezado = [
      "Fecha",
      "Sistolica (mmHg)",
      "Diastolica (mmHg)",
      "Glucosa (mg/dL)",
      "Frecuencia cardiaca (lpm)",
      "Frecuencia respiratoria (rpm)",
    ];

    const filas = registrosFiltrados.map((registro) => [
      registro.fecha.slice(0, 10),
      registro.sistolica,
      registro.diastolica,
      registro.glucosa,
      registro.frecuenciaCardiaca,
      registro.frecuenciaRespiratoria,
    ]);

    const contenido = [encabezado, ...filas]
      .map((fila) => fila.join(";"))
      .join("\r\n");

    const archivo = new Blob(
      ["\uFEFF" + contenido],
      { type: "text/csv;charset=utf-8" }
    );

    const url = URL.createObjectURL(archivo);
    const enlace = document.createElement("a");

    enlace.href = url;
    enlace.download = "prevenclin-seguimiento.csv";

    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-container">
      <Sidebar />

      <main className="seguimiento-pagina">
        <div className="seguimiento-superior">
          <span>
            Inicio　/　<strong>Mi seguimiento</strong>
          </span>
          <span>ⓘ Ayuda</span>
        </div>

        <header className="seguimiento-header">
          <h1>Seguimiento de {nombrePaciente}</h1>
          <p>
            Aquí puedes ver la evolución de tus registros.
          </p>
        </header>

        <section className="seguimiento-card">
          <div className="seguimiento-card-header">
            <div>
              <h2>▥ Evolución de registros diarios</h2>
              <p>
                Consulta las mediciones de tu historial.
              </p>
            </div>

            <div className="seguimiento-acciones">
              <select
                aria-label="Seleccionar período"
                value={mesSeleccionado}
                onChange={(e) => {
                  setMesSeleccionado(e.target.value);
                  setRegistroSeleccionado(null);
                }}
              >
                <option value="todos">
                  Todos los meses
                </option>

                {meses.map((mes) => (
                  <option key={mes} value={mes}>
                    {formatearMes(mes)}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={exportarCSV}
                disabled={registrosFiltrados.length === 0}
                className="seguimiento-exportar"
              >
                ↓ Exportar
              </button>
            </div>
          </div>

          <div className="seguimiento-indicadores">
            {Object.entries(indicadores).map(
              ([clave, indicador]) => (
                <button
                  key={clave}
                  type="button"
                  className={
                    indicadorActivo === clave
                      ? "seguimiento-indicador activo"
                      : "seguimiento-indicador"
                  }
                  onClick={() => setIndicadorActivo(clave)}
                >
                  {indicador.nombre}
                </button>
              )
            )}
          </div>

          <div className="seguimiento-contenido">
            <div className="seguimiento-grafico">
              <h3>
                {configuracion.nombre}
                <small> ({configuracion.unidad})</small>
              </h3>

              {datosGrafico.length > 0 ? (
                <div className="seguimiento-chart">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <LineChart
                      data={datosGrafico}
                      margin={{
                        top: 15,
                        right: 20,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid
                        stroke="#edf2f2"
                        strokeDasharray="3 3"
                      />

                      <XAxis
                        dataKey="etiqueta"
                        tick={{
                          fontSize: 11,
                          fill: "#82999e",
                        }}
                        tickLine={false}
                      />

                      <YAxis
                        width={45}
                        domain={["auto", "auto"]}
                        tick={{
                          fontSize: 11,
                          fill: "#82999e",
                        }}
                        tickLine={false}
                      />

                      <Tooltip
                        formatter={(valor, nombre, item) => {
                            if (indicadorActivo === "general") {
                                const campo = item?.dataKey;

                                const valorReal =item?.payload?.valoresReales?.[campo];

                                let unidad = "";

                                if (campo === "sistolica" ||campo === "diastolica") {unidad = "mmHg";} 
                                else if (campo === "glucosa") {unidad = "mg/dL";} 
                                else if (campo === "frecuenciaCardiaca") {unidad = "lpm";}
                                else if (campo === "frecuenciaRespiratoria") {unidad = "rpm";}
                            

                            return [`${Number(valor).toFixed(2)}% (${valorReal} ${unidad})`,nombre,];}

                         return [`${valor} ${configuracion.unidad}`,nombre,];}} contentStyle={{
                            borderRadius: 10,
                            border: "1px solid #dce9e8",
                            fontSize: 12,}}
                       />

                      <Legend />

                      {configuracion.lineas.map((linea) => (
                        <Line
                          key={linea.campo}
                          type="monotone"
                          dataKey={linea.campo}
                          name={linea.nombre}
                          stroke={linea.color}
                          strokeWidth={2.5}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                          isAnimationActive={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="seguimiento-vacio">
                  <h3>Sin registros disponibles</h3>
                  <p>
                    Registra tus primeras mediciones
                    para visualizar la evolución.
                  </p>

                  <button
                    onClick={() =>
                      navigate("/paciente/registrar")
                    }
                  >
                    Crear registro
                  </button>
                </div>
              )}
            </div>

            <aside className="seguimiento-detalle">
              {detalleRegistro ? (
                <>
                  <div className="seguimiento-fecha">
                    <strong>
                      {formatearFecha(detalleRegistro.fecha)}
                    </strong>
                    <span>Registro del paciente</span>
                  </div>

                  <div className="seguimiento-valores">
                    <div>
                      <span>Presión arterial</span>
                      <strong>
                        {detalleRegistro.sistolica}/
                        {detalleRegistro.diastolica}
                        <small> mmHg</small>
                      </strong>
                    </div>

                    <div>
                      <span>Glucosa</span>
                      <strong>
                        {detalleRegistro.glucosa}
                        <small> mg/dL</small>
                      </strong>
                    </div>

                    <div>
                      <span>Frec. cardíaca</span>
                      <strong>
                        {detalleRegistro.frecuenciaCardiaca}
                        <small> lpm</small>
                      </strong>
                    </div>

                    <div>
                      <span>Frec. respiratoria</span>
                      <strong>
                        {detalleRegistro.frecuenciaRespiratoria}
                        <small> rpm</small>
                      </strong>
                    </div>
                  </div>

                  <div className="seguimiento-comentario">
                    <strong>Comentarios</strong>
                    <p>
                      {detalleRegistro.comentarios ||
                        "Sin comentarios registrados."}
                    </p>
                  </div>
                </>
              ) : (
                <p>No hay mediciones para mostrar.</p>
              )}

              <button
                className="seguimiento-nuevo"
                onClick={() =>
                  navigate("/paciente/registrar")
                }
              >
                Nuevo registro +
              </button>
            </aside>
          </div>
        </section>

        <section className="seguimiento-card">
          <div className="seguimiento-card-header">
            <div>
              <h2>Historial de registros</h2>
              <p>
                Selecciona una fecha para revisar sus datos.
              </p>
            </div>

            <span className="seguimiento-cantidad">
              {registrosFiltrados.length} registro(s)
            </span>
          </div>

          {registrosFiltrados.length === 0 ? (
            <p className="seguimiento-sin-historial">
              No hay registros para el período seleccionado.
            </p>
          ) : (
            <div className="seguimiento-historial">
              {[...registrosFiltrados]
                .reverse()
                .map((registro) => (
                  <button
                    type="button"
                    key={registro.id}
                    className={
                      detalleRegistro?.id === registro.id
                        ? "seguimiento-historial-item seleccionado"
                        : "seguimiento-historial-item"
                    }
                    onClick={() =>
                      setRegistroSeleccionado(registro.id)
                    }
                  >
                    <strong>
                      {formatearFecha(registro.fecha)}
                    </strong>
                    <span>
                      Presión: {registro.sistolica}/
                      {registro.diastolica} mmHg
                    </span>
                    <span>
                      Glucosa: {registro.glucosa} mg/dL
                    </span>
                    <span>Ver detalle →</span>
                  </button>
                ))}
            </div>
          )}
        </section>

        <section className="seguimiento-card">
          <div className="seguimiento-card-header">
            <div>
              <h2>Resumen de mi salud</h2>
              <p>
                {ultimoRegistro
                  ? `Último registro: ${formatearFecha(
                      ultimoRegistro.fecha
                    )}`
                  : "Aún no hay mediciones registradas"}
              </p>
            </div>

            <span className="seguimiento-cantidad">
              {registrosOrdenados.length} registros
            </span>
          </div>

          {ultimoRegistro && (
            <div className="seguimiento-metricas">
              <div className="seguimiento-metrica">
                <span>Presión arterial</span>
                <strong>
                  {ultimoRegistro.sistolica}/
                  {ultimoRegistro.diastolica}
                </strong>
                <small>mmHg</small>
              </div>

              <div className="seguimiento-metrica">
                <span>Glucosa</span>
                <strong>{ultimoRegistro.glucosa}</strong>
                <small>mg/dL</small>
              </div>

              <div className="seguimiento-metrica">
                <span>Frecuencia cardíaca</span>
                <strong>
                  {ultimoRegistro.frecuenciaCardiaca}
                </strong>
                <small>lpm</small>
              </div>

              <div className="seguimiento-metrica">
                <span>Frecuencia respiratoria</span>
                <strong>
                  {ultimoRegistro.frecuenciaRespiratoria}
                </strong>
                <small>rpm</small>
              </div>
            </div>
          )}

          <div className="seguimiento-info-extra">
            <div>
              <span>ANTECEDENTES DECLARADOS</span>
              <strong>
                {antecedentes.length > 0
                  ? antecedentes.join(" · ")
                  : "Sin antecedentes seleccionados"}
              </strong>
              <small>
                {historiaClinica?.familiarRenal
                  ? `Antecedente familiar renal: ${
                      historiaClinica.familiarRenal
                    }`
                  : "Historia familiar no registrada"}
              </small>
            </div>

            <div>
              <span>MEDICAMENTOS DEL ÚLTIMO REGISTRO</span>
              <strong>
                {ultimoRegistro?.medicamentos?.length
                  ? ultimoRegistro.medicamentos
                      .map(
                        (med) =>
                          `${med.nombre} ${med.dosis} ${
                            med.unidad
                          }`
                      )
                      .join(" · ")
                  : "Sin medicamentos ingresados"}
              </strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default SeguimientoPaciente;
