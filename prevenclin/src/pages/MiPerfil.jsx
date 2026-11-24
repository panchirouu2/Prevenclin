
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/MiPerfil.css";

function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return null;

  const [anio, mes, dia] = fechaNacimiento
    .split("-")
    .map(Number);

  const nacimiento = new Date(anio, mes - 1, dia);
  const hoy = new Date();

  if (
    nacimiento.getFullYear() !== anio ||
    nacimiento.getMonth() !== mes - 1 ||
    nacimiento.getDate() !== dia ||
    nacimiento > hoy
  ) {
    return null;
  }

  let edad = hoy.getFullYear() - anio;

  if (
    hoy.getMonth() < mes - 1 ||
    (hoy.getMonth() === mes - 1 &&
      hoy.getDate() < dia)
  ) {
    edad--;
  }

  return edad;
}

function MiPerfil({
  historiaClinica,
  onGuardarHistoria,
}) {
  const navigate = useNavigate();

  const [datos, setDatos] = useState(() => ({
    nombres: historiaClinica?.nombres ?? "",
    apellidos: historiaClinica?.apellidos ?? "",
    sexo: historiaClinica?.sexo ?? "",
    fechaNacimiento:
      historiaClinica?.fechaNacimiento ?? "",
    peso: historiaClinica?.peso ?? "",
    hipertension: historiaClinica?.hipertension ?? false,
    prediabetes: historiaClinica?.prediabetes ?? false,
    otros: historiaClinica?.otros ?? false,
    familiarRenal:
      historiaClinica?.familiarRenal ?? "",
  }));

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const actualizar = (campo, valor) => {
    setDatos((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));

    setMensaje("");
    setError("");
  };

  const edad = calcularEdad(datos.fechaNacimiento);

  const guardarCambios = (e) => {
    e.preventDefault();

    if (
      !datos.nombres.trim() ||
      !datos.apellidos.trim() ||
      !datos.sexo ||
      !datos.fechaNacimiento
    ) {
      setError("Completa los datos personales.");
      return;
    }

    if (edad === null || edad > 120) {
      setError("Revisa la fecha de nacimiento.");
      return;
    }

    if (
      datos.peso === "" ||
      !Number.isFinite(Number(datos.peso)) ||
      Number(datos.peso) <= 0
    ) {
      setError("Ingresa un peso válido.");
      return;
    }

    if (!datos.familiarRenal) {
      setError(
        "Selecciona una respuesta sobre antecedentes familiares."
      );
      return;
    }

    const historiaActualizada = {
      ...historiaClinica,
      ...datos,
      nombres: datos.nombres.trim(),
      apellidos: datos.apellidos.trim(),
      edad,
      peso: Number(datos.peso),
    };

    onGuardarHistoria(historiaActualizada);

    setError("");
    setMensaje(
      "Cambios guardados en esta sesión de prueba."
    );
  };

  // Mientras no exista historia clínica
  if (!historiaClinica) {
    return (
      <div className="app-container">
        <Sidebar />

        <main className="perfil-pagina">
          <div className="perfil-ruta">
            Inicio / Mi perfil
          </div>

          <h1>Mi perfil</h1>

          <section className="perfil-tarjeta">
            <h2>Tu historia clínica está pendiente</h2>
            <p className="perfil-descripcion">
              Para visualizar y editar tu perfil,
              primero necesitas completar el
              cuestionario clínico inicial.
            </p>

            <button
              className="perfil-boton"
              onClick={() =>
                navigate("/paciente/historia")
              }
            >
              Completar historia clínica →
            </button>
          </section>
        </main>
      </div>
    );
  }

  const nombreCompleto =
    `${datos.nombres} ${datos.apellidos}`.trim();

  const antecedentes = [
    datos.hipertension && "Hipertensión",
    datos.prediabetes && "Prediabetes",
    datos.otros && "Otros antecedentes",
  ].filter(Boolean);

  return (
    <div className="app-container">
      <Sidebar />

      <main className="perfil-pagina">
        <div className="perfil-ruta">
          Inicio　›　<strong>Mi perfil</strong>
        </div>

        <header className="perfil-header">
          <h1>Mi perfil</h1>
          <p>
            Consulta y actualiza tus datos personales
            y antecedentes médicos.
          </p>
        </header>

        <div className="perfil-columnas">
          <section className="perfil-tarjeta">
            <div className="perfil-identidad">
              <div className="perfil-avatar">
                {datos.nombres.charAt(0).toUpperCase()}
                {datos.apellidos.charAt(0).toUpperCase()}
              </div>

              <div>
                <h2>{nombreCompleto || "Paciente"}</h2>
                <p>Perfil de paciente</p>
              </div>
            </div>

            <form onSubmit={guardarCambios}>
              <h3 className="perfil-seccion">
                Datos personales
              </h3>

              <div className="perfil-grid">
                <div className="perfil-campo">
                  <label htmlFor="perfilNombres">
                    Nombres *
                  </label>
                  <input
                    id="perfilNombres"
                    type="text"
                    value={datos.nombres}
                    onChange={(e) =>
                      actualizar("nombres", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="perfil-campo">
                  <label htmlFor="perfilApellidos">
                    Apellidos *
                  </label>
                  <input
                    id="perfilApellidos"
                    type="text"
                    value={datos.apellidos}
                    onChange={(e) =>
                      actualizar("apellidos", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="perfil-campo">
                  <label htmlFor="perfilSexo">
                    Sexo registrado *
                  </label>
                  <select
                    id="perfilSexo"
                    value={datos.sexo}
                    onChange={(e) =>
                      actualizar("sexo", e.target.value)
                    }
                    required
                  >
                    <option value="">Seleccionar</option>
                    <option value="Femenino">
                      Femenino
                    </option>
                    <option value="Masculino">
                      Masculino
                    </option>
                    <option value="Otro">Otro</option>
                    <option value="No informado">
                      Prefiero no indicar
                    </option>
                  </select>
                </div>

                <div className="perfil-campo">
                  <label htmlFor="perfilNacimiento">
                    Fecha de nacimiento *
                  </label>
                  <input
                    id="perfilNacimiento"
                    type="date"
                    value={datos.fechaNacimiento}
                    onChange={(e) =>
                      actualizar(
                        "fechaNacimiento",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>

                <div className="perfil-campo">
                  <label htmlFor="perfilEdad">
                    Edad
                  </label>
                  <input
                    id="perfilEdad"
                    type="text"
                    value={
                      edad !== null
                        ? `${edad} años`
                        : "Fecha no válida"
                    }
                    readOnly
                  />
                </div>

                <div className="perfil-campo">
                  <label htmlFor="perfilPeso">
                    Peso (kg) *
                  </label>
                  <input
                    id="perfilPeso"
                    type="number"
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

              <h3 className="perfil-seccion">
                Antecedentes patológicos
              </h3>

              <p className="perfil-descripcion">
                Selecciona las condiciones que te hayan
                diagnosticado previamente.
              </p>

              <div className="perfil-antecedentes">
                {[
                  {
                    campo: "hipertension",
                    nombre: "Hipertensión",
                  },
                  {
                    campo: "prediabetes",
                    nombre: "Prediabetes",
                  },
                  {
                    campo: "otros",
                    nombre: "Otros antecedentes",
                  },
                ].map((opcion) => (
                  <label
                    key={opcion.campo}
                    className={
                      datos[opcion.campo]
                        ? "perfil-opcion seleccionada"
                        : "perfil-opcion"
                    }
                  >
                    <input
                      type="checkbox"
                      checked={datos[opcion.campo]}
                      onChange={(e) =>
                        actualizar(
                          opcion.campo,
                          e.target.checked
                        )
                      }
                    />

                    <span>{opcion.nombre}</span>
                  </label>
                ))}
              </div>

              <h3 className="perfil-seccion">
                Antecedentes familiares
              </h3>

              <p className="perfil-descripcion">
                ¿Algún familiar directo ha tenido
                enfermedad renal crónica?
              </p>

              <div className="perfil-opciones-familia">
                {[
                  "Sí",
                  "No",
                  "No estoy seguro/a",
                ].map((opcion) => (
                  <button
                    key={opcion}
                    type="button"
                    className={
                      datos.familiarRenal === opcion
                        ? "perfil-familia activo"
                        : "perfil-familia"
                    }
                    onClick={() =>
                      actualizar("familiarRenal", opcion)
                    }
                  >
                    {opcion}
                  </button>
                ))}
              </div>

              <div className="perfil-aviso">
                Esta es una versión de desarrollo.
                Los cambios se mantienen únicamente
                durante la sesión actual.
              </div>

              {error && (
                <p className="perfil-error" role="alert">
                  {error}
                </p>
              )}

              {mensaje && (
                <p className="perfil-exito" role="status">
                  ✓ {mensaje}
                </p>
              )}

              <div className="perfil-acciones">
                <button
                  type="button"
                  className="perfil-cancelar"
                  onClick={() => navigate("/paciente")}
                >
                  Volver al inicio
                </button>

                <button
                  type="submit"
                  className="perfil-boton"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </section>

          {/* Resumen lateral */}
          <aside className="perfil-resumen">
            <div className="perfil-resumen-icono">▤</div>

            <h3>Resumen de tu perfil</h3>
            <p>
              Información registrada en tu
              historia clínica.
            </p>

            <div className="perfil-resumen-item">
              <span>Nombre</span>
              <strong>{nombreCompleto}</strong>
            </div>

            <div className="perfil-resumen-item">
              <span>Edad</span>
              <strong>
                {edad !== null ? `${edad} años` : "—"}
              </strong>
            </div>

            <div className="perfil-resumen-item">
              <span>Peso</span>
              <strong>
                {datos.peso
                  ? `${datos.peso} kg`
                  : "No registrado"}
              </strong>
            </div>

            <div className="perfil-resumen-item">
              <span>Antecedentes</span>
              <strong>
                {antecedentes.length > 0
                  ? antecedentes.join(", ")
                  : "Ninguno seleccionado"}
              </strong>
            </div>

            <div className="perfil-resumen-item">
              <span>Antecedentes familiares renales</span>
              <strong>
                {datos.familiarRenal || "No registrado"}
              </strong>
            </div>

            <div className="perfil-resumen-nota">
              Los cambios realizados en el formulario
              aparecerán aquí y se aplicarán al
              dashboard cuando los guardes.
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default MiPerfil;
