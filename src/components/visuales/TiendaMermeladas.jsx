// ---------- Kiosco con un anaquel de mermeladas (probabilidades) ----------
// Vista desde la calle: un kiosco de prensa (bóveda negra con escudo, alero, refrigerador
// de bebidas, exhibidor de snacks y mostrador) y tres niños (dos niñas y un niño) llegando. Adentro hay un anaquel
// de madera de 3 repisas inclinadas, cada una con 2 compartimentos (6 en total, uno
// por sabor), con un cartel de madera arriba. Sobre cada bloque de frascos va un
// letrero con el sabor y al lado un marcador de tarjetas (como los de los partidos)
// con la cantidad. Los frascos se apilan hacia arriba y hacia el lado. El vendedor
// estira el brazo mostrando el anaquel.
//
// Datos: estantes: [{ sabor: 'Uva', frascos: 17 }, ...]   (color opcional)

const COLORES = {
  uva: { mermelada: '#6d2a7e', borde: '#47184f' },
  manzana: { mermelada: '#d9a13b', borde: '#9c6b17' },
  frutilla: { mermelada: '#d42b3c', borde: '#8f1522' },
  durazno: { mermelada: '#f4a46a', borde: '#b86a33' },
  naranja: { mermelada: '#ec7412', borde: '#a84d05' },
  piña: { mermelada: '#f3cf36', borde: '#b18f0c' },
};
const COLOR_GENERICO = { mermelada: '#c0504d', borde: '#80302e' };
const colorDe = (estante) =>
  estante.color
    ? { mermelada: estante.color, borde: '#555' }
    : (COLORES[estante.sabor.toLowerCase()] ?? COLOR_GENERICO);

const ANCHO = 1000;
const ALTO = 760;

// Tonos de madera del anaquel
const MADERA = '#b0723a';
const MADERA_OSCURA = '#77461d';
const MADERA_FONDO = '#dcab72';
const MADERA_VETA = '#c9955a';
const LISTON = '#c98d52';

// Anaquel: 3 repisas de 2 compartimentos (uno por sabor, grandes para ver bien los frascos).
const ANAQUEL = { x0: 225, x1: 625, arriba: 212, cartel: 36, repisa: 143, costado: 16, divisor: 8 };
const COLUMNAS = 2;
const FILAS = 3;
const interiorX0 = ANAQUEL.x0 + ANAQUEL.costado;
const interiorX1 = ANAQUEL.x1 - ANAQUEL.costado;
const anchoCompartimento = (interiorX1 - interiorX0 - (COLUMNAS - 1) * ANAQUEL.divisor) / COLUMNAS;
const inicioRepisas = ANAQUEL.arriba + ANAQUEL.cartel;
const finRepisas = inicioRepisas + FILAS * ANAQUEL.repisa;

// El frasco se dibuja en 16 x 18 y se agranda con ESCALA_FRASCO.
const ESCALA_FRASCO = 1.6;
const FRASCO = { ancho: 16 * ESCALA_FRASCO, alto: 18 * ESCALA_FRASCO, paso: 28, porFila: 6 };

function Frasco({ x: fx, base, color }) {
  const ancho = 16;
  const alto = 18;
  return (
    <g transform={`translate(${fx} ${base - FRASCO.alto}) scale(${ESCALA_FRASCO})`}>
      <rect
        y="3.5"
        width={ancho}
        height={alto - 3.5}
        rx="3"
        fill={color.mermelada}
        stroke={color.borde}
        strokeWidth="1.1"
      />
      {/* tapa con paño a cuadros */}
      <rect x="1" width={ancho - 2} height="5" rx="1.5" fill="#f7f1e3" stroke="#b5452f" strokeWidth="0.9" />
      <path d="M4.5 0 v5 M8 0 v5 M11.5 0 v5" stroke="#d4614a" strokeWidth="1" />
      {/* etiqueta y brillo */}
      <rect x="3" y="9" width={ancho - 6} height="5.5" rx="1" fill="#fff8e6" opacity="0.9" />
      <rect x="2.5" y="5.5" width="2" height={alto - 8} rx="1" fill="#fff" opacity="0.35" />
    </g>
  );
}

// Marcador de tarjetas, como los de los partidos: una tarjeta por cifra.
// Se dibuja con tarjetas de 14 de ancho y se agranda con ESCALA_MARCADOR.
const TARJETA = 14;
const ESCALA_MARCADOR = 1.45;
const anchoDeMarcador = (n) => (String(n).length * (TARJETA + 2) + 4) * ESCALA_MARCADOR;

function Marcador({ x, y, n }) {
  const cifras = String(n).split('');
  const ancho = anchoDeMarcador(n) / ESCALA_MARCADOR;
  return (
    <g transform={`translate(${x} ${y}) scale(${ESCALA_MARCADOR})`}>
      <rect x={-ancho / 2} width={ancho} height="24" rx="2.5" fill="#2b2f3a" />
      {cifras.map((c, i) => {
        const tx = -ancho / 2 + 3 + i * (TARJETA + 2);
        return (
          <g key={i}>
            <rect x={tx} y="3" width={TARJETA} height="19" rx="1.5" fill="#fff" />
            <line x1={tx} x2={tx + TARJETA} y1="12.5" y2="12.5" stroke="#c9ccd3" strokeWidth="0.8" />
            <text x={tx + TARJETA / 2} y="18" className="tienda__cifra">
              {c}
            </text>
            {/* argollas de las que cuelgan las tarjetas */}
            <circle cx={tx + 4} cy="2.5" r="1.7" fill="none" stroke="#c0c4cc" strokeWidth="1" />
            <circle cx={tx + TARJETA - 4} cy="2.5" r="1.7" fill="none" stroke="#c0c4cc" strokeWidth="1" />
          </g>
        );
      })}
    </g>
  );
}

function Compartimento({ fila, columna, estante }) {
  const x = interiorX0 + columna * (anchoCompartimento + ANAQUEL.divisor);
  const y0 = inicioRepisas + fila * ANAQUEL.repisa;
  const y1 = y0 + ANAQUEL.repisa;
  const base = y1 - 13; // donde se apoyan los frascos (el tope de adelante los tapa un poco)

  let contenido = null;
  if (estante) {
    const color = colorDe(estante);
    const { paso, porFila } = FRASCO;
    // todas las tablas cuelgan a la misma altura, cerca de la parte de arriba del compartimento
    const ly = y0 + 8;
    // el letrero ocupa lo que deja libre el marcador (1 o 2 tarjetas)
    const anchoMarcador = anchoDeMarcador(estante.frascos);
    const anchoLetrero = anchoCompartimento - anchoMarcador - 10;
    contenido = (
      <g>
        {/* frascos apilados: de abajo hacia arriba, centrados en el compartimento */}
        {Array.from({ length: estante.frascos }, (_, i) => {
          const filaPila = Math.floor(i / porFila);
          const enEstaFila = Math.min(porFila, estante.frascos - filaPila * porFila);
          const posicion = i % porFila;
          const anchoFila = enEstaFila * paso - (paso - FRASCO.ancho);
          const fx = x + (anchoCompartimento - anchoFila) / 2 + posicion * paso;
          return <Frasco key={i} x={fx} base={base - filaPila * FRASCO.alto} color={color} />;
        })}
        {/* tabla de madera colgando con el sabor en letras negras y grandes, y al lado el marcador */}
        {[x + 16, x + anchoLetrero - 8].map((cx) => (
          <g key={cx}>
            <line x1={cx} x2={cx} y1={y0} y2={ly + 6} stroke="#5a3d20" strokeWidth="1.6" />
            <circle cx={cx} cy={y0 + 1.5} r="2" fill="#5a3d20" />
          </g>
        ))}
        <rect
          x={x + 4}
          y={ly + 2}
          width={anchoLetrero}
          height="30"
          rx="3"
          fill="#e2b77c"
          stroke="#77461d"
          strokeWidth="2"
        />
        <path
          d={`M${x + 8} ${ly + 9} H${x + anchoLetrero - 20} M${x + 30} ${ly + 26} H${x + anchoLetrero}`}
          stroke="#b98447"
          strokeWidth="1"
        />
        {[x + 16, x + anchoLetrero - 8].map((cx) => (
          <circle key={cx} cx={cx} cy={ly + 6} r="1.8" fill="#4a3517" />
        ))}
        <text x={x + 4 + anchoLetrero / 2} y={ly + 25} className="tienda__sabor">
          {estante.sabor}
        </text>
        <Marcador x={x + anchoCompartimento - 4 - anchoMarcador / 2} y={ly} n={estante.frascos} />
      </g>
    );
  }

  return (
    <g>
      {/* piso de listones inclinado hacia adelante, con rendijas */}
      <rect x={x} y={y1 - 24} width={anchoCompartimento} height="12" fill="#5a3d20" />
      {[0, 1, 2].map((k) => (
        <rect key={k} x={x} y={y1 - 24 + k * 4} width={anchoCompartimento} height="2.6" fill={LISTON} />
      ))}
      {contenido}
    </g>
  );
}

// Tope delantero de madera de cada repisa.
function Tope({ y }) {
  const x0 = ANAQUEL.x0 + ANAQUEL.costado - 2;
  const x1 = ANAQUEL.x1 - ANAQUEL.costado + 2;
  return (
    <g>
      <rect x={x0} y={y} width={x1 - x0} height="14" rx="2" fill={MADERA} stroke={MADERA_OSCURA} strokeWidth="1.5" />
      <path
        d={`M${x0 + 6} ${y + 5} H${x1 - 40} M${x0 + 60} ${y + 9.5} H${x1 - 6}`}
        stroke={MADERA_OSCURA}
        strokeWidth="1"
        opacity="0.45"
      />
    </g>
  );
}

