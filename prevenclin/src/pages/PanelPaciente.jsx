import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/PanelPaciente.css";

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

function mostrarValor(valor) {
  return valor !== undefined &&
    valor !== null &&
    valor !== ""
    ? valor
    : "—";
}

function PanelPaciente({
  registros = [],
  historiaClinica = null,
}) {
  const navigate = useNavigate();
  const [mostrarMedicamentos, setMostrarMedicamentos] =
    useState(false);
  const [mostrarNutricion, setMostrarNutricion] =
    useState(false);

  // Datos de la historia clínica
  const nombreCompleto = [
    historiaClinica?.nombres,
    historiaClinica?.apellidos,
  ]
    .filter(Boolean)
    .join(" ") || "Paciente";

  const nombreSaludo =
    historiaClinica?.nombres?.split(" ")[0] || "Paciente";

  const iniciales = nombreCompleto
    .split(" ")
    .slice(0, 2)
    .map((palabra) => palabra[0])
    .join("")
    .toUpperCase();

  const antecedentes = [];

  if (historiaClinica?.hipertension) {
    antecedentes.push("Hipertensión");
  }

  if (historiaClinica?.prediabetes) {
    antecedentes.push("Prediabetes");
  }

  if (historiaClinica?.otros) {
    antecedentes.push("Otros antecedentes");
  }

  // Registros ordenados por fecha
  const registrosOrdenados = [...registros].sort(
    (a, b) =>
      String(a.fecha || "").localeCompare(
        String(b.fecha || "")
      )
  );

  const ultimoRegistro = registrosOrdenados.at(-1);

  // Último registro que contiene medicamentos
  const registroConMedicamentos = [...registrosOrdenados]
    .reverse()
    .find(
      (registro) =>
        Array.isArray(registro.medicamentos) &&
        registro.medicamentos.length > 0
    );

  const medicamentos =
    registroConMedicamentos?.medicamentos || [];

  const indicadores = [
    {
      nombre: "Presión arterial",
      valor: ultimoRegistro
        ? `${mostrarValor(ultimoRegistro.sistolica)} / ${mostrarValor(ultimoRegistro.diastolica)}`
        : "— / —",
      unidad: "mmHg",
      icono: "♥",
    },
    {
      nombre: "Glucosa",
      valor: mostrarValor(ultimoRegistro?.glucosa),
      unidad: "mg/dL",
      icono: "◉",
    },
    {
      nombre: "Frecuencia cardíaca",
      valor: mostrarValor(
        ultimoRegistro?.frecuenciaCardiaca
      ),
      unidad: "lpm",
      icono: "♡",
    },
    {
      nombre: "Frecuencia respiratoria",
      valor: mostrarValor(
        ultimoRegistro?.frecuenciaRespiratoria
      ),
      unidad: "rpm",
      icono: "≋",
    },
  ];

  const irAlPerfil = () => {
    navigate("/paciente/perfil");
  };

  return (
    <div className="app-container">
      <Sidebar />

      <main className="dashboard-paciente">
        {/* Barra superior */}
        <div className="dashboard-superior">
          <span>
            Inicio　/　
            <strong>Resumen de mi salud</strong>
          </span>

          <span className="dashboard-ayuda">
            ⓘ Ayuda
          </span>
        </div>

        {/* Encabezado */}
        <header className="dashboard-header">
          <div>
            <h1>Hola, {nombreSaludo}</h1>
            <p>
              Tu perfil y lo más importante de tu
              seguimiento, en un solo lugar.
            </p>
          </div>

          <button
            type="button"
            className="dashboard-boton-principal"
            onClick={() =>
              navigate("/paciente/registrar")
            }
          >
            Nuevo registro　+
          </button>
        </header>

        {/* MI PERFIL */}
        <section className="dashboard-card">
          <div className="dashboard-card-header">
            <h2>Mi perfil</h2>

            <button
              type="button"
              className="dashboard-enlace"
              onClick={irAlPerfil}
            >
              Ver mi perfil →
            </button>
          </div>

          <div className="dashboard-perfil-grid">
            <div className="dashboard-perfil-persona">
              <div className="dashboard-avatar">
                {iniciales}
              </div>

              <div>
                <h3>{nombreCompleto}</h3>
                <p>
                  {historiaClinica
                    ? `${mostrarValor(historiaClinica.edad)} años · ${mostrarValor(historiaClinica.peso)} kg`
                    : "Historia clínica pendiente"}
                </p>
              </div>
            </div>

            <div className="dashboard-antecedentes">
              <span className="dashboard-etiqueta">
                ANTECEDENTES REGISTRADOS
              </span>

              <div className="dashboard-chips">
                {antecedentes.length > 0 ? (
                  antecedentes.map((antecedente) => (
                    <span
                      key={antecedente}
                      className="dashboard-chip"
                    >
                      {antecedente}
                    </span>
                  ))
                ) : (
                  <span className="dashboard-texto-secundario">
                    Sin antecedentes seleccionados
                  </span>
                )}
              </div>

              <p>
                Antecedente familiar de enfermedad renal:
                {" "}
                <strong>
                  {historiaClinica?.familiarRenal ||
                    "No registrado"}
                </strong>
              </p>
            </div>
          </div>

          
        </section>

        {/* MI SEGUIMIENTO */}
        <section className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h2>
                <span className="dashboard-icono">▥</span>
                Mi seguimiento
              </h2>

              <p className="dashboard-subtitulo">
                Último registro:{" "}
                {formatearFecha(ultimoRegistro?.fecha)}
              </p>
            </div>

            <div className="dashboard-header-acciones">
              <span className="dashboard-chip">
                {registros.length} registros
              </span>

              <button
                type="button"
                className="dashboard-enlace"
                onClick={() =>
                  navigate("/paciente/seguimiento")
                }
              >
                Ver seguimiento →
              </button>
            </div>
          </div>

          <div className="dashboard-indicadores">
            {indicadores.map((indicador) => (
              <div
                className="dashboard-indicador"
                key={indicador.nombre}
              >
                <span className="dashboard-indicador-nombre">
                  <span className="dashboard-simbolo">
                    {indicador.icono}
                  </span>
                  {indicador.nombre}
                </span>

                <div className="dashboard-valor">
                  <strong>{indicador.valor}</strong>
                  <small>{indicador.unidad}</small>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-comentario">
            <span>▤</span>

            <div>
              <small>
                COMENTARIO DEL ÚLTIMO REGISTRO
              </small>
              <p>
                {ultimoRegistro?.comentarios ||
                  "No hay comentarios registrados."}
              </p>
            </div>
          </div>
        </section>

        {/* TARJETAS INFERIORES */}
        <div className="dashboard-columnas">
          {/* MEDICAMENTOS */}
          <section className="dashboard-card">
            <div className="dashboard-card-header">
              <h2>
                <span className="dashboard-icono">◇</span>
                Mis medicamentos
              </h2>
            </div>

            <div className="dashboard-medicamentos">
              {medicamentos.length === 0 ? (
                <p className="dashboard-sin-datos">
                  Aún no hay medicamentos declarados.
                </p>
              ) : (
                medicamentos
                  .slice(
                    0,
                    mostrarMedicamentos
                      ? medicamentos.length
                      : 3
                  )
                  .map((medicamento, indice) => (
                    <div
                      className="dashboard-medicamento"
                      key={`${medicamento.nombre}-${indice}`}
                    >
                      <div>
                        <strong>
                          {medicamento.nombre}
                        </strong>

                        <span className="dashboard-tipo">
                          {medicamento.tipo}
                        </span>
                      </div>

                      <span>
                        {medicamento.dosis}{" "}
                        {medicamento.unidad || "mg/día"}
                      </span>
                    </div>
                  ))
              )}
            </div>

            <div className="dashboard-card-pie">
              <button
                type="button"
                className="dashboard-enlace"
                onClick={() =>
                  setMostrarMedicamentos(
                    (anterior) => !anterior
                  )
                }
              >
                {mostrarMedicamentos
                  ? "Ocultar detalles ↑"
                  : "Ver medicamentos →"}
              </button>

              {mostrarMedicamentos && (
                <p className="dashboard-nota">
                  Se muestra el último listado de
                  medicamentos declarado, no una
                  prescripción médica verificada.
                </p>
              )}
            </div>
          </section>

          {/* INFORMACIÓN NUTRICIONAL */}
          <section className="dashboard-card">
            <div className="dashboard-card-header">
              <h2>
                <span className="dashboard-icono">❧</span>
                Información nutricional
              </h2>
            </div>

            <div className="dashboard-nutricion">
              <div>
                <span className="dashboard-nutricion-tag">
                  CONTENIDO EDUCATIVO
                </span>

                <h3>
                  Alimentación y salud metabólica
                </h3>

                <p>
                  Conoce cómo se relacionan la
                  alimentación, el control de la glucosa
                  y los hábitos saludables.
                </p>
              </div>

              <div
                className="dashboard-nutricion-imagen"
                aria-hidden="true"
              >
                <span>🥦</span>
                <span>🥕</span>
                <span>🍎</span>
              </div>
            </div>

            {mostrarNutricion && (
              <div className="dashboard-nutricion-extra">
                <p>
                  Una alimentación variada puede
                  contribuir al cuidado de la salud.
                  Las necesidades nutricionales cambian
                  según cada persona y sus condiciones.
                </p>

                <p>
                  Si tienes enfermedad renal o diabetes,
                  consulta con tu profesional de salud
                  antes de hacer cambios importantes
                  en tu alimentación.
                </p>
              </div>
            )}

            <div className="dashboard-card-pie">
              <button
                type="button"
                className="dashboard-enlace"
                onClick={() =>
                  setMostrarNutricion(
                    (anterior) => !anterior
                  )
                }
              >
                {mostrarNutricion
                  ? "Mostrar menos ↑"
                  : "Explorar información nutricional →"}
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default PanelPaciente;
