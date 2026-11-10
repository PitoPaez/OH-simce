import { useState } from 'react';
import { EJES, colorEje } from '../../data/ejes.js';
import { PARTES_REPASO } from '../../lib/progreso.js';
import IconoEje from '../ui/IconoEje.jsx';

const CANTIDADES = [
  { n: 5, texto: '5' },
  { n: 10, texto: '10' },
  { n: 0, texto: 'Todas' },
];

// «Repasar» por partes: el estudiante elige qué repasar (las que dejó para
// después, las que le costaron...) y de qué ejes y temas. Las preguntas se
// mezclan, porque practicar temas intercalados ayuda a distinguir qué
// estrategia usar en cada problema.
export default function Repasar({ progreso, catalogo, ir }) {
  const porRepasar = catalogo.activos
    .map((e) => ({ e, parte: PARTES_REPASO.find((p) => p.estados.includes(progreso.ejercicios[e.id]))?.id }))
    .filter((x) => x.parte);

  const partesConPreguntas = PARTES_REPASO.filter((p) => porRepasar.some((x) => x.parte === p.id));
  const [partes, setPartes] = useState(() => partesConPreguntas.map((p) => p.id));
  const [temas, setTemas] = useState(() => [...new Set(porRepasar.map((x) => x.e.tema))]);
  const [cantidad, setCantidad] = useState(10);

  const elegibles = porRepasar.filter((x) => partes.includes(x.parte));
  const elegidas = elegibles.filter((x) => temas.includes(x.e.tema));
  const total = cantidad ? Math.min(cantidad, elegidas.length) : elegidas.length;

  const alternar = (lista, setLista, valor) => setLista(lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor]);

  function empezar() {
    const opciones = new URLSearchParams({ partes: partes.join(','), temas: temas.join(',') });
    if (cantidad) opciones.set('n', cantidad);
    ir(`/repasar/practicar?${opciones}`);
  }

  if (!porRepasar.length) {
    return (
      <main className="pagina repasar-elegir">
        <nav className="barra">
          <button type="button" className="boton boton--texto" onClick={() => ir('/')}>
            Inicio
          </button>
        </nav>
        <h1>Repasar</h1>
        <p className="inicio-intro">
          Por ahora no tienes preguntas para repasar. Aquí aparecerán las que dejes para después, las que te cuesten y las que no salgan en un ensayo.
        </p>
      </main>
    );
  }

  return (
    <main className="pagina repasar-elegir">
      <nav className="barra">
        <button type="button" className="boton boton--texto" onClick={() => ir('/')}>
          Inicio
        </button>
      </nav>
      <h1>¿Qué quieres repasar?</h1>
      <p className="inicio-intro">Elige qué preguntas y de qué temas. Las que respondas bien a la primera y sin ayuda salen de esta lista.</p>

      <fieldset className="repasar-grupo">
        <legend>1. Qué preguntas</legend>
        <div className="repasar-partes">
          {PARTES_REPASO.map((parte) => {
            const n = porRepasar.filter((x) => x.parte === parte.id).length;
            return (
              <label key={parte.id} className={n ? 'opcion-marcable' : 'opcion-marcable opcion-marcable--vacia'}>
                <input type="checkbox" checked={partes.includes(parte.id)} disabled={!n} onChange={() => alternar(partes, setPartes, parte.id)} />
                <span className="opcion-marcable-texto">{parte.nombre}</span>
                <span className="opcion-marcable-cuenta">{n}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="repasar-grupo">
        <legend>2. De qué temas</legend>
        <ul className="repasar-ejes">
          {EJES.map((eje) => {
            const temasEje = catalogo.temas.filter((t) => t.eje === eje.id && elegibles.some((x) => x.e.tema === t.id));
            if (!temasEje.length) return null;
            const marcados = temasEje.filter((t) => temas.includes(t.id));
            const todos = marcados.length === temasEje.length;
            const ids = temasEje.map((t) => t.id);
            return (
              <li key={eje.id} className="repasar-eje" style={{ '--eje': colorEje(eje.id) }}>
                <label className="repasar-eje-titulo">
                  <input
                    type="checkbox"
                    checked={todos}
                    ref={(el) => {
                      if (el) el.indeterminate = marcados.length > 0 && !todos;
                    }}
                    onChange={() => setTemas(todos ? temas.filter((t) => !ids.includes(t)) : [...new Set([...temas, ...ids])])}
                  />
                  <span className="indice-papel indice-papel--chico" aria-hidden="true">
                    <IconoEje eje={eje.id} />
                  </span>
                  <span>{eje.nombre}</span>
                </label>
                <div className="repasar-temas">
                  {temasEje.map((t) => (
                    <label key={t.id} className="opcion-marcable opcion-marcable--tema">
                      <input type="checkbox" checked={temas.includes(t.id)} onChange={() => alternar(temas, setTemas, t.id)} />
                      <span className="opcion-marcable-texto">{t.nombre}</span>
                      <span className="opcion-marcable-cuenta">{elegibles.filter((x) => x.e.tema === t.id).length}</span>
                    </label>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <fieldset className="repasar-grupo">
        <legend>3. Cuántas</legend>
        <div className="repasar-cantidad" role="radiogroup">
          {CANTIDADES.map((c) => (
            <label key={c.n} className="opcion-marcable opcion-marcable--chica">
              <input type="radio" name="cantidad" checked={cantidad === c.n} onChange={() => setCantidad(c.n)} />
              <span className="opcion-marcable-texto">{c.texto}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="repasar-empezar">
        <button type="button" className="boton boton--principal" onClick={empezar} disabled={!total}>
          {total ? `Repasar ${total} ${total === 1 ? 'pregunta' : 'preguntas'}` : 'Elige al menos una opción'}
        </button>
      </div>
    </main>
  );
}