function Anaquel({ estantes }) {
  const { x0, x1, arriba, cartel, costado, divisor, repisa } = ANAQUEL;
  return (
    <g>
      {/* fondo de madera con vetas */}
      <rect x={x0} y={inicioRepisas} width={x1 - x0} height={finRepisas - inicioRepisas} fill={MADERA_FONDO} />
      {Array.from({ length: Math.floor((x1 - x0 - 30) / 38) + 1 }, (_, i) => (
        <path
          key={i}
          d={`M${x0 + 30 + i * 38} ${inicioRepisas} C${x0 + 26 + i * 38} ${inicioRepisas + 120} ${x0 + 36 + i * 38} ${finRepisas - 140} ${x0 + 32 + i * 38} ${finRepisas}`}
          fill="none"
          stroke={MADERA_VETA}
          strokeWidth="1.4"
        />
      ))}
      {Array.from({ length: FILAS * COLUMNAS }, (_, k) => (
        <Compartimento key={k} fila={Math.floor(k / COLUMNAS)} columna={k % COLUMNAS} estante={estantes[k]} />
      ))}
      {/* divisiones bajas entre compartimentos */}
      {Array.from({ length: FILAS }, (_, f) =>
        Array.from({ length: COLUMNAS - 1 }, (_, c) => {
          const dx = interiorX0 + (c + 1) * anchoCompartimento + c * divisor;
          const y1 = inicioRepisas + (f + 1) * repisa;
          return (
            <rect
              key={`${f}-${c}`}
              x={dx}
              y={y1 - 66}
              width={divisor}
              height="54"
              fill={MADERA}
              stroke={MADERA_OSCURA}
              strokeWidth="1"
            />
          );
        }),
      )}
      {/* tope delantero de cada repisa */}
      {Array.from({ length: FILAS }, (_, f) => (
        <Tope key={f} y={inicioRepisas + (f + 1) * repisa - 14} />
      ))}
      {/* costados */}
      {[x0, x1 - costado].map((cx) => (
        <g key={cx}>
          <rect
            x={cx}
            y={inicioRepisas - 2}
            width={costado}
            height={finRepisas - inicioRepisas + 18}
            fill={MADERA}
            stroke={MADERA_OSCURA}
            strokeWidth="1.5"
          />
          <line
            x1={cx + 6}
            x2={cx + 7}
            y1={inicioRepisas + 10}
            y2={finRepisas + 6}
            stroke={MADERA_OSCURA}
            strokeWidth="1"
            opacity="0.4"
          />
        </g>
      ))}
      {/* cartel de arriba, que sobresale un poco */}
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
      <path
        d={`M${x0} ${arriba + 8} H${x0 + 120} M${x1 - 140} ${arriba + 29} H${x1}`}
        stroke={MADERA_OSCURA}
        strokeWidth="1"
        opacity="0.4"
      />
      <text x={(x0 + x1) / 2} y={arriba + 25} className="tienda__cartel">
        MERMELADAS
      </text>
    </g>
  );
}

// ---------- Personas ----------

// Vendedor detrás del mostrador, dibujado con el mismo estilo que los niños pero
// mayor: pelo canoso con entradas, bigote y arrugas. Se dibuja de frente en las
// mismas coordenadas que los niños (pies en y = 0) y se escala; del mostrador
// hacia abajo queda tapado. Mira a los niños y estira el brazo hacia el anaquel.
export function Vendedor() {
  const piel = '#eab98d';
  const bordePiel = '#9c6440';
  const sombraPiel = '#d39a6c';
  const polera = '#86b6e2';
  const poleraBorde = '#4a7cae';
  const canas = '#c4c4ca';
  const canasOscuro = '#8d8d93';
  const manga = 'M-34 -236 C-44 -232 -49 -216 -48 -202 L-35 -198 C-35 -212 -34 -224 -31 -230 Z';
  return (
    <g transform="translate(770 652) scale(1.33)">
      {/* caderas (quedan detrás del mostrador) */}
      <path d="M-30 -146 H30 L31 -96 H-31 Z" fill="#4a4f5c" stroke="#30343d" strokeWidth="1.6" />
      {/* brazo apoyado en el mostrador */}
      <path
        d="M40 -210 C46 -184 44 -152 34 -126"
        fill="none"
        stroke={bordePiel}
        strokeWidth="13"
        strokeLinecap="round"
      />
      <path d="M40 -210 C46 -184 44 -152 34 -126" fill="none" stroke={piel} strokeWidth="10.5" strokeLinecap="round" />
      <ellipse cx="29" cy="-119" rx="8.5" ry="5.5" fill={piel} stroke={bordePiel} strokeWidth="1.4" />
      {/* torso con polera */}
      <path
        d="M-34 -236 C-38 -218 -36 -180 -30 -140 H30 C36 -180 38 -218 34 -236 C22 -244 -22 -244 -34 -236 Z"
        fill={polera}
        stroke={poleraBorde}
        strokeWidth="1.6"
      />
      <path
        d={manga}
        fill={polera}
        stroke={poleraBorde}
        strokeWidth="1.5"
        strokeLinejoin="round"
        transform="scale(-1 1)"
      />
      {/* delantal */}
      <path d="M-15 -214 L-9 -242 M15 -214 L9 -242" stroke="#2c6b42" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M-21 -214 H21 L25 -96 H-25 Z" fill="#3f8f5a" stroke="#2c6b42" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M-18 -209 H18" stroke="#74b98c" strokeWidth="1" strokeDasharray="3 2.5" />
      <rect x="-12" y="-186" width="24" height="18" rx="3" fill="#357a4c" stroke="#2c6b42" strokeWidth="1.2" />
      <g transform="rotate(10 7 -190)">
        <rect x="5" y="-200" width="4" height="17" rx="1" fill="#f2c230" stroke="#a5830f" strokeWidth="0.8" />
        <rect x="5" y="-202" width="4" height="3.5" rx="1" fill="#f08aa0" />
      </g>
      {/* brazo estirado hacia el anaquel, con la mano abierta */}
      <path
        d="M-32 -234 C-44 -236 -56 -235 -63 -232 L-61 -215 C-53 -218 -43 -219 -32 -217 Z"
        fill={polera}
        stroke={poleraBorde}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M-60 -224 C-76 -225 -92 -226 -106 -228"
        fill="none"
        stroke={bordePiel}
        strokeWidth="13"
        strokeLinecap="round"
      />
      <path
        d="M-60 -224 C-76 -225 -92 -226 -106 -228"
        fill="none"
        stroke={piel}
        strokeWidth="10.5"
        strokeLinecap="round"
      />
      <ellipse cx="-113" cy="-228" rx="9" ry="6" fill={piel} stroke={bordePiel} strokeWidth="1.4" />
      <ellipse
        cx="-109"
        cy="-235"
        rx="2.6"
        ry="4.5"
        fill={piel}
        stroke={bordePiel}
        strokeWidth="1.2"
        transform="rotate(-20 -109 -235)"
      />
      <path d="M-120 -230 h4 M-120 -226.5 h4" stroke={bordePiel} strokeWidth="0.9" strokeLinecap="round" />
      {/* cuello de la polera */}
      <rect x="-5.5" y="-252" width="11" height="16" rx="3" fill={piel} stroke={bordePiel} strokeWidth="1.3" />
      <path
        d="M-11 -240 L0 -230 L-3 -242 Z M11 -240 L0 -230 L3 -242 Z"
        fill="#f4f7fb"
        stroke="#9fb1c4"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <circle cx="0" cy="-224" r="1.3" fill="#f4f7fb" stroke="#9fb1c4" strokeWidth="0.6" />
      {/* cabeza de frente */}
      <ellipse cx="-18" cy="-271" rx="3.6" ry="6" fill={piel} stroke={bordePiel} strokeWidth="1.2" />
      <ellipse cx="18" cy="-271" rx="3.6" ry="6" fill={piel} stroke={bordePiel} strokeWidth="1.2" />
      <ellipse cx="0" cy="-272" rx="18" ry="22" fill={piel} stroke={bordePiel} strokeWidth="1.4" />
      {/* pelo canoso corto, con entradas */}
      <path
        d="M-18 -276 C-19 -296 -8 -299 0 -298 C8 -299 19 -296 18 -276 C16 -283 13 -287 9 -288 C5 -285 -5 -285 -9 -288 C-13 -287 -16 -283 -18 -276 Z"
        fill={canas}
        stroke={canasOscuro}
        strokeWidth="1.2"
      />
      <path
        d="M-17.5 -276 C-18 -268 -17 -263 -15.5 -260 M17.5 -276 C18 -268 17 -263 15.5 -260"
        fill="none"
        stroke={canas}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {[
        'M-10 -295 C-12 -291 -13 -288 -13 -286',
        'M0 -298 C0 -294 -1 -290 -2 -287',
        'M10 -295 C12 -291 13 -288 13 -286',
      ].map((d) => (
        <path key={d} d={d} fill="none" stroke={canasOscuro} strokeWidth="0.9" strokeLinecap="round" />
      ))}
      {/* arrugas de la frente */}
      <path d="M-7 -282 Q0 -284 7 -282 M-5 -279 Q0 -280.5 5 -279" fill="none" stroke={sombraPiel} strokeWidth="0.8" />
      {/* cejas canosas, ojos mirando a los niños y patas de gallo */}
      <path
        d="M-11 -276 Q-7 -278.5 -3 -276.5 M3 -276.5 Q7 -278.5 11 -276"
        fill="none"
        stroke={canasOscuro}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <ellipse cx="-6" cy="-271.5" rx="2" ry="2.5" fill="#2b211c" />
      <ellipse cx="8" cy="-271.5" rx="2" ry="2.5" fill="#2b211c" />
      <circle cx="-5.3" cy="-272.4" r="0.6" fill="#fff" />
      <circle cx="8.7" cy="-272.4" r="0.6" fill="#fff" />
      <path
        d="M-12.5 -272 l-2.5 -1 M-12.5 -270 l-2.5 1 M14 -272 l2.5 -1 M14 -270 l2.5 1"
        stroke={sombraPiel}
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      {/* nariz, bigote, sonrisa y pliegues de la cara */}
      <path
        d="M1 -270 C-1.5 -264 -1 -261 2 -261"
        fill="none"
        stroke={bordePiel}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M-7 -257.5 C-4 -261 -1 -260.5 1 -259 C3 -260.5 6 -261 9 -257.5 C6 -255.5 3 -256 1 -256.8 C-1 -256 -4 -255.5 -7 -257.5 Z"
        fill={canas}
        stroke={canasOscuro}
        strokeWidth="0.8"
      />
      <path d="M-4 -253.5 Q1 -250.5 6 -253.5" fill="none" stroke="#9c3d32" strokeWidth="1.2" strokeLinecap="round" />
      <path
        d="M-9 -262 C-10 -258 -9.5 -255 -8 -253 M11 -262 C12 -258 11.5 -255 10 -253"
        fill="none"
        stroke={sombraPiel}
        strokeWidth="0.8"
      />
      <circle cx="-10" cy="-264" r="3" fill="#f2998a" opacity="0.25" />
      <circle cx="12" cy="-264" r="3" fill="#f2998a" opacity="0.25" />
    </g>
  );
}

