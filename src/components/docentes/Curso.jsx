import { useState } from 'react';
import { descargar, nombreArchivo } from '../../lib/almacen.js';
import { codificar, datosParaCompartir, enlaceDelCurso } from '../../lib/compartir.js';
import { archivoResultados, nuevoId } from '../../lib/progreso.js';
import { nombreEstudiante } from '../../lib/analisis.js';

const fecha = (ms) => (ms ? new Date(ms).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');

function NombreCurso({ curso, onGuardar }) {
  const [nombre, setNombre] = useState(curso?.nombre ?? '');
  const limpio = nombre.trim();
  return (
    <form
      className="form-nombre"
      onSubmit={(ev) => {
        ev.preventDefault();
        if (limpio) onGuardar(limpio);
      }}
    >
      <label htmlFor="nombre-curso">Nombre del curso</label>
      <div className="form-nombre-fila">
        <input id="nombre-curso" className="campo" value={nombre} maxLength={40} placeholder="Por ejemplo: 4° A" onChange={(ev) => setNombre(ev.target.value)} />
        <button type="submit" className="boton boton--principal" disabled={!limpio || limpio === curso?.nombre}>
          {curso ? 'Cambiar nombre' : 'Crear curso'}
        </button>
      </div>
    </form>
  );
}

// El curso y su enlace: cómo llegan los ejercicios a los estudiantes y cómo
// vuelven sus resultados, sin servidor.
export default function Curso({ catalogo, curso, cambiarCurso, estudiantes, borrarPerfil }) {
  const [enlace, setEnlace] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const [borrando, setBorrando] = useState(null);
  const perfiles = Object.values(estudiantes.perfiles).filter((p) => p.nombre || p.intentos.length);

  async function crearEnlace() {
    setCopiado(false);
    setEnlace(enlaceDelCurso(await codificar(datosParaCompartir(curso))));
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(enlace);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  }

  const cambios = curso.desactivados.length + curso.propios.length + Object.keys(curso.modificados).length;

  return (
    <div className="curso">
      <section className="docentes-seccion">
        <h2>1. Tu curso</h2>
        <p>El nombre del curso aparece a los estudiantes y en el panel de resultados, para separar cursos si haces clases en más de uno.</p>
        <NombreCurso
          key={curso.curso?.id ?? 'nuevo'}
          curso={curso.curso}
          onGuardar={(nombre) => {
            cambiarCurso((prev) => ({ ...prev, curso: { id: prev.curso?.id ?? nuevoId('c'), nombre } }));
            setEnlace(null);
          }}
        />
      </section>

      <section className="docentes-seccion">
        <h2>2. Enlace para tus estudiantes</h2>
        <p>
          El enlace une a cada estudiante a tu curso y lleva tu selección de ejercicios: {catalogo.activos.length} activos de {catalogo.todos.length}
          {curso.propios.length > 0 && `, con ${curso.propios.length} ${curso.propios.length === 1 ? 'creado' : 'creados'} por ti`}. Compártelo por correo, Classroom o WhatsApp, o ábrelo en cada
          computador de la sala.
        </p>
        {!curso.curso ? (
          <p className="gestion-aviso">Primero ponle nombre a tu curso.</p>
        ) : enlace ? (
          <div className="enlace">
            <input className="campo campo--codigo" readOnly value={enlace} aria-label="Enlace del curso" onFocus={(ev) => ev.target.select()} />
            <div className="acciones-fila">
              <button type="button" className="boton boton--principal" onClick={copiar}>
                {copiado ? 'Copiado' : 'Copiar el enlace'}
              </button>
            </div>
            {enlace.length > 8000 && (
              <p className="gestion-aviso">
                El enlace es largo porque lleva varios ejercicios creados por ti. Si alguna aplicación lo corta, súbelos a la página para todos con «Exportar para el
                repositorio».
              </p>
            )}
          </div>
        ) : (
          <button type="button" className="boton boton--principal" onClick={crearEnlace}>
            Crear el enlace
          </button>
        )}
        <p className="gestion-nota">
          {cambios > 0
            ? 'Si cambias ejercicios después, crea el enlace otra vez y compártelo: el enlace guarda los ejercicios del momento en que se creó.'
            : 'Por ahora el curso usa todos los ejercicios de la página.'}
        </p>
      </section>

      <section className="docentes-seccion">
        <h2>3. Cómo llegan los resultados</h2>
        <ol className="docentes-lista docentes-lista--numerada">
          <li>Cada estudiante practica con su nombre. Sus respuestas quedan guardadas en su navegador.</li>
          <li>
            Cuando se lo pidas, toca su nombre arriba en la página de inicio y luego <strong>«Descargar mis resultados»</strong>. Te envía ese archivo.
          </li>
          <li>
            En <a href="#/docentes/resultados">Resultados</a>, cargas los archivos (puedes elegir varios a la vez). Los que practicaron en este computador aparecen
            solos.
          </li>
        </ol>
        <p className="gestion-nota">
          La página no tiene servidor, así que nada se envía solo. Si el equipo agrega uno más adelante, solo hay que cambiar el archivo <code>src/lib/almacen.js</code>.
        </p>
      </section>

      <section className="docentes-seccion">
        <h2>Perfiles en este computador</h2>
        {perfiles.length ? (
          <>
            <div className="tabla-scroll">
              <table className="tabla-docente">
                <thead>
                  <tr>
                    <th scope="col">Estudiante</th>
                    <th scope="col">Curso</th>
                    <th scope="col">Preguntas</th>
                    <th scope="col">Desde</th>
                    <th scope="col">
                      <span className="visualmente-oculto">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {perfiles.map((p) => (
                    <tr key={p.id}>
                      <th scope="row">{nombreEstudiante(p)}</th>
                      <td>{p.curso?.nombre ?? '—'}</td>
                      <td className="num">{p.intentos.length}</td>
                      <td>{fecha(p.creado)}</td>
                      <td>
                        {borrando === p.id ? (
                          <span className="confirmar">
                            ¿Borrar su progreso?
                            <button
                              type="button"
                              className="boton boton--texto boton--peligro"
                              onClick={() => {
                                borrarPerfil(p.id);
                                setBorrando(null);
                              }}
                            >
                              Sí, borrar
                            </button>
                            <button type="button" className="boton boton--texto" onClick={() => setBorrando(null)}>
                              No
                            </button>
                          </span>
                        ) : (
                          <button type="button" className="boton boton--texto" onClick={() => setBorrando(p.id)}>
                            Borrar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              className="boton boton--suave"
              onClick={() =>
                descargar(`${nombreArchivo('oh-simce', 'resultados-computador', new Date().toISOString().slice(0, 10))}.json`, archivoResultados(perfiles))
              }
            >
              Descargar los resultados de todos
            </button>
          </>
        ) : (
          <p>Todavía nadie ha practicado con su nombre en este computador.</p>
        )}
        <p className="gestion-nota">
          Cualquier persona que use este computador puede abrir el panel docente. Los datos son solo de práctica, pero si el computador es compartido, borra los
          perfiles al terminar el año.
        </p>
      </section>
    </div>
  );
}
