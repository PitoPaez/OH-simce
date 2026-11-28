import { useEffect, useMemo, useRef, useState } from 'react';
import { EJES } from '../data/ejercicios.js';
import { textoPlano } from '../lib/formato.js';
import Cuadritos from './Cuadritos.jsx';
import Visual from './Visual.jsx';
import Texto from './ui/Texto.jsx';
import Sello from './Sello.jsx';
import ArrastrarPosicional from './interactivos/ArrastrarPosicional.jsx';
import RestaColumnas from './interactivos/RestaColumnas.jsx';
import CajasLapices from './interactivos/CajasLapices.jsx';
import CortarPizza from './interactivos/CortarPizza.jsx';
import SumaBolitas from './interactivos/SumaBolitas.jsx';
import Ordenar from './interactivos/Ordenar.jsx';
import Numerica from './interactivos/Numerica.jsx';
import { mezclarBolsas } from '../lib/mezclarBolsas.js';

// Ejercicios que se responden con su propio componente (según ejercicio.tipo).
const INTERACTIVOS = {
  arrastrarPosicional: ArrastrarPosicional,
  restaColumnas: RestaColumnas,
  cajasLapices: CajasLapices,
  cortarPizza: CortarPizza,
  sumaBolitas: SumaBolitas,
};

// Herramientas que reemplazan a las alternativas (medir, reloj con manecillas, calendario).
const usaHerramienta = (visual) =>
  Boolean(
    visual &&
    ['medir', 'reloj', 'calendario'].includes(visual.tipo) &&
    (visual.tipo !== 'reloj' || visual.inicio !== undefined),
  );

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

// Tipo de respuesta de cada ejercicio:
// - "interactivo": componente propio según ejercicio.tipo (tabla posicional, resta en columnas...).
// - "herramienta": se responde con la herramienta del dibujo (medir, reloj, calendario).
// - "ordenar" (tarjetas en casillas) o "numerica" (escribir un número, por pasos).
// - "alternativas" (por defecto).
function tipoDe(ejercicio) {
  if (INTERACTIVOS[ejercicio.tipo]) return 'interactivo';
  if (usaHerramienta(ejercicio.visual)) return 'herramienta';
  return ejercicio.interaccion ?? 'alternativas';
}

