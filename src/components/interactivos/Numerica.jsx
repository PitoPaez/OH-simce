import { useEffect, useRef, useState } from 'react';
import Lienzo from './Lienzo.jsx';
import { reconocerNumero } from '../../lib/reconocerNumero.js';

// Respuesta numérica, dividida en pasos.
// El estudiante hace sus cálculos en una hoja de borrador y escribe la respuesta
// a mano (dedo, lápiz o mouse); el número se reconoce con lib/reconocerNumero.js.
// También puede cambiar al teclado.
// pasos: [{ pregunta, respuesta, unidad, feedback, errores: { "<número>": "explicación" } }]
// onResponder(correcto, clave, feedback)
const CONFIANZA_MINIMA = 0.55;

export default function Numerica({ pasos, paso, resuelto, onResponder }) {
  const [modo, setModo] = useState('mano');
  const [valor, setValor] = useState('');
  const [leido, setLeido] = useState(null);
  const campoRef = useRef(null);
  const borradorRef = useRef(null);
  const respuestaRef = useRef(null);
  const actual = pasos[paso];

  useEffect(() => {
    setValor('');
    setLeido(null);
    respuestaRef.current?.borrar();
    if (!resuelto && paso > 0 && modo === 'teclado') campoRef.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paso, resuelto]);

  function leer(trazos) {
    const r = reconocerNumero(trazos);
    setLeido(r);
    setValor(r ? r.texto : '');
  }

  function borrarRespuesta() {
    respuestaRef.current?.borrar();
    setLeido(null);
    setValor('');
  }

  function enviar(e) {
    e.preventDefault();
    const limpio = valor.trim().replace(/\./g, '');
    if (!/^\d+$/.test(limpio)) return;
    const numero = Number(limpio);
    if (numero === actual.respuesta) {
      onResponder(true, `${paso}:${numero}`);
    } else {
      onResponder(false, `${paso}:${numero}`, actual.errores?.[String(numero)] ?? actual.feedback);
    }
  }

  const hechos = resuelto ? pasos : pasos.slice(0, paso);
  const dudoso = modo === 'mano' && leido && leido.confianza < CONFIANZA_MINIMA;

  return (
    <div className="numerica">
      {hechos.map((p, i) => (
        <p key={i} className="numerica__hecho">
          <span className="numerica__check" aria-hidden="true">✓</span>
          {p.pregunta} <strong>{p.respuesta} {p.unidad}</strong>
        </p>
      ))}

      {!resuelto && actual && (
        <form className="numerica__form" onSubmit={enviar}>
          <p className="numerica__pregunta" id={`numerica-p-${paso}`}>
            {pasos.length > 1 && <span className="numerica__paso">Paso {paso + 1} de {pasos.length}</span>}
            {actual.pregunta}
          </p>

          {/* hoja de borrador: se mantiene entre pasos */}
          <div className="numerica__hoja">
            <div className="numerica__cabecera">
              <span>Haz tus cálculos aquí</span>
              <button type="button" className="boton boton--texto" onClick={() => borradorRef.current?.borrar()}>
                Borrar
              </button>
            </div>
            <Lienzo ref={borradorRef} className="lienzo--borrador" grosor={3} etiqueta="Hoja para hacer cálculos" />
          </div>

          <div className="numerica__respuesta">
            <div className="numerica__cabecera">
              <span>Respuesta</span>
              <button
                type="button"
                className="boton boton--texto"
                onClick={() => {
                  setModo(modo === 'mano' ? 'teclado' : 'mano');
                  borrarRespuesta();
                }}
              >
                {modo === 'mano' ? 'Usar teclado' : 'Escribir a mano'}
              </button>
            </div>

            {modo === 'mano' ? (
              <>
                <div className="numerica__fila">
                  <Lienzo
                    ref={respuestaRef}
                    className="lienzo--respuesta"
                    grosor={6}
                    etiqueta="Escribe aquí tu respuesta con el dedo o el mouse"
                    onTrazo={leer}
                  />
                  {actual.unidad && <span className="numerica__unidad">{actual.unidad}</span>}
                </div>
                <div className="numerica__lectura" aria-live="polite">
                  {leido ? (
                    <>
                      Escribiste: <strong className="numerica__leido">{leido.texto}</strong>
                      {dudoso && <span className="numerica__duda"> ¿Es correcto? Si no, bórralo y escríbelo más grande.</span>}
                    </>
                  ) : (
                    <span className="numerica__ayuda">Escribe el número con el dedo o el mouse.</span>
                  )}
                </div>
                <div className="numerica__acciones">
                  <button type="button" className="boton boton--suave" onClick={borrarRespuesta} disabled={!leido}>
                    Borrar respuesta
                  </button>
                  <button type="submit" className="boton boton--principal" disabled={!valor}>
                    Comprobar
                  </button>
                </div>
              </>
            ) : (
              <div className="numerica__fila">
                <input
                  ref={campoRef}
                  className="numerica__campo"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  aria-labelledby={`numerica-p-${paso}`}
                  value={valor}
                  onChange={(e) => setValor(e.target.value.replace(/[^\d.]/g, ''))}
                />
                {actual.unidad && <span className="numerica__unidad">{actual.unidad}</span>}
                <button type="submit" className="boton boton--principal" disabled={!valor.trim()}>
                  Comprobar
                </button>
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
