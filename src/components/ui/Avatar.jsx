// Compañeros y compañeras de curso para los ejercicios "¿Quién tiene razón?".
// Son personajes originales y simples; cada uno trae una forma de pensar
// el problema (Ryan y Williams: discutir respuestas distintas).
const PERSONAS = {
  Sofía: { piel: '#f2c9a5', pelo: '#3b2414', peinado: 'largo' },
  Benjamín: { piel: '#d9a47a', pelo: '#1f1a17', peinado: 'corto' },
  Martina: { piel: '#e8b896', pelo: '#7a3e1d', peinado: 'cole' },
  Tomás: { piel: '#f0cfae', pelo: '#a8692f', peinado: 'corto', lentes: true },
  Josefa: { piel: '#c98e66', pelo: '#211813', peinado: 'crespo' },
  Agustín: { piel: '#e3b18a', pelo: '#2d1c12', peinado: 'parado' },
  Isidora: { piel: '#f5d3b8', pelo: '#c98b3c', peinado: 'largo', lentes: true },
  Vicente: { piel: '#b97d55', pelo: '#15100d', peinado: 'crespo' },
  Florencia: { piel: '#e9bf9c', pelo: '#4a2a17', peinado: 'cole' },
  Matías: { piel: '#d5a07a', pelo: '#3a2618', peinado: 'parado', lentes: true },
};

export default function Avatar({ nombre, className = 'avatar' }) {
  const p = PERSONAS[nombre] ?? PERSONAS.Sofía;
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="31" className="avatar-fondo" />
      {p.peinado === 'largo' && <path d="M14 30c0-14 8-21 18-21s18 7 18 21v20H14z" fill={p.pelo} />}
      {p.peinado === 'cole' && <circle cx="50" cy="20" r="7" fill={p.pelo} />}
      {p.peinado === 'crespo' && (
        <g fill={p.pelo}>
          <circle cx="20" cy="20" r="8" />
          <circle cx="32" cy="15" r="9" />
          <circle cx="44" cy="20" r="8" />
          <circle cx="17" cy="30" r="6" />
          <circle cx="47" cy="30" r="6" />
        </g>
      )}
      <ellipse cx="32" cy="34" rx="15" ry="17" fill={p.piel} />
      {p.peinado === 'corto' && <path d="M17 30c0-11 6-17 15-17s15 6 15 17c-4-6-9-8-15-8s-11 2-15 8z" fill={p.pelo} />}
      {p.peinado === 'parado' && (
        <path d="M17 29l2-10 5 4 3-9 5 6 4-8 3 9 5-3 1 11c-5-4-10-5-14-5s-9 1-14 5z" fill={p.pelo} />
      )}
      {(p.peinado === 'largo' || p.peinado === 'cole') && (
        <path d="M17 31c1-11 7-17 15-17s14 6 15 17c-3-7-9-9-15-9s-12 2-15 9z" fill={p.pelo} />
      )}
      <circle cx="26" cy="34" r="2.2" className="avatar-ojo" />
      <circle cx="38" cy="34" r="2.2" className="avatar-ojo" />
      {p.lentes && (
        <g className="avatar-lentes">
          <circle cx="26" cy="34" r="5.5" />
          <circle cx="38" cy="34" r="5.5" />
          <path d="M31.5 34h1" />
        </g>
      )}
      <path d="M27 42c3 3 7 3 10 0" className="avatar-boca" />
    </svg>
  );
}
