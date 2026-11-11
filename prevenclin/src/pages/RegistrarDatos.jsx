
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ResumenRegistro from "../components/ResumenRegistro";

import "../styles/RegistrarDatos.css";

function RegistrarDatos({ onContinuar, borrador }) {
  const navigate = useNavigate();

  const [datos, setDatos] = useState(
    borrador || {
      sistolica: "",
      diastolica: "",
      glucosa: "",
      frecuenciaCardiaca: "",
      frecuenciaRespiratoria: "",
      fecha: "",
      comentarios: "",
    }
  );

  const [archivos, setArchivos] = useState([]);
  const [error, setError] = useState("");

  const actualizar = (campo, valor) => {
    setDatos((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
    setError("");
  };

  const resumen = [
    {
      nombre: "Presión arterial",
      completo: datos.sistolica !== "" &&
                datos.diastolica !== "",
    },
    {
      nombre: "Glucemia",
      completo: datos.glucosa !== "",
    },
    {
      nombre: "Frecuencia cardíaca",
      completo: datos.frecuenciaCardiaca !== "",
    },
    {
      nombre: "Frecuencia respiratoria",
      completo: datos.frecuenciaRespiratoria !== "",
    },
    {
      nombre: "Fecha de registro",
      completo: Boolean(datos.fecha),
    },
    {
      nombre: "Archivos adjuntos",
      completo: archivos.length > 0,
    },
    {
      nombre: "Comentarios",
      completo: datos.comentarios.trim() !== "",
    },
  ];

  const guardar = (e) => {
    e.preventDefault();

    const valores = [
      datos.sistolica,
      datos.diastolica,
      datos.glucosa,
      datos.frecuenciaCardiaca,
      datos.frecuenciaRespiratoria,
    ].map(Number);

    if (
      valores.some(
        (valor) => !Number.isFinite(valor) || valor <= 0
      )
    ) {
      setError("Ingresa mediciones numéricas positivas.");
      return;
    }

    if (valores[0] <= valores[1]) {
      setError(
        "La presión sistólica debe ser mayor que la diastólica."
      );
      return;
    }

    if (!datos.fecha) {
      setError("Selecciona la fecha de registro.");
      return;
    }

    const nuevoRegistro = {
      sistolica: valores[0],
      diastolica: valores[1],
      glucosa: valores[2],
      frecuenciaCardiaca: valores[3],
      frecuenciaRespiratoria: valores[4],
      fecha: datos.fecha,
      comentarios: datos.comentarios.trim(),

      // Solo guardamos metadatos, no el contenido.
      adjuntos: archivos.map((archivo) => ({
        nombre: archivo.name,
        tipo: archivo.type,
        tamano: archivo.size,
      })),
    };

    onContinuar(nuevoRegistro);
    navigate("/paciente/registrar/medicamentos");
  };

  return (
    <div className="app-container">
      <Sidebar />

      <main className="registro-pagina">
        <div className="registro-superior">
          <span>
            Registro Diario　›　
            <strong>Ingresar Registro</strong>
          </span>
          <span className="registro-ayuda">ⓘ Ayuda</span>
        </div>

        <header className="registro-titulo">
          <h1>Ingresar Registro Diario</h1>
          <p>
            Completa los datos para guardar registro
            de tu progreso.
          </p>
        </header>

        <div className="registro-columnas">
          <section className="registro-formulario">
            <form onSubmit={guardar}>
              <h3 className="registro-seccion">
                <span className="registro-icono">▤</span>
                Datos ingresados
              </h3>

              <div className="registro-mediciones">
                <div className="registro-campo">
                  <label>Presión arterial *</label>

                  <div className="registro-presion">
                    <input
                      type="number"
                      min="1"
                      step="any"
                      placeholder="Sistólica"
                      value={datos.sistolica}
                      onChange={(e) =>
                        actualizar("sistolica", e.target.value)
                      }
                      aria-label="Presión sistólica"
                      required
                    />

                    <span>/</span>

                    <input
                      type="number"
                      min="1"
                      step="any"
                      placeholder="Diastólica"
                      value={datos.diastolica}
                      onChange={(e) =>
                        actualizar("diastolica", e.target.value)
                      }
                      aria-label="Presión diastólica"
                      required
                    />

                    <small>mmHg</small>
                  </div>
                </div>

                <div className="registro-campo">
                  <label htmlFor="glucosa">
                    Glucemia *
                  </label>

                  <div className="registro-input">
                    <input
                      id="glucosa"
                      type="number"
                      min="0.1"
                      step="any"
                      placeholder="Ej: 95"
                      value={datos.glucosa}
                      onChange={(e) =>
                        actualizar("glucosa", e.target.value)
                      }
                      required
                    />
                    <span>mg/dL</span>
                  </div>
                </div>
              </div>

              <div className="registro-mediciones tres">
                <div className="registro-campo">
                  <label htmlFor="frecuenciaCardiaca">
                    Frecuencia Cardíaca *
                  </label>

                  <div className="registro-input">
                    <input
                      id="frecuenciaCardiaca"
                      type="number"
                      min="1"
                      placeholder="Ej: 72"
                      value={datos.frecuenciaCardiaca}
                      onChange={(e) =>
                        actualizar(
                          "frecuenciaCardiaca",
                          e.target.value
                        )
                      }
                      required
                    />
                    <span>LPM</span>
                  </div>
                </div>

                <div className="registro-campo">
                  <label htmlFor="frecuenciaRespiratoria">
                    Frecuencia Respiratoria *
                  </label>

                  <div className="registro-input">
                    <input
                      id="frecuenciaRespiratoria"
                      type="number"
                      min="1"
                      placeholder="Ej: 16"
                      value={datos.frecuenciaRespiratoria}
                      onChange={(e) =>
                        actualizar(
                          "frecuenciaRespiratoria",
                          e.target.value
                        )
                      }
                      required
                    />
                    <span>RPM</span>
                  </div>
                </div>

                <div className="registro-campo">
                  <label htmlFor="fechaRegistro">
                    Fecha de registro *
                  </label>

                  <input
                    id="fechaRegistro"
                    className="registro-fecha"
                    type="date"
                    value={datos.fecha}
                    onChange={(e) =>
                      actualizar("fecha", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <h3 className="registro-seccion adjuntos">
                <span className="registro-icono">▤</span>
                Archivos adjuntos (PNG, JPEG y PDF)
              </h3>

              <p className="registro-descripcion">
                Aquí puedes seleccionar resultados
                médicos de referencia.
              </p>

              <input
                className="registro-archivo"
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                multiple
                aria-label="Seleccionar archivos médicos"
                onChange={(e) =>
                  setArchivos(Array.from(e.target.files))
                }
              />

              {archivos.length > 0 && (
                <p className="registro-archivos-elegidos">
                  {archivos.length} archivo(s) seleccionado(s)
                </p>
              )}

              <div className="registro-campo comentarios">
                <label htmlFor="comentarios">
                  Comentarios
                </label>

                <textarea
                  id="comentarios"
                  rows="5"
                  placeholder="Puedes dejar un comentario sobre cómo te sentiste hoy."
                  value={datos.comentarios}
                  onChange={(e) =>
                    actualizar("comentarios", e.target.value)
                  }
                />
              </div>

              <div className="registro-aviso">
                Este registro es de seguimiento y no
                sustituye una evaluación médica.
              </div>

              {error && (
                <p className="registro-error" role="alert">
                  {error}
                </p>
              )}

              <div className="registro-acciones">
                <button
                  type="button"
                  className="registro-cancelar"
                  onClick={() => navigate("/paciente")}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="registro-guardar"
                >
                  Guardar registro →
                </button>
              </div>
            </form>
          </section>

          <ResumenRegistro
            titulo="Resumen de tu registro"
            descripcion="Revisa el avance antes de continuar."
            elementos={resumen}
            mostrarConsejo
          />
        </div>
      </main>
    </div>
  );
}

export default RegistrarDatos;
