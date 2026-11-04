// Representaciones pictóricas de cada ejercicio (etapa "pictórica" del método
// Concreto-Pictórico-Abstracto). Usan currentColor para tomar el color del eje
// y las variables de index.css para la tinta y el papel.

function Barras({ total, parte }) {
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

function Posicional({ cifras }) {
  const columnas = ['UM', 'C', 'D', 'U'];
  return (
    <svg viewBox="0 0 400 150" role="img" aria-label="Tabla de valor posicional con unidades de mil, centenas, decenas y unidades">
      {columnas.map((col, i) => (
        <g key={col}>
          <rect x={20 + i * 90} y="15" width="90" height="44" className="v-relleno" stroke="var(--tinta)" strokeWidth="2" />
          <text x={65 + i * 90} y="45" className="v-etq v-fuerte">{col}</text>
          <rect x={20 + i * 90} y="59" width="90" height="72" className="v-linea" />
          <text x={65 + i * 90} y="108" className="v-num v-grande">{cifras[i]}</text>
        </g>
      ))}
    </svg>
  );
}

function Arreglo({ filas, columnas }) {
  const paso = 34;
  const alto = filas * (paso + 6) + 10;
  const ancho = columnas * paso + 40;
  return (
    <svg viewBox={`0 0 ${ancho} ${alto}`} role="img" aria-label={`${filas} cajas con ${columnas} lápices cada una`}>
      {Array.from({ length: filas }, (_, f) => (
        <g key={f}>
          <rect x="10" y={8 + f * (paso + 6)} width={columnas * paso + 20} height={paso} rx="8" className="v-linea" />
          {Array.from({ length: columnas }, (_, c) => (
            <circle key={c} cx={10 + 10 + paso / 2 + c * paso} cy={8 + f * (paso + 6) + paso / 2} r="10" className="v-punto" />
          ))}
        </g>
      ))}
    </svg>
  );
}

function Fraccion({ partes, pintadas }) {
  const r = 80;
  const cx = 100;
  const cy = 100;
  const sectores = Array.from({ length: partes }, (_, i) => {
    const a0 = (i / partes) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((i + 1) / partes) * 2 * Math.PI - Math.PI / 2;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    return `M${cx},${cy} L${x0.toFixed(2)},${y0.toFixed(2)} A${r},${r} 0 0 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z`;
  });
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={`Círculo dividido en ${partes} partes iguales, ${pintadas} pintadas`} className="v-cuadrado">
      {sectores.map((d, i) => (
        <path key={i} d={d} className={i < pintadas ? 'v-pintado' : 'v-linea'} />
      ))}
    </svg>
  );
}

function Recta({ valores }) {
  const min = 5;
  const max = 25;
  const x = (v) => 30 + ((v - min) / (max - min)) * 420;
  const conocidos = valores.map((v, i) => (v === null ? valores[i - 1] + (valores[i + 1] - valores[i - 1]) / 2 : v));
  return (
    <svg viewBox="0 0 480 160" role="img" aria-label="Recta numérica con saltos entre los números de la secuencia">
      <line x1="20" y1="110" x2="460" y2="110" className="v-trazo" />
      {Array.from({ length: max - min + 1 }, (_, i) => (
        <line key={i} x1={x(min + i)} y1="104" x2={x(min + i)} y2="116" className="v-trazo-fino" />
      ))}
      {conocidos.slice(0, -1).map((v, i) => {
        const a = x(v);
        const b = x(conocidos[i + 1]);
        return (
          <path key={i} d={`M${a},100 Q${(a + b) / 2},40 ${b},100`} className="v-salto" />
        );
      })}
      {valores.map((v, i) =>
        v === null ? (
          <g key={i}>
            <rect x={x(conocidos[i]) - 18} y="124" width="36" height="30" rx="4" className="v-incognita" />
            <text x={x(conocidos[i])} y="146" className="v-num v-acento">?</text>
          </g>
        ) : (
          <text key={i} x={x(v)} y="146" className="v-num">{v}</text>
        ),
      )}
    </svg>
  );
}

function Balanza({ izquierda, derecha }) {
  return (
    <svg viewBox="0 0 440 200" role="img" aria-label={`Balanza en equilibrio: a un lado ${izquierda}, al otro ${derecha}`}>
      <polygon points="220,70 196,180 244,180" className="v-relleno" stroke="var(--tinta)" strokeWidth="2" strokeLinejoin="round" />
      <line x1="60" y1="70" x2="380" y2="70" className="v-trazo" />
      <line x1="90" y1="70" x2="90" y2="100" className="v-trazo-fino" />
      <line x1="350" y1="70" x2="350" y2="100" className="v-trazo-fino" />
      <rect x="20" y="100" width="140" height="56" rx="10" className="v-linea" />
      <rect x="280" y="100" width="140" height="56" rx="10" className="v-linea" />
      <text x="90" y="137" className="v-num">{izquierda}</text>
      <text x="350" y="137" className="v-num">{derecha}</text>
    </svg>
  );
}

