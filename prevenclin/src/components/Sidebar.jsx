
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
        <NavLink
          to="/paciente/historia"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Mi perfil
        </NavLink>
        
        <NavLink
          to="/paciente/seguimiento"
          className={({ isActive }) =>
            isActive ? "active" : ""}>
            Mi seguimiento
        </NavLink>

        <NavLink
          to="/paciente/medicamentos"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Asistente de IA
        </NavLink>


      </nav>

      <div className="sidebar-footer">
        <p>Centro de ayuda</p>
      </div>
    </aside>
  );
}

export default Sidebar;
