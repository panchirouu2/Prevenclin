
function Inicio() {
  return (
    <div className="inicio">
      <header className="inicio-header">
        <div className="inicio-navbar">
          <a href="#inicio" className="inicio-logo">
            <span className="logo-icono">✚</span>
            PrevenClin
          </a>

          <nav className="inicio-nav">
            <a href="#inicio">Inicio</a>
            <a href="#nosotros">Nosotros</a>
            <a href="#servicios">Servicios</a>
            <a href="#educacion">Educación</a>
          </nav>

     <a href="/login" className="boton-acceso">Iniciar sesión</a>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-contenido">
            <span className="hero-etiqueta">
              PREVENCIÓN Y BIENESTAR
            </span>

            <h1>
              Cuidamos tu salud,
              <span> acompañamos tu futuro.</span>
            </h1>

            <p>
              PrevenClin es una plataforma de salud
              digital que facilita el seguimiento de
              indicadores renales y metabólicos,
              promoviendo la prevención y el
              autocuidado.
            </p>

            <div className="hero-botones">
              <a href="/login" className="boton-principal">
                Comenzar ahora
              </a>

              <a href="#nosotros" className="boton-secundario">
                Conoce PrevenClin
              </a>
            </div>
          </div>

          <div className="hero-imagen">
            <img
              src="/medico.jpg"
              alt="Profesional de salud"
            />
          </div>
        </section>

        <section className="servicios" id="servicios">
          <div className="seccion-titulo">
            <h2>Nuestros servicios</h2>
            <p>
              Herramientas para acompañarte
              en el cuidado de tu salud.
            </p>
          </div>

          <div className="servicios-grid">
            <article className="servicio-card">
              <div className="servicio-icono">♥</div>
              <h3>Seguimiento de salud</h3>
              <p>
                Consulta tus mediciones y visualiza
                cómo evolucionan tus indicadores.
              </p>
            </article>

            <article className="servicio-card">
              <div className="servicio-icono">✚</div>
              <h3>Registro de datos</h3>
              <p>
                Registra presión arterial,
                glucosa y otros indicadores
                importantes.
              </p>
            </article>

            <article className="servicio-card">
              <div className="servicio-icono">◈</div>
              <h3>Educación preventiva</h3>
              <p>
                Accede a información sobre
                hábitos saludables y prevención.
              </p>
            </article>
          </div>
        </section>

        <section className="nosotros" id="nosotros">
          <h2>¿Qué es PrevenClin?</h2>
          <p>
            Una herramienta de apoyo para pacientes
            y profesionales de la salud que facilita
            el automonitoreo, la educación y el
            seguimiento de indicadores clínicos.
            No sustituye la evaluación médica.
          </p>
        </section>
      </main>

      <footer className="inicio-footer" id="educacion">
        <p>
          © 2026 PrevenClin — Plataforma de salud digital
        </p>
      </footer>
    </div>
  );
}

export default Inicio;
