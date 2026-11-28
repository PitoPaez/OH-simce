// ---------- Encuesta en la tabla de pinza (pregunta 2 de datos) ----------
// Una profesora entra a la sala con la tabla de pinza. Viene mirando la encuesta
// (se ve el dorso de la tabla) y, mientras se acerca, la gira para mostrarla.
// Al terminar, la vista se acerca a la tabla y aparece la encuesta con el gráfico.
//
// Fases: "acercando" (la profesora camina y gira la tabla), "zoom" (la vista se
// acerca a la tabla) y "lista" (la tabla grande con la encuesta y el gráfico).
// Con movimiento reducido se muestra la tabla de inmediato.

import { useEffect, useState } from 'react';
import { Grafico } from './datos.jsx';

const DURACION_CAMINATA = 3400;
const DURACION_ZOOM = 800;

const sinMovimiento = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Colores de la tabla de pinza (aglomerado café, como la foto de referencia).
const TABLA = '#b08660';
const TABLA_BORDE = '#7d5a3a';
const TABLA_DORSO = '#a27a55';

// ---------- Sala de clases ----------

function Sala() {
  return (
    <g>
      {/* muro */}
      <rect x="0" y="0" width="1000" height="560" fill="#f3ead8" />
      <rect x="0" y="0" width="1000" height="70" fill="#ece0c8" />
      {/* pizarra */}
      <rect x="150" y="120" width="480" height="250" rx="8" fill="#7a5634" />
      <rect x="162" y="132" width="456" height="226" rx="4" fill="#2f5d4a" />
      <path d="M200 190 q40 -14 80 0 t80 0" fill="none" stroke="#e8efe9" strokeWidth="3" opacity="0.5" />
      <path d="M200 230 h150 M200 262 h110" stroke="#e8efe9" strokeWidth="3" opacity="0.35" strokeLinecap="round" />
      <rect x="430" y="200" width="22" height="120" fill="#e8efe9" opacity="0.18" />
      <rect x="470" y="250" width="22" height="70" fill="#e8efe9" opacity="0.18" />
      <rect x="510" y="180" width="22" height="140" fill="#e8efe9" opacity="0.18" />
      <rect x="550" y="280" width="22" height="40" fill="#e8efe9" opacity="0.18" />
      <rect x="150" y="366" width="480" height="12" rx="3" fill="#8c6440" />
      <rect x="200" y="360" width="26" height="7" rx="2" fill="#fbfbf7" />
      <rect x="240" y="361" width="18" height="6" rx="2" fill="#f2b632" />
      {/* ventana */}
      <rect x="700" y="110" width="220" height="230" rx="6" fill="#ffffff" />
      <rect x="712" y="122" width="196" height="206" fill="#bfe3f5" />
      <circle cx="860" cy="180" r="26" fill="#ffffff" opacity="0.7" />
      <circle cx="830" cy="190" r="20" fill="#ffffff" opacity="0.7" />
      <path d="M712 300 q50 -40 100 -10 t96 -14 V328 H712 Z" fill="#8cc63f" opacity="0.8" />
      <path d="M810 122 V328 M712 225 H908" stroke="#ffffff" strokeWidth="8" />
      {/* diario mural */}
      <rect x="40" y="150" width="80" height="170" rx="4" fill="#c99a62" />
      <rect x="50" y="162" width="28" height="36" fill="#f8d36a" transform="rotate(-4 64 180)" />
      <rect x="82" y="168" width="28" height="34" fill="#8fc7e8" transform="rotate(5 96 185)" />
      <rect x="54" y="214" width="54" height="40" fill="#f5a3b8" transform="rotate(2 81 234)" />
      <rect x="56" y="268" width="30" height="34" fill="#ffffff" transform="rotate(-3 71 285)" />
      {/* zócalo y piso de madera */}
      <rect x="0" y="548" width="1000" height="14" fill="#c9b08a" />
      <rect x="0" y="560" width="1000" height="200" fill="#d6a46c" />
      {[600, 650, 710, 780].map((y) => (
        <line key={y} x1="0" x2="1000" y1={y} y2={y} stroke="#bf8c55" strokeWidth="2" />
      ))}
      {[-400, -150, 100, 350, 600, 850, 1100, 1350].map((x) => (
        <line key={x} x1={500 + (x - 500) * 0.35} y1="560" x2={x} y2="760" stroke="#c3925c" strokeWidth="2" />
      ))}
      {/* mesas de los estudiantes a los lados */}
      {[
        [70, 640],
        [880, 640],
      ].map(([x, y]) => (
        <g key={x}>
          <rect x={x - 70} y={y - 40} width="140" height="16" rx="3" fill="#e2b77c" stroke="#9c6b3a" strokeWidth="2" />
          <path
            d={`M${x - 60} ${y - 24} V${y + 60} M${x + 60} ${y - 24} V${y + 60}`}
            stroke="#6e7682"
            strokeWidth="7"
          />
        </g>
      ))}
    </g>
  );
}

