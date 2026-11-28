// Representaciones visuales de los ejercicios de patrones y álgebra.
export function Maquina({ ejemplos = [], entradaActual }) {
  return (
    <div className="v-maquina" role="img" aria-label="Máquina matemática que transforma entradas en salidas">
      <div className="v-maquina-filas">
        {ejemplos.map((fila, i) => (
          <div className="v-maquina-fila" key={i}>
            <span>{fila.entrada}</span>
            <span aria-hidden="true">→</span>
            <span>{fila.salida}</span>
          </div>
        ))}
      </div>
      {entradaActual != null && (
        <div className="v-maquina-actual">
          <span>{entradaActual}</span>
          <span aria-hidden="true">→</span>
          <strong>?</strong>
        </div>
      )}
    </div>
  );
}

export function Pulsera({ patron = [], mostrarHasta = 8, posicionObjetivo }) {
  const colores = { rojo: '#d9534f', azul: '#4a72b2', amarillo: '#e6b800', verde: '#4c9b54' };
  return (
    <div className="v-pulsera" role="img" aria-label={`Patrón de colores repetido; busca la posición ${posicionObjetivo}`}>
      {Array.from({ length: mostrarHasta }, (_, i) => (
        <div className="v-pulsera-cuenta-contenedor" key={i}>
          <span className="v-pulsera-cuenta" style={{ backgroundColor: colores[patron[i % patron.length]] ?? '#888' }} />
          <span className="v-pulsera-numero">{i + 1}</span>
        </div>
      ))}
      <span className="v-pulsera-puntos" aria-hidden="true">…</span>
      <div className="v-pulsera-cuenta-contenedor">
        <span className="v-pulsera-cuenta v-pulsera-cuenta--incognita">?</span>
        <span className="v-pulsera-numero">{posicionObjetivo}</span>
      </div>
    </div>
  );
}

export function Tablero100({ fijos = [] }) {
  return (
    <div className="v-tablero100" role="img" aria-label="Tabla del 100 con números destacados">
      {Array.from({ length: 100 }, (_, i) => {
        const numero = i + 1;
        return (
          <span key={numero} className={fijos.includes(numero) ? 'v-tablero100-numero v-tablero100-numero--fijo' : 'v-tablero100-numero'}>
            {numero}
          </span>
        );
      })}
    </div>
  );
}

export function Fosforos({ figuras = [] }) {
  const lado = 30;
  return (
    <ol className="v-fosforos" aria-label="Cuadrados crecientes hechos con palitos de fósforo">
      {figuras.map((figura) => {
        const cuadrados = Math.max(1, Math.round((figura.cantidad - 1) / 3));
        const ancho = cuadrados * lado + 8;
        return (
          <li className="v-fosforo-etapa" key={figura.numero}>
            <svg width={ancho} height={lado + 8} viewBox={`-4 -4 ${ancho} ${lado + 8}`} aria-hidden="true">
              {Array.from({ length: cuadrados }, (_, c) => {
                const x = c * lado;
                return (
                  <g key={c}>
                    <line x1={x + 3} y1="0" x2={x + lado - 3} y2="0" className="v-trazo" stroke="currentColor" strokeWidth="3" />
                    <line x1={x + 3} y1={lado} x2={x + lado - 3} y2={lado} className="v-trazo" stroke="currentColor" strokeWidth="3" />
                    <line x1={x + lado} y1="3" x2={x + lado} y2={lado - 3} className="v-trazo" stroke="currentColor" strokeWidth="3" />
                    {c === 0 && <line x1="0" y1="3" x2="0" y2={lado - 3} className="v-trazo" stroke="currentColor" strokeWidth="3" />}
                  </g>
                );
              })}
            </svg>
            <span>Figura {figura.numero} ({figura.cantidad} palitos)</span>
          </li>
        );
      })}
    </ol>
  );
}
