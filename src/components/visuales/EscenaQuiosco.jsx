// ---------- Escena del quiosco (pregunta de las ventas del quiosco) ----------
// El mismo kiosco y el mismo vendedor de la tienda de mermeladas. A la izquierda
// cuelga la pizarra con las ventas del día (la pizarra es HTML y va encima del
// dibujo, ver .v-escena--kiosco en App.css). Al centro hay un anaquel de madera
// con los cuatro productos de la pizarra: jugos, sándwich de pollo, helados y
// manzanas. El anaquel no muestra cantidades para no adelantar la respuesta.

import {
  Basurero,
  CajitaJugo,
  Definiciones,
  Fondo,
  Kiosco,
  Manzana,
  Mostrador,
  Ninos,
  Revistas,
  Vendedor,
} from './TiendaMermeladas.jsx';

const ANCHO = 1000;
const ALTO = 760;

const MADERA = '#b0723a';
const MADERA_OSCURA = '#77461d';
const MADERA_FONDO = '#dcab72';
const MADERA_VETA = '#c9955a';
const LISTON = '#c98d52';

// Anaquel de 2 repisas con 2 compartimentos cada una.
const ANAQUEL = { x0: 312, x1: 612, arriba: 236, cartel: 34, repisa: 196, costado: 16, divisor: 8 };
const interiorX0 = ANAQUEL.x0 + ANAQUEL.costado;
const anchoCompartimento = (ANAQUEL.x1 - ANAQUEL.x0 - 2 * ANAQUEL.costado - ANAQUEL.divisor) / 2;
const inicioRepisas = ANAQUEL.arriba + ANAQUEL.cartel;
const finRepisas = inicioRepisas + 2 * ANAQUEL.repisa;

// ---------- Productos ----------

function Jugos({ x, base }) {
  const sabores = [
    ['#f6a35c', '#f8c27a'],
    ['#7dbb3c', '#d63a3a'],
    ['#e85a8a', '#d42b3c'],
    ['#f3cf36', '#f6e05e'],
  ];
  return (
    <g transform={`translate(${x} ${base}) scale(1.6)`}>
      {[0, 1].map((fila) =>
        sabores.map(([color, fruta], i) => (
          <CajitaJugo key={`${fila}-${i}`} x={3 + i * 19} base={-fila * 27} color={color} fruta={fruta} />
        )),
      )}
    </g>
  );
}

// Sándwich triangular envuelto en plástico, con pan, lechuga, pollo y tomate.
function Sandwich({ x, base }) {
  return (
    <g transform={`translate(${x} ${base})`}>
      <path d="M0 0 L26 -52 L52 0 Z" fill="#f3d39a" stroke="#b8894a" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 -10 L26 -46 L44 -10 Z" fill="#fff6e1" />
      <path
        d="M11 -14 Q18 -18 22 -13 T34 -14 T42 -14"
        fill="none"
        stroke="#5fae3a"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M14 -22 H38" stroke="#e8c79b" strokeWidth="6" strokeLinecap="round" />
      <path d="M17 -29 H35" stroke="#d9473b" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M0 0 L26 -52 L52 0 Z" fill="#e9f4fb" opacity="0.25" stroke="#ffffff" strokeWidth="1.2" />
      <path d="M8 -6 L24 -40" stroke="#ffffff" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
    </g>
  );
}

function Sandwiches({ x, base }) {
  return (
    <g>
      <ellipse cx={x + 65} cy={base - 2} rx="60" ry="7" fill="#ffffff" stroke="#c9ccd3" strokeWidth="1.5" />
      <Sandwich x={x + 10} base={base - 4} />
      <Sandwich x={x + 66} base={base - 4} />
    </g>
  );
}

// Helados de palito en una bandeja con hielo.
function Helados({ x, base }) {
  const colores = ['#f07aa3', '#7a4a2a', '#8cc63f', '#f3cf36', '#f6a35c', '#7fc4ea'];
  return (
    <g>
      {colores.map((c, i) => (
        <g key={c} transform={`rotate(${(i - 2.5) * 5} ${x + 18 + i * 19} ${base - 30})`}>
          <rect
            x={x + 15.5 + i * 19}
            y={base - 44}
            width="5"
            height="20"
            rx="2"
            fill="#e8c79b"
            stroke="#b8894a"
            strokeWidth="0.8"
          />
          <rect
            x={x + 9 + i * 19}
            y={base - 84}
            width="18"
            height="44"
            rx="8"
            fill={c}
            stroke="#00000044"
            strokeWidth="1"
          />
          <rect x={x + 12 + i * 19} y={base - 80} width="4" height="30" rx="2" fill="#fff" opacity="0.35" />
        </g>
      ))}
      <rect x={x + 4} y={base - 36} width="122" height="36" rx="6" fill="#f4fbff" stroke="#7fb3cf" strokeWidth="2" />
      <rect x={x + 4} y={base - 22} width="122" height="8" fill="#4cc0ef" />
      {[18, 40, 66, 92, 114].map((dx) => (
        <circle key={dx} cx={x + dx} cy={base - 30} r="2" fill="#ffffff" stroke="#b9dcef" strokeWidth="0.8" />
      ))}
    </g>
  );
}

function Manzanas({ x, base }) {
  const filas = [5, 4, 3];
  return (
    <g transform={`translate(${x} ${base}) scale(1.6)`}>
      {filas.map((n, f) =>
        Array.from({ length: n }, (_, i) => (
          <Manzana key={`${f}-${i}`} cx={9 + i * 15.5 + f * 7.75} cy={-9 - f * 12} />
        )),
      )}
    </g>
  );
}

