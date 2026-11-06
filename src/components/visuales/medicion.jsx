import { useState } from 'react';

// ---------- Reloj análogo ----------
export function puntaReloj(angulo, largo) {
  const rad = (angulo * Math.PI) / 180;
  return [100 + largo * Math.sin(rad), 100 - largo * Math.cos(rad)];
}

export function Reloj({ hora, minutos, resaltar, chico = false }) {
  const angMin = (minutos / 60) * 360;
  const angHora = ((hora % 12) + minutos / 60) * 30;
  const [mx, my] = puntaReloj(angMin, 66);
  const [hx, hy] = puntaReloj(angHora, 44);
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label={`Reloj análogo`}
      className={chico ? 'v-reloj v-reloj--chico' : 'v-reloj'}
    >
      <circle cx="100" cy="100" r="92" className="v-linea v-esfera" />
      {Array.from({ length: 60 }, (_, i) => {
        const [x1, y1] = puntaReloj(i * 6, i % 5 === 0 ? 80 : 85);
        const [x2, y2] = puntaReloj(i * 6, 89);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className={i % 5 === 0 ? 'v-trazo-fino' : 'v-guia'} />;
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const [tx, ty] = puntaReloj((i + 1) * 30, 66);
        return (
          <text key={i} x={tx} y={ty + 7} className="v-etq v-fuerte">
            {i + 1}
          </text>
        );
      })}
      <line x1="100" y1="100" x2={hx} y2={hy} className={resaltar === 'horario' ? 'v-manecilla-hora v-manecilla--resaltada' : 'v-manecilla-hora'} />
      <line x1="100" y1="100" x2={mx} y2={my} className={resaltar === 'minutero' ? 'v-manecilla v-manecilla--resaltada' : 'v-manecilla'} />
      <circle cx="100" cy="100" r="6" className="v-pivote" />
    </svg>
  );
}

