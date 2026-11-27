import { useState } from 'react';
import { leerNumero, f } from '../../lib/formato.js';
import { BotonComprobar } from './Numero.jsx';

// Completar uno o varios números/expresiones dentro de una secuencia.
export default function Completar({ ejercicio, resuelto, onResponder }) {
  const campos = ejercicio.respuesta?.campos ?? (ejercicio.respuesta ? [{ indice: 0, valor: ejercicio.respuesta.valor ?? ejercicio.respuesta }] : []);
  const [valores, setValores] = useState(() => Object.fromEntries(campos.map((campo) => [campo.indice ?? 0, ''])));

  const completos = campos.every((campo) => leerNumero(valores[campo.indice ?? 0]) !== null);

  function comprobar() {
    const entradas = Object.fromEntries(campos.map((campo) => {
      const clave = campo.indice ?? 0;
      return [clave, leerNumero(valores[clave])];
    }));

    const correcta = campos.every((campo) => {
      const clave = campo.indice ?? 0;
      return entradas[clave] !== null && entradas[clave] === campo.valor;
    });

    const clave = campos.map((campo) => `${campo.etiqueta ?? campo.indice ?? ''}:${entradas[campo.indice ?? 0]}`).join('|');
    onResponder({ correcta, clave, valor: campos.map((campo) => f(entradas[campo.indice ?? 0])).join(', '), entradas });
  }

  return (
    <div className="completar">
      {campos.map((campo) => {
        const clave = campo.indice ?? 0;
        return (
          <label className="completar-campo" key={clave}>
            <span>{campo.etiqueta ?? 'Número que falta'}</span>
            <input
              type="text"
              inputMode="numeric"
              value={valores[clave]}
              disabled={resuelto}
              onChange={(event) => setValores((actual) => ({ ...actual, [clave]: event.target.value.replace(/[^\d.,\s-]/g, '') }))}
            />
          </label>
        );
      })}
      <div className="interactivo-pie">
        <BotonComprobar disabled={resuelto || !completos} onClick={comprobar} />
      </div>
    </div>
  );
}

export function ClicSecuencia({ ejercicio, resuelto, onResponder }) {
  const visual = ejercicio.visual ?? {};
  const [indice, setIndice] = useState(null);
  const correcta = ejercicio.respuesta?.indice;

  return (
    <div className="clic-secuencia">
      <ol className="v-secuencia">
        {(visual.valores ?? []).map((valor, i) => (
          <li key={i} className="v-secuencia-item">
            <button
              type="button"
              disabled={resuelto}
              aria-pressed={indice === i}
              className={indice === i ? 'v-secuencia-caja v-secuencia-caja--activa' : 'v-secuencia-caja'}
              onClick={() => setIndice(i)}
            >
              {valor === null ? '?' : f(valor)}
            </button>
          </li>
        ))}
      </ol>
      <div className="interactivo-pie">
        <BotonComprobar
          disabled={resuelto || indice === null}
          onClick={() => onResponder({ correcta: indice === correcta, clave: String(indice), valor: String(visual.valores?.[indice] ?? indice) })}
        />
      </div>
    </div>
  );
}

const COLORES = {
  rojo: '#d9534f',
  azul: '#4a72b2',
  amarillo: '#e6b800',
  verde: '#4c9b54',
};

export function ClicColor({ ejercicio, resuelto, onResponder }) {
  const [color, setColor] = useState(null);
  const disponibles = ejercicio.visual?.coloresDisponibles ?? ['rojo', 'azul', 'amarillo', 'verde'];
  return (
    <div className="clic-color">
      <div className="clic-color-opciones" role="radiogroup" aria-label="Colores disponibles">
        {disponibles.map((nombre) => (
          <button
            key={nombre}
            type="button"
            role="radio"
            aria-checked={color === nombre}
            disabled={resuelto}
            className={color === nombre ? 'clic-color-boton clic-color-boton--activo' : 'clic-color-boton'}
            onClick={() => setColor(nombre)}
          >
            <span className="clic-color-muestra" style={{ background: COLORES[nombre] }} aria-hidden="true" />
            {nombre}
          </button>
        ))}
      </div>
      <div className="interactivo-pie">
        <BotonComprobar
          disabled={resuelto || color === null}
          onClick={() => onResponder({ correcta: color === ejercicio.respuesta?.valor, clave: color, valor: color, error: ejercicio.erroresFrecuentes?.find((e) => e.valor === color)?.error })}
        />
      </div>
    </div>
  );
}

export function TableroInteractivo({ ejercicio, resuelto, onResponder }) {
  const visual = ejercicio.visual ?? {};
  const seleccionMax = visual.seleccionMax ?? ejercicio.respuesta?.seleccion?.length ?? 2;
  const [seleccion, setSeleccion] = useState([]);

  function seleccionar(numero) {
    if (resuelto) return;
    setSeleccion((actual) => actual.includes(numero)
      ? actual.filter((n) => n !== numero)
      : actual.length < seleccionMax
        ? [...actual, numero]
        : actual);
  }

  const esperados = ejercicio.respuesta?.seleccion ?? [];
  const correcta = seleccion.length === esperados.length && esperados.every((n) => seleccion.includes(n));

  return (
    <div className="tablero-interactivo">
      <div className="tablero-interactivo-grilla" role="group" aria-label="Tabla del 100">
        {Array.from({ length: 100 }, (_, i) => {
          const numero = i + 1;
          const fijo = visual.fijos?.includes(numero);
          const elegido = seleccion.includes(numero);
          return (
            <button
              type="button"
              key={numero}
              disabled={resuelto || fijo}
              aria-label={`Número ${numero}`}
              aria-pressed={elegido}
              className={fijo ? 'tablero-numero tablero-numero--fijo' : elegido ? 'tablero-numero tablero-numero--activo' : 'tablero-numero'}
              onClick={() => seleccionar(numero)}
            >
              {numero}
            </button>
          );
        })}
      </div>
      <div className="interactivo-pie">
        <BotonComprobar
          disabled={resuelto || seleccion.length !== seleccionMax}
          onClick={() => {
            const error = ejercicio.erroresFrecuentes?.find((e) => e.contiene && seleccion.includes(e.contiene))?.error;
            onResponder({ correcta, clave: seleccion.sort((a, b) => a - b).join(','), valor: seleccion.join(' y '), error });
          }}
        />
      </div>
    </div>
  );
}
