import { useState } from 'react';
import { f } from '../../lib/formato.js';
import { Balanza } from '../visuales/numeros.jsx';
import { BotonComprobar } from './Numero.jsx';
import './patrones.css';

const valorNumerico = (valor) => {
  const numero = Number.parseFloat(String(valor).replace(',', '.'));
  return Number.isFinite(numero) ? numero : 0;
};

export default function BalanzaPesas({ ejercicio, resuelto, onResponder }) {
  const visual = ejercicio.visual ?? {};
  const disponibles = visual.pesasDisponibles ?? [1, 5, 10];
  const [conteo, setConteo] = useState(() => Object.fromEntries(disponibles.map((peso) => [peso, 0])));
  const pesoAgregado = disponibles.reduce((total, peso) => total + peso * (conteo[peso] ?? 0), 0);
  const izquierdaBase = visual.izquierda ?? [];
  const derechaBase = visual.derecha ?? [];
  const sumaPesas = (items) => items.filter((item) => item.tipo === 'pesa').reduce((total, item) => total + valorNumerico(item.valor), 0);
  const editable = visual.platoEditable ?? 'izquierda';
  const izquierdaTotal = sumaPesas(izquierdaBase) + (editable === 'izquierda' ? pesoAgregado : 0);
  const derechaTotal = sumaPesas(derechaBase) + (editable === 'derecha' ? pesoAgregado : 0);
  const diferencia = izquierdaTotal - derechaTotal;
  // Inclinación positiva baja el plato derecho; negativa baja el izquierdo.
  const inclinacion = Math.max(-12, Math.min(12, (-diferencia / Math.max(izquierdaTotal, derechaTotal, 1)) * 30));
  const agregado = pesoAgregado > 0 ? [{ tipo: 'caja', texto: `+${f(pesoAgregado)}` }] : [];
  const izquierda = editable === 'izquierda' ? [...izquierdaBase, ...agregado] : izquierdaBase;
  const derecha = editable === 'derecha' ? [...derechaBase, ...agregado] : derechaBase;

  function ajustar(peso, delta) {
    if (resuelto) return;
    setConteo((actual) => ({ ...actual, [peso]: Math.max(0, (actual[peso] ?? 0) + delta) }));
  }

  const correcta = pesoAgregado === ejercicio.respuesta?.valorAgregado;
  const estado = diferencia === 0 ? 'Está en equilibrio' : diferencia > 0 ? 'Pesa más el lado izquierdo' : 'Pesa más el lado derecho';
  return (
    <div className="balanza-pesas">
      <Balanza izquierda={izquierda} derecha={derecha} inclinacion={inclinacion} etiqueta={`Balanza. ${estado}. Peso agregado ${pesoAgregado}.`} />
      <p className="balanza-int-estado" aria-live="polite">{estado}</p>
      <div className="balanza-pesas-controles" role="group" aria-label="Agregar o quitar pesas">
        {disponibles.map((peso) => <div className="balanza-pesa-control" key={peso}><button type="button" className="boton-redondo" disabled={resuelto || conteo[peso] === 0} onClick={() => ajustar(peso, -1)} aria-label={`Quitar una pesa de ${peso}`}>−</button><span>{conteo[peso]} × {peso}</span><button type="button" className="boton-redondo" disabled={resuelto} onClick={() => ajustar(peso, 1)} aria-label={`Agregar una pesa de ${peso}`}>+</button></div>)}
      </div>
      <p><strong>Peso agregado:</strong> {f(pesoAgregado)}</p>
      <div className="interactivo-pie interactivo-pie--centro"><BotonComprobar disabled={resuelto || pesoAgregado === 0} onClick={() => {
        const error = ejercicio.erroresFrecuentes?.find((regla) => regla.valorAgregado === pesoAgregado)?.error;
        onResponder({ correcta, clave: String(pesoAgregado), valor: f(pesoAgregado), error });
      }} /></div>
    </div>
  );
}
