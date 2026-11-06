import { f } from '../../lib/formato.js';

// Eje Patrones y álgebra (OA 13 y 14).
export const TEMAS = [
  {
    id: 'patrones',
    eje: 'patrones',
    nombre: 'Patrones y secuencias',
    descripcion: 'Descubrir la regla de una secuencia y comprobar que sirve en todos los saltos',
    oa: [13],
    ejemplo: {
      enunciado: 'Ana lee siguiendo un patrón: el día 1 leyó [[10 páginas]], el día 2 leyó [[23]] y el día 3 leyó [[36]]. {{¿Cuántas páginas leerá el día 5?}}',
      pasos: [
        {
          paso: 'entender',
          texto: 'Te preguntan por el día 5. Conoces lo que leyó los días 1, 2 y 3.',
          visual: { tipo: 'secuencia', valores: [10, 23, 36, null, null], etiquetas: ['Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5'] },
        },
        {
          paso: 'planificar',
          texto: 'Busca la regla: mira cuánto aumenta de un día al siguiente, en todos los saltos y no solo en el primero.',
          visual: { tipo: 'secuencia', valores: [10, 23, 36, null, null], etiquetas: ['Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5'] },
        },
        {
          paso: 'hacer',
          texto: 'De 10 a 23 aumenta 13. De 23 a 36 también aumenta 13. La regla es sumar 13. Día 4: 36 + 13 = 49. Día 5: 49 + 13 = 62.',
          visual: { tipo: 'secuencia', valores: [10, 23, 36, 49, 62], salto: '+13', etiquetas: ['Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5'] },
        },
        {
          paso: 'comprobar',
          texto: 'Revisa que la regla funcione en cada salto: 10, 23, 36, 49, 62. Siempre se suma 13. ✓',
          visual: { tipo: 'secuencia', valores: [10, 23, 36, 49, 62], salto: '+13', etiquetas: ['Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5'] },
        },
      ],
    },
  },
  {
    id: 'ecuaciones',
    eje: 'patrones',
    nombre: 'Ecuaciones e inecuaciones',
    descripcion: 'Encontrar el número que falta usando la balanza y las operaciones inversas',
    oa: [14],
    ejemplo: {
      enunciado: 'Encuentra el número que va en el cuadrado: [[□ + 7 = 15]].',
      pasos: [
        {
          paso: 'entender',
          texto: 'La ecuación dice que □ + 7 vale lo mismo que 15. Es como una balanza en equilibrio: los dos lados pesan lo mismo.',
          visual: { tipo: 'balanza', izquierda: [{ tipo: 'caja', texto: '□' }, { tipo: 'pesa', valor: '7' }], derecha: [{ tipo: 'pesa', valor: '15' }] },
        },
        {
          paso: 'planificar',
          texto: 'Para que siga en equilibrio, □ tiene que ser lo que le falta a 7 para llegar a 15.',
          visual: { tipo: 'balanza', izquierda: [{ tipo: 'caja', texto: '□' }, { tipo: 'pesa', valor: '7' }], derecha: [{ tipo: 'pesa', valor: '15' }] },
        },
        {
          paso: 'hacer',
          texto: 'Cuenta desde 7 hasta 15: 8, 9, 10, 11, 12, 13, 14, 15. Son 8 saltos. También puedes restar: 15 − 7 = 8.',
          visual: { tipo: 'recta', inicio: 5, fin: 16, paso: 1, etiquetas: [7, 15], saltos: [[7, 15, '+8']] },
        },
        {
          paso: 'comprobar',
          texto: 'Pon el 8 en la caja: 8 + 7 = 15. ¡Equilibrio! El signo = no quiere decir «aquí va el resultado»: quiere decir «vale lo mismo que». ✓',
          visual: { tipo: 'balanza', izquierda: [{ tipo: 'caja', texto: '8' }, { tipo: 'pesa', valor: '7' }], derecha: [{ tipo: 'pesa', valor: '15' }] },
        },
      ],
    },
  },
];

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

