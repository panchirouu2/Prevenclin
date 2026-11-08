
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  //cuentas simuladas ya que aun no esta lo de la BD
  const usuarios = [
    {
      correo: "paciente@prevenclin.cl",
      contrasena: "Paciente123",
      rol: "paciente",
    },
    {
      correo: "medico@prevenclin.cl",
      contrasena: "Medico123",
      rol: "medico",
    },
  ];

  const iniciarSesion = (e) => {
    e.preventDefault();

    const usuario = usuarios.find(
      (u) =>
        u.correo === correo.trim().toLowerCase() &&
        u.contrasena === contrasena
    );

    if (!usuario) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    setError("");

    if (usuario.rol === "paciente") {
      navigate("/paciente");
    } else if (usuario.rol === "medico") {
      navigate("/medico");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>PrevenClin</h1>
        <h2>Bienvenido</h2>

        <p>Ingresa a tu cuenta para continuar</p>

        <form onSubmit={iniciarSesion}>
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="correo@ejemplo.cl"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Ingresa tu contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit">Iniciar sesión</button>
        </form>

        <a href="/">Volver al inicio</a>
      </div>
    </div>
  );
}

export default Login;
