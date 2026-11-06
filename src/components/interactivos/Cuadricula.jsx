import { useState } from 'react';
import { IconoMapa, LETRAS } from '../visuales/geometria.jsx';
import { BotonComprobar } from './Numero.jsx';

// Mapa cuadriculado con coordenadas informales (letra = columna, número = fila).
// modo 'ubicar': tocar la casilla pedida.
// modo 'mover':  trasladar un objeto con flechas (OA 18). Uno de cada cinco
//                estudiantes confunde izquierda y derecha (Agencia de Calidad).
// ejercicio: { modo, columnas, filas, objetivo: 'C4', inicio?: 'E1', icono, fijos?: [{ col, fila, icono }] }
const nombre = (c, f) => `${LETRAS[c]}${f}`;

function Celdas({ columnas, filas, renderCelda }) {
  return (
    <div className="cuadricula-mapa" style={{ '--columnas': columnas }}>
      {Array.from({ length: filas }, (_, i) => {
        const fila = filas - i;
        return (
          <div key={fila} className="cuadricula-fila" role="row">
            <span className="cuadricula-num" role="rowheader">
              {fila}
            </span>
            {Array.from({ length: columnas }, (_, c) => renderCelda(c, fila))}
          </div>
        );
      })}
      <div className="cuadricula-fila cuadricula-fila--letras" aria-hidden="true">
        <span className="cuadricula-num" />
        {LETRAS.slice(0, columnas).map((l) => (
          <span key={l} className="cuadricula-letra">
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

function Ficha({ icono }) {
  return (
    <svg viewBox="0 0 40 40" className="cuadricula-ficha" aria-hidden="true">
      <IconoMapa tipo={icono} cx={20} cy={20} r={14} />
    </svg>
  );
}

export default function Cuadricula({ ejercicio, resuelto, onResponder }) {
  const { modo = 'ubicar', columnas = 5, filas = 5, objetivo, inicio, icono = 'estrella', fijos = [] } = ejercicio;
  const desde = inicio ? { c: LETRAS.indexOf(inicio[0]), f: Number(inicio.slice(1)) } : null;
  const [pos, setPos] = useState(desde);
  const fijoEn = (c, f) => fijos.find((o) => o.col === LETRAS[c] && o.fila === f);

  function mover(dc, df) {
    setPos((p) => ({ c: Math.min(columnas - 1, Math.max(0, p.c + dc)), f: Math.min(filas, Math.max(1, p.f + df)) }));
  }

  return (
    <div className="cuadricula">
      <Celdas
        columnas={columnas}
        filas={filas}
        renderCelda={(c, f) => {
          const aqui = pos && pos.c === c && pos.f === f;
          const origen = modo === 'mover' && desde && desde.c === c && desde.f === f && !aqui;
          const fijo = fijoEn(c, f);
          if (modo === 'ubicar') {
            return (
              <button
                key={c}
                type="button"
                className={aqui ? 'cuadricula-celda cuadricula-celda--activa' : 'cuadricula-celda'}
                aria-label={`Casilla ${nombre(c, f)}`}
                aria-pressed={aqui}
                onClick={() => !resuelto && setPos({ c, f })}
                disabled={resuelto}
              >
                {fijo && <Ficha icono={fijo.icono} />}
                {aqui && <Ficha icono={icono} />}
              </button>
            );
          }
          return (
            <span key={c} className={origen ? 'cuadricula-celda cuadricula-celda--origen' : 'cuadricula-celda'} role="cell">
              {aqui && <Ficha icono={icono} />}
              {origen && <span className="visualmente-oculto">Posición inicial</span>}
            </span>
          );
        }}
      />
      {modo === 'mover' && (
        <div className="flechas" role="group" aria-label="Mover la figura">
          <button type="button" className="boton-redondo flecha flecha--arriba" onClick={() => mover(0, 1)} disabled={resuelto} aria-label="Mover hacia arriba">
            ↑
          </button>
          <button type="button" className="boton-redondo flecha flecha--izq" onClick={() => mover(-1, 0)} disabled={resuelto} aria-label="Mover hacia la izquierda">
            ←
          </button>
          <button type="button" className="boton-redondo flecha flecha--der" onClick={() => mover(1, 0)} disabled={resuelto} aria-label="Mover hacia la derecha">
            →
          </button>
          <button type="button" className="boton-redondo flecha flecha--abajo" onClick={() => mover(0, -1)} disabled={resuelto} aria-label="Mover hacia abajo">
            ↓
          </button>
          <button type="button" className="boton boton--texto flecha-reiniciar" onClick={() => setPos(desde)} disabled={resuelto}>
            Volver al inicio
          </button>
        </div>
      )}
      <div className="interactivo-pie">
        <p className="cuadricula-estado" aria-live="polite">
          {pos ? (
            <>
              {modo === 'mover' ? 'Está en' : 'Elegiste'} <strong>{nombre(pos.c, pos.f)}</strong>
            </>
          ) : (
            'Toca una casilla.'
          )}
        </p>
        <BotonComprobar
          disabled={resuelto || !pos || (modo === 'mover' && pos.c === desde.c && pos.f === desde.f)}
          onClick={() => {
            const clave = nombre(pos.c, pos.f);
            onResponder({ correcta: clave === objetivo, clave, valor: clave });
          }}
        />
      </div>
    </div>
  );
}
