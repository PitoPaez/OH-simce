import { f } from '../../lib/formato.js';
import { ConFracciones } from '../ui/Texto.jsx';

// ---------- Tabla de valor posicional ----------
export function Posicional({ cifras = [null, null, null, null], columnas = ['UM', 'C', 'D', 'U'], resaltar }) {
  return (
    <table className="v-tabla-posicional">
      <thead>
        <tr>
          {columnas.map((c, i) => (
            <th key={c} className={i === resaltar ? 'resaltada' : undefined}>
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {columnas.map((c, i) => (
            <td key={c} className={i === resaltar ? 'resaltada' : undefined}>
              {cifras[i] ?? ''}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

// ---------- Número con una cifra destacada ----------
export function NumeroDestacado({ numero, destacar }) {
  const cifras = String(numero).split('');
  const n = cifras.length;
  return (
    <p className="v-numero-destacado" aria-label={`${f(numero)}, con la cifra ${cifras[destacar]} destacada`}>
      {cifras.map((c, i) => (
        <span key={i} className={i === destacar ? 'cifra cifra--destacada' : 'cifra'}>
          {c}
          {(n - i - 1) % 3 === 0 && i < n - 1 ? <span className="cifra-espacio" /> : null}
        </span>
      ))}
    </p>
  );
}

// ---------- Algoritmo en columnas ----------
// Las posiciones se cuentan desde la derecha: 0 = unidades, 1 = decenas...
//   arriba:  marcas pequeñas sobre una columna (reservas o canjes)
//   tachar:  columnas cuya cifra de arriba se tacha al pedir prestado
const NOMBRES_POSICION = ['U', 'D', 'C', 'UM', 'DM'];

export function Columnas({ filas, op, resultado = '', arriba = {}, tachar = [], resaltar, encabezado = true }) {
  const ancho = Math.max(...filas.map((s) => s.length), resultado.length);
  const columnas = Array.from({ length: ancho }, (_, i) => ancho - 1 - i);
  const cifra = (texto, pos) => {
    const i = texto.length - 1 - pos;
    return i >= 0 ? texto[i] : '';
  };
  const clase = (pos) => (pos === resaltar ? 'col col--resaltada' : 'col');
  return (
    <div className="v-columnas" style={{ '--ancho': ancho }} role="img" aria-label={`${filas.join(` ${op} `)}`}>
      {encabezado && (
        <div className="v-columnas-fila v-columnas-encabezado">
          <span className="col col--op" />
          {columnas.map((pos) => (
            <span key={pos} className={clase(pos)}>
              {NOMBRES_POSICION[pos]}
            </span>
          ))}
        </div>
      )}
      <div className="v-columnas-fila v-columnas-arriba">
        <span className="col col--op" />
        {columnas.map((pos) => (
          <span key={pos} className={clase(pos)}>
            {arriba[pos] ?? ''}
          </span>
        ))}
      </div>
      {filas.map((texto, k) => (
        <div key={k} className={k === filas.length - 1 ? 'v-columnas-fila v-columnas-ultima' : 'v-columnas-fila'}>
          <span className="col col--op">{k === filas.length - 1 ? op : ''}</span>
          {columnas.map((pos) => (
            <span key={pos} className={clase(pos)}>
              <span className={k === 0 && tachar.includes(pos) ? 'tachada' : undefined}>{cifra(texto, pos)}</span>
            </span>
          ))}
        </div>
      ))}
      <div className="v-columnas-fila v-columnas-resultado">
        <span className="col col--op" />
        {columnas.map((pos) => (
          <span key={pos} className={clase(pos)}>
            {cifra(resultado, pos)}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------- Modelo de barras (Singapur) ----------
// Parte-todo: { total, partes: [{ valor, peso, etiqueta, incognita }] }
// Comparar:   { comparar: [{ etiqueta, valor, peso, incognita }], diferencia }
export function Barras({ total, partes, comparar, diferencia }) {
  if (comparar) {
    const max = Math.max(...comparar.map((b) => b.peso));
    const x0 = 120;
    const largo = 330;
    return (
      <svg viewBox={`0 0 470 ${comparar.length * 64 + 16}`} role="img" aria-label="Modelo de barras para comparar">
        {comparar.map((b, i) => {
          const ancho = (b.peso / max) * largo;
          const y = 12 + i * 64;
          return (
            <g key={b.etiqueta}>
              <text x={x0 - 12} y={y + 30} className="v-etq v-fuerte v-der">
                {b.etiqueta}
              </text>
              <rect x={x0} y={y} width={ancho} height="44" rx="6" className={b.incognita ? 'v-incognita' : 'v-relleno-borde'} />
              <text x={x0 + ancho / 2} y={y + 30} className={b.incognita ? 'v-num v-acento' : 'v-num'}>
                {b.valor}
              </text>
              {diferencia && i > 0 && ancho < largo && (
                <g>
                  <rect x={x0 + ancho} y={y} width={largo - ancho} height="44" rx="6" className="v-diferencia" />
                  <text x={x0 + ancho + (largo - ancho) / 2} y={y + 28} className="v-etq v-chica">
                    {diferencia}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    );
  }
  const suma = partes.reduce((s, p) => s + p.peso, 0);
  const largo = 440;
  let x = 20;
  return (
    <svg viewBox="0 0 480 170" role="img" aria-label="Modelo de barras: un total y sus partes">
      <rect x="20" y="16" width={largo} height="48" rx="6" className={total.incognita ? 'v-incognita' : 'v-relleno'} />
      <text x={20 + largo / 2} y="48" className={total.incognita ? 'v-num v-acento' : 'v-num'}>
        {total.valor}
      </text>
      {partes.map((p, i) => {
        const ancho = (p.peso / suma) * largo;
        const inicio = x;
        x += ancho;
        return (
          <g key={i}>
            <rect x={inicio} y="84" width={ancho} height="48" rx="6" className={p.incognita ? 'v-incognita' : 'v-linea'} />
            <text x={inicio + ancho / 2} y="116" className={p.incognita ? 'v-num v-acento' : 'v-num'}>
              {p.valor}
            </text>
            {p.etiqueta && (
              <text x={inicio + ancho / 2} y="158" className="v-etq">
                {p.etiqueta}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ---------- Arreglo: filas de objetos (cajas, estantes) ----------
export function Arreglo({ filas, columnas }) {
  const paso = 34;
  const alto = filas * (paso + 6) + 10;
  const ancho = columnas * paso + 40;
  return (
    <svg viewBox={`0 0 ${ancho} ${alto}`} role="img" aria-label={`${filas} filas con ${columnas} objetos cada una`} className="v-angosto">
      {Array.from({ length: filas }, (_, fi) => (
        <g key={fi}>
          <rect x="10" y={8 + fi * (paso + 6)} width={columnas * paso + 20} height={paso} rx="8" className="v-linea" />
          {Array.from({ length: columnas }, (_, c) => (
            <circle key={c} cx={10 + 10 + paso / 2 + c * paso} cy={8 + fi * (paso + 6) + paso / 2} r="10" className="v-punto" />
          ))}
        </g>
      ))}
    </svg>
  );
}

// ---------- Fracciones ----------
// Geometría compartida por el dibujo y por el ejercicio de pintar.
// Devuelve las partes de UN entero, dentro de una caja de 200 x 200
// (o 360 x 90 para la barra).
export function geometriaFraccion(forma, partes) {
  if (forma === 'circulo') {
    const r = 88;
    return Array.from({ length: partes }, (_, i) => {
      const a0 = (i / partes) * 2 * Math.PI - Math.PI / 2;
      const a1 = ((i + 1) / partes) * 2 * Math.PI - Math.PI / 2;
      const p = (a) => `${(100 + r * Math.cos(a)).toFixed(2)},${(100 + r * Math.sin(a)).toFixed(2)}`;
      return { d: `M100,100 L${p(a0)} A${r},${r} 0 0 1 ${p(a1)} Z` };
    });
  }
  if (forma === 'cuadrado4') {
    const v = [
      [10, 10],
      [190, 10],
      [190, 190],
      [10, 190],
    ];
    return v.map((punto, i) => {
      const sig = v[(i + 1) % 4];
      return { d: `M100,100 L${punto[0]},${punto[1]} L${sig[0]},${sig[1]} Z` };
    });
  }
  if (forma === 'grupo') {
    const porFila = partes <= 8 ? 4 : 6;
    const filas = Math.ceil(partes / porFila);
    return Array.from({ length: partes }, (_, i) => ({
      circulo: {
        cx: 30 + (i % porFila) * (140 / Math.max(porFila - 1, 1)),
        cy: 100 - ((filas - 1) * 46) / 2 + Math.floor(i / porFila) * 46,
        r: porFila === 4 ? 20 : 15,
      },
    }));
  }
  // barra
  const ancho = 340 / partes;
  return Array.from({ length: partes }, (_, i) => ({ rect: { x: 10 + i * ancho, y: 10, width: ancho, height: 70 } }));
}

export function cajaFraccion(forma) {
  return forma === 'barra' ? { ancho: 360, alto: 90 } : { ancho: 200, alto: 200 };
}

export function ParteFraccion({ parte, className, ...resto }) {
  if (parte.d) return <path d={parte.d} className={className} {...resto} />;
  if (parte.circulo) return <circle {...parte.circulo} className={className} {...resto} />;
  return <rect {...parte.rect} className={className} {...resto} />;
}

// pintadas: cuántas partes van pintadas, recorriendo los enteros en orden.
// segundo: partes extra con un segundo color (para mostrar una suma).
export function FraccionVisual({ forma = 'circulo', partes, pintadas = 0, segundo = 0, enteros = 1 }) {
  const geo = geometriaFraccion(forma, partes);
  const { ancho, alto } = cajaFraccion(forma);
  const separacion = 16;
  const total = enteros * ancho + (enteros - 1) * separacion;
  return (
    <svg
      viewBox={`0 0 ${total} ${alto}`}
      role="img"
      aria-label={`${enteros > 1 ? `${enteros} enteros divididos` : 'Un entero dividido'} en ${partes} partes iguales, ${pintadas} pintadas`}
      className={forma === 'barra' ? undefined : enteros > 1 ? 'v-mediano' : 'v-cuadrado'}
    >
      {Array.from({ length: enteros }, (_, e) => (
        <g key={e} transform={`translate(${e * (ancho + separacion)} 0)`}>
          {geo.map((parte, i) => {
            const indice = e * partes + i;
            const clase = indice < pintadas ? 'v-pintado' : indice < pintadas + segundo ? 'v-pintado-2' : 'v-linea';
            return <ParteFraccion key={i} parte={parte} className={clase} />;
          })}
        </g>
      ))}
    </svg>
  );
}

// ---------- Recta numérica ----------
export function escalaRecta(inicio, fin) {
  return (v) => 30 + ((v - inicio) / (fin - inicio)) * 420;
}

export function Recta({ inicio, fin, paso, etiquetas = 'extremos', textos = {}, cajas = [], saltos = [], punto }) {
  const x = escalaRecta(inicio, fin);
  const marcas = [];
  for (let v = inicio; v <= fin + 1e-9; v += paso) marcas.push(Math.round(v * 1000) / 1000);
  const conEtiqueta = (v) =>
    etiquetas === 'todas' || (etiquetas === 'extremos' && (v === inicio || v === fin)) || (Array.isArray(etiquetas) && etiquetas.includes(v));
  const texto = (v) => textos[v] ?? f(v);
  return (
    <svg viewBox="0 0 480 150" role="img" aria-label={`Recta numérica de ${texto(inicio)} a ${texto(fin)}`}>
      <line x1="16" y1="96" x2="464" y2="96" className="v-trazo" />
      <path d="M458,90 L466,96 L458,102" className="v-trazo-fino" fill="none" />
      {marcas.map((v) => (
        <line key={v} x1={x(v)} y1="88" x2={x(v)} y2="104" className="v-trazo-fino" />
      ))}
      {saltos.map(([a, b, etq], i) => (
        <g key={i}>
          <path d={`M${x(a)},86 Q${(x(a) + x(b)) / 2},36 ${x(b)},86`} className="v-salto" />
          {etq && (
            <text x={(x(a) + x(b)) / 2} y="52" className="v-etq v-chica v-acento-texto">
              {etq}
            </text>
          )}
        </g>
      ))}
      {marcas.filter(conEtiqueta).map((v) =>
        cajas.includes(v) ? null : (
          <text key={v} x={x(v)} y="130" className="v-etq v-fuerte">
            {texto(v)}
          </text>
        ),
      )}
      {cajas.map((v) => (
        <g key={`c${v}`}>
          <rect x={x(v) - 22} y="110" width="44" height="30" rx="4" className="v-incognita" />
          <text x={x(v)} y="132" className="v-num v-acento v-chico">
            ?
          </text>
        </g>
      ))}
      {punto && (
        <g>
          <circle cx={x(punto.valor)} cy="96" r="8" className="v-pintado" />
          {punto.etiqueta && (
            <text x={x(punto.valor)} y="72" className="v-etq v-fuerte">
              {punto.etiqueta}
            </text>
          )}
        </g>
      )}
    </svg>
  );
}

// ---------- Secuencia numérica ----------
export function Secuencia({ valores, salto, etiquetas, formato = 'numero' }) {
  const mostrar = (v) => (formato === 'peso' ? `$${f(v)}` : f(v));
  return (
    <ol className="v-secuencia">
      {valores.map((v, i) => (
        <li key={i} className="v-secuencia-item">
          {i > 0 && salto && <span className="v-secuencia-salto">{salto}</span>}
          <span className={v === null ? 'v-secuencia-caja v-secuencia-caja--vacia' : 'v-secuencia-caja'}>
            {v === null ? '?' : mostrar(v)}
          </span>
          {etiquetas && <span className="v-secuencia-etq">{etiquetas[i]}</span>}
        </li>
      ))}
    </ol>
  );
}

// ---------- Patrón de figuras que crecen ----------
function Icono({ tipo, x, y }) {
  if (tipo === 'persona')
    return (
      <g className="v-punto">
        <circle cx={x} cy={y - 7} r="5" />
        <path d={`M${x - 7},${y + 9} Q${x},${y - 6} ${x + 7},${y + 9} Z`} />
      </g>
    );
  if (tipo === 'triangulo') return <polygon points={`${x},${y - 9} ${x + 10},${y + 8} ${x - 10},${y + 8}`} className="v-pintado-suave" />;
  if (tipo === 'cuadrado') return <rect x={x - 9} y={y - 9} width="18" height="18" rx="2" className="v-pintado-suave" />;
  return (
    <g>
      <circle cx={x} cy={y} r="10" className="v-tronco" />
      <circle cx={x} cy={y} r="4" className="v-tronco-centro" />
    </g>
  );
}

export function Etapas({ icono = 'circulo', etapas }) {
  return (
    <ol className="v-etapas">
      {etapas.map((etapa, i) => {
        const posiciones = [];
        if (etapa.cantidad) {
          if (etapa.forma === 'piramide') {
            let base = 1;
            while ((base * (base + 1)) / 2 < etapa.cantidad) base += 1;
            let restante = etapa.cantidad;
            for (let fila = 0; restante > 0; fila += 1) {
              const enFila = Math.min(base - fila, restante);
              for (let k = 0; k < enFila; k += 1) posiciones.push([k * 22 - (enFila - 1) * 11, -fila * 19]);
              restante -= enFila;
            }
          } else {
            const porFila = etapa.porFila ?? 5;
            const filas = Math.ceil(etapa.cantidad / porFila);
            for (let k = 0; k < etapa.cantidad; k += 1) {
              const fila = Math.floor(k / porFila);
              const enFila = Math.min(porFila, etapa.cantidad - fila * porFila);
              posiciones.push([(k % porFila) * 24 - (enFila - 1) * 12, (fila - (filas - 1)) * 24]);
            }
          }
        }
        const minY = Math.min(0, ...posiciones.map((p) => p[1]));
        const alto = -minY + 30;
        return (
          <li key={i} className="v-etapa">
            <svg viewBox={`-70 ${minY - 14} 140 ${alto}`} aria-hidden="true">
              {etapa.cantidad ? (
                posiciones.map(([x, y], k) => <Icono key={k} tipo={icono} x={x} y={y} />)
              ) : (
                <text x="0" y={minY + 12} className="v-num v-acento">
                  ?
                </text>
              )}
            </svg>
            <span className="v-etapa-etq">{etapa.etiqueta}</span>
          </li>
        );
      })}
    </ol>
  );
}

// ---------- Balanza ----------
// inclinacion en grados: positiva = baja el lado derecho.
function ObjetoPlatillo({ objeto, x, y }) {
  if (objeto.tipo === 'caja') {
    return (
      <g>
        <rect x={x - 26} y={y - 40} width="52" height="40" rx="5" className="v-caja" />
        <text x={x} y={y - 12} className="v-num v-chico">
          {objeto.texto}
        </text>
      </g>
    );
  }
  if (objeto.tipo === 'bolitas') {
    const bolitas = [];
    const porFila = 4;
    for (let k = 0; k < objeto.n; k += 1) {
      const fila = Math.floor(k / porFila);
      const enFila = Math.min(porFila, objeto.n - fila * porFila);
      bolitas.push([x + (k % porFila) * 15 - (enFila - 1) * 7.5, y - 7 - fila * 13]);
    }
    return (
      <g>
        {bolitas.map(([bx, by], k) => (
          <circle key={k} cx={bx} cy={by} r="7" className="v-bolita" />
        ))}
      </g>
    );
  }
  return (
    <g>
      <path d={`M${x - 26},${y} L${x - 18},${y - 34} L${x + 18},${y - 34} L${x + 26},${y} Z`} className="v-pesa" />
      <text x={x} y={y - 10} className="v-num v-chico v-claro">
        {objeto.valor}
      </text>
    </g>
  );
}

// El platillo cuelga de la punta de la viga (gancho) con dos hilos.
function Platillo({ objetos, cx, cy, gancho }) {
  const anchoObjeto = (o) => (o.tipo === 'bolitas' ? Math.min(o.n, 4) * 15 + 6 : 58);
  const total = objetos.reduce((s, o) => s + anchoObjeto(o), 0);
  let x = cx - total / 2;
  return (
    <g>
      <line x1={cx} y1={gancho} x2={cx - 66} y2={cy} className="v-hilo" />
      <line x1={cx} y1={gancho} x2={cx + 66} y2={cy} className="v-hilo" />
      <path d={`M${cx - 70},${cy} Q${cx},${cy + 22} ${cx + 70},${cy} Z`} className="v-platillo" />
      {objetos.map((o, i) => {
        const w = anchoObjeto(o);
        const centro = x + w / 2;
        x += w;
        return <ObjetoPlatillo key={i} objeto={o} x={centro} y={cy - 1} />;
      })}
    </g>
  );
}

export function Balanza({ izquierda, derecha, inclinacion = 0, etiqueta }) {
  const rad = (inclinacion * Math.PI) / 180;
  const brazo = 150;
  const pivote = { x: 230, y: 64 };
  const izq = { x: pivote.x - brazo * Math.cos(rad), y: pivote.y - brazo * Math.sin(rad) };
  const der = { x: pivote.x + brazo * Math.cos(rad), y: pivote.y + brazo * Math.sin(rad) };
  return (
    <svg viewBox="0 0 460 250" role="img" aria-label={etiqueta ?? 'Balanza'}>
      <polygon points="230,64 206,226 254,226" className="v-relleno-borde" />
      <rect x="170" y="226" width="120" height="12" rx="4" className="v-relleno-borde" />
      <line x1={izq.x} y1={izq.y} x2={der.x} y2={der.y} className="v-trazo v-viga" />
      <circle cx={pivote.x} cy={pivote.y} r="7" className="v-pivote" />
      <Platillo objetos={izquierda} cx={izq.x} cy={izq.y + 110} gancho={izq.y} />
      <Platillo objetos={derecha} cx={der.x} cy={der.y + 110} gancho={der.y} />
    </svg>
  );
}

// ---------- Precios ----------
function IconoProducto({ tipo }) {
  const comun = { viewBox: '0 0 48 48', 'aria-hidden': true, className: 'v-producto-icono' };
  switch (tipo) {
    case 'cuaderno':
      return (
        <svg {...comun}>
          <rect x="10" y="6" width="28" height="36" rx="3" className="v-prod-a" />
          <path d="M16 6v36M21 16h12M21 22h12" className="v-prod-linea" />
        </svg>
      );
    case 'portamina':
      return (
        <svg {...comun}>
          <path d="M14 40l4-10 18-18 4 4-18 18z" className="v-prod-b" />
          <path d="M14 40l4-10 6 6z" className="v-prod-linea-relleno" />
        </svg>
      );
    case 'goma':
      return (
        <svg {...comun}>
          <rect x="8" y="16" width="32" height="18" rx="4" className="v-prod-c" />
          <path d="M22 16v18" className="v-prod-linea" />
        </svg>
      );
    case 'lapices':
      return (
        <svg {...comun}>
          {[10, 17, 24, 31].map((x, i) => (
            <path key={x} d={`M${x} 40V14l3.5-6 3.5 6v26z`} className={['v-prod-a', 'v-prod-b', 'v-prod-c', 'v-prod-d'][i]} />
          ))}
        </svg>
      );
    case 'tomate':
      return (
        <svg {...comun}>
          <circle cx="24" cy="27" r="15" className="v-prod-rojo" />
          <path d="M18 12l6 4 6-4-3 6h-6z" className="v-prod-verde" />
        </svg>
      );
    case 'palta':
      return (
        <svg {...comun}>
          <path d="M24 6c8 0 10 14 12 22 2 9-5 15-12 15S10 37 12 28c2-8 4-22 12-22z" className="v-prod-verde" />
          <circle cx="24" cy="31" r="6" className="v-prod-cafe" />
        </svg>
      );
    case 'zanahoria':
      return (
        <svg {...comun}>
          <path d="M14 14l22 4-20 24z" className="v-prod-naranjo" />
          <path d="M14 14l-6-6M14 14l-2-8M14 14l-8-2" className="v-prod-linea-verde" />
        </svg>
      );
    default:
      return (
        <svg {...comun}>
          <rect x="8" y="10" width="32" height="28" rx="4" className="v-prod-a" />
        </svg>
      );
  }
}

export function Precios({ productos }) {
  return (
    <ul className="v-precios">
      {productos.map((p) => (
        <li key={p.nombre} className="v-precio">
          <IconoProducto tipo={p.icono} />
          <span className="v-precio-nombre">{p.nombre}</span>
          <span className="v-precio-valor">${f(p.precio)}</span>
        </li>
      ))}
    </ul>
  );
}

// ---------- Tabla ----------
export function Tabla({ titulo, encabezados, filas }) {
  return (
    <table className="v-tabla">
      {titulo && <caption>{titulo}</caption>}
      <thead>
        <tr>
          {encabezados.map((e) => (
            <th key={e} scope="col">
              {e}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filas.map((fila, i) => (
          <tr key={i}>
            {fila.map((celda, j) => (
              <td key={j}>{typeof celda === 'number' ? f(celda) : <ConFracciones texto={String(celda)} />}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