// ---------- Niños de espaldas, de pie frente al kiosco ----------
// (con paso: 'izq' o 'der' en sus datos, levantan ese pie como si caminaran)
// Cada uno se dibuja con 300 de alto (pies en y = 0, centro en x = 0) y se escala.

function Pierna({ cx, levantada, e }) {
  const fin = levantada ? -22 : 0; // el pie que da el paso se levanta y se ve la suela
  const conPantalon = e.abajo === 'pantalon';
  return (
    <g>
      <path
        d={`M${cx - 8} -142 L${cx + 8} -142 L${cx + 6.5} ${fin - 12} L${cx - 6.5} ${fin - 12} Z`}
        fill={conPantalon ? e.abajoColor : e.piel}
        stroke={conPantalon ? e.abajoBorde : e.bordePiel}
        strokeWidth="1.6"
      />
      {conPantalon && <path d={`M${cx - 7} ${fin - 16} H${cx + 7}`} stroke={e.abajoBorde} strokeWidth="1.4" />}
      {e.calcetas && (
        <rect
          x={cx - 6.8}
          y={fin - 42}
          width="13.6"
          height="30"
          rx="2"
          fill={e.calcetas}
          stroke="#c9ccd3"
          strokeWidth="1"
        />
      )}
      {levantada ? (
        <g>
          <rect x={cx - 10} y={fin - 15} width="20" height="19" rx="7" fill={e.zapatos} />
          <rect x={cx - 8} y={fin - 12} width="16" height="15" rx="6" fill="#eceef0" stroke="#b9bcc2" strokeWidth="1" />
          {[-8, -4, 0].map((dy) => (
            <line key={dy} x1={cx - 5} x2={cx + 5} y1={fin + dy} y2={fin + dy} stroke="#c3c7cd" strokeWidth="1.3" />
          ))}
        </g>
      ) : (
        <g>
          <path
            d={`M${cx - 9} -14 h18 q5 0 5 6 v6 h-28 v-6 q0 -6 5 -6 Z`}
            fill={e.zapatos}
            stroke="#00000055"
            strokeWidth="1.2"
          />
          <rect x={cx - 14} y="-3" width="28" height="4" rx="2" fill="#f4f4f5" stroke="#b9bcc2" strokeWidth="0.8" />
        </g>
      )}
    </g>
  );
}

function Brazo({ lado, e, giro }) {
  // lado: -1 izquierda, 1 derecha
  const d = 'M-38 -206 C-41 -182 -42 -158 -41 -130';
  const largo = e.mangas === 'largas';
  return (
    <g transform={`scale(${lado} 1) rotate(${giro} -32 -226)`}>
      <path d={d} fill="none" stroke={largo ? e.poleraBorde : e.bordePiel} strokeWidth="13" strokeLinecap="round" />
      <path d={d} fill="none" stroke={largo ? e.polera : e.piel} strokeWidth="10.5" strokeLinecap="round" />
      {largo && <rect x="-47" y="-136" width="12" height="7" rx="2.5" fill={e.poleraBorde} />}
      <ellipse cx="-41" cy="-121" rx="5.5" ry="8" fill={e.piel} stroke={e.bordePiel} strokeWidth="1.4" />
    </g>
  );
}

// Con e.mira = 'izquierda' la cabeza gira hacia la izquierda (hacia el anaquel):
// se ve el perfil de la mejilla con la nariz y las pestañas, y la oreja izquierda
// se corre hacia el centro.
function Cabeza({ e }) {
  const gira = e.mira === 'izquierda';
  return (
    <g>
      <rect x="-6.5" y="-254" width="13" height="22" rx="3" fill={e.piel} stroke={e.bordePiel} strokeWidth="1.4" />
      {gira ? (
        <g>
          <path
            d="M-10 -290 C-19 -287 -24 -279 -23.5 -272 L-27.5 -266 L-23.2 -263.5 C-22.5 -256 -18 -251 -10 -250 Z"
            fill={e.piel}
            stroke={e.bordePiel}
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path d="M-22.5 -276 l-3 -1.5 M-22.8 -274.5 l-3.2 0" stroke="#1d1410" strokeWidth="1" strokeLinecap="round" />
        </g>
      ) : (
        <ellipse cx="-20.5" cy="-268" rx="4" ry="6.5" fill={e.piel} stroke={e.bordePiel} strokeWidth="1.3" />
      )}
      <ellipse cx="20.5" cy="-268" rx="4" ry="6.5" fill={e.piel} stroke={e.bordePiel} strokeWidth="1.3" />
      <g transform={gira ? 'translate(3 0)' : undefined}>
        <ellipse cx="0" cy="-275" rx="21.5" ry="25" fill={e.pelo} stroke={e.peloOscuro} strokeWidth="1.5" />
        {e.peinado === 'corto' && (
          <g>
            <path d="M-19 -266 C-16 -252 -8 -250 0 -251 C8 -250 16 -252 19 -266 Z" fill={e.pelo} />
            <path
              d="M-12 -253 l2 4 2 -4 2 4 2 -4 2 4 2 -4 2 4 2 -4 2 4 2 -4"
              fill="none"
              stroke={e.peloOscuro}
              strokeWidth="1"
            />
            {[
              'M2 -288 C-6 -284 -12 -276 -15 -266',
              'M2 -288 C-2 -280 -4 -268 -4 -256',
              'M2 -288 C6 -280 8 -268 7 -256',
              'M2 -288 C10 -284 15 -276 16 -266',
            ].map((d) => (
              <path key={d} d={d} fill="none" stroke={e.peloOscuro} strokeWidth="1.2" strokeLinecap="round" />
            ))}
            <path
              d="M2 -288 C0 -296 5 -300 9 -298"
              fill="none"
              stroke={e.pelo}
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </g>
        )}
        {e.peinado === 'cola' && (
          <g>
            <path d="M-20 -270 C-18 -256 -10 -252 0 -252 C10 -252 18 -256 20 -270 Z" fill={e.pelo} />
            {[
              'M-14 -292 C-6 -290 -2 -288 0 -284',
              'M14 -292 C6 -290 2 -288 0 -284',
              'M-19 -272 C-10 -276 -4 -280 0 -284',
              'M19 -272 C10 -276 4 -280 0 -284',
            ].map((d) => (
              <path key={d} d={d} fill="none" stroke={e.peloOscuro} strokeWidth="1.1" strokeLinecap="round" />
            ))}
            <path
              d="M-5 -282 C-15 -262 -12 -232 -3 -210 C5 -228 11 -260 5 -282 Z"
              fill={e.pelo}
              stroke={e.peloOscuro}
              strokeWidth="1.3"
            />
            <path
              d="M-1 -270 C-4 -254 -3 -238 -2 -222 M2 -272 C2 -256 3 -240 1 -226"
              fill="none"
              stroke={e.peloOscuro}
              strokeWidth="1"
            />
            <ellipse cx="0" cy="-284" rx="7" ry="4" fill={e.accesorio} stroke="#00000044" strokeWidth="1" />
          </g>
        )}
        {e.peinado === 'trenzas' && (
          <g>
            <path d="M0 -299 V-256" stroke={e.peloOscuro} strokeWidth="1.4" />
            <path
              d="M-20 -270 C-18 -258 -12 -254 -6 -253 M20 -270 C18 -258 12 -254 6 -253"
              fill="none"
              stroke={e.peloOscuro}
              strokeWidth="1.1"
            />
            {[-1, 1].map((l) => (
              <g key={l}>
                {Array.from({ length: 6 }, (_, i) => (
                  <ellipse
                    key={i}
                    cx={l * (13 + i * 0.6)}
                    cy={-252 + i * 8.5}
                    rx="5"
                    ry="5.2"
                    fill={e.pelo}
                    stroke={e.peloOscuro}
                    strokeWidth="1"
                  />
                ))}
                <path
                  d={`M${l * 16.6} -202 l${l * 6} -4 v8 Z M${l * 16.6} -202 l${l * -6} -4 v8 Z`}
                  fill={e.accesorio}
                  stroke="#00000044"
                  strokeWidth="0.8"
                />
                <path
                  d={`M${l * 16.6} -199 l${l * 1.5} 7 M${l * 16.6} -199 l${l * -1} 7`}
                  stroke={e.pelo}
                  strokeWidth="2"
                />
              </g>
            ))}
            <path
              d="M-21 -282 C-10 -298 10 -298 21 -282"
              fill="none"
              stroke={e.accesorio}
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        )}
      </g>
      {gira && (
        <g>
          <ellipse cx="-9" cy="-266" rx="3.6" ry="6.2" fill={e.piel} stroke={e.bordePiel} strokeWidth="1.3" />
          <path d="M-7.5 -270 C-10.5 -269 -10.5 -263 -7.5 -262" fill="none" stroke={e.bordePiel} strokeWidth="1" />
        </g>
      )}
    </g>
  );
}

