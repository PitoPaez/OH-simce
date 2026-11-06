// Junta los temas y ejercicios de los cinco ejes. Cada ejercicio hereda el eje
// de su tema.
import * as numeros from './ejercicios/numeros.js';
import * as patrones from './ejercicios/patrones.js';
import * as geometria from './ejercicios/geometria.js';
import * as medicion from './ejercicios/medicion.js';
import * as datos from './ejercicios/datos.js';

const EJES_DATOS = [numeros, patrones, geometria, medicion, datos];

export const TEMAS = EJES_DATOS.flatMap((m) => m.TEMAS);

export const EJERCICIOS = EJES_DATOS.flatMap((m) => m.EJERCICIOS).map((e) => ({
  ...e,
  eje: TEMAS.find((t) => t.id === e.tema).eje,
}));
