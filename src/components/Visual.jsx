import Calendario from './herramientas/Calendario.jsx';
import Medir from './herramientas/Medir.jsx';
import Reloj from './herramientas/Reloj.jsx';

// Lo que se muestra en cada ejercicio, según visual.tipo:
//
//   imagen      un PNG de public/imagenes/. Por defecto <id del ejercicio>.png;
//               visual.src sirve para usar otro (por ejemplo, el de otro ejercicio).
//   medir       regla o huincha en centímetros (ver herramientas/Medir.jsx)
//   reloj       reloj de manecillas para poner una hora
//   calendario  calendario de un mes para tocar un día
//
// Las herramientas (todo menos imagen) son interactivas: en vez de mostrar
// alternativas, el estudiante responde con la herramienta y su respuesta se
// compara con el texto de las opciones del ejercicio.
//
// Para agregar un tipo nuevo: crea el componente en herramientas/ y agrégalo aquí.
const HERRAMIENTAS = { medir: Medir, reloj: Reloj, calendario: Calendario };

export default function Visual({ ejercicio, bloqueado, onResponder }) {
  const { visual, id } = ejercicio;
  if (!visual) return null;

  if (visual.tipo === 'imagen') {
    return (
      <figure className="visual">
        <img src={`${import.meta.env.BASE_URL}imagenes/${visual.src ?? `${id}.png`}`} alt={visual.descripcion} />
      </figure>
    );
  }

  const Herramienta = HERRAMIENTAS[visual.tipo];
  return (
    <div className="visual herramienta" role="group" aria-label={visual.descripcion}>
      <Herramienta visual={visual} bloqueado={bloqueado} onResponder={onResponder} />
    </div>
  );
}