function Nino({ x, pies, alto, e }) {
  const s = alto / 300;
  const torso = 'M-30 -232 C-34 -214 -32 -176 -26 -146 H26 C32 -176 34 -214 30 -232 C18 -240 -18 -240 -30 -232 Z';
  const manga = 'M-30 -232 C-40 -228 -45 -212 -44 -198 L-31 -194 C-31 -208 -30 -220 -27 -226 Z';
  return (
    <g transform={`translate(${x} ${pies}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx="44" ry="6" fill="#000" opacity="0.15" />
      <Pierna cx={-11} levantada={e.paso === 'izq'} e={e} />
      <Pierna cx={11} levantada={e.paso === 'der'} e={e} />
      {e.abajo === 'pantalon' && (
        <g>
          <path d="M-25 -152 H25 L24 -128 H-24 Z" fill={e.abajoColor} stroke={e.abajoBorde} strokeWidth="1.6" />
          <path
            d="M0 -152 V-132 M-19 -146 h11 v9 q-5.5 3 -11 0 Z M8 -146 h11 v9 q-5.5 3 -11 0 Z"
            fill="none"
            stroke={e.abajoBorde}
            strokeWidth="1.2"
          />
        </g>
      )}
      {e.abajo === 'falda' && (
        <g>
          <path
            d="M-27 -154 H27 L38 -100 H-38 Z"
            fill={e.abajoColor}
            stroke={e.abajoBorde}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {[-22, -11, 0, 11, 22].map((px) => (
            <path key={px} d={`M${px * 0.7} -152 L${px} -101`} stroke={e.abajoBorde} strokeWidth="1" opacity="0.7" />
          ))}
        </g>
      )}
      <Brazo lado={-1} e={e} giro={e.paso === 'izq' ? 4 : e.paso ? -3 : 0} />
      <Brazo lado={1} e={e} giro={e.paso === 'izq' ? -3 : e.paso ? 4 : 0} />
      {e.abajo === 'jumper' ? (
        <g>
          <path d={torso} fill={e.polera} stroke={e.poleraBorde} strokeWidth="1.6" />
          <path
            d="M-24 -230 H24 L26 -152 C30 -132 37 -114 40 -100 H-40 C-37 -114 -30 -132 -26 -152 Z"
            fill={e.abajoColor}
            stroke={e.abajoBorde}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M-26 -152 H26" stroke={e.abajoBorde} strokeWidth="1.4" />
          <path d="M-12 -150 L-16 -101 M12 -150 L16 -101" stroke={e.abajoBorde} strokeWidth="1" opacity="0.7" />
        </g>
      ) : (
        <g>
          <path d={torso} fill={e.polera} stroke={e.poleraBorde} strokeWidth="1.6" />
          <path d="M-26 -150 H26" stroke={e.poleraBorde} strokeWidth="1.2" />
          <path
            d="M-18 -200 C-14 -186 -14 -170 -16 -156 M18 -200 C14 -186 14 -170 16 -156"
            fill="none"
            stroke={e.poleraBorde}
            strokeWidth="1"
            opacity="0.5"
          />
        </g>
      )}
      <path d={manga} fill={e.polera} stroke={e.poleraBorde} strokeWidth="1.5" strokeLinejoin="round" />
      <path
        d={manga}
        fill={e.polera}
        stroke={e.poleraBorde}
        strokeWidth="1.5"
        strokeLinejoin="round"
        transform="scale(-1 1)"
      />
      {e.mochila && (
        <g>
          <path d="M-17 -236 v12 M17 -236 v12" stroke={e.mochilaBorde} strokeWidth="6" strokeLinecap="round" />
          <rect
            x="-23"
            y="-228"
            width="46"
            height="72"
            rx="12"
            fill={e.mochila}
            stroke={e.mochilaBorde}
            strokeWidth="1.6"
          />
          <path d="M-18 -210 Q0 -219 18 -210" fill="none" stroke={e.mochilaBorde} strokeWidth="1.4" />
          <rect
            x="-16"
            y="-192"
            width="32"
            height="30"
            rx="8"
            fill="#ffffff"
            opacity="0.25"
            stroke={e.mochilaBorde}
            strokeWidth="1.3"
          />
          <path d="M-12 -184 H12" stroke={e.mochilaBorde} strokeWidth="1.2" />
          <path d="M-8 -236 C-8 -244 8 -244 8 -236" fill="none" stroke={e.mochilaBorde} strokeWidth="2.5" />
        </g>
      )}
      <Cabeza e={e} />
    </g>
  );
}

const NINOS = [
  {
    // niña con cola de caballo, chaleco rosado de manga larga y falda
    x: 690,
    pies: 744,
    alto: 290,
    e: {
      mira: 'izquierda',
      piel: '#f0c39c',
      bordePiel: '#b07a52',
      pelo: '#7a4a24',
      peloOscuro: '#4d2d14',
      peinado: 'cola',
      accesorio: '#f2b632',
      polera: '#e87aa0',
      poleraBorde: '#b04a72',
      mangas: 'largas',
      abajo: 'falda',
      abajoColor: '#3a4a7a',
      abajoBorde: '#26315a',
      calcetas: '#ffffff',
      zapatos: '#2b2f3a',
      mochila: '#8e5bc4',
      mochilaBorde: '#5e3a8a',
    },
  },
  {
    // niño de pelo corto, polera amarilla, jeans y mochila azul
    x: 790,
    pies: 750,
    alto: 278,
    e: {
      mira: 'izquierda',
      piel: '#d9a273',
      bordePiel: '#9c6a42',
      pelo: '#2f1d12',
      peloOscuro: '#140b06',
      peinado: 'corto',
      polera: '#f2b632',
      poleraBorde: '#b98714',
      mangas: 'cortas',
      abajo: 'pantalon',
      abajoColor: '#3c6ec4',
      abajoBorde: '#264a8a',
      zapatos: '#d8423a',
      mochila: '#2f8fb0',
      mochilaBorde: '#1d5f78',
    },
  },
  {
    // niña con dos trenzas, cintillo y jumper celeste sobre polera blanca
    x: 872,
    pies: 746,
    alto: 262,
    e: {
      mira: 'izquierda',
      piel: '#a8724a',
      bordePiel: '#6f4527',
      pelo: '#1d1410',
      peloOscuro: '#000',
      peinado: 'trenzas',
      accesorio: '#e0453a',
      polera: '#fbfbfd',
      poleraBorde: '#b9bec8',
      mangas: 'cortas',
      abajo: 'jumper',
      abajoColor: '#6fb3e0',
      abajoBorde: '#3f80ad',
      calcetas: '#ffffff',
      zapatos: '#7a3b1e',
    },
  },
];

export function Ninos() {
  return (
    <g>
      {NINOS.map((n) => (
        <Nino key={n.x} {...n} />
      ))}
    </g>
  );
}

// ---------- Kiosco de prensa ----------

const PORTADAS = [
  '#d9473b',
  '#f2b632',
  '#2f6fd0',
  '#ffffff',
  '#ec7412',
  '#3f8f5a',
  '#e85a8a',
  '#26282e',
  '#7fc4ea',
  '#f6e05e',
];
const CLARAS = ['#ffffff', '#f6e05e', '#f2b632'];

// Revistas colocadas de frente en columnas y filas.
export function Revistas({ x, y, columnas, filas, ancho, alto, separacion = 3, semilla = 0 }) {
  return (
    <g>
      {Array.from({ length: filas * columnas }, (_, k) => {
        const f = Math.floor(k / columnas);
        const c = k % columnas;
        const color = PORTADAS[(f * 7 + c * 3 + semilla) % PORTADAS.length];
        const claro = CLARAS.includes(color);
        const rx = x + c * (ancho + separacion);
        const ry = y + f * (alto + separacion);
        return (
          <g key={k}>
            <rect x={rx} y={ry} width={ancho} height={alto} fill={color} stroke="#00000040" strokeWidth="0.8" />
            <rect
              x={rx + 2}
              y={ry + 2}
              width={ancho - 4}
              height={alto * 0.16}
              fill={claro ? '#d9473b' : '#fff'}
              opacity="0.85"
            />
            <circle
              cx={rx + ancho / 2}
              cy={ry + alto * 0.5}
              r={Math.min(ancho, alto) * 0.16}
              fill={claro ? '#2f6fd0' : '#ffe0c2'}
              opacity="0.8"
            />
            <rect
              x={rx + ancho * 0.28}
              y={ry + alto * 0.62}
              width={ancho * 0.44}
              height={alto * 0.26}
              rx="2"
              fill={claro ? '#2f6fd0' : '#ffe0c2'}
              opacity="0.55"
            />
          </g>
        );
      })}
    </g>
  );
}

// Refrigerador de bebidas: mueble oscuro que ocupa todo el lado izquierdo, con un
// cartel escrito a mano arriba, dos puertas de vidrio con el interior iluminado y
// la rejilla abajo. Cada repisa de cada puerta tiene un grupo de un mismo tipo y
// sabor de bebida.

// Botella plástica (15 x 46): tapa, cuello, hombros, cuerpo con etiqueta.
function BotellaPlastica({ x, base, liquido, etiqueta, tapa, borde }) {
  const y = base - 46;
  return (
    <g>
      <rect x={x + 5} y={y} width="5" height="4" rx="1" fill={tapa} />
      <path
        d={`M${x + 5.5} ${y + 4} h4 v4 C${x + 10} ${y + 12} ${x + 14.5} ${y + 13} ${x + 14.5} ${y + 18} V${base - 3} q0 3 -3 3 h-8 q-3 0 -3 -3 V${y + 18} C${x + 0.5} ${y + 13} ${x + 5} ${y + 12} ${x + 5.5} ${y + 8} Z`}
        fill={liquido}
        stroke={borde}
        strokeWidth="1"
      />
      <rect x={x + 0.5} y={y + 22} width="14" height="12" fill={etiqueta} />
      <rect x={x + 3} y={y + 26.5} width="9" height="2.5" rx="1" fill="#fff" opacity="0.8" />
      <rect x={x + 2.3} y={y + 15} width="2" height="26" rx="1" fill="#fff" opacity="0.35" />
    </g>
  );
}

// Botella de vidrio (12 x 44): cuello largo y tapa corona.
function BotellaVidrio({ x, base, vidrio, etiqueta }) {
  const y = base - 44;
  return (
    <g>
      <rect x={x + 3.5} y={y} width="5" height="3" rx="0.8" fill="#c9cdd3" />
      <path
        d={`M${x + 4} ${y + 3} h4 v12 C${x + 8} ${y + 18} ${x + 12} ${y + 19} ${x + 12} ${y + 24} V${base - 2} q0 2 -2 2 h-8 q-2 0 -2 -2 V${y + 24} C${x} ${y + 19} ${x + 4} ${y + 18} ${x + 4} ${y + 15} Z`}
        fill={vidrio}
        stroke="#1d3b2a"
        strokeWidth="0.9"
      />
      <rect x={x} y={y + 28} width="12" height="9" fill={etiqueta} />
      <rect x={x + 2} y={y + 20} width="1.8" height="20" rx="0.9" fill="#fff" opacity="0.4" />
    </g>
  );
}

// Lata (14 x 26) con bordes metálicos, círculo del logo y brillo.
function Lata({ x, base, color }) {
  const y = base - 26;
  return (
    <g>
      <rect x={x} y={y + 1.5} width="14" height="23" rx="2" fill={color} stroke="#00000055" strokeWidth="0.8" />
      <rect x={x + 1} y={y} width="12" height="3" rx="1.2" fill="#d5d9de" stroke="#8f959c" strokeWidth="0.6" />
      <rect x={x + 1} y={base - 2.5} width="12" height="2.5" rx="1" fill="#c3c8ce" />
      <circle cx={x + 7} cy={y + 13} r="3.6" fill="#fff" opacity="0.9" />
      <rect x={x + 2} y={y + 4} width="1.8" height="19" rx="0.9" fill="#fff" opacity="0.35" />
    </g>
  );
}

// Cajita de jugo (16 x 26) con bombilla y la fruta dibujada.
export function CajitaJugo({ x, base, color, fruta }) {
  const y = base - 26;
  return (
    <g>
      <line x1={x + 12} y1={y + 1} x2={x + 14} y2={y - 8} stroke="#f0f0f0" strokeWidth="2" strokeLinecap="round" />
      <rect x={x} y={y} width="16" height="26" rx="1.5" fill={color} stroke="#00000055" strokeWidth="0.8" />
      <rect x={x} y={y} width="16" height="5" fill="#fff" opacity="0.55" />
      <circle cx={x + 8} cy={y + 15} r="4.2" fill={fruta} stroke="#00000040" strokeWidth="0.6" />
      <path d={`M${x + 8} ${y + 10.8} q1.5 -2 3 -1.5`} fill="none" stroke="#3f8f5a" strokeWidth="1.2" />
    </g>
  );
}

const PUERTAS = [22, 117]; // x de cada puerta (93 de ancho)
const FONDOS_REPISA = [352, 420, 488, 556, 628];

// Lo que hay en cada repisa: [puerta izquierda, puerta derecha]
const GRUPOS = [
  [
    { tipo: 'plastica', liquido: '#3b1f14', etiqueta: '#d32f2f', tapa: '#c62828', borde: '#1d0f09' }, // cola
    { tipo: 'plastica', liquido: '#f28c28', etiqueta: '#1e57b8', tapa: '#e2731a', borde: '#a5560f' }, // naranja
  ],
  [
    { tipo: 'plastica', liquido: '#cfeab2', etiqueta: '#2e9d4a', tapa: '#2e9d4a', borde: '#6e9c4f' }, // lima limón
    { tipo: 'plastica', liquido: '#6d2a7e', etiqueta: '#f3cf36', tapa: '#6d2a7e', borde: '#47184f' }, // uva
  ],
  [
    { tipo: 'lata', color: '#d32f2f' }, // latas rojas
    { tipo: 'lata', color: '#1e57b8' }, // latas azules
  ],
  [
    { tipo: 'jugo', color: '#f6a35c', fruta: '#f8c27a' }, // jugo de durazno
    { tipo: 'jugo', color: '#7dbb3c', fruta: '#d63a3a' }, // jugo de manzana
  ],
  [
    { tipo: 'plastica', liquido: '#e6f4fb', etiqueta: '#4cc0ef', tapa: '#1f5fa8', borde: '#7fb3cf' }, // agua
    { tipo: 'vidrio', vidrio: '#4f9c63', etiqueta: '#f4e7c3' }, // bebida en botella de vidrio
  ],
];

function Grupo({ grupo, x0, base }) {
  if (grupo.tipo === 'lata') {
    // latas apiladas: 5 abajo y 4 encima, en los huecos
    return (
      <g>
        {Array.from({ length: 5 }, (_, i) => (
          <Lata key={i} x={x0 + 4 + i * 15.5} base={base} color={grupo.color} />
        ))}
        {Array.from({ length: 4 }, (_, i) => (
          <Lata key={`a${i}`} x={x0 + 11.75 + i * 15.5} base={base - 26} color={grupo.color} />
        ))}
      </g>
    );
  }
  if (grupo.tipo === 'jugo') {
    return (
      <g>
        {Array.from({ length: 5 }, (_, i) => (
          <CajitaJugo key={i} x={x0 + 3 + i * 16} base={base} color={grupo.color} fruta={grupo.fruta} />
        ))}
      </g>
    );
  }
  if (grupo.tipo === 'vidrio') {
    return (
      <g>
        {Array.from({ length: 6 }, (_, i) => (
          <BotellaVidrio key={i} x={x0 + 3 + i * 13.5} base={base} vidrio={grupo.vidrio} etiqueta={grupo.etiqueta} />
        ))}
      </g>
    );
  }
  return (
    <g>
      {Array.from({ length: 5 }, (_, i) => (
        <BotellaPlastica key={i} x={x0 + 3 + i * 16} base={base} {...grupo} />
      ))}
    </g>
  );
}

function Refrigerador() {
  return (
    <g>
      {/* mueble oscuro */}
      <rect x="16" y="192" width="200" height="504" rx="8" fill="#1f2227" stroke="#0d0e10" strokeWidth="2" />
      {/* cartel escrito a mano */}
      <rect x="24" y="200" width="184" height="72" rx="4" fill="#2c3036" />
      <rect
        x="34"
        y="206"
        width="164"
        height="60"
        rx="3"
        fill="#f7b96a"
        stroke="#c4802f"
        strokeWidth="1.5"
        transform="rotate(-1.5 116 236)"
      />
      <text x="116" y="232" className="tienda__a-mano" transform="rotate(-1.5 116 236)">
        Bebidas
      </text>
      <text x="116" y="257" className="tienda__a-mano" transform="rotate(-1.5 116 236)">
        heladas
      </text>
      {/* puertas de vidrio con el interior iluminado */}
      {PUERTAS.map((px) => (
        <g key={px}>
          <rect x={px} y="280" width="93" height="362" rx="4" fill="#15171a" />
          <rect x={px + 5} y="285" width="83" height="352" fill="url(#tm-frio)" />
          <rect x={px + 5} y="285" width="83" height="4" fill="#ffffff" opacity="0.9" />
        </g>
      ))}
      {FONDOS_REPISA.map((base, f) =>
        PUERTAS.map((px, p) => (
          <g key={`${f}-${p}`}>
            <Grupo grupo={GRUPOS[f][p]} x0={px + 5} base={base} />
            <rect x={px + 5} y={base} width="83" height="3.5" fill="#9aa3ad" />
            <rect x={px + 5} y={base + 3.5} width="83" height="1.5" fill="#6c747d" />
          </g>
        )),
      )}
      {/* reflejo del vidrio y manillas */}
      {PUERTAS.map((px) => (
        <rect key={px} x={px + 5} y="285" width="83" height="352" fill="url(#tm-vidrio)" />
      ))}
      <rect x="106" y="420" width="5" height="90" rx="2.5" fill="#c3c8ce" stroke="#7d848c" strokeWidth="1" />
      <rect x="122" y="420" width="5" height="90" rx="2.5" fill="#c3c8ce" stroke="#7d848c" strokeWidth="1" />
      {/* rejilla de ventilación */}
      {[652, 662, 672, 682].map((y) => (
        <rect key={y} x="34" y={y} width="164" height="4" rx="2" fill="#0d0e10" />
      ))}
    </g>
  );
}

// Mostrador de madera clara con revistas inclinadas, zócalo oscuro y una hilera
// de revistas abajo.
export function Mostrador() {
  return (
    <g>
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i} transform={`rotate(-8 ${662 + i * 36} 500)`}>
          <rect
            x={650 + i * 36}
            y="462"
            width="30"
            height="40"
            fill={PORTADAS[(i * 3 + 1) % PORTADAS.length]}
            stroke="#00000040"
          />
          <rect x={653 + i * 36} y="465" width="24" height="7" fill="#fff" opacity="0.85" />
        </g>
      ))}
      <rect x="640" y="498" width="246" height="12" rx="2" fill="#ecd3a2" stroke="#b8894a" strokeWidth="1.5" />
      <path d="M644 510 H882 L874 524 H652 Z" fill="#dcbd85" stroke="#b8894a" strokeWidth="1.5" />
      <rect x="652" y="524" width="222" height="70" fill="#e8cc96" stroke="#b8894a" strokeWidth="1.5" />
      <line x1="652" x2="874" y1="546" y2="546" stroke="#d2b47a" strokeWidth="1.5" />
      <line x1="652" x2="874" y1="570" y2="570" stroke="#d2b47a" strokeWidth="1.5" />
      <rect x="648" y="594" width="230" height="44" fill="#26282e" />
      <Revistas x={654} y={642} columnas={9} filas={1} ancho={21} alto={50} separacion={4} semilla={4} />
    </g>
  );
}

// Cielo nublado, edificio y árboles al fondo; vereda de baldosas mojadas.
export function Fondo() {
  const arboles = [
    [40, 70, 70, '#7ea353'],
    [120, 40, 60, '#a8b84f'],
    [200, 80, 64, '#6f9a4a'],
    [290, 50, 56, '#c9b54a'],
    [640, 70, 60, '#7ea353'],
    [700, 110, 50, '#a8b84f'],
    [940, 120, 46, '#6f9a4a'],
  ];
  return (
    <g>
      <rect x="0" y="0" width={ANCHO} height={ALTO} fill="url(#tm-cielo)" />
      <rect x="690" y="0" width="310" height="160" fill="#c9cdd2" />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} x={706 + i * 42} y="10" width="22" height="150" fill="#aeb3ba" />
      ))}
      {arboles.map(([cx, cy, r, c]) => (
        <g key={cx}>
          <circle cx={cx} cy={cy} r={r} fill={c} />
          <circle cx={cx - r * 0.4} cy={cy - r * 0.3} r={r * 0.45} fill="#fff" opacity="0.12" />
        </g>
      ))}
      <rect x="0" y="700" width={ANCHO} height={ALTO - 700} fill="#a7acb2" />
      {Array.from({ length: 11 }, (_, i) => (
        <line key={i} x1={i * 100} x2={i * 100 - 40} y1="700" y2={ALTO} stroke="#959aa1" strokeWidth="2" />
      ))}
      <line x1="0" x2={ANCHO} y1="728" y2="728" stroke="#959aa1" strokeWidth="2" />
      <rect x="120" y="712" width="180" height="5" rx="2.5" fill="#fff" opacity="0.25" />
      <rect x="430" y="738" width="140" height="5" rx="2.5" fill="#fff" opacity="0.25" />
    </g>
  );
}

// Kiosco de prensa: bóveda negra con moldura clara y escudo, techo con remate
// metálico, alero pardo, cuerpo de metal negro, paneles de revistas a los lados
// y el interior iluminado con luz cálida.
export function Kiosco() {
  return (
    <g>
      <path d="M368 146 A126 126 0 0 1 620 146 Z" fill="#b9bfc6" />
      <path d="M380 146 A120 120 0 0 1 620 146 Z" fill="#1d1f24" />
      <path d="M392 136 A108 108 0 0 1 608 136" fill="none" stroke="#d9dde2" strokeWidth="3" />
      <line x1="392" x2="608" y1="136" y2="136" stroke="#d9dde2" strokeWidth="2" />
      <line x1="392" x2="608" y1="142" y2="142" stroke="#d9dde2" strokeWidth="1.5" />
      {/* escudo con corona de torres */}
      <rect x="486" y="54" width="28" height="7" fill="#c8cdd3" stroke="#8f959c" strokeWidth="1" />
      {[487, 495, 503, 511].map((x) => (
        <rect key={x} x={x} y="47" width="4" height="8" fill="#c8cdd3" stroke="#8f959c" strokeWidth="0.8" />
      ))}
      <path
        d="M484 63 H516 V82 C516 94 508 102 500 106 C492 102 484 94 484 82 Z"
        fill="#c8cdd3"
        stroke="#8f959c"
        strokeWidth="1.5"
      />
      <path d="M500 68 V100 M490 80 H510" stroke="#a5abb2" strokeWidth="1.5" />
      {/* techo, remate metálico y alero */}
      <rect x="8" y="142" width="984" height="10" fill="#1d1f24" />
      <rect x="8" y="140" width="984" height="3" fill="#8f959c" />
      <rect x="0" y="152" width={ANCHO} height="26" fill="#5d4c40" stroke="#3d3129" strokeWidth="1.5" />
      <rect x="0" y="176" width={ANCHO} height="4" fill="#2a2a2e" />
      {/* cuerpo de metal negro e interior iluminado */}
      <rect x="8" y="180" width="984" height="520" fill="#1d1f24" />
      <rect x="124" y="186" width="768" height="514" fill="url(#tm-luz)" />
      <rect x="124" y="680" width="768" height="20" fill="#d9c49c" />
      {/* repisas con fruta detrás del vendedor */}
      <Frutas />
      {/* costado izquierdo de vidrio (el refrigerador ocupa el resto del lado izquierdo) */}
      <rect x="8" y="186" width="10" height="514" fill="#9fb4c4" opacity="0.8" />
      <line x1="12" x2="12" y1="200" y2="680" stroke="#fff" strokeWidth="2" opacity="0.6" />
      {/* panel derecho: exhibidor de snacks y mesa baja */}
      <Snacks />
      <rect x="892" y="624" width="100" height="10" fill="#ecd3a2" stroke="#b8894a" strokeWidth="1.5" />
      <rect x="900" y="634" width="6" height="66" fill="#c9a66a" />
      <rect x="978" y="634" width="6" height="66" fill="#c9a66a" />
      {/* postes del marco y sombra del alero */}
      <rect x="888" y="180" width="8" height="520" fill="#2a2c31" />
      <rect x="8" y="180" width="984" height="18" fill="url(#tm-sombra)" />
    </g>
  );
}

// ---------- Snacks (exhibidor del lado derecho) ----------
// Cada producto se dibuja en una caja de 28 x 40 (origen arriba a la izquierda).

function bordeDentado(y, alto, ancho = 28) {
  // franja sellada de una bolsa: borde recto arriba y dientes abajo (o al revés)
  let d = `M0 ${y} H${ancho} V${y + alto - 1.5}`;
  for (let x = ancho; x > 0; x -= 2) d += ` L${x - 1} ${y + alto} L${x - 2} ${y + alto - 1.5}`;
  return `${d} Z`;
}

function IconoBolsa({ icono }) {
  switch (icono) {
    case 'papas':
      return (
        <g>
          <ellipse
            cx="11"
            cy="23"
            rx="4.5"
            ry="3"
            fill="#f7d154"
            stroke="#c99a1a"
            strokeWidth="0.7"
            transform="rotate(-20 11 23)"
          />
          <ellipse
            cx="17"
            cy="25"
            rx="4.5"
            ry="3"
            fill="#f3c63e"
            stroke="#c99a1a"
            strokeWidth="0.7"
            transform="rotate(15 17 25)"
          />
          <ellipse cx="14" cy="21" rx="3.5" ry="2.4" fill="#f9dc72" stroke="#c99a1a" strokeWidth="0.7" />
        </g>
      );
    case 'mani':
      return (
        <g fill="#d9a866" stroke="#9c6b17" strokeWidth="0.6">
          <path d="M8 22 a2.6 2.6 0 1 1 4 0 a2.6 2.6 0 1 1 -4 0 Z" transform="rotate(-25 10 23)" />
          <path d="M15 25 a2.6 2.6 0 1 1 4 0 a2.6 2.6 0 1 1 -4 0 Z" transform="rotate(20 17 26)" />
        </g>
      );
    case 'vegetales':
      return (
        <g stroke="#00000030" strokeWidth="0.6">
          <circle cx="10" cy="23" r="3.2" fill="#7dbb3c" />
          <circle cx="16" cy="21.5" r="3.2" fill="#ec7412" />
          <circle cx="17" cy="26.5" r="3" fill="#8e3b8f" />
        </g>
      );
    case 'gomitas':
      return (
        <g>
          {[
            [9, 22, '#d42b3c'],
            [14, 26, '#f3cf36'],
            [19, 22, '#2e9d4a'],
            [14, 20.5, '#ec7412'],
          ].map(([cx, cy, c]) => (
            <g key={`${cx}-${cy}`} fill={c}>
              <circle cx={cx} cy={cy - 1.6} r="1.4" />
              <rect x={cx - 1.7} y={cy - 0.6} width="3.4" height="3.4" rx="1.4" />
            </g>
          ))}
        </g>
      );
    case 'fruta':
      return (
        <g>
          <circle cx="10.5" cy="23" r="3.4" fill="#f4a46a" stroke="#b86a33" strokeWidth="0.7" />
          <circle cx="10.5" cy="23" r="1.3" fill="#fde3c4" />
          <rect x="15" y="19.5" width="5" height="4" rx="1" fill="#d42b3c" />
          <rect x="15" y="25" width="5" height="3.5" rx="1" fill="#f3cf36" />
        </g>
      );
    case 'miel':
      return (
        <g>
          <ellipse cx="11" cy="24" rx="3" ry="2.2" fill="#c98d52" stroke="#7d4f22" strokeWidth="0.6" />
          <ellipse cx="17" cy="25" rx="3" ry="2.2" fill="#b0723a" stroke="#7d4f22" strokeWidth="0.6" />
          <path
            d="M14 17 C16 20 16.5 21 16.5 22 C16.5 23.4 15.3 24 14 24 C12.7 24 11.5 23.4 11.5 22 C11.5 21 12 20 14 17 Z"
            fill="#f2b632"
            opacity="0.9"
          />
        </g>
      );
    case 'mezcla':
      return (
        <g>
          {[
            [9, 22, '#5a2e1a'],
            [13, 25.5, '#fbf6ea'],
            [17, 21.5, '#5a2e1a'],
            [19, 26, '#c98d52'],
            [12, 20.5, '#fbf6ea'],
          ].map(([cx, cy, c]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2" fill={c} stroke="#00000030" strokeWidth="0.5" />
          ))}
          <path d="M15 24 l1 1 M20 23 l1 -1 M8 26 l1 1" stroke="#fff" strokeWidth="0.8" />
        </g>
      );
    default:
      return null;
  }
}

// Bolsa sellada (papas fritas, maní, chips, gomitas, etc.) con su ventana.
function BolsaSnack({ color, borde, ventana = '#fff8e6', icono }) {
  return (
    <g>
      <path d="M1 5 C-1 15 -1 30 1 35 H27 C29 30 29 15 27 5 Z" fill={color} stroke={borde} strokeWidth="1" />
      <path d={bordeDentado(0, 5.5)} fill={borde} />
      <path d={bordeDentado(34.5, 5.5)} fill={borde} />
      <circle cx="14" cy="2.6" r="1.4" fill="#2b2d33" />
      <rect x="4" y="8.5" width="20" height="4.5" rx="1.5" fill="#fff" opacity="0.85" />
      <ellipse cx="14" cy="23.5" rx="10" ry="7.5" fill={ventana} stroke={borde} strokeWidth="0.8" />
      <IconoBolsa icono={icono} />
      <path
        d="M3.5 8 C2.5 16 2.5 26 3.5 32"
        stroke="#fff"
        strokeWidth="1.6"
        opacity="0.35"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function Palomitas() {
  return (
    <g>
      {[
        [8, 11],
        [13, 8],
        [18, 10],
        [22, 13],
        [6, 14],
        [11, 13],
        [16, 13],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.4" fill="#fff8e1" stroke="#e3c98a" strokeWidth="0.7" />
      ))}
      <path d="M2 14 H26 L23 40 H5 Z" fill="#fff" stroke="#b0362c" strokeWidth="1" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${4.5 + i * 8} 14 h4 l-0.9 26 h-3.2 Z`} fill="#d9473b" />
      ))}
      <rect x="7" y="22" width="14" height="7" rx="2" fill="#f3cf36" stroke="#b0362c" strokeWidth="0.7" />
    </g>
  );
}

