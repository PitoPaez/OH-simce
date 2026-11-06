import { leer, puedeHablar } from '../../lib/voz.js';

export function IconoParlante() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icono">
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" fill="none" />
    </svg>
  );
}

// Botón para escuchar un texto. `compacto` muestra solo el ícono.
export default function Leer({ texto, compacto = false, etiqueta = 'Escuchar' }) {
  if (!puedeHablar) return null;
  return (
    <button
      type="button"
      className={compacto ? 'boton-leer boton-leer--compacto' : 'boton boton--suave boton-leer'}
      onClick={() => leer(texto)}
      aria-label={compacto ? etiqueta : undefined}
      title={compacto ? etiqueta : undefined}
    >
      <IconoParlante />
      {!compacto && etiqueta}
    </button>
  );
}
