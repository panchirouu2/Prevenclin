
import { useState } from "react";


import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import PanelPaciente from "./pages/PanelPaciente";
import RegistrarDatos from "./pages/RegistrarDatos";
import HistoriaClinica from "./pages/HistoriaClinica";
import IngresarMedicamentos from "./pages/IngresarMedicamentos";
import SeguimientoPaciente from "./pages/SeguimientoPaciente";

import "./styles/Inicio.css";
import "./styles/App.css";

function PanelMedico() {
  return (
    <main className="main-content">
      <h1>Panel Médico</h1>
      <p>Bienvenido a PrevenClin.</p>
    </main>
  );
}

function App() {
  // Registros compartidos entre las páginas
  const [registros, setRegistros] = useState([]);
  const [historiaClinica, setHistoriaClinica] = useState(null);
  const [borradorRegistro, setBorradorRegistro] = useState(null);

  const agregarRegistro = (nuevoRegistro) => {
    setRegistros((anteriores) => [
      ...anteriores,
      nuevoRegistro,
    ]);
  };
  const finalizarRegistro = (datosMedicamentos) => {
  if (!borradorRegistro) return;

  const registroCompleto = {
    ...borradorRegistro,
    ...datosMedicamentos,
    id: crypto.randomUUID(),
  };

  agregarRegistro(registroCompleto);
  setBorradorRegistro(null);
};

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/paciente/historia" element={<HistoriaClinica onGuardarHistoria={setHistoriaClinica}/>}/>
        <Route path="/paciente/medicamentos" element={<IngresarMedicamentos />} />
        <Route path="/paciente/seguimiento" element={<SeguimientoPaciente registros={registros} historiaClinica={historiaClinica}/>}/>
        <Route path="/paciente" element={<PanelPaciente registros={registros} />}/>

        <Route
          path="/paciente/registrar"
          element={
            <RegistrarDatos
              onContinuar={setBorradorRegistro}
              borrador={borradorRegistro}
              />
              }
            />


        <Route
          path="/paciente/registrar/medicamentos"
          element={borradorRegistro ? (<IngresarMedicamentos onGuardar={finalizarRegistro}/>):
          (<Navigate to="/paciente" />)}
        />


        <Route
          path="/medico"
          element={<PanelMedico />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
