// Catálogo que reúne los temas y ejercicios de los cinco ejes.
import * as numeros from './ejercicios/numeros.js';
import * as patrones from './ejercicios/patrones.js';
import * as patronesAdicionales from './ejercicios/patrones-adicionales.js';
import { INTERACTIVOS_PATRONES } from './ejercicios/patrones-interactivos.js';
import * as geometria from './ejercicios/geometria.js';
import * as medicion from './ejercicios/medicion.js';
import * as datos from './ejercicios/datos.js';

const EJES_DATOS = [numeros, patrones, geometria, medicion, datos];

export const TEMAS = EJES_DATOS.flatMap((modulo) => modulo.TEMAS);
const ejerciciosBase = [...EJES_DATOS.flatMap((modulo) => modulo.EJERCICIOS), ...patronesAdicionales.EJERCICIOS];

export const EJERCICIOS = ejerciciosBase.map((ejercicio) => {
  const actualizado = INTERACTIVOS_PATRONES[ejercicio.id]
    ? { ...ejercicio, ...INTERACTIVOS_PATRONES[ejercicio.id] }
    : ejercicio;
  const tema = TEMAS.find((item) => item.id === actualizado.tema);
  return { ...actualizado, eje: tema?.eje ?? actualizado.eje };
});
