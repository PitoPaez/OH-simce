import { useEffect, useMemo, useRef, useState } from 'react';
import { callar } from '../../lib/voz.js';
import { mensajeError } from '../../lib/retro.js';
import Visual from '../visuales/Visual.jsx';
import Texto from '../ui/Texto.jsx';
import Leer from '../ui/Leer.jsx';
import Alternativas, { LETRAS, Quien } from '../interactivos/Alternativas.jsx';
import Numero from '../interactivos/Numero.jsx';
import Bloques from '../interactivos/Bloques.jsx';
import Pintar from '../interactivos/Pintar.jsx';
import RectaInteractiva from '../interactivos/RectaInteractiva.jsx';
import BalanzaInteractiva from '../interactivos/BalanzaInteractiva.jsx';
import RelojInteractivo from '../interactivos/RelojInteractivo.jsx';
import Cuadricula from '../interactivos/Cuadricula.jsx';
import PintarCuadricula from '../interactivos/PintarCuadricula.jsx';
import { BarraGrafico, Ordenar } from '../interactivos/Otros.jsx';
import ArrastrarPosicional from '../interactivos/ArrastrarPosicional.jsx';

const INTERACTIVOS = {
  numero: Numero,
  bloques: Bloques,
  pintar: Pintar,
  recta: RectaInteractiva,
  balanza: BalanzaInteractiva,
  reloj: RelojInteractivo,
  cuadricula: Cuadricula,
  pintarCuadricula: PintarCuadricula,
  barra: BarraGrafico,
  ordenar: Ordenar,
  arrastrarPosicional: ArrastrarPosicional,
};

function mezclar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export function prepararOpciones(ejercicio) {
  const lista = ejercicio.tipo === 'quien' ? ejercicio.personas.map((p) => ({ ...p, texto: p.nombre })) : ejercicio.opciones ?? [];
  return ejercicio.ordenFijo ? lista : mezclar(lista);
}

export const PASOS = [
  { id: 'entender', nombre: 'Entender' },
  { id: 'planificar', nombre: 'Planificar' },
  { id: 'hacer', nombre: 'Hacer' },
  { id: 'comprobar', nombre: 'Comprobar' },
];

const ENTENDER_GENERICO =
  'Lee otra vez con calma. Lo que te preguntan quedó marcado en amarillo y los datos que necesitas, subrayados.';

// Ayuda en los 4 pasos de resolución de problemas del programa de estudio
// (OA b: entender, planificar, hacer y comprobar). Se entrega de a una,
// de la más general a la más concreta.
function Ayuda({ pistas, nivel, onPedir, tieneMarcas, onVerEjemplo, onPendiente }) {
  const textos = {
    entender: pistas?.entender ?? (tieneMarcas ? ENTENDER_GENERICO : null),
    planificar: pistas?.planificar,
    hacer: pistas?.hacer,
  };
  const disponibles = PASOS.slice(0, 3).filter((p) => textos[p.id]);
  const siguiente = disponibles[nivel];
  return (
    <section className="ayuda" aria-label="Ayuda">
      {disponibles.slice(0, nivel).map((p) => (
        <div key={p.id} className="ayuda-paso">
          <span className="ayuda-paso-num" aria-hidden="true">
            {PASOS.findIndex((x) => x.id === p.id) + 1}
          </span>
          <div>
            <p className="ayuda-paso-nombre">{p.nombre}</p>
            <p>
              <Texto texto={textos[p.id]} />
            </p>
          </div>
          <Leer texto={textos[p.id]} compacto etiqueta={`Escuchar la ayuda: ${p.nombre}`} />
        </div>
      ))}
      <div className="ayuda-acciones">
        {siguiente && (
          <button type="button" className="boton boton--suave" onClick={onPedir}>
            {nivel === 0 ? 'Necesito ayuda' : 'Otra ayuda'}: {PASOS.findIndex((x) => x.id === siguiente.id) + 1}. {siguiente.nombre}
          </button>
        )}
        {onVerEjemplo && (
          <button type="button" className="boton boton--texto" onClick={onVerEjemplo}>
            Ver el ejemplo resuelto
          </button>
        )}
        {onPendiente && <BotonPendiente onClick={onPendiente} />}
      </div>
    </section>
  );
}