// ---------- Comparar longitudes ----------
export function Longitudes({ barras }) {
  const max = Math.max(...barras.map((b) => b.cm));
  return (
    <ul className="v-longitudes">
      {barras.map((b) => (
        <li key={b.etiqueta}>
          <span className="v-longitud-etq">{b.etiqueta}</span>
          <span className="v-longitud-barra" style={{ '--largo': `${(b.cm / max) * 100}%` }}>
            <span>{b.texto}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

// ---------- Polígono con medidas en sus lados ----------
// puntos: vértices en orden; lados[i] es la medida del lado i -> i+1.
function dentro([x, y], puntos) {
  let adentro = false;
  for (let i = 0, j = puntos.length - 1; i < puntos.length; j = i, i += 1) {
    const [xi, yi] = puntos[i];
    const [xj, yj] = puntos[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) adentro = !adentro;
  }
  return adentro;
}

export function Poligono({ puntos, lados = [], resaltar = [], relleno = true }) {
  const xs = puntos.map((p) => p[0]);
  const ys = puntos.map((p) => p[1]);
  const pad = 46;
  const caja = [Math.min(...xs) - pad, Math.min(...ys) - pad, Math.max(...xs) - Math.min(...xs) + pad * 2, Math.max(...ys) - Math.min(...ys) + pad * 2];
  return (
    <svg viewBox={caja.join(' ')} role="img" aria-label="Figura con las medidas de sus lados" className="v-poligono">
      <polygon points={puntos.map((p) => p.join(',')).join(' ')} className={relleno ? 'v-relleno-borde' : 'v-linea'} />
      {puntos.map((p, i) => {
        const q = puntos[(i + 1) % puntos.length];
        const mx = (p[0] + q[0]) / 2;
        const my = (p[1] + q[1]) / 2;
        let nx = -(q[1] - p[1]);
        let ny = q[0] - p[0];
        const largo = Math.hypot(nx, ny) || 1;
        nx /= largo;
        ny /= largo;
        // La medida va por fuera de la figura, aunque tenga entrantes.
        if (dentro([mx + nx * 6, my + ny * 6], puntos)) {
          nx = -nx;
          ny = -ny;
        }
        return (
          <g key={i}>
            {resaltar.includes(i) && <line x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} className="v-lado-resaltado" />}
            {lados[i] && (
              <text x={mx + nx * 24} y={my + ny * 24 + 6} className="v-etq v-fuerte">
                {lados[i]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ---------- Área: rectángulo cuadriculado o figura de cuadraditos ----------
export function Area({ largo, ancho, celdas }) {
  const lado = 40;
  const lista = celdas ?? Array.from({ length: largo * ancho }, (_, i) => [i % largo, Math.floor(i / largo)]);
  const maxX = Math.max(...lista.map(([x]) => x)) + 1;
  const maxY = Math.max(...lista.map(([, y]) => y)) + 1;
  return (
    <svg viewBox={`-4 -4 ${maxX * lado + 8} ${maxY * lado + 8}`} role="img" aria-label={`Figura formada por ${lista.length} cuadrados iguales`} className={celdas ? 'v-red' : undefined}>
      {lista.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x * lado} y={y * lado} width={lado} height={lado} className="v-relleno-borde" />
      ))}
    </svg>
  );
}

// ---------- Cubos apilados (volumen) ----------
// alturas[fila][columna]: cuántos cubos hay en cada lugar. La fila 0 está
// al fondo y la última, adelante.
const A = 19;
const B = 11;
const H = 22;

function cubosDesdeAlturas(alturas) {
  const lista = [];
  alturas.forEach((fila, y) =>
    fila.forEach((altura, x) => {
      for (let z = 0; z < altura; z += 1) lista.push([x, y, z]);
    }),
  );
  return lista.sort((p, q) => p[0] + p[1] + p[2] - (q[0] + q[1] + q[2]) || p[2] - q[2]);
}

function proyectar(x, y, z) {
  return [(x - y) * A, (x + y) * B - z * H];
}

export function contarCubos(alturas) {
  return alturas.flat().reduce((s, h) => s + h, 0);
}

export function CubosIso({ alturas }) {
  const cubos = cubosDesdeAlturas(alturas);
  const esquinas = [0, 1].flatMap((dx) => [0, 1].flatMap((dy) => [0, 1].map((dz) => [dx, dy, dz])));
  const puntos = cubos.flatMap(([x, y, z]) => esquinas.map(([dx, dy, dz]) => proyectar(x + dx, y + dy, z + dz)));
  const minX = Math.min(...puntos.map((p) => p[0])) - 4;
  const maxX = Math.max(...puntos.map((p) => p[0])) + 4;
  const minY = Math.min(...puntos.map((p) => p[1])) - 4;
  const maxY = Math.max(...puntos.map((p) => p[1])) + 4;
  const poli = (lista) => lista.map((p) => proyectar(...p).join(',')).join(' ');
  return (
    <svg viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`} role="img" aria-label="Figura formada por cubos apilados" className="v-cubos">
      {cubos.map(([x, y, z]) => (
        <g key={`${x}-${y}-${z}`}>
          <polygon points={poli([[x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]])} className="v-cubo-arriba" />
          <polygon points={poli([[x, y + 1, z + 1], [x + 1, y + 1, z + 1], [x + 1, y + 1, z], [x, y + 1, z]])} className="v-cubo-frente" />
          <polygon points={poli([[x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x + 1, y + 1, z], [x + 1, y, z]])} className="v-cubo-lado" />
        </g>
      ))}
    </svg>
  );
}

// Vista por pisos: cada piso visto desde arriba, para contar los cubos que
// no se ven (error frecuente: contar solo los cubos visibles).
export function Pisos({ alturas }) {
  const max = Math.max(...alturas.flat());
  const pisos = Array.from({ length: max }, (_, z) => alturas.map((fila) => fila.map((h) => h > z)));
  const lado = 22;
  return (
    <ol className="v-pisos">
      {pisos.map((piso, z) => {
        const n = piso.flat().filter(Boolean).length;
        return (
          <li key={z}>
            <svg viewBox={`-2 -2 ${piso[0].length * lado + 4} ${piso.length * lado + 4}`} aria-hidden="true">
              {piso.map((fila, y) =>
                fila.map((hay, x) => (
                  <rect key={`${x}-${y}`} x={x * lado} y={y * lado} width={lado} height={lado} className={hay ? 'v-cubo-arriba v-borde' : 'v-celda-vacia'} />
                )),
              )}
            </svg>
            <span>
              Piso {z + 1}: <strong>{n}</strong>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function Cubos({ alturas, pisos: mostrarPisos = false, etiqueta }) {
  return (
    <div className="v-cubos-contenedor">
      <CubosIso alturas={alturas} />
      {etiqueta && <span className="v-figuras-etq">{etiqueta}</span>}
      {mostrarPisos && <Pisos alturas={alturas} />}
    </div>
  );
}

// Versión con botón para separar por pisos (se usa dentro de los ejercicios).
export function CubosConPisos({ alturas }) {
  const [ver, setVer] = useState(false);
  return (
    <div className="v-cubos-contenedor">
      <CubosIso alturas={alturas} />
      <button type="button" className="boton boton--suave boton--chico" aria-pressed={ver} onClick={() => setVer(!ver)}>
        {ver ? 'Ocultar los pisos' : 'Ver por pisos'}
      </button>
      {ver && <Pisos alturas={alturas} />}
    </div>
  );
}
