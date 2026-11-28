// Representaciones pictóricas de cada ejercicio (etapa "pictórica" del método
// Concreto-Pictórico-Abstracto COPISI). Usan currentColor para tomar el color del eje
// y las variables de index.css para la tinta y el papel.

import { Arreglo, Balanza as BalanzaAvanzada, Barras as BarrasAvanzadas, FraccionVisual, Posicional as PosicionalAvanzada, Recta, Secuencia, Tabla } from './visuales/numeros.jsx';
import { Coordenadas as CoordenadasAvanzadas, Cuerpo, Figuras, Plano, Sala } from './visuales/geometria.jsx';
import { Area, Poligono, Reloj as RelojEstatico } from './visuales/medicion.jsx';
import { Caja, Grafico, GraficoIconos, MaquinaPeluches, Pictograma } from './visuales/datos.jsx';
import { Bolsas } from './visuales/BolsasCanicas.jsx';
import { Tienda } from './visuales/TiendaMermeladas.jsx';
import { Dado3D } from './visuales/Dado3D.jsx';
import { EncuestaProfesora } from './visuales/EncuestaProfesora.jsx';
import { Fosforos, Maquina, Pulsera, Tablero100 } from './visuales/patrones.jsx';

import Calendario from './herramientas/Calendario.jsx';
import Medir from './herramientas/Medir.jsx';
import RelojHerramienta from './herramientas/Reloj.jsx';

function Barras(props) {
  if (props.partes || props.comparar) {
    return <BarrasAvanzadas {...props} />;
  }
  const { total, parte } = props;
  const ancho = 440;
  const anchoParte = Math.round((parte / total) * ancho);
  return (
    <svg viewBox="0 0 480 170" role="img" aria-label={`Modelo de barras: ${total} en total, ${parte} regaladas y una parte desconocida`}>
      <rect x="20" y="20" width={ancho} height="48" rx="6" className="v-relleno" />
      <text x={20 + ancho / 2} y="52" className="v-num">{total}</text>
      <rect x="20" y="88" width={anchoParte} height="48" rx="6" className="v-linea" />
      <rect x={20 + anchoParte} y="88" width={ancho - anchoParte} height="48" rx="6" className="v-incognita" />
      <text x={20 + anchoParte / 2} y="120" className="v-num">{parte}</text>
      <text x={20 + anchoParte + (ancho - anchoParte) / 2} y="120" className="v-num v-acento">?</text>
      <text x={20 + anchoParte / 2} y="160" className="v-etq">regaló</text>
      <text x={20 + anchoParte + (ancho - anchoParte) / 2} y="160" className="v-etq">le quedan</text>
    </svg>
  );
}

function Posicional(props) {
  if (Array.isArray(props.cifras)) {
    const columnas = props.columnas ?? (props.cifras.length === 3 ? ['C', 'D', 'U'] : ['UM', 'C', 'D', 'U']);
    const anchoTotal = columnas.length * 90 + 40;
    return (
      <svg viewBox={`0 0 ${anchoTotal} 150`} role="img" aria-label={`Tabla de valor posicional con ${columnas.join(', ')}`}>
        {columnas.map((col, i) => (
          <g key={col}>
            <rect x={20 + i * 90} y="15" width="90" height="44" className="v-relleno" stroke="var(--tinta)" strokeWidth="2" />
            <text x={65 + i * 90} y="45" className="v-etq v-fuerte">{col}</text>
            <rect x={20 + i * 90} y="59" width="90" height="72" className="v-linea" />
            <text x={65 + i * 90} y="108" className="v-num v-grande">{props.cifras[i]}</text>
          </g>
        ))}
      </svg>
    );
  }
  return <PosicionalAvanzada {...props} />;
}

function Fraccion(props) {
  if (props.partes && props.pintadas !== undefined) {
    const r = 80;
    const cx = 100;
    const cy = 100;
    const sectores = Array.from({ length: props.partes }, (_, i) => {
      const a0 = (i / props.partes) * 2 * Math.PI - Math.PI / 2;
      const a1 = ((i + 1) / props.partes) * 2 * Math.PI - Math.PI / 2;
      const x0 = cx + r * Math.cos(a0);
      const y0 = cy + r * Math.sin(a0);
      const x1 = cx + r * Math.cos(a1);
      const y1 = cy + r * Math.sin(a1);
      return `M${cx},${cy} L${x0.toFixed(2)},${y0.toFixed(2)} A${r},${r} 0 0 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z`;
    });
    return (
      <svg viewBox="0 0 200 200" role="img" aria-label={`Círculo dividido en ${props.partes} partes iguales, ${props.pintadas} pintadas`} className="v-cuadrado">
        {sectores.map((d, i) => (
          <path key={i} d={d} className={i < props.pintadas ? 'v-pintado' : 'v-linea'} />
        ))}
      </svg>
    );
  }
  return <FraccionVisual {...props} />;
}

function Balanza(props) {
  if (Array.isArray(props.izquierda)) {
    return <BalanzaAvanzada {...props} />;
  }
  return (
    <svg viewBox="0 0 440 200" role="img" aria-label={`Balanza en equilibrio: a un lado ${props.izquierda}, al otro ${props.derecha}`}>
      <polygon points="220,70 196,180 244,180" className="v-relleno" stroke="var(--tinta)" strokeWidth="2" strokeLinejoin="round" />
      <line x1="60" y1="70" x2="380" y2="70" className="v-trazo" />
      <line x1="90" y1="70" x2="90" y2="100" className="v-trazo-fino" />
      <line x1="350" y1="70" x2="350" y2="100" className="v-trazo-fino" />
      <rect x="20" y="100" width="140" height="56" rx="10" className="v-linea" />
      <rect x="280" y="100" width="140" height="56" rx="10" className="v-linea" />
      <text x="90" y="137" className="v-num">{props.izquierda}</text>
      <text x="350" y="137" className="v-num">{props.derecha}</text>
    </svg>
  );
}