function GalletasSaladas() {
  return (
    <g>
      <rect x="1" y="8" width="26" height="32" rx="3" fill="#f2e3b3" stroke="#b8955a" strokeWidth="1" />
      <rect x="1" y="8" width="26" height="7" rx="2" fill="#2f6fd0" />
      {[
        [5, 19],
        [15, 19],
        [10, 29],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="8" height="8" rx="1" fill="#e2b35f" stroke="#a47a2c" strokeWidth="0.6" />
          <circle cx={x + 2.5} cy={y + 2.5} r="0.6" fill="#a47a2c" />
          <circle cx={x + 5.5} cy={y + 5.5} r="0.6" fill="#a47a2c" />
        </g>
      ))}
    </g>
  );
}

function GalletasDulces() {
  return (
    <g>
      {[22, 33].map((y, i) => (
        <g key={y}>
          <rect
            x="1"
            y={y - 9}
            width="26"
            height="11"
            rx="5.5"
            fill={i ? '#2f6fd0' : '#7a4a2a'}
            stroke="#00000055"
            strokeWidth="0.8"
          />
          <rect x="8" y={y - 9} width="10" height="11" fill="#fff" opacity="0.8" />
          <ellipse cx="25" cy={y - 3.5} rx="2.5" ry="5.2" fill="#c98d52" stroke="#7d4f22" strokeWidth="0.6" />
        </g>
      ))}
      <rect x="1" y="34" width="26" height="6" fill="none" />
    </g>
  );
}

