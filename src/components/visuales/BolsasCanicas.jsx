import { useEffect, useId, useMemo, useState } from 'react';
import Sello from '../Sello.jsx';

// ---------- Bolsas de malla con canicas "ojo de gato" (probabilidades) ----------
// 1) Mesa con las bolsas: la malla deja ver las canicas, así se pueden contar.
// 2) Al tocar una bolsa (esa es la respuesta del estudiante), la vista se acerca a
//    esa bolsa, baja una mano y saca una canica al azar: cada canica tiene la
//    misma posibilidad, así que el color sale con la proporción de la bolsa.
// 3) Al lado aparece un gráfico circular (anillo) con la probabilidad de sacar roja.
//
// Datos: bolsas: [{ etiqueta: 'Bolsa 1', bolitas: { roja: 2, azul: 2 } }, ...]
// Practica.jsx entrega en estado: elegir(texto) para responder, eleccion = { texto, n }
// (última bolsa elegida), descartadas, resuelto y correcta.

const NOMBRES = {
  roja: ['roja', 'rojas'],
  azul: ['azul', 'azules'],
};
const nombreColor = (color, n) => (NOMBRES[color] ?? [color, color])[n === 1 ? 0 : 1];
const describir = (bolitas) =>
  Object.entries(bolitas)
    .filter(([, n]) => n > 0)
    .map(([color, n]) => `${n} ${nombreColor(color, n)}`)
    .join(' y ');

const COLORES = {
  roja: { anillo: '#e0362c' },
  azul: { anillo: '#2c63d6' },
};

const sinMovimiento = () =>
  typeof window !== 'undefined' && Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
const pausa = (ms) => new Promise((r) => setTimeout(r, ms));

// Lugares de las canicas dentro de la bolsa (coordenadas de la bolsa, 200 x 240),
// de abajo hacia arriba, como si estuvieran apiladas.
const RADIO = 21;
const LUGARES = [
  [62, 199], [101, 202], [140, 199],
  [81, 163], [121, 164],
  [101, 128], [60, 130], [142, 130],
];

function armarCanicas(bolitas) {
  const colores = Object.entries(bolitas).flatMap(([color, n]) => Array.from({ length: n }, () => color));
  for (let i = colores.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [colores[i], colores[j]] = [colores[j], colores[i]];
  }
  return colores.map((color, i) => {
    const [x, y] = LUGARES[i % LUGARES.length];
    return {
      id: i,
      color,
      x: x + Math.round((Math.random() - 0.5) * 4),
      y: y + Math.round((Math.random() - 0.5) * 3),
      giro: Math.round(Math.random() * 360),
    };
  });
}

// ---------- Dibujos ----------

// Definiciones compartidas: el vidrio y el "ojo de gato" de cada color, y el brillo.
function DefinicionesCanicas() {
  const vidrio = {
    roja: ['#fff6f4', '#ffcdc7', '#ef8a80'],
    azul: ['#f4f8ff', '#cddcff', '#86a8ee'],
  };
  const ojo = {
    roja: { relleno: '#d8241b', borde: '#9a1812', veta: '#ff9187' },
    azul: { relleno: '#2457d0', borde: '#173c93', veta: '#9bbcff' },
  };
  return (
    <svg className="bc-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        {Object.entries(vidrio).map(([color, [c0, c1, c2]]) => (
          <radialGradient key={color} id={`bc-vidrio-${color}`} cx="0.4" cy="0.36" r="0.75">
            <stop offset="0" stopColor={c0} />
            <stop offset="0.6" stopColor={c1} />
            <stop offset="1" stopColor={c2} />
          </radialGradient>
        ))}
        {Object.entries(ojo).map(([color, c]) => (
          <symbol key={color} id={`bc-canica-${color}`} viewBox="-1.08 -1.08 2.16 2.16">
            <circle r="1" fill={`url(#bc-vidrio-${color})`} stroke={c.borde} strokeWidth="0.07" />
            {/* el "ojo de gato": una veta de color dentro del vidrio */}
            <path d="M-0.84 0.22 C-0.36 -0.52 0.36 -0.64 0.84 -0.22 C0.36 0.52 -0.36 0.64 -0.84 0.22 Z" fill={c.relleno} />
            <path d="M-0.58 0.12 C-0.2 -0.26 0.2 -0.34 0.58 -0.12" fill="none" stroke={c.veta} strokeWidth="0.1" strokeLinecap="round" />
          </symbol>
        ))}
        <symbol id="bc-brillo" viewBox="-1.08 -1.08 2.16 2.16">
          <ellipse cx="-0.4" cy="-0.46" rx="0.26" ry="0.14" transform="rotate(-35 -0.4 -0.46)" fill="#fff" opacity="0.92" />
          <circle cx="0.44" cy="0.5" r="0.08" fill="#fff" opacity="0.65" />
        </symbol>
      </defs>
    </svg>
  );
}

