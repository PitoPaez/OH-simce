import { EJERCICIOS } from '../data/ejercicios.js';
import Cuadritos from './Cuadritos.jsx';

function mensaje(logrados, total) {
  if (logrados === total) return 'Respondiste todo a la primera. Tu forma de pensar los problemas está funcionando.';
  if (logrados >= total / 2) return 'Vas muy bien. Las que corregiste son las que más te enseñan.';
  return 'Cada error que revisaste hoy es algo que ya no se te va a olvidar. Repasa estas preguntas y vuelve a intentarlo.';
}

export default function Resumen({ sesion, resultados, onRepetir, onInicio }) {
  const logrados = resultados.filter((r) => r.primerIntento).length;
  const total = resultados.length;
  const repasar = resultados
    .filter((r) => !r.primerIntento)
    .map((r) => EJERCICIOS.find((e) => e.id === r.id));

  return (
    <main className="pagina resumen" style={{ '--eje': sesion.ejeId ? `var(--eje-${sesion.ejeId})` : 'var(--eje-mixta)' }}>
      <h1>Terminaste: {sesion.titulo}</h1>

      <div className="resumen__cuadritos">
        <Cuadritos
          estados={resultados.map((r) => (r.primerIntento ? 'pintado' : 'repasar'))}
          colores={resultados.map((r) => `var(--eje-${EJERCICIOS.find((e) => e.id === r.id).eje})`)}
          etiqueta={`${logrados} de ${total} correctas a la primera`}
        />
        <p>
          <strong>{logrados} de {total}</strong> correctas a la primera
        </p>
      </div>

      <p className="resumen__mensaje">{mensaje(logrados, total)}</p>

      {repasar.length > 0 && (
        <section className="repasar">
          <h2>Para repasar</h2>
          <ul>
            {repasar.map((e) => (
              <li key={e.id}>
                <p>{e.enunciado}</p>
                <p className="repasar__solucion">{e.solucion}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="resumen__acciones">
        <button type="button" className="boton boton--principal" onClick={onRepetir}>
          Practicar otra vez
        </button>
        <button type="button" className="boton boton--suave" onClick={onInicio}>
          Elegir otro tema
        </button>
      </div>
    </main>
  );
}