// Dejar la pregunta para después, para no quedarse pegado: como en la prueba,
// conviene seguir con las demás y volver al final.
export function BotonPendiente({ onClick, marcada = false, texto }) {
  return (
    <button type="button" className={marcada ? 'boton boton--pendiente boton--pendiente-activo' : 'boton boton--pendiente'} onClick={onClick} aria-pressed={texto ? marcada : undefined}>
      <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
        <path d="M5 2.5h10v15l-5-3.6-5 3.6z" fill={marcada ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      {texto ?? 'Dejar para después'}
    </button>
  );
}

// Pregunta de autoexplicación después de acertar: "¿por qué está bien?".
function Explicar({ explicar }) {
  const [elegida, setElegida] = useState(null);
  const opcion = explicar.opciones.find((o) => o.texto === elegida);
  return (
    <div className="explicar">
      <p className="explicar-pregunta">{explicar.pregunta}</p>
      <div className="explicar-opciones">
        {explicar.opciones.map((o) => (
          <button
            key={o.texto}
            type="button"
            className={['explicar-opcion', elegida === o.texto && (o.correcta ? 'explicar-opcion--bien' : 'explicar-opcion--mal')].filter(Boolean).join(' ')}
            onClick={() => setElegida(o.texto)}
            aria-pressed={elegida === o.texto}
          >
            {o.texto}
          </button>
        ))}
      </div>
      {opcion && (
        <p className="explicar-retro" aria-live="polite">
          {opcion.correcta ? '¡Exacto! ' : 'No es esa razón. '}
          {opcion.porque}
        </p>
      )}
    </div>
  );
}

// onTerminar(estado, detalle) y onPendiente(detalle) entregan lo que hizo el
// estudiante: detalle = { x: [[clave, valor], ...] respuestas equivocadas, a: ayudas pedidas }.
export default function Pregunta({ ejercicio, esUltima, onTerminar, onVerEjemplo, onPendiente }) {
  const opciones = useMemo(() => prepararOpciones(ejercicio), [ejercicio]);
  const [errores, setErrores] = useState([]);
  const [nivelAyuda, setNivelAyuda] = useState(0);
  const [resuelto, setResuelto] = useState(false);
  const [vioSolucion, setVioSolucion] = useState(false);
  const [extra, setExtra] = useState(null);
  const panelRef = useRef(null);

  const ultimoError = errores.at(-1);
  const soloPrimera = resuelto && !vioSolucion && errores.length === 0 && nivelAyuda === 0;
  const tieneMarcas = /\[\[|\{\{/.test(ejercicio.enunciado);
  const esAlternativas = ejercicio.tipo === 'alternativas' || ejercicio.tipo === 'quien';
  const Interactivo = INTERACTIVOS[ejercicio.tipo];

  useEffect(() => {
    if (ultimoError || resuelto) panelRef.current?.focus({ preventScroll: true });
    if (ultimoError || resuelto) panelRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [ultimoError, resuelto]);

  useEffect(() => () => callar(), []);

  function responder(resultado) {
    if (resuelto) return;
    if (resultado.correcta) {
      setExtra(resultado.extra ?? null);
      setResuelto(true);
    } else {
      setErrores((prev) => [...prev, { ...resultado, texto: mensajeError(ejercicio, resultado) }]);
    }
  }

  function elegirOpcion(opcion) {
    responder({ correcta: Boolean(opcion.correcta), clave: opcion.texto, error: opcion.error });
  }

  function verSolucion() {
    setVioSolucion(true);
    setResuelto(true);
  }

  const lectura = esAlternativas
    ? `${ejercicio.enunciado} ${opciones.map((o, i) => `${LETRAS[i]}: ${o.dice ? `${o.texto} dice: ${o.dice}` : o.texto}.`).join(' ')}`
    : ejercicio.enunciado;

  const estadoFinal = vioSolucion ? 'solucion' : soloPrimera ? 'solo' : 'ayuda';
  const detalle = () => ({ x: errores.map((e) => [String(e.clave), String(e.valor ?? e.clave)]), a: nivelAyuda });

  return (
    <>
      <div className="pregunta">
        <div className="pregunta-enunciado">
          <h1>
            <Texto texto={ejercicio.enunciado} senalar={nivelAyuda >= 1} />
          </h1>
          <Leer texto={lectura} />
        </div>

        {ejercicio.visual && <Visual visual={ejercicio.visual} />}

        {ejercicio.tipo === 'alternativas' && (
          <Alternativas opciones={opciones} descartadas={errores.map((e) => e.clave)} resuelto={resuelto} onElegir={elegirOpcion} columnas={ejercicio.columnas} />
        )}
        {ejercicio.tipo === 'quien' && <Quien opciones={opciones} descartadas={errores.map((e) => e.clave)} resuelto={resuelto} onElegir={elegirOpcion} />}
        {Interactivo && <Interactivo ejercicio={ejercicio} resuelto={resuelto} onResponder={responder} />}
      </div>

      <div className="apoyo" aria-live="polite">
        {!resuelto && ultimoError && (
          <div className="panel panel--revisar" ref={panelRef} tabIndex={-1}>
            <h2>Revisemos</h2>
            <p>
              <Texto texto={ultimoError.texto} />
            </p>
            <p className="panel-nota">{esAlternativas ? 'Prueba con otra alternativa.' : 'Cambia tu respuesta y vuelve a comprobar.'}</p>
            <div className="panel-acciones">
              <Leer texto={ultimoError.texto} compacto etiqueta="Escuchar el mensaje" />
              {errores.length >= 2 && (
                <button type="button" className="boton boton--suave" onClick={verSolucion}>
                  Ver cómo se resuelve
                </button>
              )}
            </div>
          </div>
        )}

        {resuelto && (
          <div className="panel panel--logrado" ref={panelRef} tabIndex={-1}>
            <h2>{vioSolucion ? 'Así se resuelve' : soloPrimera ? '¡Correcto a la primera!' : '¡Lo lograste!'}</h2>
            {vioSolucion && ejercicio.pistas?.hacer && (
              <p>
                <Texto texto={ejercicio.pistas.hacer} />
              </p>
            )}
            {vioSolucion && ejercicio.solucion?.visual && <Visual visual={ejercicio.solucion.visual} />}
            <p className="panel-solucion">
              <Texto texto={ejercicio.solucion?.texto ?? ''} />
            </p>
            {extra && ejercicio.solucion?.extra && <p>{ejercicio.solucion.extra.replace('{ancho}', extra.ancho).replace('{alto}', extra.alto)}</p>}
            {ejercicio.comprobar && (
              <div className="paso-comprobar">
                <span className="ayuda-paso-num" aria-hidden="true">
                  4
                </span>
                <p>
                  <strong>Comprobar.</strong> <Texto texto={ejercicio.comprobar} />
                </p>
              </div>
            )}
            {!soloPrimera && !vioSolucion && <p className="panel-nota">Encontraste el camino y lo corregiste. Así se aprende.</p>}
            {vioSolucion && <p className="panel-nota">Esta pregunta queda en tu lista para repasar. La próxima vez te va a salir.</p>}
            {ejercicio.explicar && !vioSolucion && <Explicar explicar={ejercicio.explicar} />}
            <div className="panel-acciones">
              <button type="button" className="boton boton--principal" onClick={() => onTerminar(estadoFinal, detalle())}>
                {esUltima ? 'Ver cómo me fue' : 'Siguiente pregunta'}
              </button>
            </div>
          </div>
        )}

        {!resuelto && (
          <Ayuda
            pistas={ejercicio.pistas}
            nivel={nivelAyuda}
            onPedir={() => setNivelAyuda((n) => n + 1)}
            tieneMarcas={tieneMarcas}
            onVerEjemplo={onVerEjemplo}
            onPendiente={onPendiente ? () => onPendiente(detalle()) : undefined}
          />
        )}
      </div>
    </>
  );
}
