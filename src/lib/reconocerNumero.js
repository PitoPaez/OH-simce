// Reconoce un número escrito a mano (con el dedo o el mouse).
// 1) Junta los trazos que se tocan en horizontal: cada grupo es un dígito.
// 2) Dibuja cada dígito en 28x28, centrado como en MNIST.
// 3) Lo pasa por una red neuronal pequeña (lib/digitos-modelo.js).
import { B1, B2, E1, E2, OCULTA, W1, W2 } from './digitos-modelo.js';

let pesos = null;
function cargarPesos() {
  if (pesos) return pesos;
  const decodificar = (b64, escala) => {
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    return Float32Array.from(new Int8Array(bytes.buffer), (v) => v * escala);
  };
  pesos = { w1: decodificar(W1, E1), w2: decodificar(W2, E2) };
  return pesos;
}

function caja(puntos) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of puntos) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, minY, maxX, maxY };
}

// Agrupa trazos en dígitos según cuánto se superponen en el eje horizontal.
function agruparEnDigitos(trazos) {
  const conCaja = trazos.filter((t) => t.length > 0).map((t) => ({ trazo: t, ...caja(t) }));
  conCaja.sort((a, b) => a.minX - b.minX);
  const grupos = [];
  for (const t of conCaja) {
    const g = grupos.at(-1);
    if (g) {
      const solape = Math.min(g.maxX, t.maxX) - Math.max(g.minX, t.minX);
      const angosto = Math.max(4, Math.min(g.maxX - g.minX, t.maxX - t.minX));
      // Un trazo casi vertical (la línea del 4, la barra del 5) se une si su centro cae dentro del dígito.
      const centro = (t.minX + t.maxX) / 2;
      const dentro = centro >= g.minX && centro <= g.maxX;
      if (solape > angosto * 0.3 || dentro) {
        g.trazos.push(t.trazo);
        g.minX = Math.min(g.minX, t.minX);
        g.maxX = Math.max(g.maxX, t.maxX);
        g.minY = Math.min(g.minY, t.minY);
        g.maxY = Math.max(g.maxY, t.maxY);
        continue;
      }
    }
    grupos.push({ trazos: [t.trazo], minX: t.minX, maxX: t.maxX, minY: t.minY, maxY: t.maxY });
  }
  return grupos;
}

// Dibuja un grupo de trazos en un lienzo de 28x28 al estilo MNIST:
// el dígito cabe en 20x20 y su centro de masa queda en el centro.
function aImagen28(grupo) {
  const lienzo = document.createElement('canvas');
  lienzo.width = 28;
  lienzo.height = 28;
  const ctx = lienzo.getContext('2d', { willReadFrequently: true });
  const ancho = Math.max(1, grupo.maxX - grupo.minX);
  const alto = Math.max(1, grupo.maxY - grupo.minY);
  const escala = 20 / Math.max(ancho, alto);
  const dibujar = (dx, dy) => {
    ctx.clearRect(0, 0, 28, 28);
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#000';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const ox = 14 - (ancho * escala) / 2 + dx;
    const oy = 14 - (alto * escala) / 2 + dy;
    for (const trazo of grupo.trazos) {
      const px = (p) => ox + (p.x - grupo.minX) * escala;
      const py = (p) => oy + (p.y - grupo.minY) * escala;
      if (trazo.length === 1) {
        ctx.beginPath();
        ctx.arc(px(trazo[0]), py(trazo[0]), 1.2, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }
      ctx.beginPath();
      ctx.moveTo(px(trazo[0]), py(trazo[0]));
      for (const p of trazo.slice(1)) ctx.lineTo(px(p), py(p));
      ctx.stroke();
    }
    return ctx.getImageData(0, 0, 28, 28).data;
  };
  // primer dibujo para calcular el centro de masa, segundo ya centrado
  let datos = dibujar(0, 0);
  let suma = 0, sx = 0, sy = 0;
  for (let i = 0; i < 784; i++) {
    const v = datos[i * 4 + 3];
    suma += v;
    sx += v * (i % 28);
    sy += v * Math.floor(i / 28);
  }
  if (suma > 0) datos = dibujar(13.5 - sx / suma, 13.5 - sy / suma);
  const entrada = new Float32Array(784);
  for (let i = 0; i < 784; i++) entrada[i] = datos[i * 4 + 3] / 255;
  return entrada;
}

function clasificar(entrada) {
  const { w1, w2 } = cargarPesos();
  const h = new Float32Array(OCULTA);
  for (let j = 0; j < OCULTA; j++) h[j] = B1[j];
  for (let i = 0; i < 784; i++) {
    const x = entrada[i];
    if (x === 0) continue;
    const fila = i * OCULTA;
    for (let j = 0; j < OCULTA; j++) h[j] += x * w1[fila + j];
  }
  const z = B2.slice();
  for (let j = 0; j < OCULTA; j++) {
    if (h[j] <= 0) continue;
    for (let k = 0; k < 10; k++) z[k] += h[j] * w2[j * 10 + k];
  }
  const max = Math.max(...z);
  const e = z.map((v) => Math.exp(v - max));
  const total = e.reduce((a, b) => a + b, 0);
  const prob = e.map((v) => v / total);
  const digito = prob.indexOf(Math.max(...prob));
  return { digito, confianza: prob[digito] };
}

// trazos: [[{x, y}, ...], ...] en píxeles del lienzo.
// Devuelve { texto: '10', confianza: 0..1 } o null si no hay nada escrito.
export function reconocerNumero(trazos) {
  const grupos = agruparEnDigitos(trazos);
  if (grupos.length === 0) return null;
  const resultados = grupos.map((g) => clasificar(aImagen28(g)));
  return {
    texto: resultados.map((r) => r.digito).join(''),
    confianza: Math.min(...resultados.map((r) => r.confianza)),
  };
}