function Cubo() {
  return (
    <svg viewBox="0 0 220 210" role="img" aria-label="Dibujo de un cubo" className="v-cuadrado">
      <polygon points="40,75 95,25 205,25 150,75" className="v-pintado" strokeLinejoin="round" />
      <polygon points="150,75 205,25 205,135 150,185" className="v-relleno" stroke="var(--tinta)" strokeWidth="2" strokeLinejoin="round" />
      <rect x="40" y="75" width="110" height="110" className="v-linea" />
      <polyline points="40,185 95,135 205,135" className="v-oculta" />
      <line x1="95" y1="135" x2="95" y2="25" className="v-oculta" />
    </svg>
  );
}

function Coordenadas(props) {
  if (props.columna && props.fila) {
    const letras = ['A', 'B', 'C', 'D', 'E'];
    const lado = 44;
    const x0 = 50;
    const y0 = 14;
    const cx = x0 + letras.indexOf(props.columna) * lado + lado / 2;
    const cy = y0 + (5 - props.fila) * lado + lado / 2;
    const puntas = Array.from({ length: 10 }, (_, i) => {
      const ang = (i * Math.PI) / 5 - Math.PI / 2;
      const rad = i % 2 === 0 ? 16 : 7;
      return `${(cx + rad * Math.cos(ang)).toFixed(1)},${(cy + rad * Math.sin(ang)).toFixed(1)}`;
    }).join(' ');
    return (
      <svg viewBox="0 0 290 280" role="img" aria-label="Mapa cuadriculado con columnas A a E, filas 1 a 5 y una estrella" className="v-cuadrado">
        {letras.map((l, i) =>
          [1, 2, 3, 4, 5].map((n) => (
            <rect key={l + n} x={x0 + i * lado} y={y0 + (5 - n) * lado} width={lado} height={lado} className="v-linea" />
          )),
        )}
        {letras.map((l, i) => (
          <text key={l} x={x0 + i * lado + lado / 2} y={y0 + 5 * lado + 30} className="v-etq v-fuerte">{l}</text>
        ))}
        {[1, 2, 3, 4, 5].map((n) => (
          <text key={n} x={x0 - 20} y={y0 + (5 - n) * lado + lado / 2 + 7} className="v-etq v-fuerte">{n}</text>
        ))}
        <polygon points={puntas} className="v-pintado" strokeLinejoin="round" />
      </svg>
    );
  }
  return <CoordenadasAvanzadas {...props} />;
}

const TIPOS = {
  barras: Barras,
  posicional: Posicional,
  arreglo: Arreglo,
  fraccion: Fraccion,
  recta: Recta,
  balanza: Balanza,
  cubo: Cubo,
  cuerpo: Cuerpo,
  coordenadas: Coordenadas,
  area: Area,
  reloj: RelojEstatico,
  grafico: Grafico,
  secuencia: Secuencia,
  tabla: Tabla,
  sala: Sala,
  plano: Plano,
  figuras: Figuras,
  poligono: Poligono,
  pictograma: Pictograma,
  bolsas: Bolsas,
  tienda: Tienda,
  caja: Caja,
  maquinaPeluches: MaquinaPeluches,
  graficoIconos: GraficoIconos,
  dado3d: Dado3D,
  encuesta: EncuestaProfesora,
  maquina: Maquina,
  pulsera: Pulsera,
  'tablero-100': Tablero100,
  tablero100: Tablero100,
  fosforos: Fosforos,
};

const HERRAMIENTAS = {
  medir: Medir,
  reloj: RelojHerramienta,
  calendario: Calendario,
};

// estado: datos que cambian mientras se responde (por ejemplo, revelar una barra).
export default function Visual({ visual: visualProp, ejercicio, bloqueado, onResponder, estado }) {
  const visual = visualProp ?? ejercicio?.visual;
  const id = ejercicio?.id;
  if (!visual || !visual.tipo) return null;

  // 1. Imagen PNG
  if (visual.tipo === 'imagen') {
    return (
      <figure className="visual">
        <img
          src={`${import.meta.env.BASE_URL}imagenes/${visual.src ?? `${id}.png`}`}
          alt={visual.descripcion || ''}
        />
      </figure>
    );
  }

  // 2. Herramientas interactivas (medir, reloj con manecillas, calendario)
  const Herramienta = HERRAMIENTAS[visual.tipo];
  if (Herramienta && (onResponder || visual.tipo === 'medir' || visual.tipo === 'calendario' || visual.inicio !== undefined)) {
    return (
      <div className="visual herramienta" role="group" aria-label={visual.descripcion || ''}>
        <Herramienta visual={visual} bloqueado={bloqueado} onResponder={onResponder} />
      </div>
    );
  }

  // 3. Representación pictórica SVG de dev
  const Componente = TIPOS[visual.tipo];
  if (Componente) {
    return (
      <figure className={`visual visual--${visual.tipo}`}>
        <Componente {...visual} estado={estado} />
      </figure>
    );
  }

  return null;
}