function Alfajores() {
  return (
    <g>
      {[32, 23, 14].map((y, i) => (
        <g key={y}>
          <rect
            x="2"
            y={y}
            width="24"
            height="8"
            rx="4"
            fill={i === 1 ? '#c0c4cc' : '#d9b44a'}
            stroke="#8a6d1d"
            strokeWidth="0.8"
          />
          <path
            d={`M2 ${y + 2} l-1.5 2 1.5 2 M26 ${y + 2} l1.5 2 -1.5 2`}
            stroke="#8a6d1d"
            strokeWidth="0.8"
            fill="none"
          />
          <rect x="10" y={y + 2.5} width="8" height="3" rx="1" fill="#5a2e1a" />
        </g>
      ))}
    </g>
  );
}

function Chocolates() {
  return (
    <g>
      {[
        [1, '#5a2e1a'],
        [15, '#9c2b3f'],
      ].map(([x, c]) => (
        <g key={x}>
          <rect x={x} y="6" width="12" height="34" rx="1.5" fill={c} stroke="#00000066" strokeWidth="0.8" />
          <rect x={x} y="6" width="12" height="7" fill="#d5d9de" />
          <path d={`M${x} 13 l2 1.5 2 -1.5 2 1.5 2 -1.5 2 1.5 2 -1.5`} fill="none" stroke="#9aa0a7" strokeWidth="0.6" />
          <rect x={x + 2} y="20" width="8" height="10" rx="1" fill="#fff" opacity="0.8" />
        </g>
      ))}
    </g>
  );
}

