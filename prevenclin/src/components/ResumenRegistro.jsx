
function ResumenRegistro({
  titulo,
  descripcion,
  elementos,
  mostrarConsejo = false,
}) {
  return (
    <aside className="registro-resumen">
      <div className="registro-resumen-icono">▤</div>

      <h3>{titulo}</h3>
      <p>{descripcion}</p>

      <div className="registro-resumen-lista">
        {elementos.map((elemento) => (
          <div
            className="registro-resumen-item"
            key={elemento.nombre}
          >
            <span
              className={
                elemento.completo
                  ? "registro-check completado"
                  : "registro-check"
              }
            >
              {elemento.completo ? "✓" : "···"}
            </span>

            <div>
              <strong>{elemento.nombre}</strong>
              <small>
                {elemento.completo
                  ? "Completado"
                  : "Sin completar"}
              </small>
            </div>
          </div>
        ))}
      </div>

      {mostrarConsejo && (
        <div className="registro-consejo">
          <strong>💡 ¿Por qué lo preguntamos?</strong>
          <p>
            Estos datos permiten construir un historial
            de seguimiento renal y metabólico.
          </p>
        </div>
      )}

      <div className="registro-resumen-pie">
        <span>▣</span>
        Prototipo con datos temporales
      </div>
    </aside>
  );
}

export default ResumenRegistro;
