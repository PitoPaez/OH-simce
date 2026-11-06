import { useState } from 'react';
import { f } from '../../lib/formato.js';
import { BotonComprobar } from './Numero.jsx';

// Ubicar un número en la recta tocando una marca. La mitad de los estudiantes
// de 4° básico cuenta las marcas en vez de los espacios entre ellas
// (Agencia de Calidad); por eso cada salto entre marcas se dibuja visible.
// ejercicio: { inicio, fin, paso, etiquetas, textos, objetivo }
export default function RectaInteractiva({ ejercicio, resuelto, onResponder }) {
  const { inicio, fin, paso, etiquetas = 'extremos', textos = {}, objetivo } = ejercicio;
  const [elegido, setElegido] = useState(null);
  const marcas = [];
  for (let v = inicio; v <= fin + 1e-9; v += paso) marcas.push(Math.round(v * 1000) / 1000);
  const texto = (v) => textos[v] ?? f(v);
  const conEtiqueta = (v) =>
    etiquetas === 'todas' || (etiquetas === 'extremos' && (v === inicio || v === fin)) || (Array.isArray(etiquetas) && etiquetas.includes(v));
  const pos = (v) => `${((v - inicio) / (fin - inicio)) * 100}%`;

  return (
    <div className="recta-int">
      <div className="recta-int-zona" role="radiogroup" aria-label="Marcas de la recta numérica">
        <div className="recta-int-linea" />
        {marcas.map((v, i) => {
          const activa = elegido === v;
          return (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={activa}
              aria-label={conEtiqueta(v) ? texto(v) : `Marca ${i + 1}`}
              className={activa ? 'recta-int-marca recta-int-marca--activa' : 'recta-int-marca'}
              style={{ left: pos(v) }}
              onClick={() => !resuelto && setElegido(v)}
              disabled={resuelto}
            >
              <span className="recta-int-palito" aria-hidden="true" />
              {activa && <span className="recta-int-punto" aria-hidden="true" />}
              {conEtiqueta(v) && <span className="recta-int-etq">{texto(v)}</span>}
            </button>
          );
        })}
      </div>
      <div className="interactivo-pie">
        <p className="recta-int-ayuda">{elegido === null ? 'Toca la marca donde va el número.' : 'Puedes cambiarla tocando otra marca.'}</p>
        <BotonComprobar
          disabled={resuelto || elegido === null}
          onClick={() => onResponder({ correcta: elegido === objetivo, clave: String(elegido), valor: texto(elegido) })}
        />
      </div>
    </div>
  );
}
