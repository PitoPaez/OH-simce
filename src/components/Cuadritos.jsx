// Fila de cuadritos del cuaderno: el progreso se "pinta" como cuando se
// colorea la cuadrícula. estados: 'pintado' | 'actual' | 'repasar' | 'vacio'
// colores (opcional): un color por cuadrito, para la práctica mixta.
export default function Cuadritos({ estados, etiqueta, colores }) {
  return (
    <span className="cuadritos" role="img" aria-label={etiqueta}>
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
