// Ejes de Matemática 4° básico (Bases Curriculares) que evalúa el SIMCE.
// Cada eje tiene un color de "papel lustre" definido en index.css (--eje-<id>).
export const EJES = [
  {
    id: 'numeros',
    nombre: 'Números y operaciones',
    descripcion: 'Sumar, restar, multiplicar y fracciones',
  },
  {
    id: 'patrones',
    nombre: 'Patrones y álgebra',
    descripcion: 'Secuencias y el número que falta',
  },
  {
    id: 'geometria',
    nombre: 'Geometría',
    descripcion: 'Cuerpos, figuras y ubicación en un mapa',
  },
  {
    id: 'medicion',
    nombre: 'Medición',
    descripcion: 'Área y tiempo',
  },
  {
    id: 'datos',
    nombre: 'Datos y probabilidades',
    descripcion: 'Leer gráficos y tablas',
  },
];

/*
  Formato de un ejercicio:
  - enunciado: la pregunta, en lenguaje simple.
  - visual: representación pictórica (método Concreto-Pictórico-Abstracto).
  - opciones: 4 alternativas como en el SIMCE. Cada distractor tiene una
    retroalimentación que explica el error típico que lo produce.
  - pistas: de la más general a la más concreta (andamiaje gradual).
  - solucion: el ejemplo resuelto que se muestra al acertar.
*/
export const EJERCICIOS = [
  // ---------- Números y operaciones ----------
  {
    id: 'num-resta',
    eje: 'numeros',
    enunciado:
      'Matías tenía 324 láminas y regaló 158 a su hermana. ¿Cuántas láminas le quedan?',
    visual: { tipo: 'barras', total: 324, parte: 158 },
    opciones: [
      { texto: '166', correcta: true },
      {
        texto: '234',
        feedback:
          'En cada columna restaste el número menor al mayor. Cuando arriba hay menos (4 − 8), tienes que pedir prestado a la columna de al lado.',
      },
      {
        texto: '482',
        feedback:
          'Sumaste los números. Matías regaló láminas, así que ahora tiene menos que antes.',
      },
      {
        texto: '176',
        feedback:
          'Pediste prestado, pero se te olvidó descontarlo en las decenas. Las 2 decenas quedan en 1 después de prestar.',
      },
    ],
    pistas: [
      'Si regaló láminas, ¿tiene más o menos que antes? Eso te dice qué operación usar.',
      'Calcula 324 − 158. Empieza por las unidades: a 4 no le puedes quitar 8, así que pide 1 decena prestada.',
    ],
    solucion: '324 − 158 = 166. Comprueba: 166 + 158 = 324.',
  },
  {
    id: 'num-posicional',
    eje: 'numeros',
    enunciado:
      '¿Qué número tiene 4 unidades de mil, 0 centenas, 7 decenas y 2 unidades?',
    visual: { tipo: 'posicional', cifras: [4, 0, 7, 2] },
    opciones: [
      { texto: '4.072', correcta: true },
      {
        texto: '472',
        feedback:
          'Te saltaste el 0. Aunque no haya centenas, el 0 tiene que estar para guardar su lugar.',
      },
      {
        texto: '4.702',
        feedback:
          'El 7 quedó en las centenas. Fíjate en la tabla: el 7 va en las decenas.',
      },
      {
        texto: '4.720',
        feedback:
          'Los números quedaron corridos un lugar. Las unidades (2) siempre van al final, a la derecha.',
      },
    ],
    pistas: [
      'Escribe cada número en su columna de la tabla, de izquierda a derecha.',
      'Lee las columnas en orden: UM, C, D, U. ¿Qué número forman juntas?',
    ],
    solucion: '4 UM, 0 C, 7 D y 2 U forman el número 4.072.',
  },
  {
    id: 'num-multiplicacion',
    eje: 'numeros',
    enunciado:
      'En la sala hay 6 cajas y cada caja tiene 8 lápices. ¿Cuántos lápices hay en total?',
    visual: { tipo: 'arreglo', filas: 6, columnas: 8 },
    opciones: [
      { texto: '48', correcta: true },
      {
        texto: '14',
        feedback:
          'Sumaste 6 + 8. Pero son 6 grupos de 8 lápices cada uno, así que hay que juntar 8 seis veces.',
      },
      {
        texto: '42',
        feedback: 'Ese es 6 × 7. Cada caja tiene 8 lápices, no 7. Cuenta una fila del dibujo.',
      },
      {
        texto: '56',
        feedback: 'Ese es 7 × 8. Revisa cuántas cajas hay: son 6 filas en el dibujo.',
      },
    ],
    pistas: [
      'Cada fila del dibujo es una caja. ¿Cuántas filas hay y cuántos puntos tiene cada una?',
      'Puedes sumar 8 + 8 + 8 + 8 + 8 + 8, o calcular 6 × 8.',
    ],
    solucion: '6 cajas × 8 lápices = 48 lápices.',
  },
  {
    id: 'num-fraccion',
    eje: 'numeros',
    enunciado:
      'Una pizza se cortó en 8 partes iguales y la familia se comió 3. ¿Qué fracción de la pizza se comieron?',
    visual: { tipo: 'fraccion', partes: 8, pintadas: 3 },
    opciones: [
      { texto: '3/8', correcta: true },
      {
        texto: '5/8',
        feedback: '5/8 es la parte que quedó en la caja. La pregunta es por lo que se comieron.',
      },
      {
        texto: '3/5',
        feedback:
          'Comparaste lo que se comieron con lo que quedó. El número de abajo tiene que ser el total de partes.',
      },
      {
        texto: '8/3',
        feedback:
          'Los números están al revés. Abajo va el total de partes y arriba las partes que se comieron.',
      },
    ],
    pistas: [
      'El número de abajo de una fracción dice en cuántas partes iguales se dividió el entero.',
      'Cuenta las partes pintadas: esas van arriba.',
    ],
    solucion: 'Se comieron 3 de 8 partes iguales: 3/8.',
  },

  // ---------- Patrones y álgebra ----------
  {
    id: 'pat-secuencia',
    eje: 'patrones',
    enunciado: '¿Qué número falta en la secuencia? 7, 11, 15, ___, 23',
    visual: { tipo: 'recta', valores: [7, 11, 15, null, 23] },
    opciones: [
      { texto: '19', correcta: true },
      {
        texto: '17',
        feedback: 'Sumaste 2. Mira cuánto aumenta de 7 a 11: el salto es más grande.',
      },
      {
        texto: '16',
        feedback: 'Sumaste 1 al 15. Revisa cuánto crece la secuencia en cada salto.',
      },
      {
        texto: '22',
        feedback: 'Le restaste 1 al 23. El número tiene que seguir el mismo patrón que los demás.',
      },
    ],
    pistas: [
      '¿Cuánto hay que sumar para pasar de 7 a 11? ¿Y de 11 a 15?',
      'Siempre se suma 4. Calcula 15 + 4 y revisa que al sumar 4 otra vez llegues a 23.',
    ],
    solucion: 'La regla es sumar 4: 15 + 4 = 19, y 19 + 4 = 23.',
  },
  {
    id: 'pat-ecuacion',
    eje: 'patrones',
    enunciado: '¿Qué número va en el cuadrado para que la balanza quede en equilibrio?',
    visual: { tipo: 'balanza', izquierda: '□ + 25', derecha: '60' },
    opciones: [
      { texto: '35', correcta: true },
      {
        texto: '85',
        feedback:
          'Sumaste 60 + 25. Pero si pones 85 en el cuadrado, el lado izquierdo pesaría 110.',
      },
      {
        texto: '45',
        feedback:
          'Revisa la resta 60 − 25: a 0 unidades no le puedes quitar 5 sin pedir prestado.',
      },
      {
        texto: '25',
        feedback: 'Copiaste el número que ya estaba. Comprueba: 25 + 25 = 50, no 60.',
      },
    ],
    pistas: [
      'Los dos lados tienen que valer lo mismo. ¿Qué número le sumas a 25 para llegar a 60?',
      'Puedes calcular 60 − 25, o contar desde 25 hasta 60.',
    ],
    solucion: '60 − 25 = 35. Comprueba: 35 + 25 = 60.',
  },

  // ---------- Geometría ----------
  {
    id: 'geo-cubo',
    eje: 'geometria',
    enunciado: '¿Cuántas caras tiene un cubo?',
    visual: { tipo: 'cubo' },
    opciones: [
      { texto: '6', correcta: true },
      {
        texto: '8',
        feedback: 'Contaste los vértices, que son las esquinas. Las caras son los cuadrados planos.',
      },
      {
        texto: '12',
        feedback: 'Contaste las aristas, que son los bordes. Las caras son los cuadrados planos.',
      },
      {
        texto: '4',
        feedback:
          'En el dibujo no se ven todas las caras. Piensa en un dado: también tiene cara arriba, abajo y atrás.',
      },
    ],
    pistas: [
      'Piensa en un dado: ¿cuántos números distintos tiene?',
      'Cuenta: arriba, abajo, adelante, atrás, izquierda y derecha.',
    ],
    solucion: 'Un cubo tiene 6 caras cuadradas, como un dado.',
  },
  {
    id: 'geo-coordenadas',
    eje: 'geometria',
    enunciado: 'En el mapa, ¿en qué posición está la estrella?',
    visual: { tipo: 'coordenadas', columna: 'D', fila: 2 },
    opciones: [
      { texto: 'D2', correcta: true },
      {
        texto: 'D4',
        feedback:
          'Contaste las filas desde arriba. En este mapa los números empiezan en 1 abajo.',
      },
      {
        texto: 'B4',
        feedback:
          'Intercambiaste la letra y el número. La letra dice la columna y el número dice la fila.',
      },
      {
        texto: 'C2',
        feedback: 'La fila está bien, pero revisa la columna: sigue la estrella hacia abajo hasta la letra.',
      },
    ],
    pistas: [
      'Baja con el dedo desde la estrella hasta las letras. Esa es la columna.',
      'Ahora ve desde la estrella hacia la izquierda hasta los números. Esa es la fila.',
    ],
    solucion: 'La estrella está en la columna D y en la fila 2: D2.',
  },

  // ---------- Medición ----------
  {
    id: 'med-area',
    eje: 'medicion',
    enunciado:
      'Este rectángulo está formado por cuadrados iguales. ¿Cuál es su área, medida en cuadrados?',
    visual: { tipo: 'area', largo: 5, ancho: 3 },
    opciones: [
      { texto: '15 cuadrados', correcta: true },
      {
        texto: '8 cuadrados',
        feedback: 'Sumaste el largo y el ancho (5 + 3). El área es todo el espacio de adentro.',
      },
      {
        texto: '16 cuadrados',
        feedback:
          'Ese es el perímetro, el borde de la figura. El área es lo que cubre por dentro.',
      },
      {
        texto: '30 cuadrados',
        feedback: 'Contaste dos veces. Hay 3 filas de 5 cuadrados.',
      },
    ],
    pistas: [
      '¿Cuántos cuadrados hay en una fila? ¿Cuántas filas hay?',
      'Hay 3 filas de 5 cuadrados: calcula 3 × 5 o suma 5 + 5 + 5.',
    ],
    solucion: '3 filas × 5 cuadrados = 15 cuadrados.',
  },
  {
    id: 'med-tiempo',
    eje: 'medicion',
    enunciado:
      'La clase de Educación Física empieza a la hora que marca el reloj y dura 45 minutos. ¿A qué hora termina?',
    visual: { tipo: 'reloj', hora: 10, minutos: 15 },
    opciones: [
      { texto: '11:00', correcta: true },
      {
        texto: '10:60',
        feedback: 'Una hora tiene solo 60 minutos. Cuando llegas a 60, se cambia a la hora siguiente.',
      },
      {
        texto: '10:45',
        feedback:
          'Esa es la hora en que faltan 15 minutos para terminar. Cuenta los 45 minutos desde las 10:15.',
      },
      {
        texto: '11:45',
        feedback:
          'Sumaste una hora completa y además 45 minutos. La clase dura menos de una hora.',
      },
    ],
    pistas: [
      'El reloj marca las 10:15. ¿Cuántos minutos faltan para las 11:00?',
      'De 10:15 a 11:00 hay exactamente 45 minutos.',
    ],
    solucion: '10:15 + 45 minutos = 11:00.',
  },

  // ---------- Datos y probabilidades ----------
  {
    id: 'dat-diferencia',
    eje: 'datos',
    enunciado:
      'El gráfico muestra la fruta favorita del 4° B. ¿Cuántos estudiantes más prefieren manzana que naranja?',
    visual: {
      tipo: 'grafico',
      titulo: 'Fruta favorita del 4° B',
      datos: [
        { etiqueta: 'Manzana', valor: 8 },
        { etiqueta: 'Plátano', valor: 5 },
        { etiqueta: 'Naranja', valor: 3 },
        { etiqueta: 'Uva', valor: 6 },
      ],
    },
    opciones: [
      { texto: '5', correcta: true },
      {
        texto: '11',
        feedback: 'Sumaste manzana y naranja. "Cuántos más" se responde con una resta.',
      },
      {
        texto: '8',
        feedback: 'Ese es solo el total de manzana. Falta compararlo con la naranja.',
      },
      {
        texto: '3',
        feedback: 'Ese es solo el total de naranja. Falta compararlo con la manzana.',
      },
    ],
    pistas: [
      'Lee en el gráfico cuántos eligieron manzana y cuántos eligieron naranja.',
      'Para saber "cuántos más", resta el número menor al mayor.',
    ],
    solucion: 'Manzana 8, naranja 3: 8 − 3 = 5 estudiantes más.',
  },
  {
    id: 'dat-total',
    eje: 'datos',
    enunciado: 'Según el mismo gráfico, ¿cuántos estudiantes respondieron la encuesta?',
    visual: {
      tipo: 'grafico',
      titulo: 'Fruta favorita del 4° B',
      datos: [
        { etiqueta: 'Manzana', valor: 8 },
        { etiqueta: 'Plátano', valor: 5 },
        { etiqueta: 'Naranja', valor: 3 },
        { etiqueta: 'Uva', valor: 6 },
      ],
    },
    opciones: [
      { texto: '22', correcta: true },
      {
        texto: '8',
        feedback: 'Ese es el valor de la barra más alta. Cada estudiante está en una de las barras.',
      },
      {
        texto: '4',
        feedback: 'Contaste cuántas frutas hay. La pregunta es por la cantidad de estudiantes.',
      },
      {
        texto: '19',
        feedback: 'Te faltó sumar una barra. Revisa que sumaste las cuatro frutas.',
      },
    ],
    pistas: [
      'Cada estudiante eligió una fruta. ¿Qué tienes que hacer con los números de todas las barras?',
      'Suma las cuatro barras: 8 + 5 + 3 + 6.',
    ],
    solucion: '8 + 5 + 3 + 6 = 22 estudiantes.',
  },
];
