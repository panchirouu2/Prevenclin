
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/RegistrarDatos.css";

function RegistrarDatos({ onGuardarRegistro }) {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    sistolica: "",
    diastolica: "",
    glucosa: "",
    frecuenciaCardiaca: "",
    frecuenciaRespiratoria: "",
  });

  const [error, setError] = useState("");

  const campos = [
    {
      name: "sistolica",
      label: "Presión sistólica",
      unidad: "mmHg",
    },
    {
      name: "diastolica",
      label: "Presión diastólica",
      unidad: "mmHg",
    },
    {
      name: "glucosa",
      label: "Glucosa",
      unidad: "mg/dL",
    },
    {
      name: "frecuenciaCardiaca",
      label: "Frecuencia cardíaca",
      unidad: "lpm",
    },
    {
      name: "frecuenciaRespiratoria",
      label: "Frecuencia respiratoria",
      unidad: "rpm",
    },
  ];

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    setError("");
  };

  const guardarRegistro = (e) => {
    e.preventDefault();

    const valores = Object.values(formulario);

    const sonValidos = valores.every(
      (valor) =>
        valor.trim() !== "" &&
        Number.isFinite(Number(valor)) &&
        Number(valor) > 0
    );

    if (!sonValidos) {
      setError("Ingresa valores numéricos positivos.");
      return;
    }

    const nuevoRegistro = {
      id: crypto.randomUUID(),
      fecha: new Date().toISOString(),
      sistolica: Number(formulario.sistolica),
      diastolica: Number(formulario.diastolica),
      glucosa: Number(formulario.glucosa),
      frecuenciaCardiaca:
        Number(formulario.frecuenciaCardiaca),
      frecuenciaRespiratoria:
        Number(formulario.frecuenciaRespiratoria),
    };

    onGuardarRegistro(nuevoRegistro);

    navigate("/paciente");
  };

  return (
    <div className="app-container">
      <Sidebar />

      <main className="registro-contenedor">
        <header className="registro-header">
          <button
            type="button"
            className="registro-volver"
            onClick={() => navigate("/paciente")}
          >
            ← Volver al inicio
          </button>

          <h1>Registrar mediciones</h1>
          <p>
            Ingresa tus mediciones de salud
            para mantener actualizado tu seguimiento.
          </p>
        </header>

        <section className="registro-tarjeta">
          <h2>Nuevo registro de salud</h2>

          <p className="registro-descripcion">
            Completa los siguientes campos con
            tus mediciones actuales.
          </p>

          <form onSubmit={guardarRegistro}>
            <div className="registro-grid">
              {campos.map((campo) => (
                <div
                  className="registro-campo"
                  key={campo.name}
                >
                  <label htmlFor={campo.name}>
                    {campo.label}
                  </label>

                  <div className="registro-input">
                    <input
                      id={campo.name}
                      name={campo.name}
                      type="number"
                      min="0.1"
                      step="any"
                      placeholder="Ingresa un valor"
                      value={formulario[campo.name]}
                      onChange={manejarCambio}
                      required
                    />

                    <span>{campo.unidad}</span>
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <p className="registro-error" role="alert">
                {error}
              </p>
            )}

            <p className="registro-aviso">
              Esta herramienta es de seguimiento
              y no sustituye la evaluación médica.
            </p>

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
                Guardar registro
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default RegistrarDatos;
