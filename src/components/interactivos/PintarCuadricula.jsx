import { useState } from 'react';
import { BotonComprobar } from './Numero.jsx';

// Pintar cuadrados en una cuadrícula.
// modo 'area':     formar un rectángulo con el área (o el perímetro) pedido.
//                  Hay varias respuestas correctas (tarea de "piso bajo y
//                  techo alto", Mindset Mathematics).
// modo 'simetria': completar la figura al otro lado del eje (OA 17).
// ejercicio: { modo, columnas, filas, area?, perimetro?, fijas?: [[x, y]], ejeSimetria?: x }
//   ejeSimetria: la línea queda entre la columna ejeSimetria - 1 y ejeSimetria.
const clave = (x, y) => `${x},${y}`;

export function esRectanguloLleno(celdas) {
  if (celdas.length === 0) return null;
  const xs = celdas.map(([x]) => x);
  const ys = celdas.map(([, y]) => y);
  const ancho = Math.max(...xs) - Math.min(...xs) + 1;
  const alto = Math.max(...ys) - Math.min(...ys) + 1;
  return ancho * alto === celdas.length ? { ancho, alto } : null;
}

export default function PintarCuadricula({ ejercicio, resuelto, onResponder }) {
  const { modo = 'area', columnas = 8, filas = 6, area, perimetro, fijas = [], ejeSimetria: eje } = ejercicio;
  const [pintadas, setPintadas] = useState(() => new Set());
  const fijasSet = new Set(fijas.map(([x, y]) => clave(x, y)));

  function alternar(x, y) {
    if (resuelto || fijasSet.has(clave(x, y))) return;
    setPintadas((prev) => {
      const nuevo = new Set(prev);
      const k = clave(x, y);
      if (nuevo.has(k)) nuevo.delete(k);
      else nuevo.add(k);
      return nuevo;
    });
  }

  function comprobar() {
    const celdas = [...pintadas].map((k) => k.split(',').map(Number));
    if (modo === 'area' && perimetro) {
      const rect = esRectanguloLleno(celdas);
      const borde = rect ? 2 * (rect.ancho + rect.alto) : 0;
      if (rect && borde === perimetro) onResponder({ correcta: true, clave: 'ok', valor: '', extra: rect });
      else onResponder({ correcta: false, clave: rect ? 'otroPerimetro' : 'noRectangulo', valor: String(borde) });
      return;
    }
    if (modo === 'area') {
      const rect = esRectanguloLleno(celdas);
      if (rect && celdas.length === area) {
        onResponder({ correcta: true, clave: 'ok', valor: `${rect.ancho} × ${rect.alto}`, extra: rect });
      } else if (!rect) {
        onResponder({ correcta: false, clave: 'noRectangulo', valor: String(celdas.length) });
      } else {
        onResponder({ correcta: false, clave: 'otraArea', valor: String(celdas.length) });
      }
      return;
    }
    // simetría: lo pintado debe ser el reflejo exacto de las celdas fijas.
    const esperado = new Set(fijas.map(([x, y]) => clave(2 * eje - 1 - x, y)));
    const iguales = esperado.size === pintadas.size && [...esperado].every((k) => pintadas.has(k));
    if (iguales) onResponder({ correcta: true, clave: 'ok', valor: '' });
    else {
      const ladoEquivocado = celdas.some(([x]) => x < eje);
      // "Copiada": la figura se trasladó en vez de reflejarse, como un timbre.
      const dx = Math.min(...celdas.map(([x]) => x)) - Math.min(...fijas.map(([x]) => x));
      const copiada = celdas.length === fijas.length && fijas.every(([x, y]) => pintadas.has(clave(x + dx, y)));
      onResponder({
        correcta: false,
        clave: ladoEquivocado ? 'ladoEquivocado' : copiada ? 'copiada' : 'noEspejo',
        valor: String(pintadas.size),
      });
    }
  }

  return (
    <div className="pintar-cuadricula">
      <div className="pc-grilla" style={{ '--columnas': columnas }} role="grid" aria-label="Cuadrícula para pintar">
        {Array.from({ length: filas }, (_, y) => (
          <div key={y} role="row" className="pc-fila">
            {Array.from({ length: columnas }, (_, x) => {
              const k = clave(x, y);
              const fija = fijasSet.has(k);
              const activa = pintadas.has(k);
              return (
                <button
                  key={x}
                  type="button"
                  role="gridcell"
                  className={['pc-celda', fija && 'pc-celda--fija', activa && 'pc-celda--activa', eje !== undefined && x === eje - 1 && 'pc-celda--antes-eje'].filter(Boolean).join(' ')}
                  aria-label={`Fila ${y + 1}, columna ${x + 1}${fija ? ', ya pintado' : ''}`}
                  aria-pressed={fija || activa}
                  onClick={() => alternar(x, y)}
                  disabled={resuelto || fija}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="interactivo-pie">
        <p className="pintar-cuenta" aria-live="polite">
          {modo === 'area' ? (
            <>
              Pintaste <strong>{pintadas.size}</strong> {pintadas.size === 1 ? 'cuadrado' : 'cuadrados'}
            </>
          ) : (
            'Pinta al otro lado de la línea roja.'
          )}
        </p>
        <BotonComprobar disabled={resuelto || pintadas.size === 0} onClick={comprobar} />
      </div>
    </div>
  );
}
