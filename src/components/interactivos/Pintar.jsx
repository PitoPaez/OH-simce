import { useState } from 'react';
import { cajaFraccion, geometriaFraccion, ParteFraccion } from '../visuales/numeros.jsx';
import { BotonComprobar } from './Numero.jsx';

// Pintar una fracción tocando las partes de la figura.
// ejercicio: { forma, partes, enteros, objetivo }  (objetivo = partes a pintar)
export default function Pintar({ ejercicio, resuelto, onResponder }) {
  const { forma = 'circulo', partes, enteros = 1, objetivo } = ejercicio;
  const [pintadas, setPintadas] = useState(() => new Set());
  const geo = geometriaFraccion(forma, partes);
  const { ancho, alto } = cajaFraccion(forma);
  const separacion = 16;
  const total = enteros * ancho + (enteros - 1) * separacion;

  function alternar(indice) {
    if (resuelto) return;
    setPintadas((prev) => {
      const nuevo = new Set(prev);
      if (nuevo.has(indice)) nuevo.delete(indice);
      else nuevo.add(indice);
      return nuevo;
    });
  }

  return (
    <div className="pintar">
      <svg
        viewBox={`0 0 ${total} ${alto}`}
        className={forma === 'barra' ? 'pintar-svg' : enteros > 1 ? 'pintar-svg pintar-svg--varios' : 'pintar-svg pintar-svg--cuadrado'}
        role="group"
        aria-label={`Figura dividida en ${partes} partes iguales. Toca una parte para pintarla.`}
      >
        {Array.from({ length: enteros }, (_, e) => (
          <g key={e} transform={`translate(${e * (ancho + separacion)} 0)`}>
            {geo.map((parte, i) => {
              const indice = e * partes + i;
              const activa = pintadas.has(indice);
              return (
                <ParteFraccion
                  key={i}
                  parte={parte}
                  className={activa ? 'pintar-parte pintar-parte--activa' : 'pintar-parte'}
                  role="checkbox"
                  aria-checked={activa}
                  aria-label={`Parte ${i + 1}${enteros > 1 ? ` del entero ${e + 1}` : ''}`}
                  tabIndex={resuelto ? -1 : 0}
                  onClick={() => alternar(indice)}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter' || ev.key === ' ') {
                      ev.preventDefault();
                      alternar(indice);
                    }
                  }}
                />
              );
            })}
          </g>
        ))}
      </svg>
      <div className="interactivo-pie">
        <p className="pintar-cuenta" aria-live="polite">
          Pintaste <strong>{pintadas.size}</strong> {pintadas.size === 1 ? 'parte' : 'partes'}
        </p>
        <BotonComprobar
          disabled={resuelto || pintadas.size === 0}
          onClick={() =>
            onResponder({ correcta: pintadas.size === objetivo, clave: String(pintadas.size), valor: String(pintadas.size) })
          }
        />
      </div>
    </div>
  );
}
