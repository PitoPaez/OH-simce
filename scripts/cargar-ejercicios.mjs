// Envía todas las preguntas de src/data al backend (Spring Boot).
// Uso: node scripts/cargar-ejercicios.mjs
import { EJERCICIOS } from '../src/data/index.js';

const URL = process.env.API_URL ?? 'http://localhost:8080/api/ejercicios/carga';

const respuesta = await fetch(URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(EJERCICIOS),
});

if (!respuesta.ok) {
  console.error('El backend respondió con error', respuesta.status, await respuesta.text());
  process.exit(1);
}

const resultado = await respuesta.json();
console.log(`Listo: se guardaron ${resultado.guardados} preguntas en la base de datos.`);
