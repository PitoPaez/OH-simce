// Íconos de cada eje: ayudan a reconocer el tema sin tener que leer.
export default function IconoEje({ eje, className = 'icono-eje' }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      {eje === 'numeros' && (
        <>
          <rect x="6" y="8" width="10" height="32" rx="2" className="ie-relleno" />
          <path d="M6 16h10M6 24h10M6 32h10" className="ie-linea-fina" />
          <rect x="22" y="22" width="9" height="9" rx="2" className="ie-relleno" />
          <rect x="34" y="22" width="9" height="9" rx="2" className="ie-relleno" />
          <rect x="22" y="33" width="9" height="9" rx="2" className="ie-relleno" />
        </>
      )}
      {eje === 'patrones' && (
        <>
          <circle cx="9" cy="36" r="4" className="ie-relleno" />
          <circle cx="20" cy="36" r="4" className="ie-relleno" />
          <circle cx="20" cy="26" r="4" className="ie-relleno" />
          <circle cx="32" cy="36" r="4" className="ie-relleno" />
          <circle cx="32" cy="26" r="4" className="ie-relleno" />
          <circle cx="32" cy="16" r="4" className="ie-relleno" />
          <path d="M40 10l4 4-4 4" className="ie-linea" />
        </>
      )}
      {eje === 'geometria' && (
        <>
          <polygon points="14,6 25,26 3,26" className="ie-relleno" />
          <circle cx="34" cy="16" r="9" className="ie-relleno" />
          <rect x="16" y="30" width="15" height="13" rx="1.5" className="ie-relleno" />
        </>
      )}
      {eje === 'medicion' && (
        <>
          <rect x="4" y="28" width="40" height="13" rx="2" className="ie-relleno" />
          <path d="M10 28v6M17 28v4M24 28v6M31 28v4M38 28v6" className="ie-linea-fina" />
          <circle cx="24" cy="13" r="10" className="ie-relleno" />
          <path d="M24 13V7M24 13l4 3" className="ie-linea-fina" />
        </>
      )}
      {eje === 'datos' && (
        <>
          <rect x="6" y="24" width="8" height="18" rx="1.5" className="ie-relleno" />
          <rect x="18" y="10" width="8" height="32" rx="1.5" className="ie-relleno" />
          <rect x="30" y="18" width="8" height="24" rx="1.5" className="ie-relleno" />
          <path d="M3 43h42" className="ie-linea" />
        </>
      )}
      {eje === 'mixta' && (
        <>
          <rect x="6" y="6" width="16" height="16" rx="2" className="ie-relleno" />
          <circle cx="34" cy="14" r="8" className="ie-relleno" />
          <polygon points="14,26 24,42 4,42" className="ie-relleno" />
          <rect x="28" y="28" width="5" height="14" rx="1" className="ie-relleno" />
          <rect x="36" y="22" width="5" height="20" rx="1" className="ie-relleno" />
        </>
      )}
    </svg>
  );
}
