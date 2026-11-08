
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>PrevenClin</h2>
        <p>Salud y prevención</p>
      </div>

      <nav className="sidebar-menu">
        <NavLink
          to="/paciente"
          end
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Inicio
        </NavLink>

        <NavLink
          to="/paciente/registrar"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Registrar datos
        </NavLink>

        <span className="sidebar-pendiente">
          Mi perfil
        </span>

        <span className="sidebar-pendiente">
          Mi seguimiento
        </span>

        <span className="sidebar-pendiente">
          Asistente de IA
        </span>
      </nav>

      <div className="sidebar-footer">
        <p>Centro de ayuda</p>
      </div>
    </aside>
  );
}

export default Sidebar;