const PRODUCTOS = [
  { nombre: ['Jugos'], Dibujo: Jugos },
  { nombre: ['Sándwich', 'de pollo'], Dibujo: Sandwiches },
  { nombre: ['Helados'], Dibujo: Helados },
  { nombre: ['Manzanas'], Dibujo: Manzanas },
];

// ---------- Anaquel ----------

function Compartimento({ fila, columna, producto }) {
  const x = interiorX0 + columna * (anchoCompartimento + ANAQUEL.divisor);
  const y0 = inicioRepisas + fila * ANAQUEL.repisa;
  const y1 = y0 + ANAQUEL.repisa;
  const base = y1 - 13;
  const { nombre, Dibujo } = producto;
  const anchoTabla = anchoCompartimento - 8;
  const altoTabla = nombre.length > 1 ? 46 : 30;
  return (
    <g>
      <rect x={x} y={y1 - 24} width={anchoCompartimento} height="12" fill="#5a3d20" />
      {[0, 1, 2].map((k) => (
        <rect key={k} x={x} y={y1 - 24 + k * 4} width={anchoCompartimento} height="2.6" fill={LISTON} />
      ))}
      <Dibujo x={x} base={base} />
      {/* tabla de madera colgando con el nombre del producto */}
      {[x + 18, x + anchoTabla - 10].map((cx) => (
        <g key={cx}>
          <line x1={cx} x2={cx} y1={y0} y2={y0 + 14} stroke="#5a3d20" strokeWidth="1.6" />
          <circle cx={cx} cy={y0 + 1.5} r="2" fill="#5a3d20" />
          <circle cx={cx} cy={y0 + 14} r="1.8" fill="#4a3517" />
        </g>
      ))}
      <rect
        x={x + 4}
        y={y0 + 10}
        width={anchoTabla}
        height={altoTabla}
        rx="3"
        fill="#e2b77c"
        stroke={MADERA_OSCURA}
        strokeWidth="2"
      />
      {nombre.map((linea, i) => (
        <text key={linea} x={x + 4 + anchoTabla / 2} y={y0 + 32 + i * 17} className="tienda__producto">
          {linea}
        </text>
      ))}
    </g>
  );
}

function AnaquelQuiosco() {
  const { x0, x1, arriba, cartel, costado, divisor, repisa } = ANAQUEL;
  return (
    <g>
      <rect x={x0} y={inicioRepisas} width={x1 - x0} height={finRepisas - inicioRepisas} fill={MADERA_FONDO} />
      {Array.from({ length: 7 }, (_, i) => (
        <path
          key={i}
          d={`M${x0 + 30 + i * 40} ${inicioRepisas} C${x0 + 26 + i * 40} ${inicioRepisas + 140} ${x0 + 36 + i * 40} ${finRepisas - 160} ${x0 + 32 + i * 40} ${finRepisas}`}
          fill="none"
          stroke={MADERA_VETA}
          strokeWidth="1.4"
        />
      ))}
      {PRODUCTOS.map((p, k) => (
        <Compartimento key={p.nombre.join(' ')} fila={Math.floor(k / 2)} columna={k % 2} producto={p} />
      ))}
      {[0, 1].map((f) => {
        const y1 = inicioRepisas + (f + 1) * repisa;
        return (
          <g key={f}>
            <rect
              x={interiorX0 + anchoCompartimento}
              y={y1 - 66}
              width={divisor}
              height="54"
              fill={MADERA}
              stroke={MADERA_OSCURA}
              strokeWidth="1"
            />
            <rect
              x={x0 + costado - 2}
              y={y1 - 14}
              width={x1 - x0 - 2 * costado + 4}
              height="14"
              rx="2"
              fill={MADERA}
              stroke={MADERA_OSCURA}
              strokeWidth="1.5"
            />
          </g>
        );
      })}
      {[x0, x1 - costado].map((cx) => (
        <rect
          key={cx}
          x={cx}
          y={inicioRepisas - 2}
          width={costado}
          height={finRepisas - inicioRepisas + 18}
          fill={MADERA}
          stroke={MADERA_OSCURA}
          strokeWidth="1.5"
        />
      ))}
      <rect
        x={x0 - 8}
        y={arriba}
        width={x1 - x0 + 16}
        height={cartel}
        rx="4"
        fill={MADERA}
        stroke={MADERA_OSCURA}
        strokeWidth="2"
      />
      <text x={(x0 + x1) / 2} y={arriba + 24} className="tienda__cartel">
        QUIOSCO
      </text>
    </g>
  );
}

// Cordel y clavo de la pizarra (la pizarra misma es HTML, encima del dibujo).
function CordelPizarra() {
  return (
    <g>
      <path d="M40 214 L160 192 L280 214" fill="none" stroke="#5a4a3a" strokeWidth="2.5" />
      <circle cx="160" cy="192" r="4.5" fill="#7d848c" stroke="#4a4f57" strokeWidth="1.5" />
    </g>
  );
}

export function EscenaQuiosco() {
  return (
    <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} className="escena-quiosco" aria-hidden="true">
      <Definiciones />
      <Fondo />
      <Kiosco />
      {/* revistas en el costado izquierdo, bajo la pizarra */}
      <Revistas x={22} y={430} columnas={4} filas={6} ancho={22} alto={34} separacion={3} semilla={3} />
      <CordelPizarra />
      <AnaquelQuiosco />
      <Vendedor />
      <Mostrador />
      <Basurero />
      <Ninos />
    </svg>
  );
}