// ---------- Tabla de pinza que lleva la profesora ----------

// Pinza metálica plateada: placa con remaches y la palanca con su agujero.
function PinzaSvg({ x, y, ancho }) {
  const s = ancho / 100;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id="ep-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f5f7" />
          <stop offset="0.45" stopColor="#c3c7ce" />
          <stop offset="0.55" stopColor="#d9dce1" />
          <stop offset="1" stopColor="#8f949d" />
        </linearGradient>
      </defs>
      <path
        d="M-50 10 H50 L44 30 H-44 Z"
        fill="url(#ep-metal)"
        stroke="#6d727b"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M-30 12 C-30 -8 -20 -22 0 -22 C20 -22 30 -8 30 12 Z"
        fill="url(#ep-metal)"
        stroke="#6d727b"
        strokeWidth="2"
      />
      <ellipse cx="0" cy="-6" rx="9" ry="7" fill="#5b6068" />
      <ellipse cx="0" cy="-7" rx="6" ry="4.5" fill="#f3ead8" />
      {[-36, 36].map((cx) => (
        <circle key={cx} cx={cx} cy="20" r="3.5" fill="#9aa0a8" stroke="#6d727b" strokeWidth="1" />
      ))}
      <path d="M-40 26 H40" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
    </g>
  );
}

function TablaEnMano() {
  // centrada en x = 0; de y = -232 a y = -136
  const x0 = -35;
  const y0 = -232;
  const ancho = 70;
  const alto = 96;
  return (
    <g>
      {/* dorso: aglomerado liso, se asoma la pinza por arriba */}
      <g className="encuesta__dorso">
        <rect x={x0 + 26} y={y0 - 7} width="18" height="9" rx="2" fill="#b9bdc4" stroke="#6d727b" strokeWidth="1" />
        <rect
          x={x0}
          y={y0}
          width={ancho}
          height={alto}
          rx="5"
          fill={TABLA_DORSO}
          stroke={TABLA_BORDE}
          strokeWidth="1.6"
        />
        <path
          d={`M${x0 + 8} ${y0 + 20} q20 -4 54 2 M${x0 + 6} ${y0 + 52} q24 4 56 -2 M${x0 + 10} ${y0 + 80} q20 -3 50 1`}
          fill="none"
          stroke="#8f6744"
          strokeWidth="0.8"
          opacity="0.6"
        />
      </g>
      {/* frente: la hoja de la encuesta con un gráfico chiquito */}
      <g className="encuesta__frente">
        <rect x={x0} y={y0} width={ancho} height={alto} rx="5" fill={TABLA} stroke={TABLA_BORDE} strokeWidth="1.6" />
        <rect x={x0 + 6} y={y0 + 10} width={ancho - 12} height={alto - 15} fill="#ffffff" />
        <path d={`M${x0 + 11} ${y0 + 20} h30 M${x0 + 11} ${y0 + 26} h44`} stroke="#5b6b8c" strokeWidth="1.6" />
        {[
          [8, '#e2483d'],
          [5, '#f2c62a'],
          [3, '#f28c28'],
          [6, '#8e5bc4'],
        ].map(([v, c], i) => (
          <rect key={c} x={x0 + 14 + i * 12} y={y0 + 82 - v * 6} width="8" height={v * 6} fill={c} />
        ))}
        <path d={`M${x0 + 10} ${y0 + 82.5} h50`} stroke="#33415c" strokeWidth="1.2" />
        <PinzaSvg x={0} y={y0 + 2} ancho={36} />
      </g>
    </g>
  );
}

