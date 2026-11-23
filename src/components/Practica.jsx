import { useEffect, useMemo, useRef, useState } from 'react';
import { EJES } from '../data/ejercicios.js';
import { textoPlano } from '../lib/formato.js';
import Cuadritos from './Cuadritos.jsx';
import Visual from './Visual.jsx';
import Texto from './ui/Texto.jsx';
import ArrastrarPosicional from './interactivos/ArrastrarPosicional.jsx';
import RestaColumnas from './interactivos/RestaColumnas.jsx';
import CajasLapices from './interactivos/CajasLapices.jsx';
import CortarPizza from './interactivos/CortarPizza.jsx';

const INTERACTIVOS = {
  arrastrarPosicional: ArrastrarPosicional,
  restaColumnas: RestaColumnas,
  cajasLapices: CajasLapices,
  cortarPizza: CortarPizza,
};

const LETRAS = ['A', 'B', 'C', 'D'];
const puedeHablar = typeof window !== 'undefined' && 'speechSynthesis' in window;

function hablar(texto) {
  if (!puedeHablar) return;
  window.speechSynthesis.cancel();
  const voz = new SpeechSynthesisUtterance(texto);
  voz.lang = 'es-CL';
  voz.rate = 0.9;
  window.speechSynthesis.speak(voz);
}

