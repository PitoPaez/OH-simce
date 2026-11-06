// ---------- Íconos para mapas ----------
export function IconoMapa({ tipo, cx, cy, r = 15 }) {
  if (tipo === 'estrella') {
    const puntas = Array.from({ length: 10 }, (_, i) => {
      const a = (i * Math.PI) / 5 - Math.PI / 2;
      const rad = i % 2 === 0 ? r : r * 0.45;
      return `${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`;
    }).join(' ');
    return <polygon points={puntas} className="v-pintado" strokeLinejoin="round" />;
  }
  if (tipo === 'corazon') {
    const s = r / 15;
    return (
      <path
        d={`M${cx},${cy + 12 * s} C${cx - 18 * s},${cy} ${cx - 12 * s},${cy - 14 * s} ${cx},${cy - 5 * s} C${cx + 12 * s},${cy - 14 * s} ${cx + 18 * s},${cy} ${cx},${cy + 12 * s} Z`}
        className="v-pintado"
      />
    );
  }
  if (tipo === 'tesoro') {
    return (
      <g>
        <rect x={cx - r} y={cy - r * 0.5} width={r * 2} height={r * 1.3} rx="3" className="v-pintado" />
        <path d={`M${cx - r},${cy - r * 0.5} Q${cx},${cy - r * 1.4} ${cx + r},${cy - r * 0.5}`} className="v-pintado" />
      </g>
    );
  }
  return <circle cx={cx} cy={cy} r={r * 0.7} className="v-pintado" />;
}

// ---------- Mapa con coordenadas de letras y números ----------
export const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export function Coordenadas({ columnas = 5, filas = 5, objetos = [], camino }) {
  const lado = 44;
  const x0 = 46;
  const y0 = 12;
  const centro = (col, fila) => ({
    x: x0 + LETRAS.indexOf(col) * lado + lado / 2,
    y: y0 + (filas - fila) * lado + lado / 2,
  });
  return (
    <svg
      viewBox={`0 0 ${x0 + columnas * lado + 12} ${y0 + filas * lado + 40}`}
      role="img"
      aria-label={`Mapa cuadriculado con columnas de la A a la ${LETRAS[columnas - 1]} y filas del 1 al ${filas}`}
      className="v-cuadrado"
    >
      {Array.from({ length: columnas }, (_, c) =>
        Array.from({ length: filas }, (_, f) => (
          <rect key={`${c}-${f}`} x={x0 + c * lado} y={y0 + f * lado} width={lado} height={lado} className="v-celda" />
        )),
      )}
      {camino &&
        (() => {
          const p = centro(camino.col, camino.fila);
          return (
            <g className="v-camino">
              <line x1={p.x} y1={p.y} x2={p.x} y2={y0 + filas * lado + 4} />
              <line x1={p.x} y1={p.y} x2={x0 - 4} y2={p.y} />
            </g>
          );
        })()}
      {LETRAS.slice(0, columnas).map((l, i) => (
        <text key={l} x={x0 + i * lado + lado / 2} y={y0 + filas * lado + 28} className="v-etq v-fuerte">
          {l}
        </text>
      ))}
      {Array.from({ length: filas }, (_, i) => (
        <text key={i} x={x0 - 18} y={y0 + (filas - 1 - i) * lado + lado / 2 + 7} className="v-etq v-fuerte">
          {i + 1}
        </text>
      ))}
      {objetos.map((o, i) => {
        const p = centro(o.col, o.fila);
        return <IconoMapa key={i} tipo={o.icono} cx={p.x} cy={p.y} />;
      })}
    </svg>
  );
}

