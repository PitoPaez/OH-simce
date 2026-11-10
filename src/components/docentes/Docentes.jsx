import '../../docentes.css';
import Resultados from './Resultados.jsx';
import Ejercicios from './Ejercicios.jsx';
import Editor from './Editor.jsx';
import Curso from './Curso.jsx';
import Informacion from './Informacion.jsx';

const SECCIONES = [
  { id: 'resultados', nombre: 'Resultados' },
  { id: 'ejercicios', nombre: 'Ejercicios' },
  { id: 'curso', nombre: 'Curso y enlace' },
  { id: 'informacion', nombre: 'Cómo está pensada' },
];

// Área para docentes: resultados del curso, gestión de ejercicios, enlace
// para los estudiantes y la explicación pedagógica.
export default function Docentes({ partes, ir, catalogo, curso, cambiarCurso, estudiantes, borrarPerfil }) {
  const [seccion = 'resultados', ...resto] = partes;
  const editando = seccion === 'ejercicios' && (resto[0] === 'nuevo' || resto[0] === 'editar' || resto[0] === 'duplicar');

  return (
    <main className={editando ? 'pagina docentes docentes--ancha' : 'pagina docentes'}>
      <nav className="barra">
        <button type="button" className="boton boton--texto" onClick={() => ir('/')}>
          Ir a la práctica
        </button>
        {curso.curso && <span className="docentes-curso-actual">Curso: {curso.curso.nombre}</span>}
      </nav>
      <header className="docentes-encabezado">
        <h1>Panel docente</h1>
        <nav className="docentes-pestanas" aria-label="Secciones del panel docente">
          {SECCIONES.map((s) => (
            <a key={s.id} href={`#/docentes/${s.id}`} className="docentes-pestana" aria-current={seccion === s.id ? 'page' : undefined}>
              {s.nombre}
            </a>
          ))}
        </nav>
      </header>

      {seccion === 'resultados' && <Resultados resto={resto} ir={ir} catalogo={catalogo} estudiantes={estudiantes} />}
      {seccion === 'ejercicios' && !editando && <Ejercicios ir={ir} catalogo={catalogo} curso={curso} cambiarCurso={cambiarCurso} />}
      {editando && <Editor key={resto.join('/')} modo={resto[0]} id={resto[1]} ir={ir} catalogo={catalogo} cambiarCurso={cambiarCurso} />}
      {seccion === 'curso' && <Curso ir={ir} catalogo={catalogo} curso={curso} cambiarCurso={cambiarCurso} estudiantes={estudiantes} borrarPerfil={borrarPerfil} />}
      {seccion === 'informacion' && <Informacion ir={ir} catalogo={catalogo} />}
    </main>
  );
}