function Turron() {
  return (
    <g>
      <rect x="2" y="14" width="24" height="26" rx="2" fill="#fbf6ea" stroke="#c9b98f" strokeWidth="1" />
      <path d="M2 30 L26 20 V26 L2 36 Z" fill="#d42b3c" />
      <ellipse cx="9" cy="21" rx="2.6" ry="1.6" fill="#c98d52" />
      <ellipse cx="19" cy="34" rx="2.6" ry="1.6" fill="#c98d52" />
    </g>
  );
}

// Vaso de fruta picada con chile y limón.
function FrutaConChile() {
  return (
    <g>
      <line x1="19" y1="3" x2="15" y2="18" stroke="#d9b44a" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="5" y="9" width="7" height="6" rx="1.5" fill="#f3a630" stroke="#c4802f" strokeWidth="0.6" />
      <rect x="11" y="11" width="7" height="5" rx="1.5" fill="#f6c24a" stroke="#c4802f" strokeWidth="0.6" />
      <circle cx="21" cy="12" r="3.6" fill="#7dbb3c" stroke="#3f7a1f" strokeWidth="0.7" />
      <circle cx="21" cy="12" r="2.2" fill="#c9e88f" />
      <path d="M3 14 H25 L22 40 H6 Z" fill="#eaf6fb" opacity="0.92" stroke="#9fb4c4" strokeWidth="1" />
      <rect x="6" y="18" width="7" height="6" rx="1.5" fill="#f3a630" />
      <rect x="14" y="20" width="7" height="6" rx="1.5" fill="#f6c24a" />
      <rect x="8" y="27" width="7" height="6" rx="1.5" fill="#e58a2a" />
      <rect x="15" y="29" width="5" height="5" rx="1.5" fill="#f3a630" />
      {[
        [8, 19],
        [17, 21],
        [11, 29],
        [18, 31],
        [13, 24],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.9" fill="#c2261d" />
      ))}
      <path d="M3 14 H25" stroke="#7d8e9b" strokeWidth="1.2" />
    </g>
  );
}

const SECCIONES = [
  {
    nombre: 'Salados',
    fondo: '#f3cf36',
    texto: '#5a3a00',
    productos: [
      { tipo: 'bolsa', color: '#f2b632', borde: '#b07c0c', icono: 'papas' }, // papas fritas
      { tipo: 'bolsa', color: '#b5452f', borde: '#7a2a1b', icono: 'mani' }, // maní salado
      { tipo: 'palomitas' },
      { tipo: 'galletasSaladas' },
      { tipo: 'bolsa', color: '#3f8f5a', borde: '#26603a', icono: 'vegetales' }, // chips de vegetales
      { tipo: 'bolsa', color: '#2f6fd0', borde: '#1d4a91', icono: 'papas' }, // papas fritas (otro sabor)
    ],
  },
  {
    nombre: 'Dulces',
    fondo: '#f07aa3',
    texto: '#5a1230',
    productos: [
      { tipo: 'galletasDulces' },
      { tipo: 'alfajores' },
      { tipo: 'chocolates' },
      { tipo: 'bolsa', color: '#e85a8a', borde: '#a3325a', icono: 'gomitas' }, // gomitas
      { tipo: 'turron' },
      { tipo: 'bolsa', color: '#f4a46a', borde: '#b86a33', icono: 'fruta' }, // fruta deshidratada
    ],
  },
  {
    nombre: 'Agridulces',
    fondo: '#7dbb3c',
    texto: '#1f3d0a',
    productos: [
      { tipo: 'frutaChile' },
      { tipo: 'bolsa', color: '#d9a13b', borde: '#8a6417', icono: 'miel' }, // frutos secos con miel
      { tipo: 'bolsa', color: '#4a2f1f', borde: '#24160d', ventana: '#f4e7c3', icono: 'mezcla' }, // chocolate con sal
      { tipo: 'frutaChile' },
      { tipo: 'bolsa', color: '#c0504d', borde: '#80302e', icono: 'miel' },
      { tipo: 'bolsa', color: '#26282e', borde: '#000', ventana: '#f4e7c3', icono: 'mezcla' },
    ],
  },
];

function Producto({ producto }) {
  switch (producto.tipo) {
    case 'palomitas':
      return <Palomitas />;
    case 'galletasSaladas':
      return <GalletasSaladas />;
    case 'galletasDulces':
      return <GalletasDulces />;
    case 'alfajores':
      return <Alfajores />;
    case 'chocolates':
      return <Chocolates />;
    case 'turron':
      return <Turron />;
    case 'frutaChile':
      return <FrutaConChile />;
    default:
      return <BolsaSnack {...producto} />;
  }
}

// Exhibidor de snacks del costado derecho: tres secciones (salados, dulces y
// agridulces), cada una con su letrero y dos repisas de productos.
const EXHIBIDOR = { x: 894, y: 190, ancho: 98, seccion: 142 };

function Snacks() {
  const { x, y, ancho, seccion } = EXHIBIDOR;
  return (
    <g>
      <rect x={x} y={y} width={ancho} height={seccion * SECCIONES.length + 4} fill="#e8e1d3" />
      {SECCIONES.map((s, k) => {
        const top = y + k * seccion;
        return (
          <g key={s.nombre}>
            <rect x={x + 2} y={top + 2} width={ancho - 4} height="17" rx="3" fill={s.fondo} />
            <text x={x + ancho / 2} y={top + 15} className="tienda__snack" fill={s.texto}>
              {s.nombre}
            </text>
            {s.productos.map((p, i) => {
              const fila = Math.floor(i / 3);
              const col = i % 3;
              const base = top + 78 + fila * 62;
              return (
                <g key={i} transform={`translate(${x + 4 + col * 31} ${base - 40})`}>
                  <Producto producto={p} />
                </g>
              );
            })}
            {[0, 1].map((fila) => (
              <rect key={fila} x={x} y={top + 78 + fila * 62} width={ancho} height="3" fill="#8f959c" />
            ))}
          </g>
        );
      })}
    </g>
  );
}

// ---------- Frutas (repisas detrás del vendedor) ----------

export function Manzana({ cx, cy, color = '#d42b3c', borde = '#8f1522' }) {
  return (
    <g>
      <path
        d={`M${cx} ${cy - 5} C${cx + 3} ${cy - 8} ${cx + 8} ${cy - 6} ${cx + 7.5} ${cy} C${cx + 7} ${cy + 6} ${cx + 3} ${cy + 8} ${cx} ${cy + 6.5} C${cx - 3} ${cy + 8} ${cx - 7} ${cy + 6} ${cx - 7.5} ${cy} C${cx - 8} ${cy - 6} ${cx - 3} ${cy - 8} ${cx} ${cy - 5} Z`}
        fill={color}
        stroke={borde}
        strokeWidth="1"
      />
      <path d={`M${cx} ${cy - 5} q0.5 -3 2 -4`} stroke="#6b3d22" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <ellipse
        cx={cx + 3.6}
        cy={cy - 7.2}
        rx="2.6"
        ry="1.3"
        fill="#4c9a3a"
        transform={`rotate(-25 ${cx + 3.6} ${cy - 7.2})`}
      />
      <ellipse cx={cx - 3} cy={cy - 1.5} rx="1.6" ry="2.6" fill="#fff" opacity="0.4" />
    </g>
  );
}

