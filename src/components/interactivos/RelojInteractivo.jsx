import { useState } from 'react';
import { Reloj } from '../visuales/medicion.jsx';
import { BotonComprobar } from './Numero.jsx';

// Mover las manecillas. El horario avanza solo cuando avanzan los minutos,
// como en un reloj real (uno de cada cuatro estudiantes confunde las manecillas).
// ejercicio: { inicio: { hora, minutos }, objetivo: { hora, minutos } }
export default function RelojInteractivo({ ejercicio, resuelto, onResponder }) {
  const [total, setTotal] = useState(ejercicio.inicio.hora * 60 + ejercicio.inicio.minutos);
  const hora = Math.floor(total / 60) % 12 || 12;
  const minutos = total % 60;
  const mover = (delta) => setTotal((t) => (t + delta + 720) % 720);
  const texto = `${hora}:${String(minutos).padStart(2, '0')}`;
  const objetivo = ejercicio.objetivo;

  return (
    <div className="reloj-int">
      <Reloj hora={hora} minutos={minutos} />
      <div className="reloj-int-controles">
        <div className="stepper" role="group" aria-label="Manecilla corta: la hora">
          <span className="stepper-titulo">Hora</span>
          <button type="button" className="boton-redondo" onClick={() => mover(-60)} disabled={resuelto} aria-label="Una hora menos">
            −1
          </button>
          <button type="button" className="boton-redondo" onClick={() => mover(60)} disabled={resuelto} aria-label="Una hora más">
            +1
          </button>
        </div>
        <div className="stepper" role="group" aria-label="Manecilla larga: los minutos">
          <span className="stepper-titulo">Minutos</span>
          <button type="button" className="boton-redondo" onClick={() => mover(-5)} disabled={resuelto} aria-label="Cinco minutos menos">
            −5
          </button>
          <button type="button" className="boton-redondo" onClick={() => mover(5)} disabled={resuelto} aria-label="Cinco minutos más">
            +5
          </button>
        </div>
      </div>
      <div className="interactivo-pie interactivo-pie--centro">
        <BotonComprobar
          disabled={resuelto}
          onClick={() =>
            onResponder({
              correcta: hora === (objetivo.hora % 12 || 12) && minutos === objetivo.minutos,
              clave: texto,
              valor: texto,
            })
          }
        />
      </div>
    </div>
  );
}
