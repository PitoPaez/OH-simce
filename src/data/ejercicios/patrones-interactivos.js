// Overrides for the new interactive exercise modes. Keep the original question
// text, options/metadata, hints and solution in patrones-adicionales.js; this
// module only declares the interaction-specific fields.
export const INTERACTIVOS_PATRONES = {
  'pat-01-laminas': {
    tipo: 'completar',
    respuesta: {
      campos: [
        { indice: 4, valor: 42, etiqueta: 'Viernes' },
        { indice: 5, valor: 49, etiqueta: 'Sábado' },
      ],
    },
    erroresFrecuentes: [
      { cuando: { 5: 42 }, error: '42 son las láminas del viernes. Falta avanzar hasta el sábado.' },
      { cuando: { 5: 56 }, error: 'Avanzaste hasta el domingo. Cuenta bien desde el jueves al sábado.' },
      { cuando: { 5: 37 }, error: 'El patrón aumenta de 7 en 7, no de 2 en 2.' },
    ],
  },
  'pat-02-decreciente': {
    tipo: 'completar',
    respuesta: { valor: 59 },
    erroresFrecuentes: [
      { valor: 60, error: 'La secuencia resta 9; comprueba 68 − 9.' },
      { valor: 61, error: 'La regla es restar 9, pero 68 − 9 = 59.' },
    ],
  },
  'pat-04-maquina': {
    tipo: 'completar',
    visual: {
      tipo: 'maquina',
      ejemplos: [
        { entrada: 4, salida: 12 },
        { entrada: 6, salida: 18 },
        { entrada: 9, salida: 27 },
      ],
      entradaActual: 10,
    },
    respuesta: { valor: 30 },
    erroresFrecuentes: [
      { valor: 18, error: 'Sumar 8 funciona para 4 + 8 = 12, pero 6 + 8 no da 18.' },
      { valor: 20, error: 'Multiplicar por 2 no explica las filas anteriores: 4 × 2 no da 12.' },
      { valor: 28, error: 'La regla relaciona cada entrada con su salida; no se suma 1 al resultado anterior.' },
    ],
  },
  'pat-05-pulsera': {
    tipo: 'clic-color',
    visual: {
      tipo: 'pulsera',
      patron: ['rojo', 'azul', 'azul', 'amarillo'],
      mostrarHasta: 8,
      posicionObjetivo: 15,
      coloresDisponibles: ['rojo', 'azul', 'amarillo', 'verde'],
    },
    respuesta: { valor: 'azul' },
    erroresFrecuentes: [
      { valor: 'rojo', error: 'El rojo aparece en las posiciones 1, 5, 9 y 13. Continúa contando desde la 13.' },
      { valor: 'amarillo', error: 'El amarillo cierra cada grupo de 4: aparece en 4, 8, 12 y 16.' },
      { valor: 'verde', error: 'El verde no forma parte del patrón.' },
    ],
  },
  'pat-06-tabla100': {
    tipo: 'tablero-interactivo',
    visual: { tipo: 'tablero-100', fijos: [12, 23, 34, 45], seleccionMax: 2 },
    respuesta: { seleccion: [56, 67] },
    erroresFrecuentes: [
      { contiene: 55, error: '55 está debajo de 45 (+10), pero el patrón también avanza uno a la derecha (+1).' },
      { contiene: 54, error: '54 queda a la izquierda; el patrón avanza hacia la derecha y suma 11.' },
    ],
  },
  'pat-07-fosforos': {
    tipo: 'completar',
    visual: {
      tipo: 'fosforos',
      figuras: [
        { numero: 1, cantidad: 4 },
        { numero: 2, cantidad: 7 },
        { numero: 3, cantidad: 10 },
      ],
    },
    respuesta: { valor: 16 },
    erroresFrecuentes: [
      { valor: 13, error: '13 corresponde a la figura 4. Falta avanzar una figura más.' },
      { valor: 15, error: 'La primera figura comienza con 4 palitos; no basta con calcular 5 × 3.' },
      { valor: 19, error: '19 correspondería a la figura 6. Desde la figura 3 hasta la 5 hay dos aumentos.' },
    ],
  },
  'pat-08-triciclos': {
    tipo: 'completar',
    respuesta: { valor: 12 },
    erroresFrecuentes: [
      { valor: 10, error: 'Cada triciclo nuevo agrega 3 ruedas, no 1.' },
      { valor: 11, error: 'Un triciclo tiene 3 ruedas. Avanza de 3 en 3.' },
      { valor: 14, error: 'Comprueba la secuencia: 3, 6, 9, ___, 15.' },
    ],
  },
  'pat-09-error': {
    tipo: 'clic-secuencia',
    visual: { tipo: 'secuencia', valores: [15, 21, 27, 32, 39], seleccionable: true },
    respuesta: { indice: 3, valor: 32 },
    erroresFrecuentes: [
      { valor: 21, error: '15 + 6 = 21, así que ese término está correcto.' },
      { valor: 27, error: '21 + 6 = 27, así que ese término está correcto.' },
      { valor: 39, error: 'Si el término anterior es 33, entonces 33 + 6 = 39 sí es correcto.' },
    ],
  },
  'pat-11-ecuacion-suma': {
    tipo: 'balanza-interactiva',
    visual: {
      tipo: 'balanza',
      izquierda: [{ tipo: 'pesa', valor: 24 }],
      derecha: [{ tipo: 'pesa', valor: 50 }],
      pesasDisponibles: [1, 5, 10, 20],
      platoEditable: 'izquierda',
    },
    respuesta: { valorAgregado: 26 },
    erroresFrecuentes: [
      { valorAgregado: 74, error: 'Agregaste demasiado peso: 24 + 74 = 98, más que 50.' },
      { valorAgregado: 36, error: '24 + 36 = 60. Quita 10 para equilibrar en 50.' },
      { valorAgregado: 24, error: '24 + 24 = 48; todavía faltan 2.' },
    ],
  },
  'pat-12-ecuacion-resta': {
    tipo: 'numero',
    respuesta: 47,
    errores: {
      117: 'Sumar 82 + 35 no representa cuánto se quitó para pasar de 82 a 35.',
      57: 'Revisa la resta 82 − 35; el resultado es 47.',
      53: 'No restes las unidades al revés. Calcula 82 − 35.',
    },
  },
  'pat-13-balanza-peso': {
    tipo: 'balanza-interactiva',
    visual: {
      tipo: 'balanza',
      izquierda: [{ tipo: 'pesa', valor: 45 }],
      derecha: [{ tipo: 'pesa', valor: 20 }],
      pesasDisponibles: [5, 10, 20],
      platoEditable: 'derecha',
    },
    respuesta: { valorAgregado: 25 },
    erroresFrecuentes: [
      { valorAgregado: 65, error: 'Si agregas 65 kg, el lado derecho pesaría 85 kg.' },
      { valorAgregado: 15, error: '20 + 15 = 35 kg, menos que los 45 kg del lado izquierdo.' },
      { valorAgregado: 35, error: '20 + 35 = 55 kg. Quita 10 kg para equilibrar en 45 kg.' },
    ],
  },
  'pat-18-ecuacion-dos-pasos': {
    tipo: 'completar',
    respuesta: { valor: 12 },
    erroresFrecuentes: [
      { valor: 27, error: 'Restaste solo un 15. Hay dos términos iguales: 15 + 15 = 30.' },
      { valor: 22, error: 'Primero suma 15 + 15 = 30; luego 42 − 30 = 12.' },
      { valor: 72, error: 'No sumes todos los números; busca cuánto falta para llegar a 42.' },
    ],
  },
};
