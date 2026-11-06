import { f } from '../../lib/formato.js';

// ---------- Gráfico de barras ----------
// valor null = barra que falta. numeros=false oculta la escala del eje
// (para preguntas donde hay que deducirla).
export function Grafico({ titulo, datos, max, paso = 1, numeros = true, ejeY, valorEditable, editable }) {
  const tope = max ?? Math.max(...datos.map((d) => d.valor ?? 0));
  const alto = 200;
  const escala = alto / tope;
  const x0 = 54;
  const anchoUtil = 420 - x0;
  const anchoBarra = Math.min(60, (anchoUtil / datos.length) * 0.6);
  const hueco = anchoUtil / datos.length;
  const lineas = [];
  for (let v = 0; v <= tope; v += paso) lineas.push(v);
  return (
    <svg viewBox="0 0 440 290" role="img" aria-label={`${titulo}: ${datos.map((d) => `${d.etiqueta} ${d.valor ?? 'sin dato'}`).join(', ')}`}>
      {titulo && (
        <text x="240" y="18" className="v-etq v-fuerte">
          {titulo}
        </text>
      )}
      {ejeY && (
        <text x="14" y="140" className="v-etq v-chica" transform="rotate(-90 14 140)">
          {ejeY}
        </text>
      )}
      {lineas.map((v) => (
        <g key={v}>
          <line x1={x0} y1={240 - v * escala} x2="430" y2={240 - v * escala} className="v-guia" />
          {numeros && (
            <text x={x0 - 10} y={245 - v * escala} className="v-etq v-chica v-der">
              {f(v)}
            </text>
          )}
        </g>
      ))}
      {datos.map((d, i) => {
        const valor = editable === i ? valorEditable : d.valor;
        const x = x0 + hueco * i + (hueco - anchoBarra) / 2;
        return (
          <g key={d.etiqueta}>
            {valor !== null && valor !== undefined ? (
              <rect
                x={x}
                y={240 - valor * escala}
                width={anchoBarra}
                height={valor * escala}
                className={editable === i ? 'v-barra-editable' : 'v-pintado'}
              />
            ) : (
              <text x={x + anchoBarra / 2} y="226" className="v-num v-acento">
                ?
              </text>
            )}
            <text x={x + anchoBarra / 2} y="266" className="v-etq v-chica">
              {d.etiqueta}
            </text>
          </g>
        );
      })}
      <line x1={x0} y1="240" x2="430" y2="240" className="v-trazo" />
    </svg>
  );
}

// ---------- Pictograma con escala ----------
function IconoPicto({ tipo, medio }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={medio ? 'v-picto v-picto--medio' : 'v-picto'}>
      <defs>
        <clipPath id="mitad-picto">
          <rect x="0" y="0" width="16" height="32" />
        </clipPath>
      </defs>
      <g clipPath={medio ? 'url(#mitad-picto)' : undefined}>
        {tipo === 'botella' && <path d="M13 3h6v5l3 4v17H10V12l3-4z" className="v-picto-relleno" />}
        {tipo === 'carita' && (
          <>
            <circle cx="16" cy="16" r="13" className="v-picto-relleno" />
            <circle cx="11.5" cy="13" r="1.8" className="v-picto-detalle" />
            <circle cx="20.5" cy="13" r="1.8" className="v-picto-detalle" />
            <path d="M10 19c3 4 9 4 12 0" className="v-picto-trazo" />
          </>
        )}
        {tipo === 'helado' && (
          <>
            <circle cx="16" cy="11" r="8" className="v-picto-relleno" />
            <path d="M9 14h14l-7 15z" className="v-picto-cono" />
          </>
        )}
      </g>
    </svg>
  );
}

export function Pictograma({ titulo, datos, valorIcono, icono = 'carita', unidad }) {
  return (
    <div className="v-pictograma">
      {titulo && <p className="v-pictograma-titulo">{titulo}</p>}
      <table>
        <tbody>
          {datos.map((d) => (
            <tr key={d.etiqueta}>
              <th scope="row">{d.etiqueta}</th>
              <td>
                {Array.from({ length: Math.ceil(d.iconos) }, (_, i) => (
                  <IconoPicto key={i} tipo={icono} medio={i + 1 > d.iconos} />
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="v-pictograma-clave">
        <IconoPicto tipo={icono} /> = {f(valorIcono)} {unidad}
      </p>
    </div>
  );
}

// ---------- Bolsas con bolitas de colores (probabilidades) ----------
const NOMBRE_COLOR = {
  roja: ['roja', 'rojas'],
  azul: ['azul', 'azules'],
  amarilla: ['amarilla', 'amarillas'],
  verde: ['verde', 'verdes'],
};
const nombreColor = (color, n) => NOMBRE_COLOR[color][n === 1 ? 0 : 1];

function DibujoBolsa({ bolitas, grande }) {
  const lista = Object.entries(bolitas).flatMap(([color, n]) => Array.from({ length: n }, () => color));
  const porFila = grande ? 8 : 4;
  const r = grande ? 7 : 9;
  const sep = r * 2 + 3;
  const filas = Math.ceil(lista.length / porFila);
  const ancho = porFila * sep + 30;
  const alto = filas * sep + 50;
  return (
    <svg viewBox={`0 0 ${ancho} ${alto}`} aria-hidden="true" className="v-bolsa-dibujo">
      <path
        d={`M12,30 Q${ancho / 2},16 ${ancho - 12},30 L${ancho - 6},${alto - 10} Q${ancho / 2},${alto + 2} 6,${alto - 10} Z`}
        className="v-bolsa-tela"
      />
      <path d={`M${ancho / 2 - 18},22 Q${ancho / 2},2 ${ancho / 2 + 18},22`} className="v-trazo-fino" fill="none" />
      {lista.map((color, i) => (
        <circle
          key={i}
          cx={15 + r + (i % porFila) * sep + ((porFila - Math.min(porFila, lista.length - Math.floor(i / porFila) * porFila)) * sep) / 2}
          cy={36 + r + Math.floor(i / porFila) * sep}
          r={r}
          className={`v-bolita-${color}`}
        />
      ))}
    </svg>
  );
}

export function Bolsas({ bolsas }) {
  const grande = bolsas.length === 1;
  return (
    <ul className={grande ? 'v-bolsas v-bolsas--una' : 'v-bolsas'}>
      {bolsas.map((b) => (
        <li key={b.etiqueta}>
          <DibujoBolsa bolitas={b.bolitas} grande={grande} />
          <span className="v-bolsa-etq">{b.etiqueta}</span>
          <span className="v-bolsa-detalle">
            {Object.entries(b.bolitas)
              .map(([color, n]) => `${n} ${nombreColor(color, n)}`)
              .join(', ')}
          </span>
        </li>
      ))}
    </ul>
  );
}
