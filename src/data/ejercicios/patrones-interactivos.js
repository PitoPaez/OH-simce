// Overrides for the new interactive exercise modes.
export const INTERACTIVOS_PATRONES = {
  'pat-01-laminas': { tipo: 'completar', respuesta: { campos: [{ indice: 4, valor: 42, etiqueta: 'Viernes' }, { indice: 5, valor: 49, etiqueta: 'Sábado' }] }, erroresFrecuentes: [{ cuando: { 5: 42 }, error: '42 son las láminas del viernes. Falta avanzar hasta el sábado.' }] },
  'pat-02-decreciente': { tipo: 'completar', respuesta: { valor: 59 }, erroresFrecuentes: [{ valor: 60, error: 'La secuencia resta 9; comprueba 68 − 9.' }] },
  'pat-04-maquina': { tipo: 'completar', visual: { tipo: 'maquina', ejemplos: [{ entrada: 4, salida: 12 }, { entrada: 6, salida: 18 }, { entrada: 9, salida: 27 }], entradaActual: 10 }, respuesta: { valor: 30 } },
  'pat-05-pulsera': { tipo: 'clic-color', visual: { tipo: 'pulsera', patron: ['rojo', 'azul', 'azul', 'amarillo'], mostrarHasta: 8, posicionObjetivo: 15, coloresDisponibles: ['rojo', 'azul', 'amarillo', 'verde'] }, respuesta: { valor: 'azul' } },
  'pat-06-tabla100': { tipo: 'tablero-interactivo', visual: { tipo: 'tablero-100', fijos: [12, 23, 34, 45], seleccionMax: 2 }, respuesta: { seleccion: [56, 67] } },
  'pat-07-fosforos': { tipo: 'completar', visual: { tipo: 'fosforos', figuras: [{ numero: 1, cantidad: 4 }, { numero: 2, cantidad: 7 }, { numero: 3, cantidad: 10 }] }, respuesta: { valor: 16 } },
  'pat-08-triciclos': { tipo: 'completar', respuesta: { valor: 12 } },
  'pat-09-error': { tipo: 'clic-secuencia', visual: { tipo: 'secuencia', valores: [15, 21, 27, 32, 39], seleccionable: true }, respuesta: { indice: 3, valor: 32 } },
  'pat-11-ecuacion-suma': { tipo: 'balanza-interactiva', visual: { tipo: 'balanza', izquierda: [{ tipo: 'pesa', valor: 24 }], derecha: [{ tipo: 'pesa', valor: 50 }], pesasDisponibles: [1, 5, 10, 20], platoEditable: 'izquierda' }, respuesta: { valorAgregado: 26 } },
  'pat-12-ecuacion-resta': {
    tipo: 'alternativas',
    visual: {
      tipo: 'balanza',
      izquierda: [{ tipo: 'pesa', valor: 82 }],
      derecha: [{ tipo: 'caja', texto: '□' }, { tipo: 'pesa', valor: 35 }],
    },
  },
  'pat-13-balanza-peso': { tipo: 'balanza-interactiva', visual: { tipo: 'balanza', izquierda: [{ tipo: 'pesa', valor: 45 }], derecha: [{ tipo: 'pesa', valor: 20 }], pesasDisponibles: [5, 10, 20], platoEditable: 'derecha' }, respuesta: { valorAgregado: 25 } },
  'pat-18-ecuacion-dos-pasos': { tipo: 'completar', respuesta: { valor: 12 } },
};