function mezclar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function Pregunta({ ejercicio, esUltima, onSiguiente }) {
  const opciones = useMemo(() => (ejercicio.opciones ? mezclar(ejercicio.opciones) : []), [ejercicio]);
  const [descartadas, setDescartadas] = useState([]);
  const [pistas, setPistas] = useState(0);
  const [resuelto, setResuelto] = useState(false);
  const [mostroSolucion, setMostroSolucion] = useState(false);
  const [errorInteractivo, setErrorInteractivo] = useState(null);
  const [intentosInteractivo, setIntentosInteractivo] = useState(0);
  const panelRef = useRef(null);

  const Interactivo = INTERACTIVOS[ejercicio.tipo];
  const ultimoError = descartadas.at(-1);
  const primerIntento = resuelto && descartadas.length === 0 && intentosInteractivo === 0 && !mostroSolucion;

  useEffect(() => {
    if (ultimoError || errorInteractivo || resuelto) panelRef.current?.focus();
  }, [ultimoError, errorInteractivo, resuelto]);

  useEffect(() => () => puedeHablar && window.speechSynthesis.cancel(), []);

  function elegir(opcion) {
    if (resuelto) return;
    if (opcion.correcta) setResuelto(true);
    else setDescartadas((prev) => [...prev, opcion.texto]);
  }

  function responderInteractivo(resultado) {
    if (resuelto) return;
    if (resultado.correcta) {
      setErrorInteractivo(null);
      setResuelto(true);
    } else {
      const mapa = ejercicio.errores ?? {};
      const mensaje =
        mapa[resultado.clave] ??
        mapa.otro ??
        'Revisa qué número representa las centenas (C), cuál las decenas (D) y cuál las unidades (U).';
      setErrorInteractivo(mensaje);
      setIntentosInteractivo((prev) => prev + 1);
    }
  }

  function verSolucion() {
    setMostroSolucion(true);
    setErrorInteractivo(null);
    setResuelto(true);
  }

  const enunciadoLimpio = textoPlano(ejercicio.enunciado);
  const lectura = opciones.length
    ? `${enunciadoLimpio} ${opciones.map((o, i) => `${LETRAS[i]}: ${o.texto}.`).join(' ')}`
    : enunciadoLimpio;

  return (
    <>
      <div className="pregunta">
        <div className="pregunta__enunciado">
          <h1>
            <Texto texto={ejercicio.enunciado} senalar={pistas >= 1} />
          </h1>
          {puedeHablar && (
            <button type="button" className="boton boton--suave" onClick={() => hablar(lectura)}>
              <svg viewBox="0 0 24 24" aria-hidden="true" className="icono">
                <path d="M4 9v6h4l5 4V5L8 9H4z" />
                <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" fill="none" />
              </svg>
              Escuchar
            </button>
          )}
        </div>

        <Visual visual={ejercicio.visual} />

        {Interactivo ? (
          <Interactivo ejercicio={ejercicio} resuelto={resuelto} onResponder={responderInteractivo} />
        ) : (
          <div className="opciones" role="group" aria-label="Alternativas">
            {opciones.map((opcion, i) => {
              const descartada = descartadas.includes(opcion.texto);
              const esCorrecta = resuelto && opcion.correcta;
              return (
                <button
                  key={opcion.texto}
                  type="button"
                  className={`opcion${descartada ? ' opcion--descartada' : ''}${esCorrecta ? ' opcion--correcta' : ''}`}
                  onClick={() => elegir(opcion)}
                  disabled={descartada || resuelto}
                  aria-label={`${LETRAS[i]}: ${opcion.texto}${descartada ? ', descartada' : ''}${esCorrecta ? ', correcta' : ''}`}
                >
                  <span className="opcion__letra">{LETRAS[i]}</span>
                  <span className="opcion__texto">{opcion.texto}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="apoyo" aria-live="polite">
        {!resuelto && (ultimoError || errorInteractivo) && (
          <div className="panel panel--revisar" ref={panelRef} tabIndex={-1}>
            <h2>Revisemos tu respuesta</h2>
            <p>
              {errorInteractivo ??
                ejercicio.opciones?.find((o) => o.texto === ultimoError)?.feedback}
            </p>
            <p className="panel__nota">
              {errorInteractivo
                ? 'Mueve o cambia las cifras en la tabla y vuelve a comprobar.'
                : 'Intenta otra vez con las alternativas que quedan.'}
            </p>
            {(descartadas.length >= 2 || intentosInteractivo >= 2) && (
              <button type="button" className="boton boton--suave" onClick={verSolucion}>
                Ver cómo se resuelve
              </button>
            )}
          </div>
        )}

        {resuelto && (
          <div className="panel panel--logrado" ref={panelRef} tabIndex={-1}>
            <h2>
              {mostroSolucion
                ? 'Así se resuelve'
                : primerIntento
                  ? '¡Correcto a la primera!'
                  : '¡Lo lograste!'}
            </h2>
            <p className="panel__solucion">
              {typeof ejercicio.solucion === 'object' ? ejercicio.solucion.texto : ejercicio.solucion}
            </p>
            {!primerIntento && !mostroSolucion && (
              <p className="panel__nota">Encontraste tu error y lo corregiste. Así se aprende.</p>
            )}
            {mostroSolucion && (
              <p className="panel__nota">Esta pregunta va a tu lista para repasar. La próxima vez te va a salir.</p>
            )}
            <button
              type="button"
              className="boton boton--principal"
              onClick={() => onSiguiente(primerIntento)}
            >
              {esUltima ? 'Ver mis resultados' : 'Siguiente pregunta'}
            </button>
          </div>
        )}

        {!resuelto && (
          <div className="pistas">
            {ejercicio.pistas.slice(0, pistas).map((pista, i) => (
              <p key={i} className="pista">
                <span className="pista__num">Pista {i + 1}</span> {pista}
              </p>
            ))}
            {pistas < ejercicio.pistas.length && (
              <button type="button" className="boton boton--suave" onClick={() => setPistas(pistas + 1)}>
                {pistas === 0 ? 'Necesito una pista' : 'Dame otra pista'}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default function Practica({ sesion, onTerminar, onSalir }) {
  const [indice, setIndice] = useState(0);
  const [historial, setHistorial] = useState({});
  const ejercicio = sesion.ejercicios[indice];
  const eje = EJES.find((e) => e.id === ejercicio.eje);
  const total = sesion.ejercicios.length;

  function siguiente(primerIntento) {
    const nuevos = { ...historial, [ejercicio.id]: { id: ejercicio.id, primerIntento } };
    setHistorial(nuevos);
    if (indice + 1 >= total) {
      const listaFinal = sesion.ejercicios.map((e) => nuevos[e.id] ?? { id: e.id, primerIntento: false });
      onTerminar(listaFinal);
    } else {
      setIndice((prev) => prev + 1);
      window.scrollTo({ top: 0 });
    }
  }

  function retroceder() {
    if (indice > 0) {
      setIndice((prev) => prev - 1);
      window.scrollTo({ top: 0 });
    }
  }

  function adelantar() {
    if (indice + 1 < total) {
      setIndice((prev) => prev + 1);
      window.scrollTo({ top: 0 });
    }
  }

  useEffect(() => {
    function manejarTeclas(e) {
      if (e.target && ['input', 'textarea', 'select'].includes(e.target.tagName?.toLowerCase())) return;
      if (e.key === 'ArrowLeft') {
        retroceder();
      } else if (e.key === 'ArrowRight') {
        adelantar();
      }
    }
    window.addEventListener('keydown', manejarTeclas);
    return () => window.removeEventListener('keydown', manejarTeclas);
  }, [indice, total]);

  const estados = sesion.ejercicios.map((e, i) => {
    if (i === indice) return 'actual';
    const h = historial[e.id];
    if (h) return h.primerIntento ? 'pintado' : 'repasar';
    return 'vacio';
  });

  return (
    <main className="pagina practica" style={{ '--eje': `var(--eje-${eje.id})` }}>
      <button
        type="button"
        className="flecha-nav flecha-nav--anterior"
        onClick={retroceder}
        disabled={indice === 0}
        aria-label="Ejercicio anterior"
        title="Ejercicio anterior"
      >
        <svg viewBox="0 0 48 80" aria-hidden="true" className="flecha-nav__icono">
          <path
            d="M34 14 L14 40 L34 66"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button
        type="button"
        className="flecha-nav flecha-nav--siguiente"
        onClick={adelantar}
        disabled={indice + 1 >= total}
        aria-label="Siguiente ejercicio"
        title="Siguiente ejercicio"
      >
        <svg viewBox="0 0 48 80" aria-hidden="true" className="flecha-nav__icono">
          <path
            d="M14 14 L34 40 L14 66"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <nav className="barra">
        <button type="button" className="boton boton--texto" onClick={onSalir}>
          Salir
        </button>
        <span className="barra__eje">
          <span className="barra__papel" aria-hidden="true" />
          {eje.nombre}
        </span>
        <span className="barra__progreso">
          <Cuadritos
            estados={estados}
            colores={sesion.ejercicios.map((e) => `var(--eje-${e.eje})`)}
            etiqueta={`Pregunta ${indice + 1} de ${total}`}
          />
          <span className="barra__cuenta" aria-hidden="true">
            {indice + 1} de {total}
          </span>
        </span>
      </nav>

      <Pregunta
        key={`${sesion.clave}-${ejercicio.id}`}
        ejercicio={ejercicio}
        esUltima={indice + 1 === total}
        onSiguiente={siguiente}
      />
    </main>
  );
}
