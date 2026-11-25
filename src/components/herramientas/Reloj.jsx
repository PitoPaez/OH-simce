import { useRef, useState } from 'react';
import { useArrastre } from './comun.js';

// Reloj de manecillas para poner una hora. visual:
//   inicio   hora que marca al comienzo, por ejemplo '12:00'
// Responde la hora marcada, por ejemplo '10:15' (horas de 1 a 12).
//
// Funciona como un reloj de verdad: se arrastra la manecilla larga y la corta
// avanza sola. Así, a las 5:45 la corta queda casi en el 6, como debe ser.

const VUELTA = 12 * 60; // minutos que tarda la manecilla corta en dar la vuelta

const aMinutos = (hora) => {
  const [h, m] = hora.split(':').map(Number);
  return ((h % 12) * 60 + m) % VUELTA;
};
const aHora = (minutos) => `${Math.floor(minutos / 60) || 12}:${String(minutos % 60).padStart(2, '0')}`;
const ajustar = (minutos) => ((minutos % VUELTA) + VUELTA) % VUELTA;

export default function Reloj({ visual, bloqueado, onResponder }) {
  const [minutos, setMinutos] = useState(aMinutos(visual.inicio ?? '12:00'));
  const svgRef = useRef(null);

  // La manecilla larga salta de 5 en 5 minutos; si pasa por el 12, cambia la hora.
  const arrastre = useArrastre(
    svgRef,
    ({ x, y }) => {
      const angulo = ((Math.atan2(x, -y) * 180) / Math.PI + 360) % 360;
      const nuevo = (Math.round(angulo / 30) * 5) % 60;
      setMinutos((prev) => {
        let diferencia = nuevo - (prev % 60);
        if (diferencia < -30) diferencia += 60;
        if (diferencia > 30) diferencia -= 60;
        return ajustar(prev + diferencia);
      });
    },
    !bloqueado,
  );

  const sumar = (diferencia) => setMinutos((prev) => ajustar(prev + diferencia));

  return (
    <>
      <svg ref={svgRef} viewBox="-140 -140 280 280" className="herramienta__dibujo reloj" aria-hidden="true">
        <circle r={130} className="reloj__borde" />
        <circle r={124} className="reloj__cara" />
        {Array.from({ length: 60 }, (_, i) => (
          <line key={i} y1={-122} y2={i % 5 === 0 ? -110 : -116} transform={`rotate(${i * 6})`} className="reloj__marca" />
        ))}
        {Array.from({ length: 12 }, (_, i) => {
          const a = ((i + 1) * Math.PI) / 6;
          return (
            <text key={i} x={Math.sin(a) * 92} y={-Math.cos(a) * 92 + 8} className="reloj__numero">
              {i + 1}
            </text>
          );
        })}
        <line y1={12} y2={-62} transform={`rotate(${(minutos / VUELTA) * 360})`} className="reloj__corta" />
        <g transform={`rotate(${(minutos % 60) * 6})`} className={bloqueado ? undefined : 'movible'} {...arrastre}>
          <line y1={12} y2={-100} className="reloj__larga" />
          <line y2={-100} className="reloj__agarre" />
        </g>
        <circle r={7} className="reloj__centro" />
      </svg>
      <p className="herramienta__ayuda">Arrastra la manecilla larga. La corta avanza sola, como en un reloj de verdad.</p>
      <div className="herramienta__controles">
        {[
          [-60, '−1 hora'],
          [60, '+1 hora'],
          [-5, '−5 min'],
          [5, '+5 min'],
        ].map(([diferencia, texto]) => (
          <button key={texto} type="button" className="boton boton--suave" onClick={() => sumar(diferencia)} disabled={bloqueado}>
            {texto}
          </button>
        ))}
      </div>
      <button type="button" className="boton boton--principal" onClick={() => onResponder(aHora(minutos))} disabled={bloqueado}>
        Comprobar
      </button>
    </>
  );
}
