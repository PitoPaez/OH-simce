// ---------- Máquina matemática ----------
export function Maquina({ ejemplos = [], entradaActual }) {
  return (
    <div className="v-maquina" role="img" aria-label="Máquina matemática que transforma entradas en salidas">
      <div className="v-maquina-filas">
        {ejemplos.map((fila, i) => (
          <div className="v-maquina-fila" key={i}>
            <span>{fila.entrada}</span><span aria-hidden="true">→</span><span>{fila.salida}</span>
          </div>
        ))}
      </div>
      {entradaActual != null && (
        <div className="v-maquina-actual"><span>{entradaActual}</span><span aria-hidden="true">→</span><strong>?</strong></div>
      )}
    </div>
  );
}

// ---------- Pulsera repetitiva ----------
export function Pulsera({ patron = [], mostrarHasta = 8, posicionObjetivo, coloresDisponibles = [] }) {
  const colores = { rojo: '#d9534f', azul: '#4a72b2', amarillo: '#e6b800', verde: '#4c9b54' };
  return (
    <div className="v-pulsera" role="img" aria-label={`Patrón repetitivo hasta la posición ${mostrarHasta}; busca la posición ${posicionObjetivo}`}>
      {Array.from({ length: mostrarHasta }, (_, i) => (
        <div className="v-pulsera-cuenta-contenedor" key={i}>
          <span className="v-pulsera-cuenta" style={{ background: colores[patron[i % patron.length]] }} />
          <span className="v-pulsera-numero">{i + 1}</span>
        </div>
      ))}
      <span className="v-pulsera-puntos">…</span>
      <div className="v-pulsera-cuenta-contenedor">
        <span className="v-pulsera-cuenta v-pulsera-cuenta--incognita">?</span>
        <span className="v-pulsera-numero">{posicionObjetivo}</span>
      </div>
    </div>
  );
}

// ---------- Tabla del 100 visual ----------
export function Tablero100({ fijos = [] }) {
  return (
    <div className="v-tablero100" role="img" aria-label="Tabla del 100 con números destacados">
      {Array.from({ length: 100 }, (_, i) => {
        const numero = i + 1;
        return <span key={numero} className={fijos.includes(numero) ? 'v-tablero100-numero v-tablero100-numero--fijo' : 'v-tablero100-numero'}>{numero}</span>;
      })}
    </div>
  );
}

// ---------- Fósforos / cuadrados crecientes ----------
export function Fosforos({ figuras = [] }) {
  return (
    <ol className="v-fosforos" role="img" aria-label="Secuencia de figuras hechas con palitos de fósforo">
      {figuras.map((figura) => (
        <li className="v-fosforo-etapa" key={figura.numero}>
          <span className="v-fosforo-cantidad">{figura.cantidad}</span>
          <span>Figura {figura.numero}</span>
        </li>
      ))}
    </ol>
  );
}
