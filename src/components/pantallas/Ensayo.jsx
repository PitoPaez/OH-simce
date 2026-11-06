import { useMemo, useState } from 'react';
import { EJES, colorEje } from '../../data/ejes.js';
import Visual from '../visuales/Visual.jsx';
import Texto, { ConFracciones } from '../ui/Texto.jsx';
import Leer from '../ui/Leer.jsx';
import Cuadritos from '../ui/Cuadritos.jsx';
import Alternativas, { LETRAS } from '../interactivos/Alternativas.jsx';
import { prepararOpciones } from './Pregunta.jsx';

// Ensayo tipo SIMCE: preguntas de todos los ejes, con alternativas y sin
// ayuda, para conocer el formato de la prueba. No hay cronómetro: la
// velocidad no es lo importante en matemática y el apuro bloquea la
// memoria de trabajo (Boaler, Mindset Mathematics).
function Revision({ sesion, respuestas, onRepetir, onSalir }) {
  const correctas = sesion.ejercicios.filter((_, i) => respuestas[i]?.correcta).length;
  const total = sesion.ejercicios.length;
  const porEje = EJES.map((eje) => {
    const del = sesion.ejercicios.map((e, i) => ({ e, r: respuestas[i] })).filter(({ e }) => e.eje === eje.id);
    return { eje, bien: del.filter(({ r }) => r?.correcta).length, total: del.length };
  }).filter((x) => x.total > 0);
  return (
    <main className="pagina resumen">
      <h1>Resultado del ensayo</h1>
      <div className="resumen-cuadritos">
        <Cuadritos
          grande
          estados={sesion.ejercicios.map((_, i) => (respuestas[i]?.correcta ? 'solo' : 'vacio'))}
          colores={sesion.ejercicios.map((e) => colorEje(e.eje))}
          etiqueta={`${correctas} de ${total} correctas`}
        />
        <p>
          <strong>
            {correctas} de {total}
          </strong>{' '}
          correctas
        </p>
      </div>
      <ul className="ensayo-ejes">
        {porEje.map(({ eje, bien, total: t }) => (
          <li key={eje.id} style={{ '--eje': colorEje(eje.id) }}>
            <span className="ensayo-eje-papel" aria-hidden="true" />
            {eje.nombre}: {bien} de {t}
          </li>
        ))}
      </ul>
      <p className="resumen-mensaje">Revisa cada pregunta: lo importante del ensayo es saber qué practicar. Las que no salieron quedaron en «Repasar».</p>
      <ol className="revision">
        {sesion.ejercicios.map((e, i) => {
          const r = respuestas[i];
          return (
            <li key={e.id} className={r?.correcta ? 'revision-item revision-item--bien' : 'revision-item'}>
              <p className="revision-enunciado">
                <Texto texto={e.enunciado} />
              </p>
              {e.visual && <Visual visual={e.visual} />}
              <p>
                Tu respuesta: <strong>{r ? <ConFracciones texto={r.texto} /> : 'sin responder'}</strong>
                {r?.correcta ? ' (correcta)' : ''}
              </p>
              {!r?.correcta && (
                <>
                  {r?.error && (
                    <p className="revision-error">
                      <Texto texto={r.error} />
                    </p>
                  )}
                  <p className="revision-solucion">
                    <Texto texto={e.solucion?.texto ?? ''} />
                  </p>
                </>
              )}
            </li>
          );
        })}
      </ol>
      <div className="acciones-fila">
        <button type="button" className="boton boton--principal" onClick={onRepetir}>
          Hacer otro ensayo
        </button>
        <button type="button" className="boton boton--suave" onClick={onSalir}>
          Volver al inicio
        </button>
      </div>
    </main>
  );
}

export default function Ensayo({ sesion, onTerminar, onSalir, onRepetir }) {
  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState([]);
  const [fin, setFin] = useState(false);
  const opcionesPorPregunta = useMemo(() => sesion.ejercicios.map(prepararOpciones), [sesion]);

  if (fin) return <Revision sesion={sesion} respuestas={respuestas} onRepetir={onRepetir} onSalir={onSalir} />;

  const ejercicio = sesion.ejercicios[indice];
  const opciones = opcionesPorPregunta[indice];
  const total = sesion.ejercicios.length;
  const actual = respuestas[indice];

  function elegir(opcion) {
    setRespuestas((prev) => {
      const nuevo = [...prev];
      nuevo[indice] = { texto: opcion.texto, correcta: Boolean(opcion.correcta), error: opcion.error };
      return nuevo;
    });
  }

  function siguiente() {
    window.scrollTo({ top: 0 });
    if (indice + 1 < total) setIndice(indice + 1);
    else {
      onTerminar(sesion.ejercicios.map((e, i) => ({ id: e.id, correcta: Boolean(respuestas[i]?.correcta) })));
      setFin(true);
    }
  }

  const lectura = `${ejercicio.enunciado} ${opciones.map((o, i) => `${LETRAS[i]}: ${o.texto}.`).join(' ')}`;

  return (
    <main className="pagina practica" style={{ '--eje': colorEje(ejercicio.eje) }}>
      <nav className="barra" aria-label="Progreso del ensayo">
        <button type="button" className="boton boton--texto" onClick={onSalir}>
          Salir
        </button>
        <span className="barra-tema">Ensayo tipo SIMCE</span>
        <span className="barra-progreso">
          <Cuadritos
            estados={sesion.ejercicios.map((_, i) => (i === indice ? 'actual' : respuestas[i] ? 'marcada' : 'vacio'))}
            etiqueta={`Pregunta ${indice + 1} de ${total}`}
          />
          <span className="barra-cuenta" aria-hidden="true">
            {indice + 1} de {total}
          </span>
        </span>
      </nav>
      <div className="pregunta">
        <div className="pregunta-enunciado">
          <h1>
            <Texto texto={ejercicio.enunciado} />
          </h1>
          <Leer texto={lectura} />
        </div>
        {ejercicio.visual && <Visual visual={ejercicio.visual} />}
        <Alternativas opciones={opciones} modo="ensayo" elegida={actual?.texto} onElegir={elegir} columnas={ejercicio.columnas} />
      </div>
      <div className="ensayo-pie">
        <p className="ensayo-nota">{actual ? 'Puedes cambiar tu respuesta antes de seguir.' : 'Marca una alternativa. Si no sabes, elige la que te parezca mejor.'}</p>
        <div className="acciones-fila">
          {indice > 0 && (
            <button type="button" className="boton boton--suave" onClick={() => setIndice(indice - 1)}>
              Anterior
            </button>
          )}
          <button type="button" className="boton boton--principal" onClick={siguiente} disabled={!actual}>
            {indice + 1 === total ? 'Terminar el ensayo' : 'Siguiente'}
          </button>
        </div>
      </div>
    </main>
  );
}
