import { f } from '../../lib/formato.js';

// Eje Medición (OA 20 a 24).
const RECT_JARDIN = [
  [0, 0],
  [240, 0],
  [240, 80],
  [0, 80],
];

const CUBOS_EJEMPLO = [
  [2, 2, 2],
  [2, 2, 1],
  [1, 1, 1],
];

export const TEMAS = [
  {
    id: 'tiempo',
    eje: 'medicion',
    nombre: 'La hora y el tiempo',
    descripcion: 'Leer relojes, calcular cuánto dura algo y pasar de horas a minutos',
    oa: [20, 21],
    ejemplo: {
      enunciado: 'Héctor quiere ver una película que empieza a la hora que muestra el reloj. {{¿A qué hora empieza?}}',
      pasos: [
        {
          paso: 'planificar',
          texto: 'Mira las dos manecillas por separado. La corta es el horario: marca la hora. La larga es el minutero: marca los minutos.',
          visual: { tipo: 'reloj', hora: 8, minutos: 10 },
        },
        {
          paso: 'hacer',
          texto: 'El horario, la manecilla corta, está un poco pasado del 8: son las 8 y algo.',
          visual: { tipo: 'reloj', hora: 8, minutos: 10, resaltar: 'horario' },
        },
        {
          paso: 'hacer',
          texto: 'El minutero, la manecilla larga, apunta al 2. Cada número del reloj son 5 minutos: 2 × 5 = 10 minutos. ¡No leas «2 minutos»!',
          visual: { tipo: 'reloj', hora: 8, minutos: 10, resaltar: 'minutero' },
        },
        {
          paso: 'comprobar',
          texto: 'Son las 8:10. Comprueba contando de 5 en 5 desde el 12 hasta el minutero: 5, 10. ✓',
          visual: { tipo: 'reloj', hora: 8, minutos: 10 },
        },
      ],
    },
  },
  {
    id: 'longitud',
    eje: 'medicion',
    nombre: 'Metros y centímetros',
    descripcion: 'Medir, comparar y pasar de metros a centímetros',
    oa: [22],
    ejemplo: {
      enunciado: 'La mesa de Matías mide [[1 m y 60 cm]]. La de Nicolás mide [[140 cm]]. {{¿Cuál es más larga?}}',
      pasos: [
        {
          paso: 'entender',
          texto: 'Te preguntan cuál mesa es más larga. Las medidas están en unidades distintas: una en metros y centímetros, la otra solo en centímetros.',
        },
        {
          paso: 'planificar',
          texto: 'Para comparar, pasa todo a la misma unidad. Recuerda: 1 metro = 100 centímetros.',
        },
        {
          paso: 'hacer',
          texto: '1 m y 60 cm = 100 cm + 60 cm = 160 cm. Ahora compara 160 cm con 140 cm.',
          visual: {
            tipo: 'longitudes',
            barras: [
              { etiqueta: 'Mesa de Matías', texto: '1 m y 60 cm = 160 cm', cm: 160 },
              { etiqueta: 'Mesa de Nicolás', texto: '140 cm', cm: 140 },
            ],
          },
        },
        {
          paso: 'comprobar',
          texto: '160 > 140: la mesa de Matías es más larga. Aunque 140 parece un número más grande que 1 y 60, la mesa de Nicolás mide menos. ✓',
          visual: {
            tipo: 'longitudes',
            barras: [
              { etiqueta: 'Mesa de Matías', texto: '160 cm', cm: 160 },
              { etiqueta: 'Mesa de Nicolás', texto: '140 cm', cm: 140 },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'area-perimetro',
    eje: 'medicion',
    nombre: 'Perímetro y área',
    descripcion: 'El borde de una figura y lo que cubre por dentro',
    oa: [23],
    ejemplo: {
      enunciado: 'Un jardín rectangular mide [[6 m]] de largo y [[2 m]] de ancho. Se pondrá una reja **alrededor**. {{¿Cuántos metros de reja se necesitan?}}',
      pasos: [
        {
          paso: 'entender',
          texto: '«Alrededor» quiere decir por todo el borde. Te preguntan por el perímetro del jardín.',
          visual: { tipo: 'poligono', puntos: RECT_JARDIN, lados: ['6 m', '2 m'] },
        },
        {
          paso: 'planificar',
          texto: 'Un rectángulo tiene 4 lados: 2 largos de 6 m y 2 cortos de 2 m. En el dibujo solo están escritos dos, pero son cuatro.',
          visual: { tipo: 'poligono', puntos: RECT_JARDIN, lados: ['6 m', '2 m', '6 m', '2 m'] },
        },
        {
          paso: 'hacer',
          texto: 'Recorre los 4 lados: 6 + 2 + 6 + 2 = 16 metros.',
          visual: { tipo: 'poligono', puntos: RECT_JARDIN, lados: ['6 m', '2 m', '6 m', '2 m'], resaltar: [0, 1, 2, 3] },
        },
        {
          paso: 'comprobar',
          texto: 'Si sumaras solo 6 + 2 = 8, darías media vuelta. La reja completa mide 16 m. ✓',
          visual: { tipo: 'poligono', puntos: RECT_JARDIN, lados: ['6 m', '2 m', '6 m', '2 m'], resaltar: [0, 1] },
        },
      ],
    },
  },
  {
    id: 'volumen',
    eje: 'medicion',
    nombre: 'Volumen con cubos',
    descripcion: 'Contar todos los cubos de un cuerpo, también los que no se ven',
    oa: [24],
    ejemplo: {
      enunciado: 'La figura está hecha con cubos iguales. {{¿Cuántos cubos tiene?}}',
      pasos: [
        {
          paso: 'entender',
          texto: 'Algunos cubos no se ven: están detrás o debajo de otros. ¡También cuentan!',
          visual: { tipo: 'cubos', alturas: CUBOS_EJEMPLO },
        },
        {
          paso: 'planificar',
          texto: 'Cuenta por pisos, de abajo hacia arriba. Abajo se muestra cada piso visto desde arriba.',
          visual: { tipo: 'cubos', alturas: CUBOS_EJEMPLO, pisos: true },
        },
        {
          paso: 'hacer',
          texto: 'Piso 1, el de abajo: 3 filas de 3 cubos, 9 cubos. Piso 2: 5 cubos.',
          visual: { tipo: 'cubos', alturas: CUBOS_EJEMPLO, pisos: true },
        },
        {
          paso: 'comprobar',
          texto: 'Total: 9 + 5 = 14 cubos. Si contaras solo los que se ven, te faltarían los de adentro. ✓',
          visual: { tipo: 'cubos', alturas: CUBOS_EJEMPLO, pisos: true },
        },
      ],
    },
  },
];

export const EJERCICIOS = [
  // ---------------- La hora y el tiempo ----------------
  {
    id: 'ti-leer',
    tema: 'tiempo',
    tipo: 'alternativas',
    enunciado: '{{¿Qué hora marca el reloj?}}',
    visual: { tipo: 'reloj', hora: 7, minutos: 20 },
    opciones: [
      { texto: '7:20', correcta: true },
      { texto: '7:04', error: 'El minutero apunta al 4, pero eso no son 4 minutos: cada número vale 5 minutos. 4 × 5 = 20.' },
      { texto: '4:35', error: 'Cambiaste las manecillas. La corta marca la hora y la larga, los minutos.' },
      { texto: '8:20', error: 'El horario todavía no llega al 8: está entre el 7 y el 8. Son las 7 y algo.' },
    ],
    pistas: {
      planificar: 'Mira primero la manecilla corta (la hora) y después la larga (los minutos).',
      hacer: 'La corta está entre el 7 y el 8: son las 7. La larga está en el 4: 4 × 5 = 20 minutos.',
    },
    solucion: { texto: 'Son las 7:20.' },
    comprobar: 'Cuenta de 5 en 5 desde el 12 hasta el 4: 5, 10, 15, 20. ✓',
    origen: 'Aprendiendo de los errores, ejemplo 18 (con otra hora)',
  },
  {
    id: 'ti-poner',
    tema: 'tiempo',
    tipo: 'reloj',
    enunciado: 'La clase de Educación Física empieza a las [[10:15]] y dura [[45 minutos]]. {{Mueve las manecillas para mostrar la hora en que termina.}}',
    inicio: { hora: 10, minutos: 15 },
    objetivo: { hora: 11, minutos: 0 },
    errores: {
      '10:45': 'El reloj marca 10:45. De 10:15 a 10:45 pasan solo 30 minutos: faltan 15 más.',
      '11:15': 'Avanzaste una hora completa. La clase dura 45 minutos, menos de una hora.',
      '10:15': 'El reloj sigue marcando la hora en que empieza la clase. Avanza el minutero.',
      '10:00': 'Retrocediste. La clase termina después de las 10:15.',
    },
    pistas: {
      planificar: 'Avanza el minutero de 5 en 5 desde las 10:15 y cuenta hasta llegar a 45 minutos.',
      hacer: 'De 10:15 a 10:30 pasan 15 minutos. De 10:30 a 10:45, 30. De 10:45 a 11:00, 45.',
    },
    solucion: { texto: 'La clase termina a las 11:00.' },
    comprobar: 'De 10:15 a 11:00 pasan 45 minutos. ✓',
    origen: 'Programa de estudio, OA 20',
  },
  {
    id: 'ti-tenis',
    tema: 'tiempo',
    tipo: 'numero',
    enunciado: 'Un partido de tenis duró [[3 horas y 20 minutos]]. {{¿Cuántos minutos duró en total?}}',
    respuesta: 200,
    unidad: 'minutos',
    errores: {
      320: 'Juntaste el 3 y el 20, como si 1 hora fueran 100 minutos. 1 hora son 60 minutos: 3 horas son 180 minutos.',
      80: 'Sumaste 60 + 20, como si fuera 1 hora. Fueron 3 horas.',
      23: 'Sumaste 3 + 20. Primero pasa las horas a minutos.',
      180: '180 minutos son las 3 horas. Faltan los 20 minutos.',
    },
    pistas: {
      planificar: 'Pasa las horas a minutos: 1 hora = 60 minutos.',
      hacer: '3 horas = 60 + 60 + 60 = 180 minutos. Después suma los 20 minutos.',
    },
    solucion: { texto: '180 + 20 = 200 minutos.' },
    comprobar: '3 × 60 + 20 = 200. ✓',
    origen: 'Aprendiendo de los errores, ejemplo 19',
  },
  {
    id: 'ti-karate',
    tema: 'tiempo',
    tipo: 'reloj',
    enunciado: 'La práctica de karate de Jacinta empezó a las [[3:25]] y duró [[1 hora y 15 minutos]]. {{Mueve las manecillas para mostrar la hora en que terminó.}}',
    inicio: { hora: 3, minutos: 25 },
    objetivo: { hora: 4, minutos: 40 },
    errores: {
      '3:40': 'Sumaste solo los 15 minutos. Falta la hora.',
      '4:25': 'Sumaste la hora, pero faltan los 15 minutos.',
      '4:30': 'Revisa los minutos: 25 + 15 = 40.',
      '3:25': 'El reloj sigue en la hora en que empezó. Avanza las manecillas.',
    },
    pistas: {
      planificar: 'Primero avanza 1 hora con el botón de la hora. Después avanza 15 minutos.',
      hacer: 'Desde las 3:25, una hora después son las 4:25. Quince minutos más son tres saltos de 5 minutos.',
    },
    solucion: { texto: 'Terminó a las 4:40.' },
    comprobar: 'De 3:25 a 4:40 pasan 1 hora y 15 minutos. ✓',
    origen: 'PPT Medición, ejercicios 3 y 6',
  },
  {
    id: 'ti-tienda',
    tema: 'tiempo',
    tipo: 'numero',
    enunciado: 'Una tienda abre a las [[10:00]]. {{Si son las [[9:45]], ¿cuántos minutos faltan para que abra?}}',
    respuesta: 15,
    unidad: 'minutos',
    errores: {
      55: 'Restaste 100 − 45, como si una hora tuviera 100 minutos. Una hora tiene 60 minutos.',
      45: '45 son los minutos que ya pasaron desde las 9:00. Cuenta cuánto falta para las 10:00.',
      35: 'Cuenta de 5 en 5 desde las 9:45: 9:50, 9:55, 10:00.',
    },
    pistas: {
      planificar: 'Cuenta desde las 9:45 hasta las 10:00.',
      hacer: '9:45, 9:50, 9:55, 10:00: son tres saltos de 5 minutos.',
    },
    solucion: { texto: 'Faltan 15 minutos.' },
    comprobar: '9:45 más 15 minutos son las 10:00. ✓',
    origen: 'PPT Medición, ejercicio 8',
  },
  {
    id: 'ti-pm',
    tema: 'tiempo',
    tipo: 'alternativas',
    enunciado: 'Vicente almuerza a las [[13:00]]. {{¿Cómo se escribe esa hora usando A.M. o P.M.?}}',
    opciones: [
      { texto: '1:00 P.M.', correcta: true },
      { texto: '1:00 A.M.', error: 'A.M. son las horas antes del mediodía, en la madrugada y la mañana. A las 13:00 ya pasó el mediodía.' },
      { texto: '3:00 P.M.', error: 'Las 13:00 es 1 hora después de las 12:00 del mediodía: la 1 de la tarde.' },
      { texto: '13:00 A.M.', error: 'Con A.M. y P.M. se usan los números del 1 al 12.' },
    ],
    pistas: {
      planificar: 'Las horas después del mediodía se escriben con P.M.',
      hacer: '13:00 es 1 hora después de las 12:00.',
    },
    solucion: { texto: '13:00 = 1:00 P.M., la 1 de la tarde.' },
    comprobar: 'La 1 de la tarde es después del mediodía, así que lleva P.M. ✓',
    origen: 'Programa de estudio, OA 20',
  },
  {
    id: 'ti-semanas',
    tema: 'tiempo',
    tipo: 'alternativas',
    enunciado: 'Faltan [[35 días]] para las vacaciones de invierno. {{¿Cuántas semanas faltan?}}',
    opciones: [
      { texto: '5 semanas', correcta: true },
      { texto: '7 semanas', error: 'Dividiste por 5. Una semana tiene 7 días: 35 : 7.' },
      { texto: '4 semanas', error: '4 semanas son 28 días. Faltan 7 días más: otra semana.' },
      { texto: '3 semanas', error: 'Una semana tiene 7 días, no 10.' },
    ],
    pistas: {
      planificar: 'Una semana tiene 7 días.',
      hacer: '¿Cuántas veces cabe 7 en 35? 7, 14, 21, 28, 35.',
    },
    solucion: { texto: '35 : 7 = 5 semanas.' },
    comprobar: '5 × 7 = 35. ✓',
    origen: 'Programa de estudio, OA 21 (adaptado de PPT Medición, ejercicios 5 y 7)',
  },

  // ---------------- Metros y centímetros ----------------
  {
    id: 'lo-alturas',
    tema: 'longitud',
    tipo: 'alternativas',
    enunciado: 'Cuatro amigos se midieron con una huincha. {{¿Quién es el más alto?}}',
    visual: {
      tipo: 'tabla',
      encabezados: ['Nombre', 'Estatura'],
      filas: [
        ['Lucas', '1 m y 45 cm'],
        ['Juan', '1 m y 55 cm'],
        ['León', '143 cm'],
        ['Miguel', '152 cm'],
      ],
    },
    opciones: [
      { texto: 'Lucas', error: '1 m y 45 cm son 145 cm. Hay alguien más alto.' },
      { texto: 'Juan', correcta: true },
      { texto: 'León', error: '143 cm es la estatura más baja de los cuatro.' },
      { texto: 'Miguel', error: '152 parece más que «1 m y 55 cm», pero 1 m y 55 cm son 155 cm.' },
    ],
    ordenFijo: true,
    pistas: {
      planificar: 'Pasa todas las estaturas a centímetros. 1 m = 100 cm.',
      hacer: 'Lucas 145 cm, Juan 155 cm, León 143 cm, Miguel 152 cm.',
    },
    solucion: { texto: 'Juan es el más alto: mide 155 cm.' },
    comprobar: '155 > 152 > 145 > 143. ✓',
    origen: 'Ensayo 1, pregunta 9',
  },
  {
    id: 'lo-poste',
    tema: 'longitud',
    tipo: 'numero',
    enunciado: 'Un poste mide [[6 m y 42 cm]]. {{¿Cuántos centímetros le faltan para medir 8 metros?}}',
    respuesta: 158,
    unidad: 'cm',
    errores: {
      200: '200 cm le faltan a 6 metros para llegar a 8. Pero el poste mide 6 m y 42 cm: le falta menos.',
      242: 'Sumaste los 42 cm. El poste ya los tiene: hay que restarlos.',
      258: 'Revisa la resta 800 − 642: en las decenas tienes que pedir prestado.',
      2: '8 − 6 = 2 metros, pero la pregunta pide centímetros y el poste mide 42 cm más que 6 m.',
    },
    pistas: {
      planificar: 'Pasa todo a centímetros: 8 m = 800 cm y 6 m y 42 cm = 642 cm.',
      hacer: 'Calcula 800 − 642.',
    },
    solucion: { texto: '800 − 642 = 158 cm.' },
    comprobar: '642 + 158 = 800. ✓',
    origen: 'PPT Medición, ejercicio 13',
  },
  {
    id: 'lo-camioneta',
    tema: 'longitud',
    tipo: 'alternativas',
    enunciado: 'Una camioneta mide [[5 metros y 32 centímetros]] de largo. {{¿Cuánto mide en centímetros?}}',
    opciones: [
      { texto: '532 cm', correcta: true },
      { texto: '37 cm', error: 'Sumaste 5 + 32 como si los dos fueran centímetros. 5 metros son 500 cm.' },
      { texto: `${f(5032)} cm`, error: `5 metros son 500 cm, no ${f(5000)}.` },
      { texto: `${f(5320)} cm`, error: 'Agregaste un 0 al final. 500 + 32 = 532.' },
    ],
    pistas: {
      planificar: '1 metro = 100 centímetros.',
      hacer: '5 m = 500 cm. Después suma los 32 cm.',
    },
    solucion: { texto: '500 + 32 = 532 cm.' },
    comprobar: '532 cm = 5 m y 32 cm. ✓',
    origen: 'Ensayo 2, pregunta 27',
  },
  {
    id: 'lo-carteles',
    tema: 'longitud',
    tipo: 'numero',
    enunciado: 'Cada cartel mide [[26 cm]] de largo. La ventana mide [[3 metros]]. {{¿Cuántos carteles caben, como máximo, uno al lado del otro?}}',
    respuesta: 11,
    unidad: 'carteles',
    errores: {
      12: '12 carteles miden 312 cm: se pasan de los 300 cm de la ventana.',
      10: 'Con 10 carteles (260 cm) todavía queda espacio para uno más.',
      3: '3 son los metros de la ventana. Pásalos a centímetros: 300 cm.',
    },
    pistas: {
      planificar: 'Pasa 3 metros a centímetros: 300 cm.',
      hacer: 'Prueba: 26 × 10 = 260. 26 × 11 = 286. 26 × 12 = 312.',
    },
    solucion: { texto: 'Caben 11 carteles, que miden 286 cm.' },
    comprobar: '286 cm es menos que 300 cm, y con 12 carteles se pasa. ✓',
    origen: 'PPT Medición, ejercicio 11',
  },
  {
    id: 'lo-cintas',
    tema: 'longitud',
    tipo: 'quien',
    enunciado: 'Ana tiene una cinta azul de [[2 m y 15 cm]] y una roja de [[1 m y 18 cm]]. Cuatro compañeros calcularon cuánta cinta tiene en total. {{¿Quién tiene razón?}}',
    personas: [
      { nombre: 'Tomás', dice: '215 + 118 = 333. Son 333 m.', error: 'Tomás sumó bien, pero se equivocó en la unidad: son 333 centímetros, no 333 metros.' },
      { nombre: 'Florencia', dice: '2 m + 1 m = 3 m, y 15 cm + 18 cm = 33 cm. Son 3 m y 33 cm.', correcta: true },
      { nombre: 'Vicente', dice: '215 + 18 = 233. Son 233 cm.', error: 'Vicente se olvidó del metro de la cinta roja: 1 m y 18 cm son 118 cm, no 18.' },
      { nombre: 'Isidora', dice: '2 m + 1 m = 3 m, y 15 cm + 18 cm = 23 cm. Son 3 m y 23 cm.', error: 'Isidora no hizo la reserva: 15 + 18 = 33, no 23.' },
    ],
    pistas: {
      planificar: 'Suma los metros con los metros y los centímetros con los centímetros.',
      hacer: '2 m + 1 m = 3 m. 15 cm + 18 cm = 33 cm.',
    },
    solucion: { texto: '3 m y 33 cm, que son 333 cm. Florencia tiene razón.' },
    comprobar: '215 cm + 118 cm = 333 cm. ✓',
    origen: 'Ensayo 2, pregunta 2',
  },

  // ---------------- Perímetro y área ----------------
  {
    id: 'ap-patio',
    tema: 'area-perimetro',
    tipo: 'alternativas',
    enunciado: 'El patio rectangular de una casa mide [[5 m]] de largo y [[3 m]] de ancho. {{¿Cuántos metros de reja se necesitan para cercarlo completo?}}',
    visual: {
      tipo: 'poligono',
      puntos: [
        [0, 0],
        [250, 0],
        [250, 150],
        [0, 150],
      ],
      lados: ['5 m', '3 m'],
    },
    opciones: [
      { texto: '16 m', correcta: true },
      { texto: '8 m', error: 'Sumaste solo dos lados (5 + 3). El rectángulo tiene 4 lados y la reja va alrededor de todo.' },
      { texto: '15 m', error: '15 es el área (5 × 3): lo que cubre por dentro. La reja va por el borde.' },
      { texto: '13 m', error: 'Te faltó un lado. Suma los 4: 5 + 3 + 5 + 3.' },
    ],
    pistas: {
      planificar: 'La reja va por todo el borde: es el perímetro.',
      hacer: 'El rectángulo tiene 2 lados de 5 m y 2 lados de 3 m.',
    },
    solucion: { texto: '5 + 3 + 5 + 3 = 16 m.' },
    comprobar: '2 × 5 + 2 × 3 = 10 + 6 = 16. ✓',
    origen: 'Aprendiendo de los errores, ejemplo 16 (con otras medidas)',
  },
  {
    id: 'ap-pintar',
    tema: 'area-perimetro',
    tipo: 'pintarCuadricula',
    enunciado: '{{Pinta un rectángulo que tenga un área de **12 cuadrados**.}}',
    modo: 'area',
    columnas: 8,
    filas: 6,
    area: 12,
    pistas: {
      planificar: 'Piensa en multiplicaciones que den 12.',
      hacer: 'Por ejemplo, 3 filas de 4 cuadrados: 3 × 4 = 12.',
    },
    solucion: {
      texto: 'Sirven varios rectángulos: 2 × 6, 3 × 4, 4 × 3 o 6 × 2.',
      extra: 'Tú formaste uno de {ancho} × {alto}.',
    },
    comprobar: 'Rectángulos distintos pueden tener la misma área. ✓',
    origen: 'Programa de estudio, OA 23 (rectángulos distintos con la misma área)',
  },
  {
    id: 'ap-perimetro',
    tema: 'area-perimetro',
    tipo: 'pintarCuadricula',
    enunciado: 'Cada lado de un cuadrito mide 1 cm. {{Pinta un rectángulo que tenga un **perímetro de 12 cm**.}}',
    modo: 'area',
    columnas: 8,
    filas: 6,
    perimetro: 12,
    pistas: {
      planificar: 'El perímetro es el borde: suma los 4 lados del rectángulo.',
      hacer: 'Por ejemplo, un rectángulo de 4 cuadritos de largo y 2 de ancho: 4 + 2 + 4 + 2 = 12.',
    },
    solucion: {
      texto: 'Sirven varios: 5 × 1, 4 × 2 o 3 × 3. Un cuadrado también es un rectángulo.',
      extra: 'Tú formaste uno de {ancho} × {alto}.',
    },
    comprobar: 'Suma los 4 lados de tu rectángulo: tiene que dar 12. ✓',
    origen: 'Programa de estudio, OA 23 (tarea con varias respuestas correctas, como propone Mindset Mathematics)',
  },
  {
    id: 'ap-cuadrado',
    tema: 'area-perimetro',
    tipo: 'alternativas',
    enunciado: 'El perímetro de un cuadrado es [[20 cm]]. {{¿Cuánto mide cada lado?}}',
    opciones: [
      { texto: '5 cm', correcta: true },
      { texto: '10 cm', error: 'Dividiste por 2, pero el cuadrado tiene 4 lados iguales.' },
      { texto: '4 cm', error: '4 es la cantidad de lados, no lo que mide cada uno.' },
      { texto: '16 cm', error: 'Restaste 20 − 4. Hay que repartir los 20 cm en 4 lados iguales.' },
    ],
    pistas: {
      planificar: 'Un cuadrado tiene 4 lados iguales que juntos suman 20 cm.',
      hacer: 'Reparte 20 en 4 partes iguales: 20 : 4.',
    },
    solucion: { texto: 'Cada lado mide 5 cm.' },
    comprobar: '5 + 5 + 5 + 5 = 20. ✓',
    origen: 'PPT Medición, ejercicio 16',
  },
  {
    id: 'ap-casa',
    tema: 'area-perimetro',
    tipo: 'numero',
    enunciado: 'El perímetro de esta figura es [[40 unidades]]. {{¿Cuánto mide el lado que falta?}}',
    visual: {
      tipo: 'poligono',
      puntos: [
        [0, 80],
        [80, 0],
        [160, 80],
        [160, 200],
        [0, 200],
      ],
      lados: ['7 u', '7 u', '8 u', '?', '8 u'],
    },
    respuesta: 10,
    unidad: 'unidades',
    errores: {
      30: '30 es la suma de los lados que conoces. El perímetro completo es 40: ¿cuánto falta?',
      70: 'Sumaste 40 + 30. El lado que falta es lo que le falta a 30 para llegar a 40.',
      8: 'El lado de abajo no tiene por qué medir lo mismo que las paredes. Calcúlalo con el perímetro.',
    },
    pistas: {
      planificar: 'Suma los lados que conoces y compara con el perímetro.',
      hacer: '7 + 7 + 8 + 8 = 30.',
    },
    solucion: { texto: '40 − 30 = 10 unidades.' },
    comprobar: '7 + 7 + 8 + 10 + 8 = 40. ✓',
    origen: 'PPT Medición, ejercicio 18',
  },
  {
    id: 'ap-flecha',
    tema: 'area-perimetro',
    tipo: 'alternativas',
    enunciado: 'La flecha es igual a ambos lados. {{¿Cuál es su perímetro?}}',
    visual: {
      tipo: 'poligono',
      puntos: [
        [125, 0],
        [250, 83],
        [150, 83],
        [150, 183],
        [100, 183],
        [100, 83],
        [0, 83],
      ],
      lados: ['3', null, '2', '1', null, '2', null],
    },
    opciones: [
      { texto: '12 u', error: 'Te faltaron lados. La flecha tiene 7 lados: cuéntalos todos.' },
      { texto: '8 u', error: 'Sumaste solo los lados que tienen número. Los lados sin número miden lo mismo que su pareja del otro lado.' },
      { texto: '15 u', correcta: true },
      { texto: '20 u', error: 'Revisa la suma lado por lado: 3 + 3 + 2 + 2 + 2 + 2 + 1.' },
    ],
    ordenFijo: true,
    pistas: {
      planificar: 'La flecha es igual a ambos lados: los lados sin número miden lo mismo que su pareja.',
      hacer: 'Los dos lados de la punta miden 3. Los dos hombros miden 2. Los dos lados del palo miden 2. Abajo mide 1.',
    },
    solucion: { texto: '3 + 3 + 2 + 2 + 2 + 2 + 1 = 15 u.' },
    comprobar: 'Recorre el borde completo empezando por la punta y vuelve al inicio. ✓',
    origen: 'PPT Medición, ejercicio 19',
  },
  {
    id: 'ap-mitad',
    tema: 'area-perimetro',
    tipo: 'alternativas',
    enunciado: 'El ancho de un rectángulo es [[la mitad de su largo]]. El largo mide [[10 cm]]. {{¿Cuál es el área del rectángulo?}}',
    opciones: [
      { texto: '50 cm²', correcta: true },
      { texto: '30 cm²', error: '30 cm es el perímetro (10 + 5 + 10 + 5). El área es lo que cubre por dentro: largo × ancho.' },
      { texto: '100 cm²', error: 'Usaste 10 cm para el largo y para el ancho. El ancho es la mitad: 5 cm.' },
      { texto: '15 cm²', error: 'Sumaste 10 + 5. El área se calcula multiplicando.' },
    ],
    pistas: {
      planificar: 'Primero calcula el ancho. Después multiplica largo × ancho.',
      hacer: 'Ancho: 10 : 2 = 5 cm. Área: 10 × 5.',
    },
    solucion: { texto: '10 × 5 = 50 cm².', visual: { tipo: 'area', largo: 10, ancho: 5 } },
    comprobar: 'Son 5 filas de 10 cuadrados de 1 cm². ✓',
    origen: 'Ensayo 2, pregunta 26',
  },
  {
    id: 'ap-figura8',
    tema: 'area-perimetro',
    tipo: 'alternativas',
    enunciado: 'Todas las figuras están hechas con cuadrados iguales. {{¿Cuál tiene un área de **8 cuadrados**?}}',
    opciones: [
      {
        texto: 'Figura A',
        visual: { tipo: 'area', celdas: [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]] },
        error: 'La figura A tiene 9 cuadrados: 3 filas de 3.',
      },
      { texto: 'Figura B', visual: { tipo: 'area', celdas: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2], [2, 2], [1, 3]] }, correcta: true },
      {
        texto: 'Figura C',
        visual: { tipo: 'area', celdas: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [2, 1], [2, 2]] },
        error: 'La figura C tiene 7 cuadrados. Cuenta de nuevo marcando cada uno.',
      },
      {
        texto: 'Figura D',
        visual: { tipo: 'area', celdas: [[0, 0], [1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [2, 2], [3, 2], [4, 2], [5, 2]] },
        error: 'La figura D tiene 10 cuadrados.',
      },
    ],
    ordenFijo: true,
    pistas: {
      planificar: 'Cuenta los cuadrados de cada figura, fila por fila, para no repetir ninguno.',
      hacer: 'Figura B: 1 arriba, 4 en la segunda fila, 2 en la tercera y 1 abajo.',
    },
    solucion: { texto: 'La figura B tiene 8 cuadrados: 1 + 4 + 2 + 1 = 8.' },
    comprobar: 'Figura A: 9. Figura C: 7. Figura D: 10. ✓',
    origen: 'PPT Medición, ejercicio 9',
  },

  // ---------------- Volumen con cubos ----------------
  {
    id: 'vo-escalera',
    tema: 'volumen',
    tipo: 'numero',
    enunciado: 'Esta escalera está hecha con cubos iguales. {{¿Cuántos cubos tiene en total?}}',
    visual: {
      tipo: 'cubosPisos',
      alturas: [
        [3, 2, 1],
        [3, 2, 1],
      ],
    },
    respuesta: 12,
    unidad: 'cubos',
    errores: {
      9: 'Contaste solo los cubos que se ven. Atrás hay cubos escondidos: usa «Ver por pisos».',
      6: 'Contaste solo una fila de la escalera. Atrás hay otra fila igual.',
    },
    pistas: {
      planificar: 'Hay cubos que no se ven. Usa el botón «Ver por pisos».',
      hacer: 'Piso 1: 6 cubos. Piso 2: 4 cubos. Piso 3: 2 cubos.',
    },
    solucion: { texto: '6 + 4 + 2 = 12 cubos.' },
    comprobar: 'Son 2 filas iguales de 3 + 2 + 1 = 6 cubos: 2 × 6 = 12. ✓',
    origen: 'PPT Medición, ejercicio 4 (adaptado)',
  },
  {
    id: 'vo-bloque',
    tema: 'volumen',
    tipo: 'numero',
    enunciado: 'Este bloque está hecho con cubos iguales. {{¿Cuántos cubos tiene?}}',
    visual: {
      tipo: 'cubosPisos',
      alturas: [
        [2, 2, 2, 2],
        [2, 2, 2, 2],
      ],
    },
    respuesta: 16,
    unidad: 'cubos',
    errores: {
      12: 'Contaste solo los cubos que se ven. Detrás hay cubos escondidos: usa «Ver por pisos».',
      8: 'Contaste solo un piso. El bloque tiene 2 pisos iguales.',
    },
    pistas: {
      planificar: 'Cuenta por pisos. Cada piso tiene 2 filas.',
      hacer: 'Cada piso tiene 2 filas de 4 cubos: 8 cubos por piso.',
    },
    solucion: { texto: '8 + 8 = 16 cubos.' },
    comprobar: '2 pisos × 2 filas × 4 cubos = 16. ✓',
    origen: 'PPT Medición, ejercicio 12',
  },
  {
    id: 'vo-comparar',
    tema: 'volumen',
    tipo: 'alternativas',
    enunciado: '{{¿Cuántos cubos **más** tiene la figura A que la figura B?}}',
    visual: {
      tipo: 'grupo',
      items: [
        {
          tipo: 'cubos',
          etiqueta: 'Figura A',
          alturas: [
            [2, 2, 2],
            [2, 2, 2],
          ],
        },
        {
          tipo: 'cubos',
          etiqueta: 'Figura B',
          alturas: [
            [1, 1, 1],
            [1, 1, 1],
          ],
        },
      ],
    },
    opciones: [
      { texto: '6', correcta: true },
      { texto: '12', error: '12 cubos tiene la figura A. Falta compararla con la B.' },
      { texto: '18', error: 'Sumaste las dos figuras. «Cuántos más» se responde restando.' },
      { texto: '3', error: 'Cuenta cada figura por pisos: la A tiene 2 pisos de 6 cubos.' },
    ],
    pistas: {
      planificar: 'Cuenta los cubos de cada figura, por pisos. Después compara.',
      hacer: 'A: 2 pisos de 6 cubos = 12. B: 1 piso de 6 cubos = 6.',
    },
    solucion: { texto: '12 − 6 = 6 cubos más.' },
    comprobar: 'La figura A es como dos figuras B, una encima de otra. ✓',
    origen: 'Ensayo 1, pregunta 27 (adaptado)',
  },
];
