// Revisa que los temas y ejercicios estén completos y bien escritos.
// Uso: node scripts/validar-datos.mjs
import { EJERCICIOS, TEMAS } from '../src/data/index.js';

const TIPOS = ['alternativas', 'quien', 'numero', 'bloques', 'pintar', 'recta', 'balanza', 'reloj', 'cuadricula', 'pintarCuadricula', 'barra', 'ordenar'];
const PASOS = ['entender', 'planificar', 'hacer', 'comprobar'];
const problemas = [];
const avisar = (id, texto) => problemas.push(`${id}: ${texto}`);

function textos(obj, ruta = '') {
  if (typeof obj === 'string') return [[ruta, obj]];
  if (Array.isArray(obj)) return obj.flatMap((v, i) => textos(v, `${ruta}[${i}]`));
  if (obj && typeof obj === 'object') return Object.entries(obj).flatMap(([k, v]) => textos(v, `${ruta}.${k}`));
  return [];
}

function revisarTexto(id, ruta, t) {
  if (/\d \d{3}(?!\d)/.test(t) && !/\d \d\/\d/.test(t)) avisar(id, `miles con espacio normal en ${ruta}: «${t}»`);
  const abre = (t.match(/\[\[/g) || []).length;
  const cierra = (t.match(/\]\]/g) || []).length;
  if (abre !== cierra) avisar(id, `[[ ]] desbalanceado en ${ruta}`);
  if ((t.match(/\{\{/g) || []).length !== (t.match(/\}\}/g) || []).length) avisar(id, `{{ }} desbalanceado en ${ruta}`);
  if ((t.match(/\*\*/g) || []).length % 2) avisar(id, `** desbalanceado en ${ruta}`);
  if (/\s{2,}/.test(t.replace(/\n/g, ''))) avisar(id, `espacios dobles en ${ruta}`);
}

const ids = new Set();
for (const t of TEMAS) {
  if (!t.oa?.length) avisar(t.id, 'tema sin OA');
  if (!t.ejemplo?.pasos?.length) avisar(t.id, 'tema sin ejemplo resuelto');
  t.ejemplo?.pasos.forEach((p, i) => {
    if (!PASOS.includes(p.paso)) avisar(t.id, `paso ${i + 1} sin nombre válido`);
  });
  textos(t).forEach(([r, s]) => revisarTexto(t.id, r, s));
  if (EJERCICIOS.filter((e) => e.tema === t.id).length < 3) avisar(t.id, 'tema con menos de 3 ejercicios');
}

for (const e of EJERCICIOS) {
  if (ids.has(e.id)) avisar(e.id, 'id repetido');
  ids.add(e.id);
  if (!TIPOS.includes(e.tipo)) avisar(e.id, `tipo desconocido ${e.tipo}`);
  if (!e.enunciado) avisar(e.id, 'sin enunciado');
  if (!e.solucion?.texto) avisar(e.id, 'sin solución');
  if (!e.comprobar) avisar(e.id, 'sin paso comprobar');
  if (!e.pistas?.planificar || !e.pistas?.hacer) avisar(e.id, 'faltan pistas planificar/hacer');
  if (!e.origen) avisar(e.id, 'sin origen');
  textos(e).forEach(([r, s]) => revisarTexto(e.id, r, s));

  if (e.tipo === 'alternativas' || e.tipo === 'quien') {
    const lista = e.tipo === 'quien' ? e.personas : e.opciones;
    const correctas = lista.filter((o) => o.correcta);
    if (correctas.length !== 1) avisar(e.id, `tiene ${correctas.length} alternativas correctas`);
    lista.filter((o) => !o.correcta && !o.error).forEach((o) => avisar(e.id, `alternativa sin mensaje de error: ${o.texto ?? o.nombre}`));
    const claves = lista.map((o) => o.texto ?? o.nombre);
    if (new Set(claves).size !== claves.length) avisar(e.id, 'alternativas repetidas');
    if (e.tipo === 'alternativas' && lista.length !== 4 && !e.ordenFijo) avisar(e.id, `tiene ${lista.length} alternativas`);
  }
  if (e.tipo === 'numero') {
    if (typeof e.respuesta !== 'number') avisar(e.id, 'sin respuesta numérica');
    if (e.errores && String(e.respuesta) in e.errores) avisar(e.id, 'la respuesta correcta aparece como error');
  }
  if (e.tipo === 'bloques' && !(e.objetivo >= 0 && e.objetivo < 10000)) avisar(e.id, 'objetivo fuera de rango');
  if (e.tipo === 'pintar' && !(e.objetivo > 0 && e.objetivo <= e.partes * (e.enteros ?? 1))) avisar(e.id, 'objetivo imposible de pintar');
  if (e.tipo === 'recta') {
    const n = Math.round((e.fin - e.inicio) / e.paso);
    if (n > 10) avisar(e.id, `recta con ${n} saltos (más de 10 se ve apretada en el celular)`);
    const k = (e.objetivo - e.inicio) / e.paso;
    if (Math.abs(k - Math.round(k)) > 1e-9) avisar(e.id, 'el objetivo no cae en una marca');
  }
  if (e.tipo === 'balanza') {
    if (e.relacion === '=' && (e.derecha - e.suma < 0 || e.derecha - e.suma > e.maximo)) avisar(e.id, 'la solución no se alcanza con el máximo');
  }
  if (e.tipo === 'barra' && e.respuesta > e.grafico.max) avisar(e.id, 'la respuesta supera el máximo del gráfico');
  if (e.tipo === 'pintarCuadricula' && e.modo === 'simetria' && typeof e.ejeSimetria !== 'number') avisar(e.id, 'falta ejeSimetria');
}

console.log(`${TEMAS.length} temas, ${EJERCICIOS.length} ejercicios`);
const porTipo = {};
EJERCICIOS.forEach((e) => (porTipo[e.tipo] = (porTipo[e.tipo] ?? 0) + 1));
console.log('Por tipo:', porTipo);
const porEje = {};
EJERCICIOS.forEach((e) => (porEje[e.eje] = (porEje[e.eje] ?? 0) + 1));
console.log('Por eje:', porEje);
if (problemas.length) {
  console.log(`\n${problemas.length} problemas:`);
  problemas.forEach((p) => console.log(' -', p));
  process.exit(1);
}
console.log('Sin problemas.');
