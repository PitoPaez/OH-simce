// Datos de la práctica.
//
// EJES: los ejes del SIMCE. Cada uno tiene su color en index.css (--eje-<id>).
// EJERCICIOS: en ejercicios.json. Se practican en el orden del archivo.
//
// Cada ejercicio:
//   id         único; también es el nombre de su imagen (public/imagenes/<id>.png)
//   eje        id de uno de los EJES
//   enunciado  la pregunta
//   visual     qué se muestra; visual.tipo es uno de los de components/Visual.jsx
//   opciones   [{ texto, correcta, feedback }]: la correcta y los errores típicos,
//              cada uno con lo que ve el estudiante si responde eso
//   pistas     de la más general a la más concreta
//   solucion   se muestra al terminar
import EJERCICIOS from './ejercicios.json';

export { EJERCICIOS };

export const EJES = [
  { id: 'numeros', nombre: 'Números y operaciones', descripcion: 'Sumar, restar, multiplicar y fracciones' },
  { id: 'patrones', nombre: 'Patrones y álgebra', descripcion: 'Secuencias y el número que falta' },
  { id: 'geometria', nombre: 'Geometría', descripcion: 'Cuerpos, figuras y ubicación en un mapa' },
  { id: 'medicion', nombre: 'Medición', descripcion: 'Medir, perímetro, área, horas y calendario' },
  { id: 'datos', nombre: 'Datos y probabilidades', descripcion: 'Leer gráficos y tablas' },
];
