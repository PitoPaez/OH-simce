// Revisa que los temas y ejercicios estén completos y bien escritos.
// Uso: node scripts/validar-datos.mjs
// Las reglas están en src/lib/validar.js, que también usa el editor docente.
import { EJERCICIOS, TEMAS } from '../src/data/index.js';
import { problemasEjercicio, problemasTema } from '../src/lib/validar.js';

const problemas = [];

for (const t of TEMAS) {
  problemasTema(
    t,
    EJERCICIOS.filter((e) => e.tema === t.id),
  ).forEach((p) => problemas.push(`${t.id}: ${p}`));
}

const ids = new Set();
for (const e of EJERCICIOS) {
  if (ids.has(e.id)) problemas.push(`${e.id}: id repetido`);
  ids.add(e.id);
  problemasEjercicio(e, TEMAS).forEach((p) => problemas.push(`${e.id}: ${p}`));
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
