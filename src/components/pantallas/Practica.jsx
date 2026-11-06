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

function Resumen({ sesion, resultados, onRepetir, onSalir, textoSalir }) {
  const solos = resultados.filter((r) => r.estado === 'solo').length;
  const total = resultados.length;
  const repasar = resultados.filter((r) => r.estado !== 'solo').map((r) => sesion.ejercicios.find((e) => e.id === r.id));
  return (
    <main className="pagina resumen" style={{ '--eje': sesion.ejeId ? colorEje(sesion.ejeId) : 'var(--eje-mixta)' }}>
      <h1>Terminaste: {sesion.titulo}</h1>
      <div className="resumen-cuadritos">
        <Cuadritos
          grande
          estados={resultados.map((r) => (r.estado === 'solo' ? 'solo' : 'ayuda'))}
          colores={resultados.map((r) => colorEje(sesion.ejercicios.find((e) => e.id === r.id).eje))}
          etiqueta={`${solos} de ${total} correctas a la primera y sin ayuda`}
        />
        <p>
          <strong>
            {solos} de {total}
          </strong>{' '}
          a la primera y sin ayuda
        </p>
      </div>
      <p className="resumen-mensaje">{mensajeFinal(solos, total)}</p>
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
export default function Practica({ sesion, onRegistrar, onRepetir, onSalir, textoSalir = 'Volver', onVerEjemplo }) {
  const [indice, setIndice] = useState(0);
  const [resultados, setResultados] = useState([]);
  const terminado = resultados.length === sesion.ejercicios.length;

  if (terminado) {
    return <Resumen sesion={sesion} resultados={resultados} onRepetir={onRepetir} onSalir={onSalir} textoSalir={textoSalir} />;
  }

  const ejercicio = sesion.ejercicios[indice];
  const eje = EJES.find((e) => e.id === ejercicio.eje);
  const total = sesion.ejercicios.length;

  function terminar(estado) {
    onRegistrar(ejercicio.id, estado);
    setResultados((prev) => [...prev, { id: ejercicio.id, estado }]);
    if (indice + 1 < total) {
      setIndice(indice + 1);
      window.scrollTo({ top: 0 });
    } else {
      window.scrollTo({ top: 0 });
    }
  }

  const estados = sesion.ejercicios.map((_, i) => {
    if (i < resultados.length) return resultados[i].estado === 'solo' ? 'solo' : 'ayuda';
    if (i === indice) return 'actual';
    return 'vacio';
  });

  return (
    <main className="pagina practica" style={{ '--eje': colorEje(eje.id) }}>
      <nav className="barra" aria-label="Progreso">
        <button type="button" className="boton boton--texto" onClick={onSalir}>
          Salir
        </button>
        <span className="barra-tema">
          <IconoEje eje={eje.id} className="icono-eje icono-eje--chico" />
          {sesion.ejeId ? sesion.titulo : eje.nombre}
        </span>
        <span className="barra-progreso">
          <Cuadritos estados={estados} colores={sesion.ejercicios.map((e) => colorEje(e.eje))} etiqueta={`Pregunta ${indice + 1} de ${total}`} />
          <span className="barra-cuenta" aria-hidden="true">
            {indice + 1} de {total}
          </span>
        </span>
      </nav>
      <Pregunta
        key={`${sesion.clave}-${ejercicio.id}`}
        ejercicio={ejercicio}
        esUltima={indice + 1 === total}
        onTerminar={terminar}
        onVerEjemplo={onVerEjemplo ? () => onVerEjemplo(ejercicio.tema) : undefined}
      />
    </main>
  );
}
