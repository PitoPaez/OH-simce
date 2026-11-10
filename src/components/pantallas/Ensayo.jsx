import { useMemo, useState } from 'react';
import { EJES, colorEje } from '../../data/ejes.js';
import Visual from '../visuales/Visual.jsx';
import Texto, { ConFracciones } from '../ui/Texto.jsx';
import Leer from '../ui/Leer.jsx';
import Cuadritos from '../ui/Cuadritos.jsx';
import Alternativas, { LETRAS } from '../interactivos/Alternativas.jsx';
import { BotonPendiente, prepararOpciones } from './Pregunta.jsx';

// Ensayo tipo SIMCE: preguntas de todos los ejes, con alternativas y sin
// ayuda, para conocer el formato de la prueba. No hay cronómetro: la
// velocidad no es lo importante en matemática y el apuro bloquea la
// memoria de trabajo (Boaler, Mindset Mathematics).
function Revision({ sesion, respuestas, marcadas, onRepetir, onSalir }) {
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
      <p className="resumen-mensaje">Revisa cada pregunta: lo importante del ensayo es saber qué practicar. Las que no salieron quedaron en «Repasar», en «Las que no salieron en el ensayo».</p>
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
              {marcadas.includes(i) && <p className="revision-marca">La dejaste para después.</p>}
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

// Mapa con todas las preguntas, como hojear la prueba: se puede ir a
// cualquiera y responderlas en el orden que se quiera.
function MapaPreguntas({ total, indice, respuestas, marcadas, onIr, grande = false }) {
  return (
    <ol className={grande ? 'mapa-preguntas mapa-preguntas--grande' : 'mapa-preguntas'} aria-label="Todas las preguntas">
      {Array.from({ length: total }, (_, i) => {
        const marcada = marcadas.includes(i);
        const respondida = Boolean(respuestas[i]);
        const estado = marcada ? 'para después' : respondida ? 'respondida' : 'sin responder';
        return (
          <li key={i}>
            <button
              type="button"
              className={[
                'mapa-pregunta',
                respondida && 'mapa-pregunta--respondida',
                marcada && 'mapa-pregunta--marcada',
                i === indice && 'mapa-pregunta--actual',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onIr(i)}
              aria-current={i === indice ? 'step' : undefined}
              aria-label={`Pregunta ${i + 1}, ${estado}`}
            >
              {i + 1}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function LeyendaMapa() {
  return (
    <p className="mapa-leyenda" aria-hidden="true">
      <span>
        <span className="mapa-muestra mapa-pregunta--respondida" /> Respondida
      </span>
      <span>
        <span className="mapa-muestra mapa-pregunta--marcada" /> Para después
      </span>
      <span>
        <span className="mapa-muestra" /> Sin responder
      </span>
    </p>
  );
}

function Indicaciones({ total, onEmpezar, onSalir }) {
  return (
    <main className="pagina ensayo-intro">
      <nav className="barra">
        <button type="button" className="boton boton--texto" onClick={onSalir}>
          Salir
        </button>
      </nav>
      <h1>Ensayo tipo SIMCE</h1>
      <p className="inicio-intro">
        Son {total} preguntas de todos los ejes, con alternativas. No hay ayuda ni tiempo límite: es para que conozcas cómo es la prueba.
      </p>
      <ol className="ensayo-consejos">
        <li>
          <strong>Puedes responder en el orden que quieras.</strong> Abajo de cada pregunta está el mapa con todas: toca un número para ir a esa pregunta.
        </li>
        <li>
          <strong>Si una te cuesta, déjala para después.</strong> Sigue con las otras y vuelve al final. Así no pierdes tiempo pegado en una.
        </li>
        <li>
          <strong>Antes de entregar</strong> verás cuáles dejaste para después y cuáles están sin responder.
        </li>
      </ol>
      <div className="acciones-fila">
        <button type="button" className="boton boton--principal" onClick={onEmpezar}>
          Empezar
        </button>
      </div>
    </main>
  );
}

function AntesDeEntregar({ sesion, respuestas, marcadas, onIr, onVolverPendientes, onEntregar }) {
  const total = sesion.ejercicios.length;
  const [confirmar, setConfirmar] = useState(false);
  const respondidas = sesion.ejercicios.filter((_, i) => respuestas[i]).length;
  const sinResponder = sesion.ejercicios.map((_, i) => i).filter((i) => !respuestas[i]);
  const porRevisar = sesion.ejercicios.map((_, i) => i).filter((i) => marcadas.includes(i) || !respuestas[i]);

  return (
    <main className="pagina antes-entregar">
      <h1>Antes de entregar</h1>
      <ul className="antes-cuentas">
        <li>
          <strong>{respondidas}</strong> de {total} respondidas
        </li>
        {marcadas.length > 0 && (
          <li className="antes-cuentas--marcadas">
            <strong>{marcadas.length}</strong> para después
          </li>
        )}
        {sinResponder.length > 0 && (
          <li className="antes-cuentas--blanco">
            <strong>{sinResponder.length}</strong> sin responder
          </li>
        )}
      </ul>
      <MapaPreguntas grande total={total} indice={-1} respuestas={respuestas} marcadas={marcadas} onIr={onIr} />
      <LeyendaMapa />
      {porRevisar.length > 0 ? (
        <p className="resumen-mensaje">
          Te {porRevisar.length === 1 ? 'queda 1 pregunta' : `quedan ${porRevisar.length} preguntas`} por revisar. En el SIMCE una pregunta en blanco no suma: si no
          estás seguro, elige la alternativa que te parezca mejor.
        </p>
      ) : (
        <p className="resumen-mensaje">Respondiste todas. Puedes revisar alguna tocando su número, o entregar.</p>
      )}
      {confirmar ? (
        <div className="panel panel--revisar antes-confirmar" role="alert">
          <p>
            {sinResponder.length === 1 ? 'Hay 1 pregunta sin responder.' : `Hay ${sinResponder.length} preguntas sin responder.`} ¿Quieres entregar igual?
          </p>
          <div className="acciones-fila">
            <button type="button" className="boton boton--principal" onClick={onVolverPendientes}>
              Volver a responderlas
            </button>
            <button type="button" className="boton boton--suave" onClick={onEntregar}>
              Entregar igual
            </button>
          </div>
        </div>
      ) : (
        <div className="acciones-fila">
          {porRevisar.length > 0 && (
            <button type="button" className="boton boton--principal" onClick={onVolverPendientes}>
              Ir a las que faltan
            </button>
          )}
          <button
            type="button"
            className={porRevisar.length > 0 ? 'boton boton--suave' : 'boton boton--principal'}
            onClick={() => (sinResponder.length ? setConfirmar(true) : onEntregar())}
          >
            Entregar el ensayo
          </button>
        </div>
      )}
    </main>
  );
}

export default function Ensayo({ sesion, onTerminar, onSalir, onRepetir }) {
  const total = sesion.ejercicios.length;
  const [fase, setFase] = useState('indicaciones');
  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState([]);
  const [marcadas, setMarcadas] = useState([]);
  // Al volver desde «Antes de entregar», «Siguiente» salta a la próxima que falta.
  const [soloFaltantes, setSoloFaltantes] = useState(false);
  const opcionesPorPregunta = useMemo(() => sesion.ejercicios.map(prepararOpciones), [sesion]);

  const ir = (i) => {
    setIndice(i);
    setFase('responder');
    window.scrollTo({ top: 0 });
  };
  const falta = (i) => marcadas.includes(i) || !respuestas[i];

  if (fase === 'indicaciones') return <Indicaciones total={total} onEmpezar={() => setFase('responder')} onSalir={onSalir} />;

  if (fase === 'fin') {
    return <Revision sesion={sesion} respuestas={respuestas} marcadas={marcadas} onRepetir={onRepetir} onSalir={onSalir} />;
  }

  if (fase === 'antes') {
    return (
      <AntesDeEntregar
        sesion={sesion}
        respuestas={respuestas}
        marcadas={marcadas}
        onIr={(i) => {
          setSoloFaltantes(false);
          ir(i);
        }}
        onVolverPendientes={() => {
          setSoloFaltantes(true);
          ir(sesion.ejercicios.findIndex((_, i) => falta(i)));
        }}
        onEntregar={() => {
          onTerminar(
            sesion.ejercicios.map((e, i) => ({
              id: e.id,
              correcta: Boolean(respuestas[i]?.correcta),
              texto: respuestas[i]?.texto ?? null,
              marcada: marcadas.includes(i),
            })),
          );
          setFase('fin');
          window.scrollTo({ top: 0 });
        }}
      />
    );
  }

  const ejercicio = sesion.ejercicios[indice];
  const opciones = opcionesPorPregunta[indice];
  const actual = respuestas[indice];
  const marcada = marcadas.includes(indice);

  function elegir(opcion) {
    setRespuestas((prev) => {
      const nuevo = [...prev];
      nuevo[indice] = { texto: opcion.texto, correcta: Boolean(opcion.correcta), error: opcion.error };
      return nuevo;
    });
    // Responder quita la marca: ya no está pendiente.
    setMarcadas((prev) => prev.filter((i) => i !== indice));
  }

  function siguienteDe(i, marcadasAhora) {
    if (soloFaltantes) {
      const orden = [...sesion.ejercicios.keys()].slice(i + 1);
      const proxima = orden.find((k) => marcadasAhora.includes(k) || !respuestas[k]);
      return proxima ?? null;
    }
    return i + 1 < total ? i + 1 : null;
  }

  function avanzar(marcadasAhora = marcadas) {
    const proxima = siguienteDe(indice, marcadasAhora);
    if (proxima === null) {
      setFase('antes');
      window.scrollTo({ top: 0 });
    } else ir(proxima);
  }

  function dejarParaDespues() {
    const nuevas = marcada ? marcadas : [...marcadas, indice];
    setMarcadas(nuevas);
    avanzar(nuevas);
  }

  const lectura = `${ejercicio.enunciado} ${opciones.map((o, i) => `${LETRAS[i]}: ${o.texto}.`).join(' ')}`;
  const respondidas = sesion.ejercicios.filter((_, i) => respuestas[i]).length;
  const hayProxima = siguienteDe(indice, marcadas) !== null;

  return (
    <main className="pagina practica ensayo" style={{ '--eje': colorEje(ejercicio.eje) }}>
      <nav className="barra" aria-label="Progreso del ensayo">
        <button type="button" className="boton boton--texto" onClick={onSalir}>
          Salir
        </button>
        <span className="barra-tema">
          Pregunta {indice + 1} de {total}
        </span>
        <span className="barra-progreso">
          <Cuadritos
            estados={sesion.ejercicios.map((_, i) => (i === indice ? 'actual' : marcadas.includes(i) ? 'pendiente' : respuestas[i] ? 'marcada' : 'vacio'))}
            etiqueta={`${respondidas} de ${total} respondidas`}
          />
        </span>
      </nav>
      {marcada && <p className="aviso-pendiente">La dejaste para después. Cuando elijas una alternativa, se quita la marca.</p>}
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
        <p className="ensayo-nota">
          {actual ? 'Puedes cambiar tu respuesta cuando quieras, hasta entregar.' : 'Si no sabes, déjala para después y vuelve al final.'}
        </p>
        <div className="acciones-fila ensayo-acciones">
          {indice > 0 && (
            <button type="button" className="boton boton--suave" onClick={() => ir(indice - 1)}>
              Anterior
            </button>
          )}
          {!actual && <BotonPendiente onClick={dejarParaDespues} />}
          <button type="button" className={actual ? 'boton boton--principal' : 'boton boton--suave'} onClick={() => avanzar()}>
            {hayProxima ? 'Siguiente' : 'Revisar y entregar'}
          </button>
        </div>
        <section className="ensayo-mapa" aria-labelledby="titulo-mapa">
          <h2 id="titulo-mapa">Todas las preguntas</h2>
          <MapaPreguntas total={total} indice={indice} respuestas={respuestas} marcadas={marcadas} onIr={ir} />
          <LeyendaMapa />
          <button
            type="button"
            className="boton boton--texto"
            onClick={() => {
              setFase('antes');
              window.scrollTo({ top: 0 });
            }}
          >
            Revisar y entregar
          </button>
        </section>
      </div>
    </main>
  );
}
