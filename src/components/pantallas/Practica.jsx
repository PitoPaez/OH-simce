import { useState } from 'react';
import { EJES, colorEje } from '../../data/ejes.js';
import Cuadritos from '../ui/Cuadritos.jsx';
import IconoEje from '../ui/IconoEje.jsx';
import Texto from '../ui/Texto.jsx';
import Pregunta from './Pregunta.jsx';

function mensajeFinal(solos, total) {
  if (solos === total) return 'Respondiste todo a la primera y sin ayuda. Tu forma de pensar los problemas está funcionando.';
  if (solos >= total / 2) return 'Vas muy bien. Las preguntas que te costaron son las que más te enseñan: repásalas otro día.';
  return 'Hoy practicaste cosas difíciles. Cada error que revisaste es algo que entendiste mejor. Vuelve a intentarlo otro día: el cerebro aprende repasando.';
}

function Resumen({ sesion, resultados, pendientes, onRepetir, onSalir, textoSalir }) {
  const solos = resultados.filter((r) => r.estado === 'solo').length;
  const total = resultados.length;
  const repasar = resultados.filter((r) => r.estado !== 'solo').map((r) => sesion.ejercicios.find((e) => e.id === r.id));
  return (
    <main className="pagina resumen" style={{ '--eje': sesion.ejeId ? colorEje(sesion.ejeId) : 'var(--eje-mixta)' }}>
      <h1>Terminaste: {sesion.titulo}</h1>
      <div className="resumen-cuadritos">
        <Cuadritos
          grande
          estados={[...resultados.map((r) => (r.estado === 'solo' ? 'solo' : 'ayuda')), ...pendientes.map(() => 'pendiente')]}
          colores={[...resultados.map((r) => colorEje(sesion.ejercicios.find((e) => e.id === r.id).eje)), ...pendientes.map((e) => colorEje(e.eje))]}
          etiqueta={`${solos} de ${total} correctas a la primera y sin ayuda${pendientes.length ? `, ${pendientes.length} para después` : ''}`}
        />
        <p>
          {total > 0 && (
            <>
              <strong>
                {solos} de {total}
              </strong>{' '}
              a la primera y sin ayuda
            </>
          )}
          {total > 0 && pendientes.length > 0 && <br />}
          {pendientes.length > 0 && <>{pendientes.length === 1 ? '1 quedó para después' : `${pendientes.length} quedaron para después`}</>}
        </p>
      </div>
      {total > 0 && <p className="resumen-mensaje">{mensajeFinal(solos, total)}</p>}
      {pendientes.length > 0 && (
        <section className="repasar repasar--pendientes">
          <h2>Quedaron para después</h2>
          <p className="repasar-intro">
            Están guardadas en «Repasar», en «Las que dejé para después». Cuando vuelvas, intenta primero sola o solo, y si no sale, pide ayuda.
          </p>
          <ul>
            {pendientes.map((e) => (
              <li key={e.id}>
                <p>
                  <Texto texto={e.enunciado} />
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
      {repasar.length > 0 && (
        <section className="repasar">
          <h2>Para repasar</h2>
          <p className="repasar-intro">Estas quedaron guardadas en «Repasar». Así se resolvían:</p>
          <ul>
            {repasar.map((e) => (
              <li key={e.id}>
                <p>
                  <Texto texto={e.enunciado} />
                </p>
                <p className="repasar-solucion">
                  <Texto texto={e.solucion?.texto ?? ''} />
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
      <div className="acciones-fila">
        <button type="button" className="boton boton--principal" onClick={onRepetir}>
          Practicar otra vez
        </button>
        <button type="button" className="boton boton--suave" onClick={onSalir}>
          {textoSalir}
        </button>
      </div>
    </main>
  );
}

// Una sesión de práctica: una pregunta por pantalla (sin distracciones,
// para no sobrecargar la memoria de trabajo) y un resumen al final.
//
// Las preguntas forman una fila. «Dejar para después» manda la pregunta al
// final de la fila, para no quedarse pegado en una. Cuando solo quedan
// pendientes, se avisa antes de volver a ellas y se puede terminar ahí.
export default function Practica({ sesion, onRegistrar, onPendiente, onRepetir, onSalir, textoSalir = 'Volver', onVerEjemplo }) {
  const total = sesion.ejercicios.length;
  const [fila, setFila] = useState(() => sesion.ejercicios.map((_, i) => i));
  const [resultados, setResultados] = useState([]);
  const [pendientes, setPendientes] = useState([]);
  const [avisadas, setAvisadas] = useState([]);
  const [terminado, setTerminado] = useState(false);

  if (terminado || fila.length === 0) {
    return (
      <Resumen
        sesion={sesion}
        resultados={resultados}
        pendientes={fila.map((i) => sesion.ejercicios[i])}
        onRepetir={onRepetir}
        onSalir={onSalir}
        textoSalir={textoSalir}
      />
    );
  }

  const indice = fila[0];
  const ejercicio = sesion.ejercicios[indice];
  const eje = EJES.find((e) => e.id === ejercicio.eje);
  const esPendiente = pendientes.includes(indice);

  function avanzar(nuevaFila) {
    setFila(nuevaFila);
    window.scrollTo({ top: 0 });
  }

  function terminar(estado, detalle) {
    onRegistrar(ejercicio.id, estado, detalle);
    setResultados((prev) => [...prev, { id: ejercicio.id, indice, estado }]);
    setPendientes((prev) => prev.filter((i) => i !== indice));
    avanzar(fila.slice(1));
  }

  function dejarPendiente(detalle) {
    onPendiente(ejercicio.id, detalle);
    setPendientes((prev) => (prev.includes(indice) ? prev : [...prev, indice]));
    setAvisadas((prev) => prev.filter((i) => i !== indice));
    avanzar([...fila.slice(1), indice]);
  }

  const estados = sesion.ejercicios.map((_, i) => {
    const r = resultados.find((x) => x.indice === i);
    if (r) return r.estado === 'solo' ? 'solo' : 'ayuda';
    if (i === indice) return 'actual';
    if (pendientes.includes(i)) return 'pendiente';
    return 'vacio';
  });
  const hechas = resultados.length;

  const barra = (
    <nav className="barra" aria-label="Progreso">
      <button type="button" className="boton boton--texto" onClick={onSalir}>
        Salir
      </button>
      <span className="barra-tema">
        <IconoEje eje={eje.id} className="icono-eje icono-eje--chico" />
        {sesion.ejeId ? sesion.titulo : eje.nombre}
      </span>
      <span className="barra-progreso">
        <Cuadritos
          estados={estados}
          colores={sesion.ejercicios.map((e) => colorEje(e.eje))}
          etiqueta={`${hechas} de ${total} terminadas${pendientes.length ? `, ${pendientes.length} para después` : ''}`}
        />
        <span className="barra-cuenta" aria-hidden="true">
          {hechas} de {total}
        </span>
      </span>
    </nav>
  );

  // Solo quedan pendientes: se avisa antes de volver a ellas.
  if (esPendiente && !avisadas.includes(indice)) {
    const n = fila.length;
    return (
      <main className="pagina practica" style={{ '--eje': colorEje(eje.id) }}>
        {barra}
        <section className="vuelta-pendientes">
          <h1>{n === 1 ? 'Te queda 1 pregunta que dejaste para después' : `Te quedan ${n} preguntas que dejaste para después`}</h1>
          <p>Ahora que hiciste las demás, puede que te resulte más fácil. Si todavía no te sale, pide ayuda: está para eso.</p>
          <div className="acciones-fila">
            <button type="button" className="boton boton--principal" onClick={() => setAvisadas((prev) => [...prev, ...fila])}>
              {n === 1 ? 'Intentarla ahora' : 'Intentarlas ahora'}
            </button>
            <button type="button" className="boton boton--suave" onClick={() => setTerminado(true)}>
              Terminar por hoy
            </button>
          </div>
          <p className="pendiente-nota">Si terminas, {n === 1 ? 'queda guardada' : 'quedan guardadas'} en «Repasar» para otro día.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="pagina practica" style={{ '--eje': colorEje(eje.id) }}>
      {barra}
      {esPendiente && <p className="aviso-pendiente">La dejaste para después. ¡Vamos de nuevo!</p>}
      <Pregunta
        key={`${sesion.clave}-${ejercicio.id}-${pendientes.includes(indice)}`}
        ejercicio={ejercicio}
        esUltima={fila.length === 1}
        onTerminar={terminar}
        onPendiente={total > 1 ? dejarPendiente : undefined}
        onVerEjemplo={onVerEjemplo ? () => onVerEjemplo(ejercicio.tema) : undefined}
      />
    </main>
  );
}
