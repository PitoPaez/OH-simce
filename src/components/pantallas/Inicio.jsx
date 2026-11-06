import { EJES, colorEje } from '../../data/ejes.js';
import { EJERCICIOS, TEMAS } from '../../data/index.js';
import { idsParaRepasar } from '../../lib/progreso.js';
import Cuadritos from '../ui/Cuadritos.jsx';
import IconoEje from '../ui/IconoEje.jsx';
import { PASOS } from './Pregunta.jsx';

const DESCRIPCION_PASOS = {
  entender: '¿Qué me preguntan? ¿Qué datos tengo?',
  planificar: '¿Qué puedo hacer? ¿Un dibujo, una operación?',
  hacer: 'Resuelvo paso a paso.',
  comprobar: '¿Mi respuesta tiene sentido?',
};

export default function Inicio({ progreso, ir }) {
  const repasar = idsParaRepasar(progreso).filter((id) => EJERCICIOS.some((e) => e.id === id));
  const ultimoTema = TEMAS.find((t) => t.id === progreso.ultimoTema);
  const ultimoEnsayo = progreso.ensayos.at(-1);

  return (
    <main className="pagina inicio">
      <header className="inicio-encabezado">
        <p className="marca">
          OH Simce <span>Matemática 4° básico</span>
        </p>
        <h1>¿Qué quieres practicar hoy?</h1>
        <p className="inicio-intro">Elige un tema y avanza a tu ritmo. Aquí equivocarse está bien: cada error te muestra algo que puedes aprender.</p>
      </header>

      {ultimoTema && (
        <button type="button" className="seguir" style={{ '--eje': colorEje(ultimoTema.eje) }} onClick={() => ir(`/tema/${ultimoTema.id}`)}>
          <IconoEje eje={ultimoTema.eje} />
          <span>
            <span className="seguir-rotulo">Seguir donde quedaste</span>
            <span className="seguir-tema">{ultimoTema.nombre}</span>
          </span>
        </button>
      )}

      <ul className="indice">
        {EJES.map((eje) => {
          const ejercicios = EJERCICIOS.filter((e) => e.eje === eje.id);
          const logrados = ejercicios.filter((e) => progreso.ejercicios[e.id] === 'solo').length;
          const temas = TEMAS.filter((t) => t.eje === eje.id);
          return (
            <li key={eje.id}>
              <button type="button" className="indice-fila" style={{ '--eje': colorEje(eje.id) }} onClick={() => ir(`/eje/${eje.id}`)}>
                <span className="indice-papel" aria-hidden="true">
                  <IconoEje eje={eje.id} />
                </span>
                <span className="indice-texto">
                  <span className="indice-nombre">{eje.nombre}</span>
                  <span className="indice-desc">{eje.descripcion}</span>
                </span>
                <span className="indice-progreso">
                  <Cuadritos
                    estados={temas.map((t) => {
                      const ids = EJERCICIOS.filter((e) => e.tema === t.id).map((e) => e.id);
                      const n = ids.filter((id) => progreso.ejercicios[id] === 'solo').length;
                      return n === ids.length ? 'solo' : n > 0 || ids.some((id) => progreso.ejercicios[id]) ? 'ayuda' : 'vacio';
                    })}
                    etiqueta={`${logrados} de ${ejercicios.length} ejercicios logrados`}
                  />
                  <span className="indice-cuenta">
                    {logrados} de {ejercicios.length}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="tarjetas">
        <section className="tarjeta tarjeta--ensayo">
          <h2>Ensayo tipo SIMCE</h2>
          <p>15 preguntas de todos los ejes, con alternativas y sin ayuda, como el día de la prueba. Al final revisas cada respuesta.</p>
          {ultimoEnsayo && (
            <p className="tarjeta-dato">
              Tu último ensayo: {ultimoEnsayo.correctas} de {ultimoEnsayo.total}
            </p>
          )}
          <button type="button" className="boton boton--principal" onClick={() => ir('/ensayo')}>
            Empezar un ensayo
          </button>
        </section>
        <section className="tarjeta tarjeta--repasar">
          <h2>Repasar</h2>
          {repasar.length > 0 ? (
            <>
              <p>
                Tienes {repasar.length} {repasar.length === 1 ? 'pregunta que te costó' : 'preguntas que te costaron'}. Repasar otro día ayuda a que no se olvide.
              </p>
              <button type="button" className="boton boton--principal" onClick={() => ir('/repasar')}>
                Repasar ahora
              </button>
            </>
          ) : (
            <p>Aquí aparecerán las preguntas que te cuesten, para que las practiques de nuevo otro día.</p>
          )}
        </section>
      </div>

      <section className="pasos-inicio" aria-labelledby="titulo-pasos">
        <h2 id="titulo-pasos">Para resolver un problema</h2>
        <ol>
          {PASOS.map((p) => (
            <li key={p.id}>
              <span className="pasos-nombre">{p.nombre}</span>
              <span className="pasos-desc">{DESCRIPCION_PASOS[p.id]}</span>
            </li>
          ))}
        </ol>
        <p className="pasos-nota">Cuando pidas ayuda en un ejercicio, te la daremos en este mismo orden.</p>
      </section>

      <footer className="pie">
        <button type="button" className="boton boton--texto" onClick={() => ir('/docentes')}>
          Información para docentes y familias
        </button>
      </footer>
    </main>
  );
}
