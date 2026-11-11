
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ResumenRegistro from "../components/ResumenRegistro";

import "../styles/RegistrarDatos.css";

function IngresarMedicamentos({ onGuardar }) {
  const navigate = useNavigate();

  const crearFila = () => ({
    id: crypto.randomUUID(),
    nombre: "",
    dosis: "",
  });

  const [recetados, setRecetados] = useState([crearFila()]);
  const [ventaLibre, setVentaLibre] = useState([crearFila()]);
  const [comentarios, setComentarios] = useState("");
  const [archivos, setArchivos] = useState([]);
  const [error, setError] = useState("");

  const modificarMedicamento = (
    lista,
    setLista,
    id,
    campo,
    valor
  ) => {
    setLista(
      lista.map((item) =>
        item.id === id
          ? { ...item, [campo]: valor }
          : item
      )
    );
    setError("");
  };

  const agregarFila = (setLista) => {
    setLista((anterior) => [...anterior, crearFila()]);
  };

  const eliminarFila = (setLista, id) => {
    setLista((anterior) =>
      anterior.filter((item) => item.id !== id)
    );
  };

  const renderGrupo = (titulo, lista, setLista, tipo) => (
    <div className="medicamentos-grupo">
      <h3 className="registro-seccion">
        <span className="registro-icono">▤</span>
        {titulo}
      </h3>

      {lista.map((medicamento) => (
        <div
          className="medicamento-fila"
          key={medicamento.id}
        >
          <div className="registro-campo">
            <label>Nombre del medicamento</label>
            <input
              type="text"
              placeholder="Ej: Metformina"
              value={medicamento.nombre}
              onChange={(e) =>
                modificarMedicamento(
                  lista,
                  setLista,
                  medicamento.id,
                  "nombre",
                  e.target.value
                )
              }
            />
          </div>

          <div className="registro-campo">
            <label>Dosis (mg/día)</label>
            <input
              type="number"
              min="0.1"
              step="any"
              placeholder="Ej: 500"
              value={medicamento.dosis}
              onChange={(e) =>
                modificarMedicamento(
                  lista,
                  setLista,
                  medicamento.id,
                  "dosis",
                  e.target.value
                )
              }
            />
          </div>

          <button
            type="button"
            className="medicamento-eliminar"
            onClick={() =>
              eliminarFila(setLista, medicamento.id)
            }
            aria-label="Eliminar medicamento"
          >
            ×
          </button>
        </div>
      ))}

      <button
        type="button"
        className="medicamento-agregar"
        onClick={() => agregarFila(setLista)}
      >
        + Agregar otro medicamento
      </button>
    </div>
  );

  const procesarMedicamentos = (lista, tipo) =>
    lista
      .filter((item) => item.nombre.trim() !== "")
      .map((item) => ({
        nombre: item.nombre.trim(),
        dosis: Number(item.dosis),
        unidad: "mg/día",
        tipo,
      }));

  const finalizar = (omitir = false) => {
    if (omitir) {
      onGuardar({
        medicamentos: [],
        comentariosMedicamentos: "",
        adjuntosMedicamentos: [],
      });
      navigate("/paciente");
      return;
    }

    const todos = [...recetados, ...ventaLibre];

    const incompleto = todos.some(
      (item) =>
        (item.nombre.trim() !== "" ||
          item.dosis !== "") &&
        (
          item.nombre.trim() === "" ||
          item.dosis === "" ||
          !Number.isFinite(Number(item.dosis)) ||
          Number(item.dosis) <= 0
        )
    );

    if (incompleto) {
      setError(
        "Completa el nombre y la dosis de cada medicamento ingresado."
      );
      return;
    }

    const medicamentos = [
      ...procesarMedicamentos(recetados, "Recetado"),
      ...procesarMedicamentos(ventaLibre, "Venta libre"),
    ];

    onGuardar({
      medicamentos,
      comentariosMedicamentos: comentarios.trim(),
      adjuntosMedicamentos: archivos.map((archivo) => ({
        nombre: archivo.name,
        tipo: archivo.type,
        tamano: archivo.size,
      })),
    });

    navigate("/paciente");
  };

  const medicamentosCompletos = [
    ...recetados,
    ...ventaLibre,
  ].filter(
    (item) =>
      item.nombre.trim() !== "" &&
      item.dosis !== "" &&
      Number(item.dosis) > 0
  );

  const resumen = [
    ...medicamentosCompletos.map((item) => ({
      nombre: `${item.nombre} (${item.dosis} mg/día)`,
      completo: true,
    })),
    {
      nombre: "Archivos adjuntos",
      completo: archivos.length > 0,
    },
    {
      nombre: "Comentarios",
      completo: comentarios.trim() !== "",
    },
  ];

  return (
    <div className="app-container">
      <Sidebar />

      <main className="registro-pagina">
        <div className="registro-superior">
          <span>
            Registro Diario　›　Ingresar Registro　›　
            <strong>Ingresar Medicamentos</strong>
          </span>
          <span className="registro-ayuda">ⓘ Ayuda</span>
        </div>

        <header className="registro-titulo">
          <h1>Ingresar Medicamentos</h1>
          <p>
            Registra los medicamentos que utilizas
            según las indicaciones recibidas.
          </p>
        </header>

        <div className="registro-columnas">
          <section className="registro-formulario">
            {renderGrupo(
              "Medicamentos (Recetados)",
              recetados,
              setRecetados,
              "Recetado"
            )}

            {renderGrupo(
              "Medicamentos (Venta libre)",
              ventaLibre,
              setVentaLibre,
              "Venta libre"
            )}

            <h3 className="registro-seccion adjuntos">
              <span className="registro-icono">▤</span>
              Archivos adjuntos (PNG, JPEG y PDF)
            </h3>

            <p className="registro-descripcion">
              Selecciona documentos relacionados
              con tu tratamiento, si corresponde.
            </p>

            <input
              className="registro-archivo"
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              multiple
              aria-label="Adjuntar documentos"
              onChange={(e) =>
                setArchivos(Array.from(e.target.files))
              }
            />

            <div className="registro-campo comentarios">
              <label htmlFor="comentariosMedicamentos">
                Comentarios
              </label>

              <textarea
                id="comentariosMedicamentos"
                rows="5"
                placeholder="Dudas sobre algún medicamento, su uso diario o cualquier pregunta relacionada."
                value={comentarios}
                onChange={(e) =>
                  setComentarios(e.target.value)
                }
              />
            </div>

            <div className="registro-aviso">
              Registra únicamente medicamentos y dosis
              que realmente utilizas. No modifiques tu
              tratamiento basándote en esta herramienta.
            </div>

            {error && (
              <p className="registro-error" role="alert">
                {error}
              </p>
            )}

            <div className="registro-acciones">
              <button
                type="button"
                className="registro-cancelar"
                onClick={() =>
                  navigate("/paciente/registrar")
                }
              >
                ← Volver
              </button>

              <button
                type="button"
                className="registro-cancelar"
                onClick={() => finalizar(true)}
              >
                Omitir
              </button>

              <button
                type="button"
                className="registro-guardar"
                onClick={() => finalizar(false)}
              >
                → Guardar registro
              </button>
            </div>
          </section>

          <ResumenRegistro
            titulo="Resumen de medicamentos"
            descripcion="Medicamentos ingresados en este registro."
            elementos={resumen}
          />
        </div>
      </main>
    </div>
  );
}

export default IngresarMedicamentos;
