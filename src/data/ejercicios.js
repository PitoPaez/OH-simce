// Datos de la práctica.
//
// EJES: los ejes del SIMCE. Cada uno tiene su color en index.css (--eje-<id>).
// EJERCICIOS: cargados desde ejercicios.json (10 por módulo).
//
import EJERCICIOS from './ejercicios.json';

export { EJERCICIOS };

export const EJES = [
  { id: 'numeros', nombre: 'Números y operaciones', descripcion: 'Sumar, restar, multiplicar y fracciones' },
  { id: 'patrones', nombre: 'Patrones y álgebra', descripcion: 'Secuencias y el número que falta' },
  { id: 'geometria', nombre: 'Geometría', descripcion: 'Cuerpos, figuras y ubicación en un mapa' },
  { id: 'medicion', nombre: 'Medición', descripcion: 'Medir, perímetro, área, horas y calendario' },
  { id: 'datos', nombre: 'Datos y probabilidades', descripcion: 'Leer gráficos y tablas' },
];