export const EJERCICIOS = [
  // ---------------- Patrones y secuencias ----------------
  {
    id: 'pa-alcancia',
    tema: 'patrones',
    tipo: 'numero',
    enunciado: 'Carla ahorra en su alcancía, cada día, [[el doble]] de lo que ahorró el día anterior. {{¿Cuánto dinero pondrá el viernes?}}',
    visual: { tipo: 'secuencia', valores: [100, 200, 400, null, null], etiquetas: DIAS, formato: 'peso' },
    respuesta: 1600,
    antes: '$',
    errores: {
      800: '$800 es lo que pone el jueves. Falta un día más.',
      500: 'Sumaste $100 cada día. Pero de martes a miércoles aumentó $200: cada día pone el doble del día anterior.',
      600: 'Sumaste $200 cada día. Mira la regla: cada día es el doble del anterior.',
      3200: `${'$'}${f(3200)} sería el sábado. Cuenta los días hasta el viernes.`,
    },
    pistas: {
      planificar: 'Mira cómo cambia de un día al siguiente: $100, $200, $400.',
      hacer: 'Cada día es el doble: el jueves pone $400 + $400 = $800.',
    },
    solucion: { texto: `El viernes pone $800 + $800 = $${f(1600)}.` },
    comprobar: `100, 200, 400, 800, ${f(1600)}: cada número es el doble del anterior. ✓`,
    origen: 'PPT Números y Operaciones, ejercicio 3',
  },
  {
    id: 'pa-regla',
    tema: 'patrones',
    tipo: 'alternativas',
    enunciado: 'Noemí escribió esta secuencia. {{¿Qué regla sigue?}}',
    visual: { tipo: 'secuencia', valores: [640, 320, 160, 80, 40, 20, 10] },
    opciones: [
      { texto: 'Dividir por 2 cada término', correcta: true },
      { texto: 'Restar 320 a cada término', error: 'Restar 320 solo funciona en el primer salto: 320 − 320 = 0, no 160. Una regla tiene que servir en todos los saltos.' },
      { texto: 'Sumar 160 a cada término', error: 'La secuencia va bajando: no puede ser sumando.' },
      { texto: 'Multiplicar por 2 cada término', error: 'Multiplicar por 2 agranda los números, y aquí van bajando.' },
    ],
    pistas: {
      planificar: 'Prueba cada regla en todos los saltos, no solo en el primero.',
      hacer: '640 : 2 = 320. 320 : 2 = 160. 160 : 2 = 80...',
    },
    solucion: { texto: 'Cada término es la mitad del anterior: se divide por 2.' },
    comprobar: '20 : 2 = 10, el último término. ✓',
    explicar: {
      pregunta: '¿Por qué no basta con mirar el primer salto?',
      opciones: [
        { texto: 'Porque la regla tiene que funcionar en todos los saltos', correcta: true, porque: 'Una regla que sirve una sola vez no es la regla de la secuencia.' },
        { texto: 'Porque el primer número es muy grande', porque: 'No es por eso: hay que comprobar la regla en cada salto.' },
      ],
    },
    origen: 'PPT Patrones y Álgebra, ejercicio 12',
  },
  {
    id: 'pa-troncos',
    tema: 'patrones',
    tipo: 'numero',
    enunciado: 'Observa cómo aumentan los troncos en cada montón. {{Si se arma un 4° montón siguiendo el patrón, ¿cuántos troncos tendrá?}}',
    visual: {
      tipo: 'etapas',
      icono: 'tronco',
      etapas: [
        { etiqueta: '1° montón', cantidad: 3, forma: 'piramide' },
        { etiqueta: '2° montón', cantidad: 6, forma: 'piramide' },
        { etiqueta: '3° montón', cantidad: 10, forma: 'piramide' },
        { etiqueta: '4° montón', cantidad: null },
      ],
    },
    respuesta: 15,
    unidad: 'troncos',
    errores: {
      13: 'Sumaste 3 otra vez. Mira cómo crecen los saltos: +3, +4... el siguiente es +5.',
      14: 'Sumaste 4 otra vez. Los saltos van creciendo: +3, +4, +5.',
      16: 'Revisa la suma: 10 + 5.',
    },
    pistas: {
      planificar: 'Cuenta los troncos de cada montón y mira cuánto aumenta de uno al siguiente.',
      hacer: 'De 3 a 6 aumenta 3. De 6 a 10 aumenta 4. El siguiente aumento es 5.',
    },
    solucion: { texto: '10 + 5 = 15 troncos.' },
    comprobar: 'El 4° montón tiene una fila más abajo: 5 + 4 + 3 + 2 + 1 = 15. ✓',
    origen: 'PPT Patrones y Álgebra, ejercicio 1',
  },
  {
    id: 'pa-recta',
    tema: 'patrones',
    tipo: 'alternativas',
    enunciado: '{{¿Qué par de números completa la recta numérica?}}',
    visual: { tipo: 'recta', inicio: 925, fin: 1100, paso: 25, etiquetas: 'todas', cajas: [950, 1000] },
    opciones: [
      { texto: `950 y ${f(1000)}`, correcta: true },
      { texto: `955 y ${f(1005)}`, error: `Sumaste 30 en cada salto. Mira dos números seguidos que conozcas, como ${f(1050)} y ${f(1075)}: el salto es 25.` },
      { texto: `955 y ${f(1000)}`, error: 'El primero no calza: 925 + 25 = 950.' },
      { texto: `950 y ${f(1005)}`, error: `El segundo no calza: 975 + 25 = ${f(1000)}.` },
    ],
    pistas: {
      planificar: 'Busca dos números seguidos que conozcas para saber de cuánto es cada salto.',
      hacer: `${f(1025)}, ${f(1050)}, ${f(1075)}: los saltos son de 25.`,
    },
    solucion: { texto: `925 + 25 = 950 y 975 + 25 = ${f(1000)}.` },
    comprobar: `${f(1000)} + 25 = ${f(1025)}, que es el número siguiente. ✓`,
    origen: 'PPT Patrones y Álgebra, ejercicio 14',
  },
  {
    id: 'pa-restando',
    tema: 'patrones',
    tipo: 'alternativas',
    enunciado: 'La secuencia empieza en 660. {{¿Cómo se obtienen los demás términos?}}',
    visual: { tipo: 'secuencia', valores: [660, 540, 420, 300, 180, 60] },
    opciones: [
      { texto: 'Restando 120', correcta: true },
      { texto: 'Sumando 120', error: 'La secuencia va bajando: no puede ser sumando.' },
      { texto: 'Restando 20', error: 'Mira también las centenas: de 660 a 540 bajan 120, no 20.' },
      { texto: 'Restando 100', error: '660 − 100 = 560, y el siguiente término es 540.' },
    ],
    pistas: {
      planificar: 'Calcula cuánto baja de un término al siguiente.',
      hacer: '660 − 540 = 120. 540 − 420 = 120.',
    },
    solucion: { texto: 'Cada término se obtiene restando 120.' },
    comprobar: '180 − 120 = 60, el último. ✓',
    origen: 'Ensayo 2, pregunta 30',
  },
  {
    id: 'pa-personas',
    tema: 'patrones',
    tipo: 'numero',
    enunciado: 'Observa cómo aumentan las personas en cada lugar. {{¿Cuántas personas habrá en el 5° lugar?}}',
    visual: {
      tipo: 'etapas',
      icono: 'persona',
      etapas: [
        { etiqueta: '1° lugar', cantidad: 1 },
        { etiqueta: '2° lugar', cantidad: 2 },
        { etiqueta: '3° lugar', cantidad: 4 },
        { etiqueta: '4° lugar', cantidad: 8, porFila: 4 },
        { etiqueta: '5° lugar', cantidad: null },
      ],
    },
    respuesta: 16,
    unidad: 'personas',
    errores: {
      10: 'Sumaste 2. Mira bien: 1, 2, 4, 8. De 4 a 8 no se suman 2.',
      12: 'Sumaste 4 (8 + 4). Mira cómo cambia: cada lugar tiene el doble de personas que el anterior.',
      9: 'Sumaste 1. Mira: de 4 a 8 se duplica.',
    },
    pistas: {
      planificar: 'Cuenta las personas de cada lugar: 1, 2, 4, 8. ¿Cuál es la regla?',
      hacer: 'Cada lugar tiene el doble del anterior: 1 × 2 = 2, 2 × 2 = 4, 4 × 2 = 8.',
    },
    solucion: { texto: '8 × 2 = 16 personas.' },
    comprobar: '1, 2, 4, 8, 16: cada número es el doble del anterior. ✓',
    origen: 'PPT Patrones y Álgebra, ejercicio 11',
  },

  // ---------------- Ecuaciones e inecuaciones ----------------
  {
    id: 'ec-balanza',
    tema: 'ecuaciones',
    tipo: 'balanza',
    enunciado: 'Busca el valor de □ en [[□ + 44 = 61]]. {{Cambia el número de la caja hasta que la balanza quede en equilibrio.}}',
    suma: 44,
    derecha: 61,
    relacion: '=',
    maximo: 100,
    errores: {
      otro: 'Con □ = {valor} la balanza no está en equilibrio. Mira hacia dónde se inclina: si baja la izquierda, la caja pesa demasiado.',
    },
    pistas: {
      planificar: '¿Qué número sumado a 44 da 61? Puedes contar desde 44 hasta 61.',
      hacer: 'También puedes usar la resta: 61 − 44.',
    },
    solucion: { texto: '□ = 17, porque 17 + 44 = 61.' },
    comprobar: 'Con □ = 17 la balanza queda en equilibrio. ✓',
    origen: 'PPT Patrones y Álgebra, ejercicio 3',
  },
  {
    id: 'ec-signo-igual',
    tema: 'ecuaciones',
    tipo: 'alternativas',
    enunciado: 'Observa la ecuación **7 + x = 15**. {{¿Qué valor debe tener x para que se cumpla?}}',
    visual: { tipo: 'balanza', izquierda: [{ tipo: 'pesa', valor: '7' }, { tipo: 'caja', texto: 'x' }], derecha: [{ tipo: 'pesa', valor: '15' }] },
    opciones: [
      { texto: '8', correcta: true },
      { texto: '15', error: 'El signo = no significa «aquí va el resultado»: significa que los dos lados valen lo mismo. Si x fuera 15, el lado izquierdo valdría 22.' },
      { texto: '22', error: 'Sumaste 7 + 15. Busca qué número sumado a 7 da 15.' },
      { texto: '7', error: 'Si x fuera 7, quedaría 7 + 7 = 14, no 15.' },
    ],
    pistas: {
      planificar: 'Piensa en la balanza: los dos lados tienen que pesar lo mismo.',
      hacer: '¿7 más qué número da 15? Puedes calcular 15 − 7.',
    },
    solucion: { texto: 'x = 8, porque 7 + 8 = 15.' },
    comprobar: '7 + 8 = 15. ✓',
    explicar: {
      pregunta: '¿Qué significa el signo = en 7 + x = 15?',
      opciones: [
        { texto: 'Que los dos lados valen lo mismo', correcta: true, porque: 'Por eso la balanza queda en equilibrio.' },
        { texto: 'Que después viene el resultado', porque: 'El = no solo anuncia un resultado: dice que los dos lados son iguales.' },
      ],
    },
    origen: 'Aprendiendo de los errores, ejemplo 12',
  },
  {
    id: 'ec-menor',
    tema: 'ecuaciones',
    tipo: 'balanza',
    enunciado: 'Busca un valor de □ que cumpla [[□ + 12 < 25]]. {{El lado izquierdo tiene que pesar **menos** que el derecho.}}',
    suma: 12,
    derecha: 25,
    relacion: '<',
    maximo: 40,
    errores: {
      igual: 'Con 13 la balanza queda en equilibrio: 13 + 12 = 25. Pero el signo < pide que el lado izquierdo pese **menos**. Prueba con un número más chico.',
      otro: 'Con □ = {valor}, el lado izquierdo pesa más que 25. Prueba con un número más chico.',
    },
    pistas: {
      planificar: 'Primero busca el número que deja la balanza en equilibrio.',
      hacer: '13 + 12 = 25. Para que pese menos, □ tiene que ser menor que 13.',
    },
    solucion: { texto: 'Sirve cualquier número menor que 13: 0, 1, 2... hasta 12.' },
    comprobar: 'Por ejemplo, 10 + 12 = 22, y 22 < 25. ✓',
    origen: 'Aprendiendo de los errores, ejemplo 11',
  },
  {
    id: 'ec-mayor',
    tema: 'ecuaciones',
    tipo: 'alternativas',
    enunciado: `{{¿Qué número hace verdadera esta oración?}} **□ + 250 > ${f(1000)}**`,
    opciones: [
      { texto: '759', correcta: true },
      { texto: '750', error: `750 + 250 = ${f(1000)}. Eso es igual, y la oración pide mayor.` },
      { texto: '748', error: `748 + 250 = 998: es menor que ${f(1000)}.` },
      { texto: '250', error: `250 + 250 = 500: es mucho menor que ${f(1000)}.` },
    ],
    pistas: {
      planificar: `Busca primero el número que da exactamente ${f(1000)}.`,
      hacer: `750 + 250 = ${f(1000)}. Para que sea mayor, □ tiene que ser más que 750.`,
    },
    solucion: { texto: `759 + 250 = ${f(1009)}, y ${f(1009)} > ${f(1000)}.` },
    comprobar: 'Cualquier número mayor que 750 hace verdadera la oración. ✓',
    origen: 'PPT Patrones y Álgebra, ejercicio 9 (se cambió una alternativa: 752 y 759 eran correctas)',
  },
  {
    id: 'ec-resta',
    tema: 'ecuaciones',
    tipo: 'alternativas',
    enunciado: 'Observa: **□ − 500 = 150**. {{¿Qué valor debe tener □?}}',
    opciones: [
      { texto: '650', correcta: true },
      { texto: '350', error: 'Restaste 500 − 150. Si a □ le quitas 500 y quedan 150, □ tiene que ser más grande que 500.' },
      { texto: '150', error: 'Si □ fuera 150, no podrías quitarle 500.' },
      { texto: '600', error: '600 − 500 = 100, no 150.' },
    ],
    pistas: {
      planificar: 'La resta y la suma son operaciones inversas: una deshace a la otra.',
      hacer: 'Si quitas 500 y quedan 150, antes había 150 + 500.',
    },
    solucion: { texto: '□ = 650, porque 650 − 500 = 150.' },
    comprobar: '650 − 500 = 150. ✓',
    origen: 'PPT Patrones y Álgebra, ejercicio 13',
  },
  {
    id: 'ec-figuras',
    tema: 'ecuaciones',
    tipo: 'alternativas',
    enunciado: 'Cada figura representa siempre el mismo número: **● + ▲ = 11** y **▲ × ▲ = 9**. {{¿Cuál es el valor de ●?}}',
    opciones: [
      { texto: '8', correcta: true },
      { texto: '3', error: '3 es el valor de ▲. La pregunta es por ●.' },
      { texto: '2', error: 'Si ● fuera 2, quedaría 2 + 3 = 5, no 11.' },
      { texto: '9', error: '9 es el resultado de ▲ × ▲. Primero averigua cuánto vale ▲.' },
    ],
    pistas: {
      planificar: 'Empieza por la ecuación que tiene una sola figura repetida: ▲ × ▲ = 9.',
      hacer: '3 × 3 = 9, así que ▲ = 3. Después: ● + 3 = 11.',
    },
    solucion: { texto: '● = 8, porque 8 + 3 = 11.' },
    comprobar: '8 + 3 = 11 y 3 × 3 = 9. ✓',
    origen: 'PPT Patrones y Álgebra, ejercicio 8; Ensayo 2, pregunta 18',
  },
  {
    id: 'ec-bolitas',
    tema: 'ecuaciones',
    tipo: 'alternativas',
    enunciado: 'La balanza está en equilibrio. Cada bolita pesa [[1 kilo]]. {{¿Cuánto pesa la caja X?}}',
    visual: { tipo: 'balanza', izquierda: [{ tipo: 'caja', texto: 'X' }, { tipo: 'bolitas', n: 3 }], derecha: [{ tipo: 'bolitas', n: 7 }] },
    opciones: [
      { texto: '4 kilos', correcta: true },
      { texto: '7 kilos', error: '7 kilos pesa todo el lado derecho. Junto a la caja hay 3 bolitas que también pesan.' },
      { texto: '10 kilos', error: 'Sumaste 7 + 3. La caja y las 3 bolitas juntas pesan lo mismo que 7 bolitas.' },
      { texto: '3 kilos', error: '3 kilos pesan las bolitas que están junto a la caja, no la caja.' },
    ],
    pistas: {
      planificar: 'Si sacas 3 bolitas de cada lado, la balanza sigue en equilibrio.',
      hacer: 'Quedan la caja sola a la izquierda y 4 bolitas a la derecha.',
    },
    solucion: { texto: 'La caja pesa 4 kilos.' },
    comprobar: '4 + 3 = 7. ✓',
    origen: 'PPT Patrones y Álgebra, ejercicio 5',
  },
];
