
import { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import PanelPaciente from "./pages/PanelPaciente";
import RegistrarDatos from "./pages/RegistrarDatos";

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

  const agregarRegistro = (nuevoRegistro) => {
    setRegistros((anteriores) => [
      ...anteriores,
      nuevoRegistro,
    ]);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/paciente"
          element={
            <PanelPaciente registros={registros} />
          }
        />

        <Route
          path="/paciente/registrar"
          element={
            <RegistrarDatos
              onGuardarRegistro={agregarRegistro}
            />
          }
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
