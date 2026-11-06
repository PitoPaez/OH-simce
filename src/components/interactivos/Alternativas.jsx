import Visual from '../visuales/Visual.jsx';
import Avatar from '../ui/Avatar.jsx';
import { ConFracciones } from '../ui/Texto.jsx';

export const LETRAS = ['A', 'B', 'C', 'D', 'E'];

// Alternativas como en el SIMCE: A, B, C y D. Al tocar una, se responde.
//   descartadas: textos de las alternativas ya elegidas y erradas
//   elegida: en el ensayo, la alternativa marcada (sin decir si es correcta)
export default function Alternativas({ opciones, descartadas = [], resuelto, elegida, modo = 'practica', onElegir, columnas }) {
  const conDibujo = opciones.some((o) => o.visual);
  const largas = opciones.some((o) => String(o.texto).length > 28);
  const clase = ['opciones', conDibujo && 'opciones--dibujos', (largas || columnas === 1) && 'opciones--una-columna'].filter(Boolean).join(' ');
  return (
    <div className={clase} role="group" aria-label="Alternativas">
      {opciones.map((opcion, i) => {
        const descartada = descartadas.includes(opcion.texto);
        const esCorrecta = modo === 'practica' && resuelto && opcion.correcta;
        const marcada = modo === 'ensayo' && elegida === opcion.texto;
        const estado = [descartada && 'descartada', esCorrecta && 'correcta', marcada && 'marcada'].filter(Boolean);
        return (
          <button
            key={opcion.texto}
            type="button"
            className={['opcion', ...estado.map((e) => `opcion--${e}`)].join(' ')}
            onClick={() => onElegir(opcion)}
            disabled={descartada || (modo === 'practica' && resuelto)}
            aria-pressed={modo === 'ensayo' ? marcada : undefined}
          >
            <span className="opcion-letra" aria-hidden="true">
              {LETRAS[i]}
            </span>
            <span className="visualmente-oculto">Alternativa {LETRAS[i]}: </span>
            <span className="opcion-contenido">
              {opcion.visual && <Visual visual={opcion.visual} enMarco={false} />}
              <span className="opcion-texto">
                <ConFracciones texto={String(opcion.texto)} />
              </span>
            </span>
            {descartada && <span className="visualmente-oculto"> (descartada)</span>}
            {esCorrecta && <span className="visualmente-oculto"> (correcta)</span>}
          </button>
        );
      })}
    </div>
  );
}

// "¿Quién tiene razón?": compañeros que muestran su forma de pensar.
// Discutir respuestas distintas desarrolla la habilidad de argumentar y
// comunicar (Bases Curriculares), la menos trabajada en las pruebas.
export function Quien({ opciones, descartadas = [], resuelto, onElegir }) {
  return (
    <div className="quien" role="group" aria-label="¿Quién tiene razón?">
      {opciones.map((p) => {
        const descartada = descartadas.includes(p.texto);
        const esCorrecta = resuelto && p.correcta;
        return (
          <button
            key={p.texto}
            type="button"
            className={['quien-persona', descartada && 'quien-persona--descartada', esCorrecta && 'quien-persona--correcta'].filter(Boolean).join(' ')}
            onClick={() => onElegir(p)}
            disabled={descartada || resuelto}
          >
            <Avatar nombre={p.texto} />
            <span className="quien-globo">
              <span className="quien-nombre">{p.texto}</span>
              <span className="quien-dice">
                <ConFracciones texto={p.dice} />
              </span>
            </span>
            <span className="quien-accion">{esCorrecta ? 'Tiene razón' : descartada ? 'No tiene razón' : `${p.texto} tiene razón`}</span>
          </button>
        );
      })}
    </div>
  );
}
