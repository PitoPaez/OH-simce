import { useRef, useState } from 'react';

// ---------- Dado en 3D ----------
// Cubo hecho con transformaciones CSS 3D. Se gira arrastrando con el
// mouse o el dedo (o con las flechas del teclado). Las caras opuestas suman 7, como
// en un dado real.

// Posición de los puntos en una cuadrícula de 3x3 (0 a 8).
const PUNTOS = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

// Cada cara: su número y cómo se ubica en el cubo.
const CARAS = [
  { n: 1, giro: 'rotateY(0deg)' },
  { n: 6, giro: 'rotateY(180deg)' },
  { n: 3, giro: 'rotateY(90deg)' },
  { n: 4, giro: 'rotateY(-90deg)' },
  { n: 2, giro: 'rotateX(90deg)' },
  { n: 5, giro: 'rotateX(-90deg)' },
];

// ---- Rotación con matrices: cada giro se aplica respecto a la pantalla,
// así arrastrar hacia la derecha siempre mueve el dado hacia la derecha,
// aunque ya esté dado vuelta. Permite girar 360° en cualquier dirección.
const rad = (g) => (g * Math.PI) / 180;
function rotX(g) {
  const c = Math.cos(rad(g)), s = Math.sin(rad(g));
  return [[1, 0, 0], [0, c, -s], [0, s, c]];
}
function rotY(g) {
  const c = Math.cos(rad(g)), s = Math.sin(rad(g));
  return [[c, 0, s], [0, 1, 0], [-s, 0, c]];
}
function mult(a, b) {
  return a.map((fila, i) => fila.map((_, j) => a[i][0] * b[0][j] + a[i][1] * b[1][j] + a[i][2] * b[2][j]));
}
function aCss(m) {
  const r = (v) => (Math.abs(v) < 1e-10 ? 0 : v);
  return `matrix3d(${r(m[0][0])},${r(m[1][0])},${r(m[2][0])},0,${r(m[0][1])},${r(m[1][1])},${r(m[2][1])},0,${r(m[0][2])},${r(m[1][2])},${r(m[2][2])},0,0,0,0,1)`;
}
const orientar = ({ x, y }) => mult(rotX(x), rotY(y));
const INICIAL = orientar({ x: -22, y: 32 });

function Cara({ n, giro }) {
  const puntos = PUNTOS[n];
  return (
    <div className="dado3d__cara" style={{ transform: `${giro} translateZ(var(--mitad))` }} aria-hidden="true">
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className={puntos.includes(i) ? 'dado3d__punto' : undefined} />
      ))}
    </div>
  );
}

export function Dado3D() {
  const [rot, setRot] = useState(INICIAL);
  const [animar, setAnimar] = useState(false);
  const arrastre = useRef(null);

  const inicio = (e) => {
    arrastre.current = { x: e.clientX, y: e.clientY };
    setAnimar(false);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const mover = (e) => {
    const a = arrastre.current;
    if (!a) return;
    const dx = e.clientX - a.x;
    const dy = e.clientY - a.y;
    a.x = e.clientX;
    a.y = e.clientY;
    setRot((m) => mult(mult(rotX(-dy * 0.6), rotY(dx * 0.6)), m));
  };

  const fin = () => {
    arrastre.current = null;
  };

  const girar = (dx, dy) => {
    setAnimar(true);
    setRot((m) => mult(mult(rotX(dx), rotY(dy)), m));
  };

  const teclas = (e) => {
    const pasos = { ArrowLeft: [0, -90], ArrowRight: [0, 90], ArrowUp: [90, 0], ArrowDown: [-90, 0] };
    const p = pasos[e.key];
    if (!p) return;
    e.preventDefault();
    girar(p[0], p[1]);
  };

  return (
    <div className="dado3d">
      <div
        className="dado3d__escena"
        onPointerDown={inicio}
        onPointerMove={mover}
        onPointerUp={fin}
        onPointerCancel={fin}
        onKeyDown={teclas}
        tabIndex={0}
        role="img"
        aria-label="Dado de 6 caras con los números del 1 al 6. Arrástralo o usa las flechas para girarlo."
      >
        <div
          className={`dado3d__cubo${animar ? ' dado3d__cubo--animado' : ''}`}
          style={{ transform: aCss(rot) }}
        >
          {CARAS.map((c) => (
            <Cara key={c.n} {...c} />
          ))}
        </div>
      </div>

      <p className="dado3d__ayuda">Arrastra el dado hacia arriba, abajo, izquierda o derecha para girarlo y ver todas sus caras.</p>
    </div>
  );
}