function Canica({ x, y, r = RADIO, color, giro = 0 }) {
  const lado = r * 2.16;
  return (
    <g transform={`translate(${x} ${y})`}>
      <g transform={`rotate(${giro})`}>
        <use href={`#bc-canica-${color}`} x={-lado / 2} y={-lado / 2} width={lado} height={lado} />
      </g>
      <use href="#bc-brillo" x={-lado / 2} y={-lado / 2} width={lado} height={lado} />
    </g>
  );
}

// Mano que baja con los dedos hacia abajo. (0, 0) es el centro de la canica que agarra;
// la mano queda un poco más arriba para que los dedos tapen solo la parte de arriba.
function Mano({ canica }) {
  return (
    <g className="bc-mano" transform="translate(0 -13)">
      {/* manga y puño */}
      <rect x="-19" y="-420" width="38" height="372" rx="9" fill="#4f7fd6" stroke="#2f5aa8" strokeWidth="3" />
      <rect x="-23" y="-60" width="46" height="15" rx="6" fill="#f4f6fb" stroke="#2f5aa8" strokeWidth="3" />
      {/* palma */}
      <path
        d="M-18 -46 C-22 -32 -21 -20 -16 -12 L16 -12 C21 -20 22 -32 18 -46 Z"
        fill="#f2c39b"
        stroke="#b97b4f"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* la canica queda entre los dedos */}
      {canica && <Canica x={0} y={13} color={canica.color} giro={canica.giro} />}
      {[-14, -5, 5, 14].map((x, i) => (
        <rect
          key={x}
          x={x - 4.5}
          y="-20"
          width="9"
          height={i === 0 || i === 3 ? 22 : 27}
          rx="4.5"
          fill="#f2c39b"
          stroke="#b97b4f"
          strokeWidth="2"
        />
      ))}
      {/* pulgar */}
      <path d="M18 -36 C30 -30 31 -16 24 -6" fill="none" stroke="#b97b4f" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

// Bolsa de malla abierta, en sus coordenadas (200 x 240). "dentro" se dibuja
// detrás de la malla (la mano que entra a la bolsa).
const CUERPO = 'M34 62 C22 104 16 168 30 204 C44 236 156 236 170 204 C184 168 178 104 166 62 Z';
const COLOR_MALLA = '#b5844a';
const COLOR_CORDON = '#8a5a2b';

function Bolsa({ etiqueta, canicas, oculta, dentro }) {
  const id = useId().replace(/:/g, '');
  const lineas = [];
  for (let d = -240; d <= 240; d += 19) lineas.push(d);
  return (
    <g>
      {/* sombra sobre la mesa */}
      <ellipse cx="100" cy="228" rx="78" ry="9" fill="#5b3a1a" opacity="0.22" />
      {/* boca, parte de atrás */}
      <ellipse cx="100" cy="62" rx="66" ry="14" fill="#f3e6d2" stroke={COLOR_MALLA} strokeWidth="3" />
      {/* fondo de la malla */}
      <path d={CUERPO} fill="#f6ead8" opacity="0.55" />
      {canicas.filter((c) => c.id !== oculta).map((c) => (
        <Canica key={c.id} {...c} />
      ))}
      {dentro}
      {/* malla */}
      <clipPath id={`bc-malla-${id}`}>
        <path d={CUERPO} />
      </clipPath>
      <g clipPath={`url(#bc-malla-${id})`} stroke={COLOR_MALLA} strokeWidth="2" opacity="0.75">
        {lineas.map((d) => (
          <line key={`a${d}`} x1={d} y1="40" x2={d + 200} y2="240" />
        ))}
        {lineas.map((d) => (
          <line key={`b${d}`} x1={d + 200} y1="40" x2={d} y2="240" />
        ))}
      </g>
      <path d={CUERPO} fill="none" stroke={COLOR_MALLA} strokeWidth="3.5" strokeLinejoin="round" />
      {/* cordón de la boca, parte de adelante, con un nudo */}
      <path d="M34 62 A66 14 0 0 0 166 62" fill="none" stroke={COLOR_CORDON} strokeWidth="5" strokeLinecap="round" />
      <path d="M100 76 C88 66 78 72 84 80 C88 84 96 80 100 76 C104 80 112 84 116 80 C122 72 112 66 100 76 Z" fill={COLOR_CORDON} />
      <path d="M98 77 L92 96 M102 77 L110 95" stroke={COLOR_CORDON} strokeWidth="3.5" strokeLinecap="round" />
      {/* etiqueta colgando */}
      <line x1="110" y1="95" x2="126" y2="106" stroke={COLOR_CORDON} strokeWidth="2" />
      <g transform="translate(150 118) rotate(-8)">
        <rect x="-38" y="-15" width="76" height="30" rx="6" fill="#fffdf6" stroke={COLOR_CORDON} strokeWidth="2" />
        <circle cx="-29" cy="0" r="3" fill="none" stroke={COLOR_CORDON} strokeWidth="1.5" />
        <text x="5" y="6" textAnchor="middle" className="bc-etiqueta">
          {etiqueta}
        </text>
      </g>
    </g>
  );
}

// Mesa de madera vista un poco desde arriba.
function Mesa({ ancho, superficie, alto }) {
  const frente = superficie + 52;
  return (
    <g aria-hidden="true">
      <rect x="56" y={frente + 26} width="26" height={alto - frente - 26} fill="#9a5f2a" />
      <rect x={ancho - 82} y={frente + 26} width="26" height={alto - frente - 26} fill="#9a5f2a" />
      <polygon points={`34,${superficie} ${ancho - 34},${superficie} ${ancho - 8},${frente} 8,${frente}`} fill="url(#bc-madera)" />
      <rect x="8" y={frente} width={ancho - 16} height="26" rx="3" fill="#b5743a" />
      <line x1="8" y1={frente} x2={ancho - 8} y2={frente} stroke="#8c5424" strokeWidth="2" />
    </g>
  );
}

function DefinicionMadera() {
  return (
    <defs>
      <linearGradient id="bc-madera" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e7b57a" />
        <stop offset="1" stopColor="#d29a5c" />
      </linearGradient>
    </defs>
  );
}

// ---------- Vista 1: la mesa con todas las bolsas ----------
const ANCHO_MESA = 820;

function VistaMesa({ bolsas, canicasPorBolsa, descartadas, correcta, onElegir }) {
  const escala = 0.86;
  const teclas = (e, etiqueta) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onElegir(etiqueta);
    }
  };
  return (
    <div className={`bc-mesa${correcta ? ' bc-mesa--sello' : ''}`}>
      {correcta && <Sello />}
      <svg viewBox={`0 95 ${ANCHO_MESA} 287`} className="bc-escena" role="group" aria-label="Bolsas sobre una mesa">
        <DefinicionMadera />
        <Mesa ancho={ANCHO_MESA} superficie={250} alto={382} />
        {bolsas.map((b, i) => {
          const cx = (ANCHO_MESA * (i + 0.5)) / bolsas.length;
          const descartada = descartadas.includes(b.etiqueta);
          const esCorrecta = correcta === b.etiqueta;
          let estadoTexto = '';
          if (descartada) estadoTexto = ', descartada';
          if (esCorrecta) estadoTexto = ', correcta';
          return (
            <g key={b.etiqueta} transform={`translate(${cx - 100 * escala} ${292 - 228 * escala}) scale(${escala})`}>
              <g
                className={`bc-bolsa${descartada ? ' bc-bolsa--descartada' : ''}${esCorrecta ? ' bc-bolsa--correcta' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={`${b.etiqueta}: ${describir(b.bolitas)}${estadoTexto}. Elegir esta bolsa.`}
                onClick={() => onElegir(b.etiqueta)}
                onKeyDown={(e) => teclas(e, b.etiqueta)}
              >
                <rect x="10" y="30" width="180" height="210" fill="transparent" className="bc-bolsa__zona" rx="16" />
                <Bolsa etiqueta={b.etiqueta} canicas={canicasPorBolsa[i]} />
              </g>
            </g>
          );
        })}
      </svg>
      <ul className="bc-conteo" style={{ gridTemplateColumns: `repeat(${bolsas.length}, 1fr)` }}>
        {bolsas.map((b) => (
          <li key={b.etiqueta}>
            {Object.entries(b.bolitas)
              .filter(([, n]) => n > 0)
              .map(([color, n]) => (
                <span key={color} className="bc-conteo__item">
                  <svg viewBox="-12 -12 24 24" aria-hidden="true">
                    <Canica x={0} y={0} r={10.5} color={color} giro={20} />
                  </svg>
                  {n} {nombreColor(color, n)}
                </span>
              ))}
          </li>
        ))}
      </ul>
      <p className="bc-ayuda">{correcta ? 'Puedes tocar una bolsa para sacar otra canica.' : 'Toca una bolsa para elegirla.'}</p>
    </div>
  );
}

// ---------- Vista 2: una bolsa, la mano y el gráfico ----------
const BOLSA_FOCO = { x: 250, escala: 1.35, piso: 404 };
// Corrido a la izquierda para dejar libre la esquina del sello.
const ANILLO = { cx: 548, cy: 238, r: 86, grosor: 34 };

function Anillo({ rojas, total, visible }) {
  const circ = 2 * Math.PI * ANILLO.r;
  const parte = total > 0 ? rojas / total : 0;
  const [lleno, setLleno] = useState(false);
  useEffect(() => {
    if (!visible) return undefined;
    const t = setTimeout(() => setLleno(true), 30);
    return () => clearTimeout(t);
  }, [visible]);
  if (!visible) return null;
  const largo = lleno ? parte * circ : 0;
  return (
    <g className="bc-anillo" role="img" aria-label={`Probabilidad de sacar una canica roja: ${rojas} de ${total}.`}>
      <text x={ANILLO.cx} y={ANILLO.cy - ANILLO.r - 66} textAnchor="middle" className="bc-anillo__titulo">
        Probabilidad de
      </text>
      <text x={ANILLO.cx} y={ANILLO.cy - ANILLO.r - 38} textAnchor="middle" className="bc-anillo__titulo">
        sacar roja
      </text>
      {/* parte azul (el resto) y parte roja, empezando arriba */}
      <circle cx={ANILLO.cx} cy={ANILLO.cy} r={ANILLO.r} fill="none" stroke={COLORES.azul.anillo} strokeWidth={ANILLO.grosor} />
      <circle
        className="bc-anillo__rojo"
        cx={ANILLO.cx}
        cy={ANILLO.cy}
        r={ANILLO.r}
        fill="none"
        stroke={COLORES.roja.anillo}
        strokeWidth={ANILLO.grosor}
        strokeDasharray={`${largo} ${circ}`}
        transform={`rotate(-90 ${ANILLO.cx} ${ANILLO.cy})`}
      />
      {/* separaciones entre canicas, para poder contar las partes */}
      {Array.from({ length: total }, (_, i) => {
        const a = (i / total) * 2 * Math.PI - Math.PI / 2;
        const r1 = ANILLO.r - ANILLO.grosor / 2 - 1;
        const r2 = ANILLO.r + ANILLO.grosor / 2 + 1;
        return (
          <line
            key={i}
            x1={ANILLO.cx + r1 * Math.cos(a)}
            y1={ANILLO.cy + r1 * Math.sin(a)}
            x2={ANILLO.cx + r2 * Math.cos(a)}
            y2={ANILLO.cy + r2 * Math.sin(a)}
            stroke="#fff"
            strokeWidth="4"
          />
        );
      })}
      <text x={ANILLO.cx} y={ANILLO.cy + 6} textAnchor="middle" className="bc-anillo__numero">
        {rojas} de {total}
      </text>
      <text x={ANILLO.cx} y={ANILLO.cy + 32} textAnchor="middle" className="bc-anillo__sub">
        {rojas === 1 ? 'es roja' : 'son rojas'}
      </text>
    </g>
  );
}

function VistaFoco({ bolsa, canicas, entrada, resultado, textoVolver, onOtraVez, onVolver }) {
  const total = canicas.length;
  const rojas = canicas.filter((c) => c.color === 'roja').length;
  // escondida → bajando → tomada → subiendo → grafico → listo
  const [fase, setFase] = useState('escondida');
  const [mano, setMano] = useState({ x: 100, y: -300, ms: 0 });
  const [sacada, setSacada] = useState(null);

  useEffect(() => {
    let vigente = true;
    const rapido = sinMovimiento();
    const t = (ms) => (rapido ? 1 : ms);
    // Cada canica tiene la misma posibilidad: el color sale con la proporción de la bolsa.
    const elegida = canicas[Math.floor(Math.random() * canicas.length)];

    async function jugar() {
      await pausa(t(entrada ? 750 : 150));
      if (!vigente) return;
      setFase('bajando');
      setMano({ x: elegida.x, y: elegida.y, ms: t(1100) });
      await pausa(t(1200));
      if (!vigente) return;
      setSacada(elegida);
      setFase('tomada');
      await pausa(t(350));
      if (!vigente) return;
      setFase('subiendo');
      setMano({ x: 100, y: -2, ms: t(1000) });
      await pausa(t(1100));
      if (!vigente) return;
      setFase('grafico');
      await pausa(t(1000));
      if (!vigente) return;
      setFase('listo');
    }
    jugar();
    return () => {
      vigente = false;
    };
  }, [canicas, entrada]);

  const { x, escala, piso } = BOLSA_FOCO;
  const verGrafico = fase === 'grafico' || fase === 'listo';

  return (
    <div className={`bc-foco${entrada ? ' bc-foco--entrada' : ''}`}>
      {resultado && verGrafico && <Sello tipo={resultado} animado />}
      <svg viewBox="0 0 820 470" className="bc-escena" role="img" aria-label={`${bolsa.etiqueta}: ${describir(bolsa.bolitas)}.`}>
        <DefinicionMadera />
        <g className="bc-foco__mesa">
          <Mesa ancho={820} superficie={352} alto={470} />
        </g>
        <g transform={`translate(${x - 100 * escala} ${piso - 228 * escala}) scale(${escala})`}>
          <g className="bc-foco__bolsa">
            <Bolsa
              etiqueta={bolsa.etiqueta}
              canicas={canicas}
              oculta={sacada?.id}
              dentro={
                // la mano parte arriba, fuera del dibujo, y desde ahí baja
                <g style={{ transform: `translate(${mano.x}px, ${mano.y}px)`, transition: `transform ${mano.ms}ms ease-in-out` }}>
                  <Mano canica={sacada} />
                </g>
              }
            />
          </g>
        </g>
        <Anillo rojas={rojas} total={total} visible={verGrafico} />
      </svg>

      <div className="bc-resultado" aria-live="polite">
        {fase === 'listo' && sacada && (
          <>
            <p>
              Salió una canica <strong className={`bc-color bc-color--${sacada.color}`}>{nombreColor(sacada.color, 1)}</strong>.{' '}
              En la {bolsa.etiqueta.toLowerCase()} hay {rojas} {nombreColor('roja', rojas)} de {total} canicas.
            </p>
            <div className="bc-resultado__botones">
              <button type="button" className="boton boton--suave" onClick={onOtraVez}>
                Sacar otra vez
              </button>
              <button type="button" className="boton boton--suave" onClick={onVolver}>
                {textoVolver}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function Bolsas({ bolsas, estado }) {
  const canicasPorBolsa = useMemo(() => bolsas.map((b) => armarCanicas(b.bolitas)), [bolsas]);
  // foco: { indice, entrada } de la bolsa que se está mirando, o null (mesa).
  // vuelta cambia en cada jugada para que la animación empiece de nuevo.
  const [foco, setFoco] = useState(null);
  const [vuelta, setVuelta] = useState(0);
  const eleccion = estado?.eleccion;

  const mirar = (indice, entrada) => {
    setFoco({ indice, entrada });
    setVuelta((v) => v + 1);
  };

  useEffect(() => {
    if (!eleccion) return;
    const indice = bolsas.findIndex((b) => b.etiqueta === eleccion.texto);
    if (indice >= 0) mirar(indice, true);
  }, [eleccion, bolsas]);

  function elegir(etiqueta) {
    if (estado?.elegir) estado.elegir(etiqueta);
    else mirar(bolsas.findIndex((b) => b.etiqueta === etiqueta), true);
  }

  const resuelto = Boolean(estado?.resuelto);
  const correcta = resuelto ? estado?.correcta : null;
  const descartadas = estado?.descartadas ?? [];
  // Sello de la bolsa elegida: verde si es la correcta, rojo si ya se descartó.
  const resultadoDe = (etiqueta) => {
    if (etiqueta === correcta) return 'correcto';
    if (descartadas.includes(etiqueta)) return 'incorrecto';
    return null;
  };
  // Después de un error, el botón invita a probar con otra bolsa.
  const textoVolver = !resuelto && estado?.elegir ? 'Elegir otra bolsa' : 'Volver a la mesa';

  return (
    <div className="bc">
      <DefinicionesCanicas />
      {foco ? (
        <VistaFoco
          key={vuelta}
          bolsa={bolsas[foco.indice]}
          canicas={canicasPorBolsa[foco.indice]}
          entrada={foco.entrada}
          resultado={resultadoDe(bolsas[foco.indice].etiqueta)}
          textoVolver={textoVolver}
          onOtraVez={() => mirar(foco.indice, false)}
          onVolver={() => setFoco(null)}
        />
      ) : (
        <VistaMesa
          bolsas={bolsas}
          canicasPorBolsa={canicasPorBolsa}
          descartadas={descartadas}
          correcta={correcta}
          onElegir={elegir}
        />
      )}
    </div>
  );
}
