import { useMemo, useState } from 'react';
import { f } from '../../lib/formato.js';
import { Grafico } from '../visuales/datos.jsx';
import { ConFracciones } from '../ui/Texto.jsx';
import { BotonComprobar } from './Numero.jsx';

// Completar la barra que falta en un gráfico (OA 25 y 27).
// ejercicio: { grafico: { titulo, datos, max, paso }, faltante: índice, respuesta }
export function BarraGrafico({ ejercicio, resuelto, onResponder }) {
  const { grafico, faltante, respuesta } = ejercicio;
  const [valor, setValor] = useState(0);
  const max = grafico.max;
  const cambiar = (d) => setValor((v) => Math.min(max, Math.max(0, v + d)));
  const etiqueta = grafico.datos[faltante].etiqueta;
  return (
    <div className="barra-int">
      <Grafico {...grafico} editable={faltante} valorEditable={valor} />
      <div className="stepper" role="group" aria-label={`Altura de la barra de ${etiqueta}`}>
        <span className="stepper-titulo">{etiqueta}</span>
        <button type="button" className="boton-redondo" onClick={() => cambiar(-1)} disabled={resuelto} aria-label="Bajar 1">
          −1
        </button>
        <output className="stepper-valor">{f(valor)}</output>
        <button type="button" className="boton-redondo" onClick={() => cambiar(1)} disabled={resuelto} aria-label="Subir 1">
          +1
        </button>
      </div>
      <div className="interactivo-pie interactivo-pie--centro">
        <BotonComprobar
          disabled={resuelto}
          onClick={() => onResponder({ correcta: valor === respuesta, clave: String(valor), valor: f(valor) })}
        />
      </div>
    </div>
  );
}

// Ordenar tocando los elementos en orden (más fácil que arrastrar en una
// tablet y se puede hacer con el teclado).
// ejercicio: { elementos: [{ texto, detalle }] } en el orden correcto.
export function Ordenar({ ejercicio, resuelto, onResponder }) {
  const { elementos, ranuras } = ejercicio;
  const mezclados = useMemo(() => {
    // Orden fijo pero distinto del correcto y del inverso: se rota por la mitad.
    const indices = elementos.map((_, i) => i);
    const k = Math.ceil(indices.length / 2);
    return [...indices.slice(k), ...indices.slice(0, k)];
  }, [elementos]);
  const [secuencia, setSecuencia] = useState([]);

  const poner = (i) => !resuelto && setSecuencia((s) => (s.includes(i) ? s : [...s, i]));
  const sacar = (i) => !resuelto && setSecuencia((s) => s.filter((x) => x !== i));

  function comprobar() {
    const correcta = secuencia.every((v, i) => v === i);
    const alReves = secuencia.every((v, i) => v === elementos.length - 1 - i);
    onResponder({ correcta, clave: correcta ? 'ok' : alReves ? 'alReves' : 'otro', valor: '' });
  }

  return (
    <div className="ordenar">
      <ol className="ordenar-ranuras">
        {elementos.map((_, pos) => {
          const i = secuencia[pos];
          return (
            <li key={pos} className="ordenar-ranura">
              <span className="ordenar-pos">{ranuras?.[pos] ?? `${pos + 1}°`}</span>
              {i !== undefined ? (
                <button type="button" className="ordenar-ficha ordenar-ficha--puesta" onClick={() => sacar(i)} disabled={resuelto}>
                  <span>
                    <ConFracciones texto={elementos[i].texto} />
                  </span>
                  {elementos[i].detalle && <span className="ordenar-detalle">{elementos[i].detalle}</span>}
                  <span className="visualmente-oculto"> (toca para sacar)</span>
                </button>
              ) : (
                <span className="ordenar-vacia" />
              )}
            </li>
          );
        })}
      </ol>
      <div className="ordenar-disponibles" role="group" aria-label="Elementos para ordenar">
        {mezclados.map((i) =>
          secuencia.includes(i) ? null : (
            <button key={i} type="button" className="ordenar-ficha" onClick={() => poner(i)} disabled={resuelto}>
              <span>
                <ConFracciones texto={elementos[i].texto} />
              </span>
              {elementos[i].detalle && <span className="ordenar-detalle">{elementos[i].detalle}</span>}
            </button>
          ),
        )}
      </div>
      <div className="interactivo-pie">
        <button type="button" className="boton boton--texto" onClick={() => setSecuencia([])} disabled={resuelto || secuencia.length === 0}>
          Empezar de nuevo
        </button>
        <BotonComprobar disabled={resuelto || secuencia.length < elementos.length} onClick={comprobar} />
      </div>
    </div>
  );
}