// ---------- Plano con ejes numerados ----------
export function Plano({ max = 10, puntos = [] }) {
  const lado = 30;
  const x0 = 34;
  const alto = max * lado;
  const px = (x) => x0 + x * lado;
  const py = (y) => 12 + alto - y * lado;
  return (
    <svg viewBox={`0 0 ${x0 + alto + 24} ${alto + 50}`} role="img" aria-label="Plano con coordenadas numeradas" className="v-mediano">
      {Array.from({ length: max + 1 }, (_, i) => (
        <g key={i}>
          <line x1={px(i)} y1={py(0)} x2={px(i)} y2={py(max)} className="v-guia" />
          <line x1={px(0)} y1={py(i)} x2={px(max)} y2={py(i)} className="v-guia" />
          {i > 0 && (
            <>
              <text x={px(i)} y={py(0) + 22} className="v-etq v-chica">
                {i}
              </text>
              <text x={px(0) - 14} y={py(i) + 5} className="v-etq v-chica">
                {i}
              </text>
            </>
          )}
        </g>
      ))}
      <line x1={px(0)} y1={py(0)} x2={px(max) + 10} y2={py(0)} className="v-trazo" />
      <line x1={px(0)} y1={py(0)} x2={px(0)} y2={py(max) - 10} className="v-trazo" />
      {puntos.map((p) => (
        <g key={p.etiqueta}>
          <circle cx={px(p.x)} cy={py(p.y)} r="7" className="v-pintado" />
          <text x={px(p.x) + 14} y={py(p.y) - 8} className="v-etq v-fuerte v-izq">
            {p.etiqueta}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ---------- Sala de clases vista desde atrás ----------
export function Sala({ filas }) {
  return (
    <div className="v-sala" role="img" aria-label="Puestos de una sala de clases vistos desde atrás, mirando a la pizarra">
      <div className="v-sala-pizarra">Pizarra</div>
      {filas.map((fila, i) => (
        <div key={i} className="v-sala-fila">
          {fila.map((nombre) => (
            <span key={nombre} className="v-sala-puesto">
              {nombre}
            </span>
          ))}
        </div>
      ))}
      <p className="v-sala-nota">Así ven la sala los estudiantes sentados.</p>
    </div>
  );
}

// ---------- Cuerpos geométricos ----------
export function Cuerpo({ forma, chico = false }) {
  const clase = chico ? 'v-cuerpo v-cuerpo--chico' : 'v-cuerpo';
  return (
    <svg viewBox="0 0 220 210" role="img" aria-label={NOMBRE_CUERPO[forma]} className={clase}>
      {forma === 'cubo' && (
        <>
          <polygon points="40,75 95,25 205,25 150,75" className="v-pintado" />
          <polygon points="150,75 205,25 205,135 150,185" className="v-relleno-borde" />
          <rect x="40" y="75" width="110" height="110" className="v-linea" />
          <polyline points="40,185 95,135 205,135" className="v-oculta" />
          <line x1="95" y1="135" x2="95" y2="25" className="v-oculta" />
        </>
      )}
      {forma === 'piramide' && (
        <>
          <polygon points="30,170 120,185 110,30" className="v-linea" />
          <polygon points="120,185 195,150 110,30" className="v-relleno-borde" />
          <polyline points="30,170 105,140 195,150" className="v-oculta" />
          <line x1="105" y1="140" x2="110" y2="30" className="v-oculta" />
        </>
      )}
      {forma === 'cono' && (
        <>
          <path d="M30,165 L110,25 L190,165" className="v-relleno-borde" />
          <ellipse cx="110" cy="165" rx="80" ry="22" className="v-linea" />
          <path d="M30,165 A80,22 0 0 1 190,165" className="v-oculta" />
          <path d="M30,165 L110,25 L190,165" className="v-borde-solo" />
        </>
      )}
      {forma === 'cilindro' && (
        <>
          <rect x="45" y="45" width="130" height="120" className="v-relleno-borde v-sin-borde" />
          <line x1="45" y1="45" x2="45" y2="165" className="v-trazo-fino" />
          <line x1="175" y1="45" x2="175" y2="165" className="v-trazo-fino" />
          <ellipse cx="110" cy="45" rx="65" ry="20" className="v-pintado" />
          <path d="M45,165 A65,20 0 0 0 175,165" className="v-borde-solo" />
          <path d="M45,165 A65,20 0 0 1 175,165" className="v-oculta" />
        </>
      )}
      {forma === 'prisma' && (
        <>
          <polygon points="30,170 80,70 130,170" className="v-linea" />
          <polygon points="80,70 175,40 225,140 130,170" className="v-relleno-borde" transform="translate(-10 0)" />
          <polyline points="30,170 120,140 165,40" className="v-oculta" />
        </>
      )}
      {forma === 'esfera' && (
        <>
          <circle cx="110" cy="105" r="80" className="v-relleno-borde" />
          <path d="M30,105 A80,24 0 0 0 190,105" className="v-borde-solo" />
          <path d="M30,105 A80,24 0 0 1 190,105" className="v-oculta" />
        </>
      )}
    </svg>
  );
}

export const NOMBRE_CUERPO = {
  cubo: 'Cubo',
  piramide: 'Pirámide de base cuadrada',
  cono: 'Cono',
  cilindro: 'Cilindro',
  prisma: 'Prisma de base triangular',
  esfera: 'Esfera',
};

// ---------- Figuras 2D ----------
function MarcaRecta({ x, y, dx, dy }) {
  const s = 14;
  return <path d={`M${x + dx * s},${y} L${x + dx * s},${y + dy * s} L${x},${y + dy * s}`} className="v-angulo-recto" />;
}

export function Figura2D({ forma, angulos = false, ejes = [] }) {
  return (
    <svg viewBox="0 0 160 140" role="img" aria-label={NOMBRE_FIGURA[forma]} className="v-figura">
      {forma === 'cuadrado' && <rect x="30" y="20" width="100" height="100" className="v-relleno-borde" />}
      {forma === 'rectangulo' && <rect x="15" y="35" width="130" height="70" className="v-relleno-borde" />}
      {forma === 'circulo' && <circle cx="80" cy="70" r="52" className="v-relleno-borde" />}
      {forma === 'trianguloEq' && <polygon points="80,15 140,120 20,120" className="v-relleno-borde" />}
      {forma === 'trianguloRect' && <polygon points="30,20 30,120 135,120" className="v-relleno-borde" />}
      {forma === 'trapecioRect' && <polygon points="25,45 135,20 135,120 25,120" className="v-relleno-borde" />}
      {forma === 'rombo' && <polygon points="80,10 135,70 80,130 25,70" className="v-relleno-borde" />}
      {angulos && forma === 'cuadrado' && (
        <>
          <MarcaRecta x={30} y={20} dx={1} dy={1} />
          <MarcaRecta x={130} y={20} dx={-1} dy={1} />
          <MarcaRecta x={30} y={120} dx={1} dy={-1} />
          <MarcaRecta x={130} y={120} dx={-1} dy={-1} />
        </>
      )}
      {angulos && forma === 'trianguloRect' && <MarcaRecta x={30} y={120} dx={1} dy={-1} />}
      {angulos && forma === 'trapecioRect' && (
        <>
          <MarcaRecta x={25} y={120} dx={1} dy={-1} />
          <MarcaRecta x={135} y={120} dx={-1} dy={-1} />
        </>
      )}
      {ejes.map((d, i) => (
        <path key={i} d={d} className="v-eje-simetria" />
      ))}
    </svg>
  );
}

export const NOMBRE_FIGURA = {
  cuadrado: 'Cuadrado',
  rectangulo: 'Rectángulo',
  circulo: 'Círculo',
  trianguloEq: 'Triángulo de lados iguales',
  trianguloRect: 'Triángulo con un ángulo recto',
  trapecioRect: 'Trapecio con dos ángulos rectos',
  rombo: 'Rombo',
};

export function Figuras({ lista }) {
  return (
    <ul className="v-figuras">
      {lista.map((fig) => (
        <li key={fig.etiqueta}>
          <Figura2D forma={fig.forma} angulos={fig.angulos} />
          <span className="v-figuras-etq">{fig.etiqueta}</span>
        </li>
      ))}
    </ul>
  );
}

// ---------- Red de un cuerpo (celdas en una cuadrícula) ----------
export function Red({ celdas }) {
  const lado = 28;
  const maxX = Math.max(...celdas.map(([x]) => x)) + 1;
  const maxY = Math.max(...celdas.map(([, y]) => y)) + 1;
  return (
    <svg viewBox={`-4 -4 ${maxX * lado + 8} ${maxY * lado + 8}`} role="img" aria-label={`Red con ${celdas.length} cuadrados`} className="v-red">
      {celdas.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x * lado} y={y * lado} width={lado} height={lado} className="v-relleno-borde" />
      ))}
    </svg>
  );
}

// ---------- Ángulos ----------
export function Angulos({ lista }) {
  return (
    <ul className="v-figuras">
      {lista.map((a) => {
        const rad = (a.grados * Math.PI) / 180;
        const r = a.largo;
        const fin = { x: 30 + r * Math.cos(rad), y: 120 - r * Math.sin(rad) };
        const arco = 26;
        return (
          <li key={a.etiqueta}>
            <svg viewBox="0 0 170 140" role="img" aria-label={`Ángulo ${a.etiqueta}`} className="v-figura">
              <line x1="30" y1="120" x2={30 + r} y2="120" className="v-trazo" />
              <line x1="30" y1="120" x2={fin.x} y2={fin.y} className="v-trazo" />
              <path
                d={`M${30 + arco},120 A${arco},${arco} 0 0 0 ${30 + arco * Math.cos(rad)},${120 - arco * Math.sin(rad)}`}
                className="v-salto"
              />
            </svg>
            <span className="v-figuras-etq">Ángulo {a.etiqueta}</span>
          </li>
        );
      })}
    </ul>
  );
}