function Pera({ cx, base }) {
  return (
    <g>
      <path
        d={`M${cx} ${base} C${cx - 8} ${base} ${cx - 8.5} ${base - 9} ${cx - 4.5} ${base - 12} C${cx - 3} ${base - 14} ${cx - 2.5} ${base - 19} ${cx} ${base - 19} C${cx + 2.5} ${base - 19} ${cx + 3} ${base - 14} ${cx + 4.5} ${base - 12} C${cx + 8.5} ${base - 9} ${cx + 8} ${base} ${cx} ${base} Z`}
        fill="#c9d34a"
        stroke="#7f8a1c"
        strokeWidth="1"
      />
      <path d={`M${cx} ${base - 19} q1 -3 3 -4`} stroke="#6b3d22" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <ellipse cx={cx - 3} cy={base - 6} rx="1.6" ry="2.6" fill="#fff" opacity="0.35" />
      <circle cx={cx + 3} cy={base - 5} r="0.7" fill="#8a9420" />
    </g>
  );
}

function Naranja({ cx, cy, r = 7.5, color = '#f28c28', borde = '#b85d0c' }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color} stroke={borde} strokeWidth="1" />
      {[
        [-2.5, 1.5],
        [2, 3],
        [3, -1.5],
        [-1, -3],
      ].map(([dx, dy]) => (
        <circle key={`${dx}${dy}`} cx={cx + dx} cy={cy + dy} r="0.45" fill={borde} opacity="0.6" />
      ))}
      <circle cx={cx} cy={cy - r + 1.2} r="0.9" fill="#5c7a1e" />
      <ellipse cx={cx - r * 0.4} cy={cy - r * 0.35} rx="1.6" ry="2.4" fill="#fff" opacity="0.35" />
    </g>
  );
}

function Mandarina({ cx, cy }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx="7" ry="5.8" fill="#f7a21b" stroke="#b86a0c" strokeWidth="1" />
      <path
        d={`M${cx - 3} ${cy - 5} q0 10 0 10 M${cx + 3} ${cy - 5} q0 10 0 10`}
        stroke="#d9860c"
        strokeWidth="0.7"
        fill="none"
        opacity="0.6"
      />
      <ellipse
        cx={cx + 2.5}
        cy={cy - 6.4}
        rx="3"
        ry="1.4"
        fill="#4c9a3a"
        transform={`rotate(-15 ${cx + 2.5} ${cy - 6.4})`}
      />
      <circle cx={cx} cy={cy - 5.6} r="0.9" fill="#5c7a1e" />
    </g>
  );
}

// Racimo de plátanos: varios plátanos curvos unidos por el tallo.
function Platanos({ x, base }) {
  const platanos = [0, 1, 2, 3];
  return (
    <g>
      {platanos.map((i) => {
        const y = base - 4 - i * 5;
        const d = `M${x + 4} ${y - 6} C${x + 10} ${y + 4} ${x + 30} ${y + 4} ${x + 40} ${y - 6 + i}`;
        return (
          <g key={i}>
            <path d={d} fill="none" stroke="#b0862a" strokeWidth="8.5" strokeLinecap="round" />
            <path d={d} fill="none" stroke={i % 2 ? '#f6d33c' : '#f2c62a'} strokeWidth="6" strokeLinecap="round" />
            <circle cx={x + 40} cy={y - 6 + i} r="1.6" fill="#4a3517" />
          </g>
        );
      })}
      <path
        d={`M${x + 4} ${base - 26} L${x + 1} ${base - 30}`}
        stroke="#6b5a2a"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  );
}

// Cajón bajo de madera al frente de cada grupo de fruta.
function Cajon({ x, ancho, base }) {
  return (
    <g>
      <rect x={x} y={base - 8} width={ancho} height="8" rx="1.5" fill="#c98d52" stroke="#8c5627" strokeWidth="1" />
      <line
        x1={x + 2}
        x2={x + ancho - 2}
        y1={base - 4}
        y2={base - 4}
        stroke="#8c5627"
        strokeWidth="0.8"
        opacity="0.6"
      />
    </g>
  );
}

// Fila de frutas redondas en pirámide: abajo "abajo" frutas, arriba una menos.
function Pila({ x, base, abajo, paso, dibujar }) {
  const filas = [abajo, abajo - 1];
  return (
    <g>
      {filas.map((n, f) =>
        Array.from({ length: n }, (_, i) => (
          <g key={`${f}-${i}`}>{dibujar(x + paso / 2 + i * paso + (f * paso) / 2, base - 9 - f * 11)}</g>
        )),
      )}
    </g>
  );
}

// Repisas detrás del vendedor: arriba (sobre su cabeza) manzanas, peras, plátanos,
// naranjas y mandarinas; abajo, a los lados de la cabeza, más manzanas y naranjas.
function Frutas() {
  const arriba = 242;
  const abajo = 314;
  return (
    <g>
      {/* repisa de arriba */}
      <Pila x={640} base={arriba} abajo={3} paso={15} dibujar={(cx, cy) => <Manzana cx={cx} cy={cy} />} />
      <Cajon x={640} ancho={46} base={arriba} />
      <g>
        {[699, 713, 727].map((cx) => (
          <Pera key={cx} cx={cx} base={arriba - 4} />
        ))}
        {[706, 720].map((cx) => (
          <Pera key={cx} cx={cx} base={arriba - 14} />
        ))}
      </g>
      <Cajon x={691} ancho={44} base={arriba} />
      <Platanos x={740} base={arriba - 3} />
      <Cajon x={738} ancho={46} base={arriba} />
      <Pila x={788} base={arriba} abajo={3} paso={15} dibujar={(cx, cy) => <Naranja cx={cx} cy={cy} />} />
      <Cajon x={788} ancho={46} base={arriba} />
      <Pila x={838} base={arriba} abajo={3} paso={15} dibujar={(cx, cy) => <Mandarina cx={cx} cy={cy + 1} />} />
      <Cajon x={838} ancho={46} base={arriba} />
      <rect x="636" y={arriba} width="252" height="6" fill="#c9a66a" stroke="#8c5627" strokeWidth="1" />
      {/* repisa de abajo: solo los lados se ven junto a la cabeza */}
      <Pila
        x={640}
        base={abajo}
        abajo={5}
        paso={15}
        dibujar={(cx, cy) => <Manzana cx={cx} cy={cy} color="#8cc63f" borde="#4f7a1a" />}
      />
      <Cajon x={640} ancho={76} base={abajo} />
      <Pila x={812} base={abajo} abajo={5} paso={15} dibujar={(cx, cy) => <Naranja cx={cx} cy={cy} />} />
      <Cajon x={812} ancho={76} base={abajo} />
      <rect x="636" y={abajo} width="252" height="6" fill="#c9a66a" stroke="#8c5627" strokeWidth="1" />
    </g>
  );
}

// Basurero urbano gris con tapa anaranjada, junto al costado izquierdo.
export function Basurero() {
  return (
    <g>
      <ellipse cx="44" cy="748" rx="34" ry="5" fill="#000" opacity="0.15" />
      <path d="M16 640 H72 L68 746 H20 Z" fill="#8d9097" stroke="#5f636a" strokeWidth="2" />
      {[30, 44, 58].map((x) => (
        <line key={x} x1={x} x2={x - 1} y1="652" y2="738" stroke="#767a81" strokeWidth="2" />
      ))}
      <rect x="12" y="628" width="64" height="14" rx="5" fill="#e0662a" stroke="#a54617" strokeWidth="2" />
    </g>
  );
}

export function Definiciones() {
  return (
    <defs>
      <linearGradient id="tm-cielo" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d9e3ea" />
        <stop offset="1" stopColor="#eef2f4" />
      </linearGradient>
      <linearGradient id="tm-luz" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f6dfae" />
        <stop offset="0.5" stopColor="#fff1d2" />
        <stop offset="1" stopColor="#f3e1bd" />
      </linearGradient>
      <linearGradient id="tm-frio" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f4fbff" />
        <stop offset="1" stopColor="#cfe3ee" />
      </linearGradient>
      <linearGradient id="tm-vidrio" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
        <stop offset="0.4" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#fff" stopOpacity="0.15" />
      </linearGradient>
      <linearGradient id="tm-sombra" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#000" stopOpacity="0.35" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </linearGradient>
    </defs>
  );
}

export function Tienda({ estantes }) {
  const descripcion = estantes.map((e) => `${e.sabor}, ${e.frascos} frascos`).join('; ');
  return (
    <div className="tienda">
      <svg
        viewBox={`0 0 ${ANCHO} ${ALTO}`}
        className="tienda-escena"
        role="img"
        aria-label={`Dos niñas y un niño llegan a un kiosco de la calle. Detrás del mostrador, el vendedor le muestra un anaquel con frascos de mermelada; sobre cada grupo hay un letrero con el sabor y un marcador con la cantidad: ${descripcion}.`}
      >
        <Definiciones />
        <Fondo />
        <Kiosco />
        <Refrigerador />
        <Anaquel estantes={estantes.slice(0, FILAS * COLUMNAS)} />
        <Vendedor />
        <Mostrador />
        <Basurero />
        <Ninos />
      </svg>
      {/* en pantallas chicas los letreros se leen mal: se repiten aquí */}
      <ul className="tienda__lista" aria-hidden="true">
        {estantes.map((e) => (
          <li key={e.sabor}>
            <span className="tienda__punto" style={{ background: colorDe(e).mermelada }} />
            {e.sabor}: <strong>{e.frascos}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
