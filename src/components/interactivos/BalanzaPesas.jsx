import { useState } from 'react';
import { f } from '../../lib/formato.js';
import { Balanza } from '../visuales/numeros.jsx';
import { BotonComprobar } from './Numero.jsx';

// Construye el peso agregado con las pesas disponibles. Reutiliza el visual
// Balanza existente, por lo que el dato no necesita un componente visual nuevo.
export default function BalanzaPesas({ ejercicio, resuelto, onResponder }) {
  const visual = ejercicio.visual ?? {};
  const disponibles = visual.pesasDisponibles ?? [1, 5, 10];
  const [conteo, setConteo] = useState(() => Object.fromEntries(disponibles.map((peso) => [peso, 0])));
  const pesoAgregado = disponibles.reduce((total, peso) => total + peso * (conteo[peso] ?? 0), 0);

  const pesosIzquierda = visual.izquierda ?? [];
  const pesosDerecha = visual.derecha ?? [];
  const baseIzquierda = pesosIzquierda.filter((item) => item.tipo === 'pesa').reduce((total, item) => total + Number(item.valor), 0);
  const baseDerecha = pesosDerecha.filter((item) => item.tipo === 'pesa').reduce((total, item) => total + Number(item.valor), 0);
  const editable = visual.platoEditable ?? 'izquierda';
  const izquierdaActual = baseIzquierda + (editable === 'izquierda' ? pesoAgregado : 0);
  const derechaActual = baseDerecha + (editable === 'derecha' ? pesoAgregado : 0);
  const diferencia = izquierdaActual - derechaActual;
  const inclinacion = Math.max(-12, Math.min(12, (-diferencia / Math.max(Math.max(izquierdaActual, derechaActual), 1)) * 30));

  function ajustar(peso, delta) {
    if (resuelto) return;
    setConteo((actual) => ({ ...actual, [peso]: Math.max(0, (actual[peso] ?? 0) + delta) }));
  }

  const correcta = pesoAgregado === ejercicio.respuesta?.valorAgregado;

  return (
    <div className="balanza-pesas">
      <Balanza
        izquierda={pesosIzquierda.map((item) => editable === 'izquierda' && item === pesosIzquierda[0] ? item : item)}
        derecha={pesosDerecha.map((item) => item)}
        inclinacion={inclinacion}
        etiqueta={`Balanza en construcción. Peso agregado ${pesoAgregado}.`}
      />
      <p className="balanza-int-estado" aria-live="polite">
        {diferencia === 0 ? 'Está en equilibrio' : diferencia > 0 ? 'Pesa más el lado izquierdo' : 'Pesa más el lado derecho'}
      </p>
      <div className="balanza-pesas-controles" role="group" aria-label="Agregar pesas">
        {disponibles.map((peso) => (
          <div className="balanza-pesa-control" key={peso}>
            <button type="button" className="boton-redondo" disabled={resuelto || (conteo[peso] ?? 0) === 0} onClick={() => ajustar(peso, -1)} aria-label={`Quitar una pesa de ${peso}`}>−</button>
            <span>{conteo[peso] ?? 0} × {peso}</span>
            <button type="button" className="boton-redondo" disabled={resuelto} onClick={() => ajustar(peso, 1)} aria-label={`Agregar una pesa de ${peso}`}>+</button>
          </div>
        ))}
      </div>
      <p><strong>Peso agregado:</strong> {f(pesoAgregado)}</p>
      <div className="interactivo-pie interactivo-pie--centro">
        <BotonComprobar
          disabled={resuelto}
          onClick={() => {
            const error = ejercicio.erroresFrecuentes?.find((e) => e.valorAgregado === pesoAgregado)?.error;
            onResponder({ correcta, clave: String(pesoAgregado), valor: f(pesoAgregado), error });
          }}
        />
      </div>
    </div>
  );
}
