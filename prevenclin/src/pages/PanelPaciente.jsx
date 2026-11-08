
import Sidebar from "../components/Sidebar";
import "../styles/PanelPaciente.css";
import { useNavigate } from "react-router-dom";

function PanelPaciente({ registros = [] }) {
  const navigate = useNavigate();

  const ultimoRegistro =
    registros.length > 0
      ? registros[registros.length - 1]
      : null;
  // Datos simulados para construir la interfaz
  const paciente = {
    nombre: "Paciente de prueba",
    edad: 35,
    sexo: "Masculino",
    antecedentes: ["Hipertensión"],
    presion: ultimoRegistro? `${ultimoRegistro.sistolica}/${ultimoRegistro.diastolica}`:"138/86",
    glucosa: ultimoRegistro?.glucosa ?? 126,
    frecuenciaCardiaca: ultimoRegistro?.frecuenciaCardiaca ?? 82,
    frecuenciaRespiratoria: ultimoRegistro?.frecuenciaRespiratoria ?? 16,
    medicamentos: [
      { nombre: "Metformina", dosis: "500 mg" },
      { nombre: "Enalapril", dosis: "10 mg" },
    ],
  };

  return (
    <div className="app-container">
      <Sidebar />

      <main className="panel-paciente">
        <header className="paciente-header">
          <div>
            <h1>Hola, Paciente</h1>
            <p>
              Tu perfil y estado de salud
              en un solo lugar.
            </p>
          </div>

          <button className="btn-primary"onClick={() => navigate("/paciente/registrar")}>
            + Nuevo registro
          </button>
        </header>

        <section className="paciente-card perfil-card">
          <div className="card-encabezado">
            <h2>Mi perfil</h2>
            <button className="btn-texto">
              Ver mi perfil →
            </button>
          </div>

          <div className="perfil-info">
            <div className="avatar-paciente">
              {paciente.nombre.charAt(0)}
            </div>

            <div>
              <h3>{paciente.nombre}</h3>
              <p>
                {paciente.edad} años · {paciente.sexo}
              </p>
              <span className="estado-perfil">
                Antecedentes registrados
              </span>
            </div>
          </div>
        </section>

        <section className="paciente-card">
          <div className="card-encabezado">
            <h2>Mi seguimiento</h2>
            <button className="btn-texto">
              Ver seguimiento →
            </button>
          </div>

          <p className="card-descripcion">
            Resumen de tus últimos registros.
          </p>

          <div className="indicadores-grid">
            <div className="indicador">
              <span>Presión arterial</span>
              <strong>{paciente.presion}</strong>
              <small>mmHg</small>
            </div>

            <div className="indicador">
              <span>Glucosa</span>
              <strong>{paciente.glucosa}</strong>
              <small>mg/dL</small>
            </div>

            <div className="indicador">
              <span>Frecuencia cardíaca</span>
              <strong>
                {paciente.frecuenciaCardiaca}
              </strong>
              <small>lpm</small>
            </div>

            <div className="indicador">
              <span>Frecuencia respiratoria</span>
              <strong>
                {paciente.frecuenciaRespiratoria}
              </strong>
              <small>rpm</small>
            </div>
          </div>
        </section>

        <div className="paciente-columnas">
          <section className="paciente-card">

            <button className="btn-texto">
              Ver medicamentos →
            </button>
          </section>

          <section className="paciente-card">
            <div className="card-encabezado">
              <h2>Información nutricional</h2>
            </div>

            <h3>Alimentación y salud renal</h3>

            <p className="card-descripcion">
              Descubre información educativa
              sobre alimentación equilibrada,
              prevención y hábitos saludables.
            </p>

            <button className="btn-texto">
              Explorar información →
            </button>
          </section>
        </div>

      </main>
    </div>
  );
}

export default PanelPaciente;
