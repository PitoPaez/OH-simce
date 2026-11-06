import { useId, useState } from 'react';
import { f, leerNumero } from '../../lib/formato.js';

export function BotonComprobar({ onClick, disabled, children = 'Comprobar' }) {
  return (
    <button type="button" className="boton boton--principal boton-comprobar" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

// Respuesta abierta: el SIMCE también tiene preguntas de desarrollo, y escribir
// el número evita adivinar entre alternativas.
export default function Numero({ ejercicio, resuelto, onResponder }) {
  const [texto, setTexto] = useState('');
  const id = useId();
  const decimal = String(ejercicio.respuesta).includes('.');

  function comprobar() {
    const valor = leerNumero(texto);
    if (valor === null) return;
    const correcta = Math.abs(valor - ejercicio.respuesta) < 1e-9;
    onResponder({ correcta, clave: String(valor), valor: f(valor) });
  }

  return (
    <form
      className="numero"
      onSubmit={(e) => {
        e.preventDefault();
        comprobar();
      }}
    >
      <label htmlFor={id} className="numero-etiqueta">
        {ejercicio.etiqueta ?? 'Tu respuesta'}
      </label>
      <div className="numero-fila">
        {ejercicio.antes && <span className="numero-unidad">{ejercicio.antes}</span>}
        <input
          id={id}
          className="numero-campo"
          type="text"
          inputMode={decimal ? 'decimal' : 'numeric'}
          autoComplete="off"
          value={texto}
          onChange={(e) => setTexto(e.target.value.replace(/[^\d.,\s]/g, ''))}
          disabled={resuelto}
          placeholder={decimal ? '0,00' : ''}
        />
        {ejercicio.unidad && <span className="numero-unidad">{ejercicio.unidad}</span>}
        <BotonComprobar onClick={comprobar} disabled={resuelto || leerNumero(texto) === null} />
      </div>
    </form>
  );
}