// ---------- Profesora ----------
// Dibujada de frente con el mismo estilo que el vendedor del quiosco: pies en
// y = 0 y unos 300 de alto. Pelo castaño con tomate, lentes, chaleco y falda.

function Pierna({ lado }) {
  const cx = lado * 10;
  return (
    <g className={`encuesta__pierna encuesta__pierna--${lado < 0 ? 'izq' : 'der'}`}>
      <path
        d={`M${cx - 7} -118 H${cx + 7} L${cx + 6} -12 H${cx - 6} Z`}
        fill="#e9b48c"
        stroke="#a8714b"
        strokeWidth="1.4"
      />
      <path
        d={`M${cx - 9} -13 h18 q5 0 5 6 v5 h-28 v-5 q0 -6 5 -6 Z`}
        fill="#8a2f45"
        stroke="#5a1a2b"
        strokeWidth="1.2"
      />
    </g>
  );
}

function Profesora() {
  const piel = '#e9b48c';
  const bordePiel = '#a8714b';
  const pelo = '#4a2c1d';
  const peloOscuro = '#2b170c';
  const chaleco = '#2f8f8a';
  const chalecoBorde = '#1d615d';
  return (
    <g className="encuesta__cuerpo">
      <ellipse cx="0" cy="2" rx="46" ry="7" fill="#000" opacity="0.15" />
      <Pierna lado={-1} />
      <Pierna lado={1} />
      {/* falda */}
      <path
        d="M-30 -160 H30 L40 -108 H-40 Z"
        fill="#3d4f7c"
        stroke="#27345a"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M-14 -158 L-20 -109 M14 -158 L20 -109" stroke="#27345a" strokeWidth="1" opacity="0.6" />
      {/* blusa blanca */}
      <path
        d="M-34 -236 C-38 -218 -36 -186 -31 -156 H31 C36 -186 38 -218 34 -236 C22 -244 -22 -244 -34 -236 Z"
        fill="#fbfbfd"
        stroke="#b9bec8"
        strokeWidth="1.5"
      />
      {/* chaleco abierto */}
      <path
        d="M-34 -236 C-38 -218 -36 -186 -31 -156 H-12 L-10 -232 C-18 -240 -28 -240 -34 -236 Z"
        fill={chaleco}
        stroke={chalecoBorde}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M34 -236 C38 -218 36 -186 31 -156 H12 L10 -232 C18 -240 28 -240 34 -236 Z"
        fill={chaleco}
        stroke={chalecoBorde}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M-31 -160 H-12 M12 -160 H31" stroke={chalecoBorde} strokeWidth="2.5" />
      {/* brazos que sostienen la tabla */}
      {[-1, 1].map((l) => (
        <g key={l} transform={`scale(${l} 1)`}>
          <path
            d="M-35 -230 C-46 -206 -46 -184 -38 -168 L-22 -146"
            fill="none"
            stroke={chalecoBorde}
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M-35 -230 C-46 -206 -46 -184 -38 -168 L-22 -146"
            fill="none"
            stroke={chaleco}
            strokeWidth="11.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ))}
      {/* cuello */}
      <rect x="-6" y="-254" width="12" height="18" rx="3" fill={piel} stroke={bordePiel} strokeWidth="1.3" />
      <path d="M-10 -240 L0 -230 L10 -240" fill="none" stroke="#b9bec8" strokeWidth="1.4" />
      {/* cabeza */}
      <ellipse cx="0" cy="-268" rx="25" ry="29" fill={pelo} stroke={peloOscuro} strokeWidth="1.4" />
      <path
        d="M-25 -268 C-27 -254 -24 -246 -18 -243 H18 C24 -246 27 -254 25 -268 Z"
        fill={pelo}
        stroke={peloOscuro}
        strokeWidth="1.3"
      />
      <ellipse cx="0" cy="-303" rx="13" ry="10" fill={pelo} stroke={peloOscuro} strokeWidth="1.4" />
      <path d="M-8 -303 Q0 -310 8 -303" fill="none" stroke={peloOscuro} strokeWidth="1" />
      <ellipse cx="-18" cy="-268" rx="3.6" ry="6" fill={piel} stroke={bordePiel} strokeWidth="1.2" />
      <ellipse cx="18" cy="-268" rx="3.6" ry="6" fill={piel} stroke={bordePiel} strokeWidth="1.2" />
      <circle cx="-18.5" cy="-260" r="2" fill="#f2c230" stroke="#a5830f" strokeWidth="0.6" />
      <circle cx="18.5" cy="-260" r="2" fill="#f2c230" stroke="#a5830f" strokeWidth="0.6" />
      <ellipse cx="0" cy="-268" rx="17" ry="21" fill={piel} stroke={bordePiel} strokeWidth="1.4" />
      {/* chasquilla */}
      <path
        d="M-18 -272 C-19 -292 -6 -296 2 -294 C12 -293 19 -286 18 -272 C14 -280 8 -284 2 -284 C-4 -282 -12 -280 -18 -272 Z"
        fill={pelo}
        stroke={peloOscuro}
        strokeWidth="1.2"
      />
      {/* cejas, lentes y ojos */}
      <path
        d="M-11 -276 Q-7 -278.5 -3 -276.5 M3 -276.5 Q7 -278.5 11 -276"
        fill="none"
        stroke={peloOscuro}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="-7" cy="-269" r="2" fill="#2b211c" />
      <circle cx="7" cy="-269" r="2" fill="#2b211c" />
      <circle cx="-6.4" cy="-269.7" r="0.6" fill="#fff" />
      <circle cx="7.6" cy="-269.7" r="0.6" fill="#fff" />
      <path d="M-9.5 -265.5 l-1.5 1 M9.5 -265.5 l1.5 1" stroke="#2b211c" strokeWidth="0.8" />
      <rect
        x="-13"
        y="-274.5"
        width="11"
        height="9.5"
        rx="3.5"
        fill="#ffffff"
        fillOpacity="0.15"
        stroke="#7a3b5e"
        strokeWidth="1.5"
      />
      <rect
        x="2"
        y="-274.5"
        width="11"
        height="9.5"
        rx="3.5"
        fill="#ffffff"
        fillOpacity="0.15"
        stroke="#7a3b5e"
        strokeWidth="1.5"
      />
      <path
        d="M-2 -270.5 Q0 -272 2 -270.5 M-13 -271 l-3.5 -1 M13 -271 l3.5 -1"
        fill="none"
        stroke="#7a3b5e"
        strokeWidth="1.3"
      />
      {/* nariz, sonrisa y mejillas */}
      <path
        d="M0.5 -264 C-1.5 -260 -1 -258 1.5 -258"
        fill="none"
        stroke={bordePiel}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path d="M-6 -253.5 Q0 -248.5 6 -253.5" fill="#ffffff" stroke="#b5485a" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="-10" cy="-259" r="3.2" fill="#f2998a" opacity="0.35" />
      <circle cx="10" cy="-259" r="3.2" fill="#f2998a" opacity="0.35" />
      {/* tabla de pinza y manos encima */}
      <g className="encuesta__tabla-mano">
        <TablaEnMano />
      </g>
      {[-1, 1].map((l) => (
        <g key={l}>
          <ellipse cx={l * 22} cy="-142" rx="7" ry="6" fill={piel} stroke={bordePiel} strokeWidth="1.3" />
          <path d={`M${l * 18} -146 v-6`} stroke={piel} strokeWidth="4" strokeLinecap="round" />
          <path d={`M${l * 18} -146 v-6`} fill="none" stroke={bordePiel} strokeWidth="0.8" opacity="0.7" />
        </g>
      ))}
    </g>
  );
}

// ---------- Tabla grande: la encuesta y el gráfico ----------

// Palotes agrupados de a cinco (cuatro rayas y una cruzada), como se cuenta en clases.
function Palotes({ n }) {
  const grupos = Math.ceil(n / 5);
  const ancho = grupos * 38;
  return (
    <svg viewBox={`0 0 ${ancho} 30`} width={ancho} height="30" className="encuesta__palotes" aria-hidden="true">
      {Array.from({ length: grupos }, (_, g) => {
        const enGrupo = Math.min(5, n - g * 5);
        const x = 4 + g * 38;
        return (
          <g key={g}>
            {Array.from({ length: Math.min(4, enGrupo) }, (_, i) => (
              <path key={i} d={`M${x + i * 7} 4 l${i % 2 ? 0.8 : -0.6} 22`} />
            ))}
            {enGrupo === 5 && <path d={`M${x - 4} 22 L${x + 26} 8`} />}
          </g>
        );
      })}
    </svg>
  );
}

function TablaEncuesta({ titulo, pregunta, curso, datos }) {
  return (
    <div className="encuesta__tabla">
      <svg viewBox="-60 -26 120 62" className="encuesta__pinza" aria-hidden="true">
        <PinzaSvg x={0} y={0} ancho={100} />
      </svg>
      <div className="encuesta__hoja">
        <p className="encuesta__curso">Encuesta del {curso}</p>
        <p className="encuesta__pregunta">{pregunta}</p>
        <table className="encuesta__conteo">
          <thead>
            <tr>
              <th scope="col">Fruta</th>
              <th scope="col">Votos</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((d) => (
              <tr key={d.etiqueta}>
                <th scope="row">{d.etiqueta}</th>
                <td>
                  <Palotes n={d.valor} />
                  <span className="sr-only">{d.valor} votos</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="encuesta__grafico">
          <Grafico titulo={titulo} datos={datos} />
        </div>
      </div>
    </div>
  );
}

export function EncuestaProfesora({ titulo, pregunta = '¿Cuál es tu fruta favorita?', curso = '4° B', datos }) {
  const [fase, setFase] = useState(() => (sinMovimiento() ? 'lista' : 'acercando'));

  useEffect(() => {
    if (fase === 'lista') return undefined;
    const t1 = setTimeout(() => setFase('zoom'), DURACION_CAMINATA);
    const t2 = setTimeout(() => setFase('lista'), DURACION_CAMINATA + DURACION_ZOOM);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // solo al abrir la pregunta
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`encuesta encuesta--${fase}`}>
      {fase !== 'lista' && (
        <svg
          viewBox="0 0 1000 760"
          preserveAspectRatio="xMidYMid slice"
          className="encuesta__escena"
          role="img"
          aria-label="Una profesora entra a la sala con una tabla de pinza y la gira para mostrar la encuesta."
        >
          <g className="encuesta__vista">
            <Sala />
            <g className="encuesta__profesora">
              <Profesora />
            </g>
          </g>
        </svg>
      )}
      <TablaEncuesta titulo={titulo} pregunta={pregunta} curso={curso} datos={datos} />
    </div>
  );
}
