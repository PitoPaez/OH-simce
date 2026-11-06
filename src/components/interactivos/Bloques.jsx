import { useState } from 'react';
import { f } from '../../lib/formato.js';
import { BotonComprobar } from './Numero.jsx';

// Bloques base 10 (material concreto en pantalla). El número que se forma se
// muestra en símbolos junto a los bloques: así se conecta lo pictórico con
// lo simbólico (COPISI).
const COLUMNAS = [
  { id: 'um', nombre: 'Unidades de mil', singular: 'una unidad de mil', corto: 'UM', valor: 1000 },
  { id: 'c', nombre: 'Centenas', singular: 'una centena', corto: 'C', valor: 100 },
  { id: 'd', nombre: 'Decenas', singular: 'una decena', corto: 'D', valor: 10 },
  { id: 'u', nombre: 'Unidades', singular: 'una unidad', corto: 'U', valor: 1 },
];

function Bloque({ tipo, i }) {
  if (tipo === 'um') {
    return (
      <svg viewBox="0 0 40 40" className="bloque bloque--um" aria-hidden="true" style={{ '--i': i }}>
        <polygon points="4,12 16,4 36,4 24,12" className="bloque-arriba" />
        <polygon points="24,12 36,4 36,26 24,36" className="bloque-lado" />
        <rect x="4" y="12" width="20" height="24" className="bloque-frente" />
      </svg>
    );
  }
  if (tipo === 'c') {
    return (
      <svg viewBox="0 0 40 40" className="bloque bloque--c" aria-hidden="true">
        <rect x="2" y="2" width="36" height="36" className="bloque-frente" />
        <path d="M2 14h36M2 26h36M14 2v36M26 2v36" className="bloque-lineas" />
      </svg>
    );
  }
  if (tipo === 'd') {
    return (
      <svg viewBox="0 0 10 50" className="bloque bloque--d" aria-hidden="true">
        <rect x="1" y="1" width="8" height="48" className="bloque-frente" />
        <path d="M1 10.6h8M1 20.2h8M1 29.8h8M1 39.4h8" className="bloque-lineas" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 12 12" className="bloque bloque--u" aria-hidden="true">
      <rect x="1" y="1" width="10" height="10" className="bloque-frente" />
    </svg>
  );
}

export default function Bloques({ ejercicio, resuelto, onResponder }) {
  const [cantidad, setCantidad] = useState({ um: 0, c: 0, d: 0, u: 0 });
  const total = COLUMNAS.reduce((s, col) => s + cantidad[col.id] * col.valor, 0);

  function cambiar(id, delta) {
    setCantidad((prev) => ({ ...prev, [id]: Math.min(9, Math.max(0, prev[id] + delta)) }));
  }

  return (
    <div className="bloques">
      <div className="bloques-tablero">
        {COLUMNAS.map((col) => (
          <section key={col.id} className={`bloques-col bloques-col--${col.id}`} aria-label={col.nombre}>
            <h3 className="bloques-titulo">
              <abbr title={col.nombre}>{col.corto}</abbr>
            </h3>
            <div className="bloques-pila">
              {Array.from({ length: cantidad[col.id] }, (_, i) => (
                <Bloque key={i} tipo={col.id} i={i} />
              ))}
            </div>
            <p className="bloques-cuenta" aria-live="polite">
              {cantidad[col.id]}
            </p>
            <div className="bloques-botones">
              <button
                type="button"
                className="boton-redondo"
                onClick={() => cambiar(col.id, -1)}
                disabled={resuelto || cantidad[col.id] === 0}
                aria-label={`Quitar ${col.singular}`}
              >
                −
              </button>
              <button
                type="button"
                className="boton-redondo"
                onClick={() => cambiar(col.id, 1)}
                disabled={resuelto || cantidad[col.id] === 9}
                aria-label={`Agregar ${col.singular}`}
              >
                +
              </button>
            </div>
          </section>
        ))}
      </div>
      <div className="interactivo-pie">
        <p className="bloques-total">
          Formaste el número <strong>{f(total)}</strong>
        </p>
        <BotonComprobar
          disabled={resuelto}
          onClick={() => onResponder({ correcta: total === ejercicio.objetivo, clave: String(total), valor: f(total) })}
        />
      </div>
    </div>
  );
}
