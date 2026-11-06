import { useState } from 'react';
import { f } from '../../lib/formato.js';
import { Balanza } from '../visuales/numeros.jsx';
import { BotonComprobar } from './Numero.jsx';

// Ecuaciones e inecuaciones con una balanza (representación que propone el
// programa de estudio para OA 14). El estudiante elige el valor de □ y ve
// cómo se inclina la balanza.
// ejercicio: { suma, derecha, relacion: '=' | '<' | '>', maximo }
//   lado izquierdo = □ + suma; lado derecho = derecha
export default function BalanzaInteractiva({ ejercicio, resuelto, onResponder }) {
  const { suma, derecha, relacion = '=', maximo = 100 } = ejercicio;
  const [valor, setValor] = useState(0);
  const izquierda = valor + suma;
  const diferencia = izquierda - derecha;
  const inclinacion = Math.max(-12, Math.min(12, (-diferencia / Math.max(derecha, 1)) * 30));

  const cumple = relacion === '=' ? diferencia === 0 : relacion === '<' ? diferencia < 0 : diferencia > 0;
  const estado = diferencia === 0 ? 'Está en equilibrio' : diferencia > 0 ? 'Pesa más el lado izquierdo' : 'Pesa más el lado derecho';

  function cambiar(delta) {
    setValor((v) => Math.min(maximo, Math.max(0, v + delta)));
  }

  return (
    <div className="balanza-int">
      <Balanza
        izquierda={[
          { tipo: 'caja', texto: f(valor) },
          { tipo: 'pesa', valor: f(suma) },
        ]}
        derecha={[{ tipo: 'pesa', valor: f(derecha) }]}
        inclinacion={inclinacion}
        etiqueta={`Balanza: a la izquierda ${valor} más ${suma}, a la derecha ${derecha}. ${estado}.`}
      />
      <p className="balanza-int-estado" aria-live="polite">
        {estado}
      </p>
      <div className="stepper" role="group" aria-label="Valor del cuadrado">
        <button type="button" className="boton-redondo boton-redondo--ancho" onClick={() => cambiar(-10)} disabled={resuelto}>
          −10
        </button>
        <button type="button" className="boton-redondo" onClick={() => cambiar(-1)} disabled={resuelto} aria-label="Restar 1">
          −1
        </button>
        <output className="stepper-valor" aria-label="Valor del cuadrado">
          □ = {f(valor)}
        </output>
        <button type="button" className="boton-redondo" onClick={() => cambiar(1)} disabled={resuelto} aria-label="Sumar 1">
          +1
        </button>
        <button type="button" className="boton-redondo boton-redondo--ancho" onClick={() => cambiar(10)} disabled={resuelto}>
          +10
        </button>
      </div>
      <div className="interactivo-pie interactivo-pie--centro">
        <BotonComprobar
          disabled={resuelto}
          onClick={() =>
            onResponder({
              correcta: cumple,
              clave: !cumple && diferencia === 0 ? 'igual' : String(valor),
              valor: f(valor),
            })
          }
        />
      </div>
    </div>
  );
}