function Pregunta({ ejercicio: original, esUltima, onSiguiente }) {
  // Se prepara una sola vez cada vez que se abre la pregunta (por ejemplo, las
  // bolsas se reparten al azar y no cambian mientras se responde).
  const [ejercicio] = useState(() => mezclarBolsas(original));
  const tipo = tipoDe(ejercicio);
  const Interactivo = INTERACTIVOS[ejercicio.tipo];
  const opciones = useMemo(() => mezclar(ejercicio.opciones ?? []), [ejercicio]);
  // Cada error guarda qué respondió (clave), su explicación y en qué paso ocurrió.
  const [errores, setErrores] = useState([]);
  const [pistas, setPistas] = useState(0);
  const [paso, setPaso] = useState(0);
  const [resuelto, setResuelto] = useState(false);
  const [mostroSolucion, setMostroSolucion] = useState(false);
  const [eleccion, setEleccion] = useState(null); // última alternativa elegida: { texto, n }
  const panelRef = useRef(null);

  const descartadas = errores.map((e) => e.clave);
  const ultimoError = errores.at(-1);
  const errorVisible = ultimoError && ultimoError.paso === paso ? ultimoError : null;
  const primerIntento = resuelto && errores.length === 0 && !mostroSolucion;

  useEffect(() => {
    if (errores.length > 0 || resuelto) panelRef.current?.focus();
  }, [errores.length, resuelto]);

  useEffect(() => () => puedeHablar && window.speechSynthesis.cancel(), []);

  function anotarError(clave, feedback) {
    setErrores((prev) => [...prev, { clave, feedback, paso }]);
  }

  function elegir(opcion) {
    if (resuelto) return;
    setEleccion((e) => ({ texto: opcion.texto, n: (e?.n ?? 0) + 1 }));
    if (opcion.correcta) setResuelto(true);
    else anotarError(opcion.texto, opcion.feedback);
  }

  // Si el ejercicio tiene "responderEnDibujo", se responde tocando el dibujo (por
  // ejemplo, las bolsas) y no se muestran las alternativas A, B, C, D.
  // Si esa opción ya se descartó o la pregunta está resuelta, solo se vuelve a mostrar.
  function elegirDesdeDibujo(texto) {
    const opcion = ejercicio.opciones?.find((o) => o.texto === texto);
    if (opcion && !resuelto && !descartadas.includes(texto)) elegir(opcion);
    else setEleccion((e) => ({ texto, n: (e?.n ?? 0) + 1 }));
  }

  function comprobarOrden(correcto, clave, feedback) {
    if (correcto) setResuelto(true);
    else anotarError(clave, feedback);
  }

  function responderNumero(correcto, clave, feedback) {
    if (!correcto) {
      anotarError(clave, feedback);
    } else if (paso + 1 < ejercicio.pasos.length) {
      setPaso(paso + 1);
    } else {
      setResuelto(true);
    }
  }

  // Respuesta dada con una herramienta (medir, reloj, calendario).
  function responderHerramienta(respuesta) {
    if (resuelto) return;
    const opcion = ejercicio.opciones?.find((o) => o.texto === String(respuesta));
    if (opcion?.correcta) setResuelto(true);
    else
      anotarError(
        String(respuesta),
        opcion?.feedback ?? ejercicio.visual?.mensajeOtro ?? 'Todavía no está bien. Revisa con calma.',
      );
  }

  // Respuesta de un ejercicio interactivo: { correcta, clave }.
  function responderInteractivo(resultado) {
    if (resuelto) return;
    if (resultado.correcta) {
      setResuelto(true);
    } else {
      const mapa = ejercicio.errores ?? {};
      anotarError(
        resultado.clave,
        mapa[resultado.clave] ??
          mapa.otro ??
          'Revisa qué número representa las centenas (C), cuál las decenas (D) y cuál las unidades (U).',
      );
    }
  }

  function verSolucion() {
    setMostroSolucion(true);
    setResuelto(true);
  }

  const enDibujo = tipo === 'alternativas' && Boolean(ejercicio.responderEnDibujo);

  // Sello CORRECTO / INCORRECTO en las preguntas de datos y probabilidades.
  // Con alternativas va en la esquina del dibujo (o de las alternativas, si no hay
  // dibujo). Al ordenar o escribir un número va en la esquina de esa respuesta,
  // que es lo que se está mirando al comprobar.
  // Las bolsas ponen su propio sello después de sacar la canica.
  const conSello = ejercicio.eje === 'datos' && !enDibujo;
  const sello = !conSello ? null : resuelto ? (mostroSolucion ? null : 'correcto') : errorVisible ? 'incorrecto' : null;
  // cambia en cada respuesta, para que el sello vuelva a timbrar
  const marcaSello = `${sello}-${errores.length}-${paso}`;
  const tieneDibujo = Boolean(ejercicio.visual?.tipo);
  const selloEnDibujo = tieneDibujo && tipo === 'alternativas';
  const selloAqui = (lugar) =>
    sello && (lugar === 'dibujo') === selloEnDibujo ? <Sello key={marcaSello} tipo={sello} animado /> : null;

  let lectura = textoPlano(ejercicio.enunciado);
  if (tipo === 'alternativas' && !enDibujo) {
    lectura += ` ${opciones.map((o, i) => `${LETRAS[i]}: ${o.texto}.`).join(' ')}`;
  } else if (tipo === 'numerica' && !resuelto) {
    lectura += ` ${ejercicio.pasos[paso].pregunta}`;
  }

  // La barra oculta del gráfico aparece cuando se completa el primer paso.
  const estadoVisual = {
    paso,
    resuelto,
    revelar: resuelto || paso > 0,
    intentos: errores.length,
    eleccion,
    elegir: enDibujo ? elegirDesdeDibujo : undefined,
    descartadas,
    correcta: ejercicio.opciones?.find((o) => o.correcta)?.texto,
  };

  const notaError = {
    alternativas: enDibujo
      ? 'Intenta otra vez con otra de las que quedan.'
      : 'Intenta otra vez con las alternativas que quedan.',
    herramienta: 'Ajusta tu respuesta con la herramienta y vuelve a comprobar.',
    interactivo: 'Mueve o cambia las cifras y vuelve a comprobar.',
  };

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

        {tieneDibujo && (
          <div className="con-sello">
            <Visual
              visual={ejercicio.visual}
              ejercicio={ejercicio}
              bloqueado={resuelto}
              onResponder={responderHerramienta}
              estado={estadoVisual}
            />
            {selloAqui('dibujo')}
          </div>
        )}

        <div className={selloEnDibujo ? undefined : 'con-sello'}>
          {tipo === 'alternativas' && !enDibujo && (
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

          {tipo === 'interactivo' && (
            <Interactivo ejercicio={ejercicio} resuelto={resuelto} onResponder={responderInteractivo} />
          )}

          {tipo === 'ordenar' && <Ordenar datos={ejercicio.ordenar} resuelto={resuelto} onComprobar={comprobarOrden} />}

          {tipo === 'numerica' && (
            <Numerica pasos={ejercicio.pasos} paso={paso} resuelto={resuelto} onResponder={responderNumero} />
          )}
          {selloAqui('respuesta')}
        </div>
      </div>

      <div className="apoyo" aria-live="polite">
        {!resuelto && errorVisible && (
          <div className="panel panel--revisar" ref={panelRef} tabIndex={-1}>
            <h2>Revisemos tu respuesta</h2>
            <p>{errorVisible.feedback}</p>
            <p className="panel__nota">{notaError[tipo] ?? 'Corrige tu respuesta y vuelve a comprobar.'}</p>
            {errores.length >= 2 && (
              <button type="button" className="boton boton--suave" onClick={verSolucion}>
                Ver cómo se resuelve
              </button>
            )}
          </div>
        )}

        {resuelto && (
          <div className="panel panel--logrado" ref={panelRef} tabIndex={-1}>
            <h2>{mostroSolucion ? 'Así se resuelve' : primerIntento ? '¡Correcto a la primera!' : '¡Lo lograste!'}</h2>
            <p className="panel__solucion">
              {typeof ejercicio.solucion === 'object' ? ejercicio.solucion.texto : ejercicio.solucion}
            </p>
            {!primerIntento && !mostroSolucion && (
              <p className="panel__nota">Encontraste tu error y lo corregiste. Así se aprende.</p>
            )}
            {mostroSolucion && (
              <p className="panel__nota">Esta pregunta va a tu lista para repasar. La próxima vez te va a salir.</p>
            )}
            <button type="button" className="boton boton--principal" onClick={() => onSiguiente(primerIntento)}>
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
    const nuevos = {
      ...historial,
      [ejercicio.id]: { id: ejercicio.id, primerIntento },
    };
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
