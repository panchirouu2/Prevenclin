
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/HistoriaClinica.css";

function HistoriaClinica({ onGuardarHistoria }) {
  const navigate = useNavigate();

  const [datos, setDatos] = useState({
    sexo: "",
    fechaNacimiento: "",
    nombres: "",
    apellidos: "",
    edad: "",
    peso: "",
    hipertension: false,
    prediabetes: false,
    otros: false,
    familiarRenal: "",
  });

  const [error, setError] = useState("");

  const actualizar = (campo, valor) => {
    setDatos((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
    setError("");
  };

  const resumen = [
    { nombre: "Sexo", completo: Boolean(datos.sexo) },
    {
      nombre: "Fecha de nacimiento",
      completo: Boolean(datos.fechaNacimiento),
    },
    {
      nombre: "Edad y peso",
      completo: datos.edad !== "" && datos.peso !== "",
    },
    {
      nombre: "Hipertensión",
      completo: datos.hipertension,
    },
    {
      nombre: "Prediabetes",
      completo: datos.prediabetes,
    },
    {
      nombre: "Historia familiar renal",
      completo: Boolean(datos.familiarRenal),
    },
  ];

  const guardar = (e) => {
    e.preventDefault();

    if (!datos.familiarRenal) {
      setError("Indica tus antecedentes familiares.");
      return;
    }

    if (
      Number(datos.edad) < 0 ||
      Number(datos.edad) > 120 ||
      Number(datos.peso) <= 0
    ) {
      setError("Revisa los valores de edad y peso.");
      return;
    }

    onGuardarHistoria(datos);
    navigate("/paciente");
  };

  return (
    <div className="app-container historia-layout">
      <Sidebar />

      <main className="historia-main">
        <div className="historia-superior">
          <span>Registrarse　›　Historia clínica inicial</span>
          <span>ⓘ Ayuda</span>
        </div>

        <header className="historia-header">
          <h1>Registro e Historia Clínica Inicial</h1>
          <p>
            Completa estos datos para crear tu perfil y
            personalizar tu atención preventiva.
          </p>
        </header>

        <div className="historia-columnas">
          <section className="historia-tarjeta">
            <h2>Cuestionario inicial</h2>
            <h3>♙ Datos básicos</h3>
            <p className="historia-ayuda">
              Indica tus datos actuales. Los campos marcados
              son necesarios para guardar tu perfil.
            </p>

            <form onSubmit={guardar}>
              <div className="historia-fila corta">
                <div className="historia-campo">
                  <label>Sexo *</label>
                  <select
                    value={datos.sexo}
                    onChange={(e) =>
                      actualizar("sexo", e.target.value)
                    }
                    required
                  >
                    <option value="">Seleccionar</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Otro">Otro</option>
                    <option value="No informado">
                      Prefiero no indicar
                    </option>
                  </select>
                </div>

                <div className="historia-campo">
                  <label>Fecha de nacimiento *</label>
                  <input
                    type="date"
                    value={datos.fechaNacimiento}
                    onChange={(e) =>
                      actualizar("fechaNacimiento", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="historia-fila">
                <div className="historia-campo">
                  <label>Nombres *</label>
                  <input
                    type="text"
                    placeholder="Ingresa tus nombres"
                    value={datos.nombres}
                    onChange={(e) =>
                      actualizar("nombres", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="historia-campo">
                  <label>Apellidos *</label>
                  <input
                    type="text"
                    placeholder="Ingresa tus apellidos"
                    value={datos.apellidos}
                    onChange={(e) =>
                      actualizar("apellidos", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="historia-fila">
                <div className="historia-campo">
                  <label>Edad *</label>
                  <input
                    type="number"
                    placeholder="Edad en años"
                    min="0"
                    max="120"
                    value={datos.edad}
                    onChange={(e) =>
                      actualizar("edad", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="historia-campo">
                  <label>Peso (kg) *</label>
                  <input
                    type="number"
                    placeholder="Peso en kg"
                    min="0.1"
                    step="0.1"
                    value={datos.peso}
                    onChange={(e) =>
                      actualizar("peso", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <h3>♧ Antecedentes patológicos</h3>
              <p className="historia-ayuda">
                Selecciona las condiciones que te hayan
                diagnosticado previamente.
              </p>

              <div className="historia-opciones">
                {[
                  {
                    campo: "hipertension",
                    titulo: "Hipertensión",
                    descripcion: "Presión arterial alta diagnosticada",
                  },
                  {
                    campo: "prediabetes",
                    titulo: "Prediabetes",
                    descripcion: "Glucosa elevada o diagnóstico previo",
                  },
                  {
                    campo: "otros",
                    titulo: "Otros",
                    descripcion: "Otros antecedentes",
                  },
                ].map((opcion) => (
                  <label
                    key={opcion.campo}
                    className={
                      datos[opcion.campo]
                        ? "historia-opcion seleccionada"
                        : "historia-opcion"
                    }
                  >
                    <input
                      type="checkbox"
                      checked={datos[opcion.campo]}
                      onChange={(e) =>
                        actualizar(opcion.campo, e.target.checked)
                      }
                    />
                    <span>
                      <strong>{opcion.titulo}</strong>
                      <small>{opcion.descripcion}</small>
                    </span>
                  </label>
                ))}
              </div>

              <h3>♧ Antecedentes familiares</h3>
              <p className="historia-ayuda">
                ¿Algún familiar directo ha tenido
                enfermedad renal crónica?
              </p>

              <div className="historia-familia">
                {["Sí", "No", "No estoy seguro/a"].map(
                  (opcion) => (
                    <button
                      key={opcion}
                      type="button"
                      className={
                        datos.familiarRenal === opcion
                          ? "familia-btn activo"
                          : "familia-btn"
                      }
                      onClick={() =>
                        actualizar("familiarRenal", opcion)
                      }
                    >
                      {opcion}
                    </button>
                  )
                )}
              </div>

              <div className="historia-aviso">
                Tu información es confidencial y debe
                manejarse mediante un sistema seguro.
              </div>

              {error && (
                <p className="historia-error" role="alert">
                  {error}
                </p>
              )}

              <div className="historia-acciones">
                <button className="historia-guardar" type="submit">
                  → Guardar y crear perfil
                </button>
              </div>
            </form>
          </section>

          <aside className="historia-resumen">
            <div className="resumen-icono">▤</div>
            <h3>Resumen de tu registro</h3>
            <p>Revisa el avance antes de crear tu perfil.</p>

            <div className="resumen-elementos">
              {resumen.map((item) => (
                <div className="resumen-elemento" key={item.nombre}>
                  <span
                    className={
                      item.completo
                        ? "resumen-estado listo"
                        : "resumen-estado"
                    }
                  >
                    {item.completo ? "✓" : "·"}
                  </span>
                  <div>
                    <strong>{item.nombre}</strong>
                    <small>
                      {item.completo
                        ? "Registrado"
                        : "Sin completar / seleccionar"}
                    </small>
                  </div>
                </div>
              ))}
            </div>

            <div className="resumen-nota">
              <strong>💡 ¿Por qué lo preguntamos?</strong>
              <p>
                Estos factores ayudan a identificar
                antecedentes relevantes para el
                seguimiento de salud renal y metabólica.
              </p>
            </div>

            <div className="resumen-pie">
              🔒 Protección de datos cifrada.
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default HistoriaClinica;
