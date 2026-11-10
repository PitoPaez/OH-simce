// Revisión de temas y ejercicios. La usan el script `npm run validar` y el
// editor de ejercicios para docentes, así que las reglas son las mismas en
// los dos lados.

export const TIPOS = [
  'alternativas',
  'quien',
  'numero',
  'bloques',
  'pintar',
  'recta',
  'balanza',
  'reloj',
  'cuadricula',
  'pintarCuadricula',
  'barra',
  'ordenar',
  'arrastrarPosicional',
];

export const NOMBRE_TIPO = {
  alternativas: 'Alternativas',
  quien: '¿Quién tiene razón?',
  numero: 'Respuesta numérica',
  bloques: 'Bloques base 10',
  pintar: 'Pintar fracción',
  recta: 'Recta numérica',
  balanza: 'Balanza',
  reloj: 'Reloj',
  cuadricula: 'Cuadrícula',
  pintarCuadricula: 'Pintar en cuadrícula',
  barra: 'Completar gráfico',
  ordenar: 'Ordenar',
  arrastrarPosicional: 'Tabla posicional',
};

const PASOS = ['entender', 'planificar', 'hacer', 'comprobar'];

// Los miles se separan con un espacio que no se corta (U+00A0), como en el
// SIMCE: «7 560» no debe quedar con el 7 en una línea y el 560 en otra.
export function arreglarMiles(texto) {
  return texto.replace(/(\d) (?=\d{3}(?![\d/]))/g, '$1 ');
}

export function textos(obj, ruta = '') {
  if (typeof obj === 'string') return [[ruta, obj]];
  if (Array.isArray(obj)) return obj.flatMap((v, i) => textos(v, `${ruta}[${i}]`));
  if (obj && typeof obj === 'object') return Object.entries(obj).flatMap(([k, v]) => textos(v, `${ruta}.${k}`));
  return [];
}

function revisarTexto(ruta, t) {
  const p = [];
  if (/\d \d{3}(?!\d)/.test(t) && !/\d \d\/\d/.test(t)) p.push(`miles con espacio normal en ${ruta}: «${t}»`);
  if ((t.match(/\[\[/g) || []).length !== (t.match(/\]\]/g) || []).length) p.push(`[[ ]] desbalanceado en ${ruta}`);
  if ((t.match(/\{\{/g) || []).length !== (t.match(/\}\}/g) || []).length) p.push(`{{ }} desbalanceado en ${ruta}`);
  if ((t.match(/\*\*/g) || []).length % 2) p.push(`** desbalanceado en ${ruta}`);
  if (/\s{2,}/.test(t.replace(/\n/g, ''))) p.push(`espacios dobles en ${ruta}`);
  return p;
}

export function problemasTema(tema, ejerciciosDelTema) {
  const p = [];
  if (!tema.oa?.length) p.push('tema sin OA');
  if (!tema.ejemplo?.pasos?.length) p.push('tema sin ejemplo resuelto');
  tema.ejemplo?.pasos.forEach((paso, i) => {
    if (!PASOS.includes(paso.paso)) p.push(`paso ${i + 1} sin nombre válido`);
  });
  textos(tema).forEach(([r, s]) => p.push(...revisarTexto(r, s)));
  if (ejerciciosDelTema.length < 3) p.push('tema con menos de 3 ejercicios');
  return p;
}

// Devuelve la lista de problemas de un ejercicio (vacía si está bien).
export function problemasEjercicio(e, temas) {
  const p = [];
  if (!e.id) p.push('sin id');
  if (temas && !temas.some((t) => t.id === e.tema)) p.push('sin tema válido');
  if (!TIPOS.includes(e.tipo)) p.push(`tipo desconocido ${e.tipo}`);
  if (!e.enunciado) p.push('sin enunciado');
  if (!e.solucion?.texto) p.push('sin solución');
  if (!e.comprobar) p.push('sin paso comprobar');
  if (!e.pistas?.planificar || !e.pistas?.hacer) p.push('faltan pistas planificar/hacer');
  if (!e.origen) p.push('sin origen');
  textos(e).forEach(([r, s]) => p.push(...revisarTexto(r, s)));

  if (e.tipo === 'alternativas' || e.tipo === 'quien') {
    const lista = (e.tipo === 'quien' ? e.personas : e.opciones) ?? [];
    const correctas = lista.filter((o) => o.correcta);
    if (correctas.length !== 1) p.push(`tiene ${correctas.length} alternativas correctas`);
    lista.filter((o) => !o.correcta && !o.error && (o.texto ?? o.nombre)).forEach((o) => p.push(`alternativa sin mensaje de error: ${o.texto ?? o.nombre}`));
    const claves = lista.map((o) => o.texto ?? o.nombre);
    if (claves.some((c) => !c)) p.push('hay una alternativa vacía');
    if (new Set(claves).size !== claves.length) p.push('alternativas repetidas');
    if (e.tipo === 'alternativas' && lista.length !== 4 && !e.ordenFijo) p.push(`tiene ${lista.length} alternativas`);
  }
  if (e.tipo === 'numero') {
    if (typeof e.respuesta !== 'number' || Number.isNaN(e.respuesta)) p.push('sin respuesta numérica');
    if (e.errores && String(e.respuesta) in e.errores) p.push('la respuesta correcta aparece como error');
  }
  if (e.tipo === 'bloques' && !(e.objetivo >= 0 && e.objetivo < 10000)) p.push('objetivo fuera de rango');
  if (e.tipo === 'pintar' && !(e.objetivo > 0 && e.objetivo <= e.partes * (e.enteros ?? 1))) p.push('objetivo imposible de pintar');
  if (e.tipo === 'recta') {
    const n = Math.round((e.fin - e.inicio) / e.paso);
    if (n > 10) p.push(`recta con ${n} saltos (más de 10 se ve apretada en el celular)`);
    const k = (e.objetivo - e.inicio) / e.paso;
    if (Math.abs(k - Math.round(k)) > 1e-9) p.push('el objetivo no cae en una marca');
  }
  if (e.tipo === 'balanza' && e.relacion === '=' && (e.derecha - e.suma < 0 || e.derecha - e.suma > e.maximo)) {
    p.push('la solución no se alcanza con el máximo');
  }
  if (e.tipo === 'barra' && e.respuesta > e.grafico?.max) p.push('la respuesta supera el máximo del gráfico');
  if (e.tipo === 'pintarCuadricula' && e.modo === 'simetria' && typeof e.ejeSimetria !== 'number') p.push('falta ejeSimetria');
  if (e.tipo === 'arrastrarPosicional') {
    const columnas = e.columnas ?? ['C', 'D', 'U'];
    if (!Array.isArray(e.solucionPosicional) || e.solucionPosicional.length !== columnas.length) p.push('solucionPosicional no calza con las columnas');
    else if (e.disponibles && e.solucionPosicional.some((c) => !e.disponibles.includes(c))) p.push('una cifra de la solución no está entre las disponibles');
  }
  return p;
}
