// Fila de cuadritos del cuaderno: el progreso se "pinta" como cuando se
// colorea la cuadrícula.
//   estados: 'solo' (lleno) | 'ayuda' (rayado, para repasar) | 'actual' | 'vacio'
//   colores (opcional): un color por cuadrito, en la práctica que mezcla ejes.
export default function Cuadritos({ estados, etiqueta, colores, grande = false }) {
  return (
    <span className={grande ? 'cuadritos cuadritos--grande' : 'cuadritos'} role="img" aria-label={etiqueta}>
      {estados.map((estado, i) => (
        <span
          key={i}
          className={`cuadrito cuadrito--${estado}`}
          style={colores ? { '--eje': colores[i] } : undefined}
        />
      ))}
    </span>
  );
}
