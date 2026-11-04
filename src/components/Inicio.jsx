import { EJES, EJERCICIOS } from '../data/ejercicios.js';
import Cuadritos from './Cuadritos.jsx';

export default function Inicio({ dominados, onElegirEje, onPracticaMixta }) {
  return (
    <main className="pagina inicio">
      <header className="inicio__encabezado">
        <p className="marca">OH Simce <span>Matemática 4° básico</span></p>
        <h1>¿Qué quieres practicar hoy?</h1>
        <p className="inicio__intro">
          Elige un tema y responde con calma. Si te equivocas, te mostramos dónde
          estuvo el error para que lo intentes otra vez.
        </p>
      </header>

      <ul className="indice">
        {EJES.map((eje) => {
          const ejercicios = EJERCICIOS.filter((e) => e.eje === eje.id);
          const logrados = ejercicios.filter((e) => dominados[e.id]).length;
          return (
            <li key={eje.id}>
              <button
                type="button"
                className="indice__fila"
                style={{ '--eje': `var(--eje-${eje.id})` }}
                onClick={() => onElegirEje(eje.id)}
              >
                <span className="indice__papel" aria-hidden="true" />
                <span className="indice__texto">
                  <span className="indice__nombre">{eje.nombre}</span>
                  <span className="indice__desc">{eje.descripcion}</span>
                </span>
                <span className="indice__progreso">
                  <Cuadritos
                    estados={ejercicios.map((_, i) => (i < logrados ? 'pintado' : 'vacio'))}
                    etiqueta={`${logrados} de ${ejercicios.length} ejercicios logrados`}
                  />
                  <span className="indice__cuenta">
                    {logrados} de {ejercicios.length}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <section className="mixta">
        <div>
          <h2>Práctica mixta</h2>
          <p>
            Preguntas de todos los temas mezclados, como en el SIMCE. Mezclar temas
            te ayuda a recordar mejor.
          </p>
        </div>
        <button type="button" className="boton boton--principal" onClick={onPracticaMixta}>
          Empezar práctica mixta
        </button>
      </section>
    </main>
  );
}
