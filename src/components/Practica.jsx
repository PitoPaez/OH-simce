import { useEffect, useMemo, useRef, useState } from 'react';
import { EJES } from '../data/ejercicios.js';
import Cuadritos from './Cuadritos.jsx';
import Visual from './Visual.jsx';

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
  const opciones = useMemo(() => mezclar(ejercicio.opciones), [ejercicio]);
  const [descartadas, setDescartadas] = useState([]);
  const [pistas, setPistas] = useState(0);
  const [resuelto, setResuelto] = useState(false);
  const [mostroSolucion, setMostroSolucion] = useState(false);
  const panelRef = useRef(null);

  const ultimoError = descartadas.at(-1);
  const primerIntento = resuelto && descartadas.length === 0 && !mostroSolucion;

  useEffect(() => {
    if (ultimoError || resuelto) panelRef.current?.focus();
  }, [ultimoError, resuelto]);

  useEffect(() => () => puedeHablar && window.speechSynthesis.cancel(), []);

  function elegir(opcion) {
    if (resuelto) return;
    if (opcion.correcta) setResuelto(true);
    else setDescartadas((prev) => [...prev, opcion.texto]);
  }

  function verSolucion() {
    setMostroSolucion(true);
    setResuelto(true);
  }

  const lectura = `${ejercicio.enunciado} ${opciones
    .map((o, i) => `${LETRAS[i]}: ${o.texto}.`)
    .join(' ')}`;

  return (
    <>
      <div className="pregunta">
        <div className="pregunta__enunciado">
          <h1>{ejercicio.enunciado}</h1>
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
      </div>

      <div className="apoyo" aria-live="polite">
        {!resuelto && ultimoError && (
          <div className="panel panel--revisar" ref={panelRef} tabIndex={-1}>
            <h2>Revisemos tu respuesta</h2>
            <p>{ejercicio.opciones.find((o) => o.texto === ultimoError).feedback}</p>
            <p className="panel__nota">Intenta otra vez con las alternativas que quedan.</p>
            {descartadas.length >= 2 && (
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
            <p className="panel__solucion">{ejercicio.solucion}</p>
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
  const [resultados, setResultados] = useState([]);
  const ejercicio = sesion.ejercicios[indice];
  const eje = EJES.find((e) => e.id === ejercicio.eje);
  const total = sesion.ejercicios.length;

  function siguiente(primerIntento) {
    const nuevos = [...resultados, { id: ejercicio.id, primerIntento }];
    if (indice + 1 >= total) {
      onTerminar(nuevos);
    } else {
      setResultados(nuevos);
      setIndice(indice + 1);
      window.scrollTo({ top: 0 });
    }
  }

  const estados = sesion.ejercicios.map((_, i) => {
    if (i < resultados.length) return resultados[i].primerIntento ? 'pintado' : 'repasar';
    if (i === indice) return 'actual';
    return 'vacio';
  });

  return (
    <main className="pagina practica" style={{ '--eje': `var(--eje-${eje.id})` }}>
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
