import { useState } from 'react';
import { colorEje } from '../../data/ejes.js';
import Visual from '../visuales/Visual.jsx';
import Texto from '../ui/Texto.jsx';
import Leer from '../ui/Leer.jsx';
import IconoEje from '../ui/IconoEje.jsx';
import { PASOS } from './Pregunta.jsx';

// Ejemplo resuelto, un paso por pantalla (principios del ejemplo resuelto y
// de segmentación). Para quien recién empieza un tema, estudiar un ejemplo
// enseña más que resolver sin apoyo (Sweller, Teoría de la Carga Cognitiva).
// Quien ya sabe puede saltarlo (efecto de reversión por experticia).
export default function Ejemplo({ tema, onPracticar, onSalir }) {
  const [paso, setPaso] = useState(0);
  const { ejemplo } = tema;
  const actual = ejemplo.pasos[paso];
  const ultimo = paso === ejemplo.pasos.length - 1;
  const nombrePaso = PASOS.find((p) => p.id === actual.paso);

  return (
    <main className="pagina ejemplo" style={{ '--eje': colorEje(tema.eje) }}>
      <nav className="barra" aria-label="Ejemplo resuelto">
        <button type="button" className="boton boton--texto" onClick={onSalir}>
          Salir
        </button>
        <span className="barra-tema">
          <IconoEje eje={tema.eje} className="icono-eje icono-eje--chico" />
          {tema.nombre}
        </span>
        <button type="button" className="boton boton--texto" onClick={onPracticar}>
          Saltar el ejemplo
        </button>
      </nav>

      <p className="ejemplo-rotulo">Ejemplo resuelto</p>
      <div className="pregunta-enunciado">
        <h1>
          <Texto texto={ejemplo.enunciado} senalar={actual.paso === 'entender'} />
        </h1>
        <Leer texto={ejemplo.enunciado} compacto etiqueta="Escuchar el problema" />
      </div>

      <ol className="ejemplo-pasos" aria-label="Pasos">
        {ejemplo.pasos.map((_, i) => (
          <li key={i} className={i === paso ? 'ejemplo-chip ejemplo-chip--actual' : i < paso ? 'ejemplo-chip ejemplo-chip--hecho' : 'ejemplo-chip'} aria-current={i === paso ? 'step' : undefined}>
            <button type="button" onClick={() => setPaso(i)} aria-label={`Paso ${i + 1}`}>
              {i + 1}
            </button>
          </li>
        ))}
      </ol>

      <section className="ejemplo-paso" aria-live="polite">
        {actual.visual && <Visual visual={actual.visual} />}
        <div className="ejemplo-explicacion">
          {nombrePaso && <p className="ejemplo-nombre-paso">{nombrePaso.nombre}</p>}
          <p>
            <Texto texto={actual.texto} />
          </p>
          <Leer texto={actual.texto} compacto etiqueta="Escuchar este paso" />
        </div>
      </section>

      <div className="acciones-fila ejemplo-acciones">
        {paso > 0 && (
          <button type="button" className="boton boton--suave" onClick={() => setPaso(paso - 1)}>
            Paso anterior
          </button>
        )}
        {ultimo ? (
          <button type="button" className="boton boton--principal" onClick={onPracticar}>
            Ahora practica tú
          </button>
        ) : (
          <button type="button" className="boton boton--principal" onClick={() => setPaso(paso + 1)}>
            Siguiente paso
          </button>
        )}
      </div>
    </main>
  );
}
