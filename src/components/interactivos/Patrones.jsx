import { useState } from 'react';
import { f, leerNumero } from '../../lib/formato.js';
import { BotonComprobar } from './Numero.jsx';
import './patrones.css';

function erroresDe(ejercicio, entradas) {
  return ejercicio.erroresFrecuentes?.find((regla) => {
    if (regla.cuando) {
      return Object.entries(regla.cuando).every(([indice, valor]) => entradas[indice] === valor);
    }
    return Object.entries(entradas).length === 1 && entradas[0] === regla.valor;
  })?.error;
}

export default function Completar({ ejercicio, resuelto, onResponder }) {
  const respuesta = ejercicio.respuesta;
  const campos = respuesta?.campos ?? (respuesta ? [{ indice: 0, valor: respuesta.valor ?? respuesta }] : []);
  const [valores, setValores] = useState(() => Object.fromEntries(campos.map((campo) => [campo.indice ?? 0, ''])));
  const completos = campos.length > 0 && campos.every((campo) => leerNumero(valores[campo.indice ?? 0]) !== null);

  function comprobar() {
    const entradas = Object.fromEntries(campos.map((campo) => {
      const indice = campo.indice ?? 0;
      return [indice, leerNumero(valores[indice])];
    }));
    const correcta = campos.every((campo) => entradas[campo.indice ?? 0] === campo.valor);
    const clave = campos.map((campo) => `${campo.etiqueta ?? campo.indice ?? ''}:${entradas[campo.indice ?? 0]}`).join('|');
    onResponder({ correcta, clave, valor: campos.map((campo) => f(entradas[campo.indice ?? 0])).join(', '), entradas, error: erroresDe(ejercicio, entradas) });
  }

  return (
    <div className="patrones-completar">
      {campos.map((campo) => {
        const indice = campo.indice ?? 0;
        return <label className="patrones-campo" key={indice}><span>{campo.etiqueta ?? 'Número que falta'}</span><input type="text" inputMode="decimal" autoComplete="off" value={valores[indice]} disabled={resuelto} onChange={(event) => setValores((actual) => ({ ...actual, [indice]: event.target.value.replace(/[^\d.,\s-]/g, '') }))} /></label>;
      })}
      <div className="interactivo-pie"><BotonComprobar disabled={resuelto || !completos} onClick={comprobar} /></div>
    </div>
  );
}

export function ClicSecuencia({ ejercicio, resuelto, onResponder }) {
  const valores = ejercicio.visual?.valores ?? [];
  const [indice, setIndice] = useState(null);
  return (
    <div className="patrones-clic-secuencia">
      <ol className="v-secuencia" aria-label="Secuencia; selecciona el término equivocado">
        {valores.map((valor, i) => <li key={i} className="v-secuencia-item"><button type="button" disabled={resuelto} aria-pressed={indice === i} className={indice === i ? 'v-secuencia-caja v-secuencia-caja--activa' : 'v-secuencia-caja'} onClick={() => setIndice(i)}>{valor === null ? '?' : f(valor)}</button></li>)}
      </ol>
      <div className="interactivo-pie"><BotonComprobar disabled={resuelto || indice === null} onClick={() => {
        const valor = valores[indice];
        const error = ejercicio.erroresFrecuentes?.find((regla) => regla.valor === valor)?.error;
        onResponder({ correcta: indice === ejercicio.respuesta?.indice, clave: String(indice), valor: String(valor ?? indice), error });
      }} /></div>
    </div>
  );
}

const COLORES = { rojo: '#d9534f', azul: '#4a72b2', amarillo: '#e6b800', verde: '#4c9b54' };

export function ClicColor({ ejercicio, resuelto, onResponder }) {
  const [color, setColor] = useState(null);
  const disponibles = ejercicio.visual?.coloresDisponibles ?? Object.keys(COLORES);
  return (
    <div className="patrones-color">
      <div className="patrones-color-opciones" role="radiogroup" aria-label="Colores disponibles">
        {disponibles.map((nombre) => <button key={nombre} type="button" role="radio" aria-checked={color === nombre} disabled={resuelto} className={color === nombre ? 'patrones-color-opcion patrones-color-opcion--activa' : 'patrones-color-opcion'} onClick={() => setColor(nombre)}><span className="patrones-color-muestra" style={{ backgroundColor: COLORES[nombre] ?? '#888' }} aria-hidden="true" />{nombre}</button>)}
      </div>
      <div className="interactivo-pie"><BotonComprobar disabled={resuelto || color === null} onClick={() => onResponder({ correcta: color === ejercicio.respuesta?.valor, clave: color, valor: color, error: ejercicio.erroresFrecuentes?.find((regla) => regla.valor === color)?.error })} /></div>
    </div>
  );
}

export function TableroInteractivo({ ejercicio, resuelto, onResponder }) {
  const visual = ejercicio.visual ?? {};
  const maximo = visual.seleccionMax ?? ejercicio.respuesta?.seleccion?.length ?? 2;
  const [seleccion, setSeleccion] = useState([]);
  function seleccionar(numero) {
    if (resuelto) return;
    setSeleccion((actual) => actual.includes(numero) ? actual.filter((n) => n !== numero) : actual.length < maximo ? [...actual, numero] : actual);
  }
  const esperados = ejercicio.respuesta?.seleccion ?? [];
  const correcta = seleccion.length === esperados.length && esperados.every((numero) => seleccion.includes(numero));
  return (
    <div className="patrones-tablero">
      <div className="patrones-tablero-grilla" role="group" aria-label="Tabla del 100">
        {Array.from({ length: 100 }, (_, i) => {
          const numero = i + 1;
          const fijo = visual.fijos?.includes(numero);
          const elegido = seleccion.includes(numero);
          return <button key={numero} type="button" disabled={resuelto || fijo} aria-label={`Número ${numero}`} aria-pressed={elegido} className={fijo ? 'patrones-tablero-numero patrones-tablero-numero--fijo' : elegido ? 'patrones-tablero-numero patrones-tablero-numero--activo' : 'patrones-tablero-numero'} onClick={() => seleccionar(numero)}>{numero}</button>;
        })}
      </div>
      <p aria-live="polite">Selecciona {maximo} números. Seleccionados: {seleccion.length} de {maximo}.</p>
      <div className="interactivo-pie"><BotonComprobar disabled={resuelto || seleccion.length !== maximo} onClick={() => {
        const ordenados = [...seleccion].sort((a, b) => a - b);
        const error = ejercicio.erroresFrecuentes?.find((regla) => regla.contiene && seleccion.includes(regla.contiene))?.error;
        onResponder({ correcta, clave: ordenados.join(','), valor: ordenados.join(' y '), error });
      }} /></div>
    </div>
  );
}