function Cubo() {
  return (
    <svg viewBox="0 0 220 210" role="img" aria-label="Dibujo de un cubo" className="v-cuadrado">
      <polygon points="40,75 95,25 205,25 150,75" className="v-pintado" strokeLinejoin="round" />
      <polygon points="150,75 205,25 205,135 150,185" className="v-relleno" stroke="var(--tinta)" strokeWidth="2" strokeLinejoin="round" />
      <rect x="40" y="75" width="110" height="110" className="v-linea" />
      {/* Aristas que no se ven, punteadas como en el cuaderno. */}
      <polyline points="40,185 95,135 205,135" className="v-oculta" />
      <line x1="95" y1="135" x2="95" y2="25" className="v-oculta" />
    </svg>
  );
}

function Coordenadas({ columna, fila }) {
  const letras = ['A', 'B', 'C', 'D', 'E'];
  const lado = 44;
  const x0 = 50;
  const y0 = 14;
  const cx = x0 + letras.indexOf(columna) * lado + lado / 2;
  const cy = y0 + (5 - fila) * lado + lado / 2;
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

function Area({ largo, ancho }) {
  const lado = 52;
  return (
    <svg viewBox={`0 0 ${largo * lado + 20} ${ancho * lado + 20}`} role="img" aria-label={`Rectángulo de ${largo} cuadrados de largo y ${ancho} de ancho`}>
      {Array.from({ length: ancho }, (_, f) =>
        Array.from({ length: largo }, (_, c) => (
          <rect key={`${f}-${c}`} x={10 + c * lado} y={10 + f * lado} width={lado} height={lado} className="v-relleno" stroke="var(--tinta)" strokeWidth="2" />
        )),
      )}
    </svg>
  );
}

function Reloj({ hora, minutos }) {
  const angMin = (minutos / 60) * 360;
  const angHora = ((hora % 12) + minutos / 60) * 30;
  const punta = (ang, largo) => [100 + largo * Math.sin((ang * Math.PI) / 180), 100 - largo * Math.cos((ang * Math.PI) / 180)];
  const [mx, my] = punta(angMin, 64);
  const [hx, hy] = punta(angHora, 42);
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={`Reloj que marca las ${hora}:${String(minutos).padStart(2, '0')}`} className="v-cuadrado">
      <circle cx="100" cy="100" r="90" className="v-linea" strokeWidth="3" />
      {Array.from({ length: 12 }, (_, i) => {
        const [tx, ty] = punta((i + 1) * 30, 72);
        return (
          <text key={i} x={tx} y={ty + 6} className="v-etq v-fuerte">{i + 1}</text>
        );
      })}
      <line x1="100" y1="100" x2={hx} y2={hy} className="v-manecilla-hora" />
      <line x1="100" y1="100" x2={mx} y2={my} className="v-manecilla" />
      <circle cx="100" cy="100" r="5" fill="var(--tinta)" />
    </svg>
  );
}

function Grafico({ titulo, datos }) {
  const maximo = Math.max(...datos.map((d) => d.valor));
  const alto = 180;
  const escala = alto / maximo;
  const anchoBarra = 56;
  const separacion = 34;
  const x0 = 50;
  return (
    <svg viewBox="0 0 440 260" role="img" aria-label={`${titulo}: ${datos.map((d) => `${d.etiqueta} ${d.valor}`).join(', ')}`}>
      <text x="230" y="20" className="v-etq v-fuerte">{titulo}</text>
      {Array.from({ length: maximo + 1 }, (_, i) => (
        <g key={i}>
          <line x1={x0} y1={220 - i * escala} x2="430" y2={220 - i * escala} className="v-guia" />
          <text x={x0 - 14} y={225 - i * escala} className="v-etq v-chica">{i}</text>
        </g>
      ))}
      {datos.map((d, i) => (
        <g key={d.etiqueta}>
          <rect x={x0 + 20 + i * (anchoBarra + separacion)} y={220 - d.valor * escala} width={anchoBarra} height={d.valor * escala} className="v-pintado" />
          <text x={x0 + 20 + i * (anchoBarra + separacion) + anchoBarra / 2} y="246" className="v-etq">{d.etiqueta}</text>
        </g>
      ))}
      <line x1={x0} y1="220" x2="430" y2="220" className="v-trazo" />
    </svg>
  );
}

const TIPOS = {
  barras: Barras,
  posicional: Posicional,
  arreglo: Arreglo,
  fraccion: Fraccion,
  recta: Recta,
  balanza: Balanza,
  cubo: Cubo,
  coordenadas: Coordenadas,
  area: Area,
  reloj: Reloj,
  grafico: Grafico,
};

export default function Visual({ visual }) {
  const Componente = TIPOS[visual.tipo];
  if (!Componente) return null;
  return (
    <figure className="visual">
      <Componente {...visual} />
    </figure>
  );
}
