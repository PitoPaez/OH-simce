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
  // =========================================================
  // ---------- Números y operaciones (10 ejercicios) ----------
  // =========================================================
  {
    "id": "num-resta",
    "eje": "numeros",
    "tema": "suma-resta",
    "tipo": "restaColumnas",
    "enunciado": "Matías tenía un frasco con [[324 canicas]] y regaló [[158]] a su hermana. {{¿Cuántas canicas le quedan en el frasco?}}",
    "minuendo": 324,
    "sustraendo": 158,
    "columnas": ["C", "D", "U"],
    "errores": {
      "signo-suma": "Matías regaló canicas a su hermana, así que ahora le quedan menos. La operación debe ser una resta (−). ¡Toca el signo + para cambiarlo a −!",
      "orden-invertido": "En la resta, el total inicial de canicas (el número mayor: 324) se coloca arriba, y la cantidad que regaló (158) se coloca abajo.",
      "234": "En cada columna restaste el número menor al mayor (8 − 4 = 4). En la resta siempre es el de arriba menos el de abajo. Si arriba no alcanza, ¡pide prestado a la columna de al lado!",
      "176": "Pediste prestado en las unidades, pero olvidaste descontar en las decenas: las 2 decenas quedaron en 1 al prestar (1 − 5 necesita pedir prestado a las centenas).",
      "482": "Sumaste los números. Recuerda que Matías regaló canicas a su hermana, así que ahora le quedan menos en el frasco.",
      "otro": "Revisa tu cálculo columna por columna empezando por las unidades (U). Recuerda pedir prestado cuando el número de arriba es menor que el de abajo."
    },
    "pistas": [
      "Si regaló canicas, ¿tiene más o menos que antes? Eso te dice que hay que restar.",
      "Calcula 324 − 158. Empieza por las unidades: a 4 no le puedes quitar 8, así que pide 1 decena prestada (canje)."
    ],
    "solucion": "324 − 158 = 166. Le quedan 166 canicas en el frasco. Comprueba: 166 + 158 = 324."
  },
  {
    "id": "vp-alicia",
    "eje": "numeros",
    "tema": "valor-posicional",
    "tipo": "arrastrarPosicional",
    "enunciado": "El número de la casa de Alicia se forma con [[7 decenas]], [[5 unidades]] y [[2 centenas]]. {{¿Cuál es el número de la casa de Alicia?}}",
    "columnas": ["C", "D", "U"],
    "disponibles": [7, 5, 6, 2, 9, 8],
    "solucionPosicional": [2, 7, 5],
    "errores": {
      "752": "Escribiste las cifras en el orden en que aparecen en el texto: 7, 5 y 2. Pero el orden en la tabla lo da el valor: ¿cuántas centenas hay? Esa cifra va en la C.",
      "257": "El 5 y el 7 quedaron cambiados. ¿Cuál es la cifra de las decenas: el 7 o el 5?",
      "527": "Las unidades van al final a la derecha en la U. ¿Qué cifra va en las centenas (C)?",
      "otro": "Revisa qué número representa las centenas (C), cuál las decenas (D) y cuál las unidades (U)."
    },
    "pistas": [
      "Usa la tabla con C, D y U, y pon cada cifra en su columna.",
      "2 centenas van en la C, 7 decenas en la D y 5 unidades en la U."
    ],
    "solucion": "2 centenas, 7 decenas y 5 unidades forman el 275."
  },
  {
    "id": "num-multiplicacion",
    "eje": "numeros",
    "enunciado": "En la sala hay 6 cajas y cada caja tiene 8 lápices. ¿Cuántos lápices hay en total?",
    "visual": {
      "tipo": "arreglo",
      "filas": 6,
      "columnas": 8
    },
    "opciones": [
      {
        "texto": "48",
        "correcta": true
      },
      {
        "texto": "14",
        "feedback": "Sumaste 6 + 8. Pero son 6 grupos de 8 lápices cada uno, así que hay que juntar 8 seis veces."
      },
      {
        "texto": "42",
        "feedback": "Ese es 6 × 7. Cada caja tiene 8 lápices, no 7. Cuenta una fila del dibujo."
      },
      {
        "texto": "56",
        "feedback": "Ese es 7 × 8. Revisa cuántas cajas hay: son 6 filas en el dibujo."
      }
    ],
    "pistas": [
      "Cada fila del dibujo es una caja. ¿Cuántas filas hay y cuántos puntos tiene cada una?",
      "Puedes sumar 8 + 8 + 8 + 8 + 8 + 8, o calcular 6 × 8."
    ],
    "solucion": "6 cajas × 8 lápices = 48 lápices."
  },
  {
    "id": "num-fraccion",
    "eje": "numeros",
    "enunciado": "Una pizza se cortó en 8 partes iguales y la familia se comió 3. ¿Qué fracción de la pizza se comieron?",
    "visual": {
      "tipo": "fraccion",
      "partes": 8,
      "pintadas": 3
    },
    "opciones": [
      {
        "texto": "3/8",
        "correcta": true
      },
      {
        "texto": "5/8",
        "feedback": "5/8 es la parte que quedó en la caja. La pregunta es por lo que se comieron."
      },
      {
        "texto": "3/5",
        "feedback": "Comparaste lo que se comieron con lo que quedó. El número de abajo tiene que ser el total de partes."
      },
      {
        "texto": "8/3",
        "feedback": "Los números están al revés. Abajo va el total de partes y arriba las partes que se comieron."
      }
    ],
    "pistas": [
      "El número de abajo de una fracción dice en cuántas partes iguales se dividió el entero.",
      "Cuenta las partes pintadas: esas van arriba."
    ],
    "solucion": "Se comieron 3 de 8 partes iguales: 3/8."
  },
  {
    "id": "sr-bolitas",
    "eje": "numeros",
    "enunciado": "Marcia tiene 112 bolitas rojas, 43 amarillas y 103 azules. ¿Cuántas bolitas tiene en total?",
    "opciones": [
      {
        "texto": "258",
        "correcta": true
      },
      {
        "texto": "645",
        "feedback": "Te dio 645 porque pusiste el 43 corrido a la izquierda, como si fuera 430. Alinea las cifras por la derecha: unidades con unidades."
      },
      {
        "texto": "155",
        "feedback": "Sumaste solo las rojas y las amarillas. Faltan las 103 azules."
      },
      {
        "texto": "268",
        "feedback": "Revisa las decenas: 1 + 4 + 0 = 5, no 6."
      }
    ],
    "pistas": [
      "Escribe los tres números en columnas, alineados por la derecha.",
      "Unidades: 2 + 3 + 3 = 8. Decenas: 1 + 4 + 0 = 5. Centenas: 1 + 0 + 1 = 2."
    ],
    "solucion": "112 + 43 + 103 = 258 bolitas. Estima: 110 + 40 + 100 = 250. 258 está cerca. ✓"
  },
  {
    "id": "sr-zoologico",
    "eje": "numeros",
    "enunciado": "Al zoológico fueron 824 estudiantes entre lunes, martes y miércoles. El lunes y el martes fue la misma cantidad, y el miércoles fueron 220. ¿Cuántos estudiantes fueron el lunes y cuántos el martes?",
    "visual": {
      "tipo": "barras",
      "total": {
        "valor": "824"
      },
      "partes": [
        {
          "valor": "?",
          "peso": 302,
          "incognita": true,
          "etiqueta": "lunes"
        },
        {
          "valor": "?",
          "peso": 302,
          "incognita": true,
          "etiqueta": "martes"
        },
        {
          "valor": "220",
          "peso": 220,
          "etiqueta": "miércoles"
        }
      ]
    },
    "opciones": [
      {
        "texto": "302 el lunes y 302 el martes",
        "correcta": true
      },
      {
        "texto": "110 el lunes y 110 el martes",
        "feedback": "Repartiste los 220 del miércoles. Lo que hay que repartir es lo que queda después de quitar el miércoles."
      },
      {
        "texto": "300 el lunes y 250 el martes",
        "feedback": "El lunes y el martes fue la misma cantidad: los dos números tienen que ser iguales."
      },
      {
        "texto": "604 el lunes y 604 el martes",
        "feedback": "604 son el lunes y el martes juntos. Falta repartirlos en dos partes iguales."
      }
    ],
    "pistas": [
      "Mira el modelo de barras: quita el miércoles del total y reparte lo que queda en dos partes iguales.",
      "824 − 220 = 604. Después, 604 : 2."
    ],
    "solucion": "604 : 2 = 302. Fueron 302 el lunes y 302 el martes. 302 + 302 + 220 = 824. ✓"
  },
  {
    "id": "mu-circulos",
    "eje": "numeros",
    "enunciado": "Observa los círculos. ¿Cuál de estos cálculos no sirve para contarlos?",
    "visual": {
      "tipo": "arreglo",
      "filas": 3,
      "columnas": 6
    },
    "opciones": [
      {
        "texto": "6 + 3",
        "correcta": true
      },
      {
        "texto": "3 × 6",
        "feedback": "3 × 6 sí sirve: son 3 filas de 6 círculos. Busca el cálculo que no da 18."
      },
      {
        "texto": "6 + 6 + 6",
        "feedback": "6 + 6 + 6 sí sirve: suma las 3 filas. Busca el cálculo que no da 18."
      },
      {
        "texto": "3 + 3 + 3 + 3 + 3 + 3",
        "feedback": "Este también sirve: son 6 columnas de 3 círculos. Busca el cálculo que no da 18."
      }
    ],
    "pistas": [
      "Cuenta cuántos círculos hay. Después calcula cada alternativa.",
      "Hay 3 filas de 6: 18 círculos. Ahora fíjate cuánto da 6 + 3."
    ],
    "solucion": "6 + 3 = 9, y los círculos son 18. Ese cálculo no sirve. Los otros tres cálculos dan 18. ✓"
  },
  {
    "id": "di-arboles",
    "eje": "numeros",
    "enunciado": "Marcela y cinco amigas plantarán 30 árboles en un parque. Cada una plantará la misma cantidad. ¿Cuántos árboles plantará cada una?",
    "opciones": [
      {
        "texto": "5",
        "correcta": true
      },
      {
        "texto": "6",
        "feedback": "Dividiste por 5, pero Marcela también planta: son ella y cinco amigas, 6 personas."
      },
      {
        "texto": "25",
        "feedback": "Restaste 30 − 5. Repartir en partes iguales es dividir."
      },
      {
        "texto": "10",
        "feedback": "Con 10 árboles cada una, 6 personas plantarían 60 árboles, no 30."
      }
    ],
    "pistas": [
      "Reparte 30 árboles entre 6 personas.",
      "¿Qué número por 6 da 30?"
    ],
    "solucion": "30 : 6 = 5 árboles cada una. 6 × 5 = 30. ✓"
  },
  {
    "id": "di-306",
    "eje": "numeros",
    "enunciado": "¿Cuál es el resultado de 306 : 3?",
    "opciones": [
      {
        "texto": "102",
        "correcta": true
      },
      {
        "texto": "12",
        "feedback": "Te saltaste el 0. 3 centenas : 3 = 1 centena. 0 decenas : 3 = 0 decenas, y ese 0 hay que escribirlo."
      },
      {
        "texto": "106",
        "feedback": "6 : 3 no da 6. ¿Qué número por 3 da 6?"
      },
      {
        "texto": "918",
        "feedback": "Multiplicaste por 3. El signo : significa dividir."
      }
    ],
    "pistas": [
      "Divide cada posición por 3: centenas, decenas y unidades.",
      "300 : 3 = 100. 0 : 3 = 0. 6 : 3 = 2."
    ],
    "solucion": "306 : 3 = 102. 102 × 3 = 306. ✓"
  },
  {
    "id": "fr-galletas",
    "eje": "numeros",
    "enunciado": "Josefa horneó 10 galletas y regaló 4. ¿Qué fracción de las galletas regaló?",
    "opciones": [
      {
        "texto": "4/10",
        "correcta": true
      },
      {
        "texto": "10/4",
        "feedback": "Pusiste arriba el número que apareció primero. Abajo va el total (10) y arriba las que regaló (4)."
      },
      {
        "texto": "6/10",
        "feedback": "6/10 son las galletas que no regaló."
      },
      {
        "texto": "4/6",
        "feedback": "Abajo va el total de galletas, no las que le quedaron."
      }
    ],
    "pistas": [
      "¿Cuál es el total de galletas? Ese número va abajo.",
      "El total es 10. Regaló 4: ese número va arriba."
    ],
    "solucion": "Regaló 4/10 de las galletas. Regaló 4 y le quedaron 6: 4 + 6 = 10. ✓"
  },
  // =========================================================
  // ---------- Patrones y álgebra (10 ejercicios) ----------
  // =========================================================
  {
    "id": "pat-secuencia",
    "eje": "patrones",
    "enunciado": "¿Qué número falta en la secuencia? 7, 11, 15, ___, 23",
    "visual": {
      "tipo": "recta",
      "valores": [
        7,
        11,
        15,
        null,
        23
      ]
    },
    "opciones": [
      {
        "texto": "19",
        "correcta": true
      },
      {
        "texto": "17",
        "feedback": "Sumaste 2. Mira cuánto aumenta de 7 a 11: el salto es más grande."
      },
      {
        "texto": "16",
        "feedback": "Sumaste 1 al 15. Revisa cuánto crece la secuencia en cada salto."
      },
      {
        "texto": "22",
        "feedback": "Le restaste 1 al 23. El número tiene que seguir el mismo patrón que los demás."
      }
    ],
    "pistas": [
      "¿Cuánto hay que sumar para pasar de 7 a 11? ¿Y de 11 a 15?",
      "Siempre se suma 4. Calcula 15 + 4 y revisa que al sumar 4 otra vez llegues a 23."
    ],
    "solucion": "La regla es sumar 4: 15 + 4 = 19, y 19 + 4 = 23."
  },
  {
    "id": "pat-ecuacion",
    "eje": "patrones",
    "enunciado": "¿Qué número va en el cuadrado para que la balanza quede en equilibrio?",
    "visual": {
      "tipo": "balanza",
      "izquierda": "□ + 25",
      "derecha": "60"
    },
    "opciones": [
      {
        "texto": "35",
        "correcta": true
      },
      {
        "texto": "85",
        "feedback": "Sumaste 60 + 25. Pero si pones 85 en el cuadrado, el lado izquierdo pesaría 110."
      },
      {
        "texto": "45",
        "feedback": "Revisa la resta 60 − 25: a 0 unidades no le puedes quitar 5 sin pedir prestado."
      },
      {
        "texto": "25",
        "feedback": "Copiaste el número que ya estaba. Comprueba: 25 + 25 = 50, no 60."
      }
    ],
    "pistas": [
      "Los dos lados tienen que valer lo mismo. ¿Qué número le sumas a 25 para llegar a 60?",
      "Puedes calcular 60 − 25, o contar desde 25 hasta 60."
    ],
    "solucion": "60 − 25 = 35. Comprueba: 35 + 25 = 60."
  },
  {
    "id": "pa-regla",
    "eje": "patrones",
    "enunciado": "Noemí escribió esta secuencia. ¿Qué regla sigue?",
    "visual": {
      "tipo": "secuencia",
      "valores": [
        640,
        320,
        160,
        80,
        40,
        20,
        10
      ]
    },
    "opciones": [
      {
        "texto": "Dividir por 2 cada término",
        "correcta": true
      },
      {
        "texto": "Restar 320 a cada término",
        "feedback": "Restar 320 solo funciona en el primer salto: 320 − 320 = 0, no 160. Una regla tiene que servir en todos los saltos."
      },
      {
        "texto": "Sumar 160 a cada término",
        "feedback": "La secuencia va bajando: no puede ser sumando."
      },
      {
        "texto": "Multiplicar por 2 cada término",
        "feedback": "Multiplicar por 2 agranda los números, y aquí van bajando."
      }
    ],
    "pistas": [
      "Prueba cada regla en todos los saltos, no solo en el primero.",
      "640 : 2 = 320. 320 : 2 = 160. 160 : 2 = 80..."
    ],
    "solucion": "Cada término es la mitad del anterior: se divide por 2. 20 : 2 = 10, el último término. ✓"
  },
  {
    "id": "pa-recta",
    "eje": "patrones",
    "enunciado": "¿Qué par de números completa la recta numérica?",
    "visual": {
      "tipo": "recta",
      "inicio": 925,
      "fin": 1100,
      "paso": 25,
      "etiquetas": "todas",
      "cajas": [
        950,
        1000
      ]
    },
    "opciones": [
      {
        "texto": "950 y 1 000",
        "correcta": true
      },
      {
        "texto": "955 y 1 005",
        "feedback": "Sumaste 30 en cada salto. Mira dos números seguidos que conozcas, como 1 050 y 1 075: el salto es 25."
      },
      {
        "texto": "955 y 1 000",
        "feedback": "El primero no calza: 925 + 25 = 950."
      },
      {
        "texto": "950 y 1 005",
        "feedback": "El segundo no calza: 975 + 25 = 1 000."
      }
    ],
    "pistas": [
      "Busca dos números seguidos que conozcas para saber de cuánto es cada salto.",
      "1 025, 1 050, 1 075: los saltos son de 25."
    ],
    "solucion": "925 + 25 = 950 y 975 + 25 = 1 000. 1 000 + 25 = 1 025, que es el número siguiente. ✓"
  },
  {
    "id": "pa-restando",
    "eje": "patrones",
    "enunciado": "La secuencia empieza en 660. ¿Cómo se obtienen los demás términos?",
    "visual": {
      "tipo": "secuencia",
      "valores": [
        660,
        540,
        420,
        300,
        180,
        60
      ]
    },
    "opciones": [
      {
        "texto": "Restando 120",
        "correcta": true
      },
      {
        "texto": "Sumando 120",
        "feedback": "La secuencia va bajando: no puede ser sumando."
      },
      {
        "texto": "Restando 20",
        "feedback": "Mira también las centenas: de 660 a 540 bajan 120, no 20."
      },
      {
        "texto": "Restando 100",
        "feedback": "660 − 100 = 560, y el siguiente término es 540."
      }
    ],
    "pistas": [
      "Calcula cuánto baja de un término al siguiente.",
      "660 − 540 = 120. 540 − 420 = 120."
    ],
    "solucion": "Cada término se obtiene restando 120. 180 − 120 = 60, el último. ✓"
  },
  {
    "id": "ec-signo-igual",
    "eje": "patrones",
    "enunciado": "Observa la ecuación 7 + x = 15. ¿Qué valor debe tener x para que se cumpla?",
    "visual": {
      "tipo": "balanza",
      "izquierda": [
        {
          "tipo": "pesa",
          "valor": "7"
        },
        {
          "tipo": "caja",
          "texto": "x"
        }
      ],
      "derecha": [
        {
          "tipo": "pesa",
          "valor": "15"
        }
      ]
    },
    "opciones": [
      {
        "texto": "8",
        "correcta": true
      },
      {
        "texto": "15",
        "feedback": "El signo = no significa «aquí va el resultado»: significa que los dos lados valen lo mismo. Si x fuera 15, el lado izquierdo valdría 22."
      },
      {
        "texto": "22",
        "feedback": "Sumaste 7 + 15. Busca qué número sumado a 7 da 15."
      },
      {
        "texto": "7",
        "feedback": "Si x fuera 7, quedaría 7 + 7 = 14, no 15."
      }
    ],
    "pistas": [
      "Piensa en la balanza: los dos lados tienen que pesar lo mismo.",
      "¿7 más qué número da 15? Puedes calcular 15 − 7."
    ],
    "solucion": "x = 8, porque 7 + 8 = 15. 7 + 8 = 15. ✓"
  },
  {
    "id": "ec-mayor",
    "eje": "patrones",
    "enunciado": "¿Qué número hace verdadera esta oración? □ + 250 > 1 000",
    "opciones": [
      {
        "texto": "759",
        "correcta": true
      },
      {
        "texto": "750",
        "feedback": "750 + 250 = 1 000. Eso es igual, y la oración pide mayor."
      },
      {
        "texto": "748",
        "feedback": "748 + 250 = 998: es menor que 1 000."
      },
      {
        "texto": "250",
        "feedback": "250 + 250 = 500: es mucho menor que 1 000."
      }
    ],
    "pistas": [
      "Busca primero el número que da exactamente 1 000.",
      "750 + 250 = 1 000. Para que sea mayor, □ tiene que ser más que 750."
    ],
    "solucion": "759 + 250 = 1 009, y 1 009 > 1 000. Cualquier número mayor que 750 hace verdadera la oración. ✓"
  },
  {
    "id": "ec-resta",
    "eje": "patrones",
    "enunciado": "Observa: □ − 500 = 150. ¿Qué valor debe tener □?",
    "opciones": [
      {
        "texto": "650",
        "correcta": true
      },
      {
        "texto": "350",
        "feedback": "Restaste 500 − 150. Si a □ le quitas 500 y quedan 150, □ tiene que ser más grande que 500."
      },
      {
        "texto": "150",
        "feedback": "Si □ fuera 150, no podrías quitarle 500."
      },
      {
        "texto": "600",
        "feedback": "600 − 500 = 100, no 150."
      }
    ],
    "pistas": [
      "La resta y la suma son operaciones inversas: una deshace a la otra.",
      "Si quitas 500 y quedan 150, antes había 150 + 500."
    ],
    "solucion": "□ = 650, porque 650 − 500 = 150. 650 − 500 = 150. ✓"
  },
  {
    "id": "ec-figuras",
    "eje": "patrones",
    "enunciado": "Cada figura representa siempre el mismo número: ● + ▲ = 11 y ▲ × ▲ = 9. ¿Cuál es el valor de ●?",
    "opciones": [
      {
        "texto": "8",
        "correcta": true
      },
      {
        "texto": "3",
        "feedback": "3 es el valor de ▲. La pregunta es por ●."
      },
      {
        "texto": "2",
        "feedback": "Si ● fuera 2, quedaría 2 + 3 = 5, no 11."
      },
      {
        "texto": "9",
        "feedback": "9 es el resultado de ▲ × ▲. Primero averigua cuánto vale ▲."
      }
    ],
    "pistas": [
      "Empieza por la ecuación que tiene una sola figura repetida: ▲ × ▲ = 9.",
      "3 × 3 = 9, así que ▲ = 3. Después: ● + 3 = 11."
    ],
    "solucion": "● = 8, porque 8 + 3 = 11. 8 + 3 = 11 y 3 × 3 = 9. ✓"
  },
  {
    "id": "ec-bolitas",
    "eje": "patrones",
    "enunciado": "La balanza está en equilibrio. Cada bolita pesa 1 kilo. ¿Cuánto pesa la caja X?",
    "visual": {
      "tipo": "balanza",
      "izquierda": [
        {
          "tipo": "caja",
          "texto": "X"
        },
        {
          "tipo": "bolitas",
          "n": 3
        }
      ],
      "derecha": [
        {
          "tipo": "bolitas",
          "n": 7
        }
      ]
    },
    "opciones": [
      {
        "texto": "4 kilos",
        "correcta": true
      },
      {
        "texto": "7 kilos",
        "feedback": "7 kilos pesa todo el lado derecho. Junto a la caja hay 3 bolitas que también pesan."
      },
      {
        "texto": "10 kilos",
        "feedback": "Sumaste 7 + 3. La caja y las 3 bolitas juntas pesan lo mismo que 7 bolitas."
      },
      {
        "texto": "3 kilos",
        "feedback": "3 kilos pesan las bolitas que están junto a la caja, no la caja."
      }
    ],
    "pistas": [
      "Si sacas 3 bolitas de cada lado, la balanza sigue en equilibrio.",
      "Quedan la caja sola a la izquierda y 4 bolitas a la derecha."
    ],
    "solucion": "La caja pesa 4 kilos. 4 + 3 = 7. ✓"
  },
  // =========================================================
  // ---------- Geometría (10 ejercicios) ----------
  // =========================================================
  {
    "id": "geo-cubo",
    "eje": "geometria",
    "enunciado": "¿Cuántas caras tiene un cubo?",
    "visual": {
      "tipo": "cubo"
    },
    "opciones": [
      {
        "texto": "6",
        "correcta": true
      },
      {
        "texto": "8",
        "feedback": "Contaste los vértices, que son las esquinas. Las caras son los cuadrados planos."
      },
      {
        "texto": "12",
        "feedback": "Contaste las aristas, que son los bordes. Las caras son los cuadrados planos."
      },
      {
        "texto": "4",
        "feedback": "En el dibujo no se ven todas las caras. Piensa en un dado: también tiene cara arriba, abajo y atrás."
      }
    ],
    "pistas": [
      "Piensa en un dado: ¿cuántos números distintos tiene?",
      "Cuenta: arriba, abajo, adelante, atrás, izquierda y derecha."
    ],
    "solucion": "Un cubo tiene 6 caras cuadradas, como un dado."
  },
  {
    "id": "geo-coordenadas",
    "eje": "geometria",
    "enunciado": "En el mapa, ¿en qué posición está la estrella?",
    "visual": {
      "tipo": "coordenadas",
      "columna": "D",
      "fila": 2
    },
    "opciones": [
      {
        "texto": "D2",
        "correcta": true
      },
      {
        "texto": "D4",
        "feedback": "Contaste las filas desde arriba. En este mapa los números empiezan en 1 abajo."
      },
      {
        "texto": "B4",
        "feedback": "Intercambiaste la letra y el número. La letra dice la columna y el número dice la fila."
      },
      {
        "texto": "C2",
        "feedback": "La fila está bien, pero revisa la columna: sigue la estrella hacia abajo hasta la letra."
      }
    ],
    "pistas": [
      "Baja con el dedo desde la estrella hasta las letras. Esa es la columna.",
      "Ahora ve desde la estrella hacia la izquierda hasta los números. Esa es la fila."
    ],
    "solucion": "La estrella está en la columna D y en la fila 2: D2."
  },
  {
    "id": "ub-sala",
    "eje": "geometria",
    "enunciado": "Las sillas tienen los nombres de quienes se sientan en ellas. ¿Quién se sienta a la izquierda de Natalia?",
    "visual": {
      "tipo": "sala",
      "filas": [
        [
          "María",
          "Hugo",
          "Felipe"
        ],
        [
          "Carmen",
          "Natalia",
          "Daniel"
        ]
      ]
    },
    "opciones": [
      {
        "texto": "Carmen",
        "correcta": true
      },
      {
        "texto": "Daniel",
        "feedback": "Daniel está a la derecha de Natalia. Imagina que estás sentado en el puesto de Natalia, mirando la pizarra: ¿quién queda al lado de tu mano izquierda?"
      },
      {
        "texto": "Hugo",
        "feedback": "Hugo está adelante de Natalia, no a su lado."
      },
      {
        "texto": "María",
        "feedback": "María está adelante, en la otra fila. Busca a quién tiene Natalia justo al lado."
      }
    ],
    "pistas": [
      "Busca a quiénes tiene justo al lado.",
      "A un lado tiene a Carmen y al otro a Daniel. ¿Cuál queda hacia tu mano izquierda?"
    ],
    "solucion": "Carmen se sienta a la izquierda de Natalia. Daniel queda a la derecha de Natalia. ✓"
  },
  {
    "id": "ub-plano",
    "eje": "geometria",
    "enunciado": "Observa el punto A en el plano. ¿Qué movimiento lleva el punto A al lugar (8, 5)?",
    "visual": {
      "tipo": "plano",
      "max": 10,
      "puntos": [
        {
          "x": 2,
          "y": 2,
          "etiqueta": "A"
        }
      ]
    },
    "opciones": [
      {
        "texto": "6 a la derecha y 3 hacia arriba",
        "correcta": true
      },
      {
        "texto": "7 a la derecha y 4 hacia arriba",
        "feedback": "Contaste las marcas, incluida la de partida. Hay que contar los saltos: de 2 a 8 hay 6."
      },
      {
        "texto": "3 a la derecha y 6 hacia arriba",
        "feedback": "Cambiaste los movimientos. El primer número (8) se busca en el eje de abajo: de 2 a 8 hacia la derecha."
      },
      {
        "texto": "8 a la derecha y 5 hacia arriba",
        "feedback": "Así llegarías a (10, 7). (8, 5) es el lugar de llegada, no cuánto hay que moverse."
      }
    ],
    "pistas": [
      "El primer número dice dónde llegar en el eje de abajo, y el segundo, en el eje del costado.",
      "A está en (2, 2). De 2 a 8 hay 6 saltos. De 2 a 5 hay 3 saltos."
    ],
    "solucion": "6 a la derecha y 3 hacia arriba. 2 + 6 = 8 y 2 + 3 = 5. ✓"
  },
  {
    "id": "cu-piramide",
    "eje": "geometria",
    "enunciado": "¿Cuáles son todas las caras de esta pirámide?",
    "visual": {
      "tipo": "cuerpo",
      "forma": "piramide"
    },
    "opciones": [
      {
        "texto": "1 cuadrado y 4 triángulos",
        "correcta": true
      },
      {
        "texto": "4 triángulos",
        "feedback": "Contaste solo las caras de los lados. La pirámide también tiene una cara abajo: la base."
      },
      {
        "texto": "1 cuadrado y 4 rectángulos",
        "feedback": "Las caras de los lados se juntan en una punta arriba: son triángulos, no rectángulos."
      },
      {
        "texto": "5 triángulos",
        "feedback": "La base de esta pirámide no es un triángulo: es un cuadrado."
      }
    ],
    "pistas": [
      "Cuenta las caras de los lados y después mira la base, la cara de abajo.",
      "Hay 4 caras laterales con forma de triángulo y una base cuadrada."
    ],
    "solucion": "1 cuadrado (la base) y 4 triángulos (las caras laterales). En total son 5 caras. ✓"
  },
  {
    "id": "cu-vistas",
    "eje": "geometria",
    "enunciado": "Soledad mira un cuerpo. Desde arriba ve un cuadrado. Desde el frente y desde el lado ve un triángulo. ¿Qué cuerpo es?",
    "opciones": [
      {
        "texto": "Pirámide de base cuadrada",
        "correcta": true
      },
      {
        "texto": "Cono",
        "feedback": "Desde arriba, un cono se ve como un círculo, no como un cuadrado."
      },
      {
        "texto": "Cubo",
        "feedback": "Desde el frente, un cubo se ve como un cuadrado, no como un triángulo."
      },
      {
        "texto": "Cilindro",
        "feedback": "Desde arriba, un cilindro se ve como un círculo y de frente, como un rectángulo."
      }
    ],
    "pistas": [
      "Revisa cada cuerpo: ¿qué forma tiene desde arriba? ¿Y desde el frente?",
      "Busca uno que tenga la base cuadrada y que termine en punta."
    ],
    "solucion": "Es una pirámide de base cuadrada. Su base es cuadrada (vista desde arriba) y sus caras terminan en punta (vista de frente). ✓"
  },
  {
    "id": "cu-red",
    "eje": "geometria",
    "enunciado": "¿Cuál de estas redes se puede doblar para armar un cubo?",
    "opciones": [
      {
        "texto": "Figura 1",
        "correcta": true
      },
      {
        "texto": "Figura 2",
        "feedback": "Esta red tiene 6 cuadrados, pero al doblarla dos caras quedan una encima de la otra y queda un lado abierto."
      },
      {
        "texto": "Figura 3",
        "feedback": "Con cinco cuadrados en fila, al doblarlos dan la vuelta completa y uno queda encima de otro."
      },
      {
        "texto": "Figura 4",
        "feedback": "Los cuatro cuadrados que forman un cuadrado grande no se pueden doblar como caras de un cubo."
      }
    ],
    "pistas": [
      "Imagina que doblas cada red por las líneas. Cada cuadrado tiene que tapar un lado distinto del cubo.",
      "En la cruz, un cuadrado del centro es la base, los de los lados se doblan hacia arriba y el último hace de tapa."
    ],
    "solucion": "La figura 1, la cruz, se puede doblar para armar un cubo. El cubo tiene 6 caras y la cruz tiene 6 cuadrados, uno para cada cara. ✓"
  },
  {
    "id": "sa-letras",
    "eje": "geometria",
    "enunciado": "¿Cuál de estas letras no tiene ningún eje de simetría?",
    "opciones": [
      {
        "texto": "A",
        "feedback": "La A tiene un eje vertical: si la doblas por el medio, de arriba hacia abajo, las mitades calzan."
      },
      {
        "texto": "H",
        "feedback": "La H tiene dos ejes: uno vertical y uno horizontal."
      },
      {
        "texto": "E",
        "feedback": "La E tiene un eje horizontal: la parte de arriba calza con la de abajo."
      },
      {
        "texto": "F",
        "correcta": true
      }
    ],
    "pistas": [
      "Imagina que doblas cada letra por la mitad: de arriba hacia abajo y de lado a lado.",
      "Prueba con la F: ¿alguna de sus mitades calza con la otra?"
    ],
    "solucion": "La F no tiene ningún eje de simetría. La A, la H y la E tienen al menos un eje. ✓"
  },
  {
    "id": "sa-ejes",
    "eje": "geometria",
    "enunciado": "¿Cuál o cuáles de estas figuras tienen más de dos ejes de simetría?",
    "visual": {
      "tipo": "figuras",
      "lista": [
        {
          "forma": "rectangulo",
          "etiqueta": "I"
        },
        {
          "forma": "cuadrado",
          "etiqueta": "II"
        },
        {
          "forma": "trianguloEq",
          "etiqueta": "III"
        }
      ]
    },
    "opciones": [
      {
        "texto": "Solo II",
        "feedback": "El triángulo de lados iguales también: tiene 3 ejes, uno desde cada esquina hasta el medio del lado de enfrente."
      },
      {
        "texto": "Solo III",
        "feedback": "El cuadrado también: tiene 4 ejes, el vertical, el horizontal y las dos diagonales."
      },
      {
        "texto": "II y III",
        "correcta": true
      },
      {
        "texto": "I, II y III",
        "feedback": "El rectángulo tiene solo 2 ejes. Sus diagonales no sirven: al doblar, las mitades no calzan."
      }
    ],
    "pistas": [
      "Cuenta los ejes de cada figura. Prueba también las diagonales.",
      "Rectángulo: 2 ejes. Cuadrado: 4 ejes. Triángulo de lados iguales: 3 ejes."
    ],
    "solucion": "El cuadrado (4 ejes) y el triángulo (3 ejes): II y III. 4 y 3 son más que 2; el rectángulo tiene justo 2. ✓"
  },
  {
    "id": "sa-recto",
    "eje": "geometria",
    "enunciado": "Un ángulo recto es como la esquina de una hoja de cuaderno. ¿Cuál o cuáles de estas figuras tienen al menos un ángulo recto?",
    "visual": {
      "tipo": "figuras",
      "lista": [
        {
          "forma": "trianguloRect",
          "etiqueta": "Figura 1"
        },
        {
          "forma": "rectangulo",
          "etiqueta": "Figura 2"
        },
        {
          "forma": "trianguloEq",
          "etiqueta": "Figura 3"
        }
      ]
    },
    "opciones": [
      {
        "texto": "Solo la figura 1",
        "feedback": "La figura 2 es un rectángulo: sus 4 esquinas son ángulos rectos."
      },
      {
        "texto": "Solo la figura 2",
        "feedback": "La figura 1 también tiene un ángulo recto: la esquina de abajo a la izquierda."
      },
      {
        "texto": "Las figuras 1 y 2",
        "correcta": true
      },
      {
        "texto": "Las figuras 1 y 3",
        "feedback": "El triángulo de lados iguales no tiene ángulos rectos: sus esquinas son más cerradas."
      }
    ],
    "pistas": [
      "Usa la esquina de una hoja para probar cada esquina de las figuras.",
      "El triángulo 1 tiene una esquina recta. El rectángulo tiene cuatro. El triángulo 3 no tiene ninguna."
    ],
    "solucion": "Las figuras 1 y 2 tienen al menos un ángulo recto. Los ángulos rectos quedaron marcados con un cuadradito. ✓"
  },
  // =========================================================
  // ---------- Medición (10 ejercicios) ----------
  // =========================================================
  {
    "id": "med-area",
    "eje": "medicion",
    "enunciado": "Este rectángulo está formado por cuadrados iguales. ¿Cuál es su área, medida en cuadrados?",
    "visual": {
      "tipo": "area",
      "largo": 5,
      "ancho": 3
    },
    "opciones": [
      {
        "texto": "15 cuadrados",
        "correcta": true
      },
      {
        "texto": "8 cuadrados",
        "feedback": "Sumaste el largo y el ancho (5 + 3). El área es todo el espacio de adentro."
      },
      {
        "texto": "16 cuadrados",
        "feedback": "Ese es el perímetro, el borde de la figura. El área es lo que cubre por dentro."
      },
      {
        "texto": "30 cuadrados",
        "feedback": "Contaste dos veces. Hay 3 filas de 5 cuadrados."
      }
    ],
    "pistas": [
      "¿Cuántos cuadrados hay en una fila? ¿Cuántas filas hay?",
      "Hay 3 filas de 5 cuadrados: calcula 3 × 5 o suma 5 + 5 + 5."
    ],
    "solucion": "3 filas × 5 cuadrados = 15 cuadrados."
  },
  {
    "id": "med-tiempo",
    "eje": "medicion",
    "enunciado": "La clase de Educación Física empieza a la hora que marca el reloj y dura 45 minutos. ¿A qué hora termina?",
    "visual": {
      "tipo": "reloj",
      "hora": 10,
      "minutos": 15
    },
    "opciones": [
      {
        "texto": "11:00",
        "correcta": true
      },
      {
        "texto": "10:60",
        "feedback": "Una hora tiene solo 60 minutos. Cuando llegas a 60, se cambia a la hora siguiente."
      },
      {
        "texto": "10:45",
        "feedback": "Esa es la hora en que faltan 15 minutos para terminar. Cuenta los 45 minutos desde las 10:15."
      },
      {
        "texto": "11:45",
        "feedback": "Sumaste una hora completa y además 45 minutos. La clase dura menos de una hora."
      }
    ],
    "pistas": [
      "El reloj marca las 10:15. ¿Cuántos minutos faltan para las 11:00?",
      "De 10:15 a 11:00 hay exactamente 45 minutos."
    ],
    "solucion": "10:15 + 45 minutos = 11:00."
  },
  {
    "id": "ti-leer",
    "eje": "medicion",
    "enunciado": "¿Qué hora marca el reloj?",
    "visual": {
      "tipo": "reloj",
      "hora": 7,
      "minutos": 20
    },
    "opciones": [
      {
        "texto": "7:20",
        "correcta": true
      },
      {
        "texto": "7:04",
        "feedback": "El minutero apunta al 4, pero eso no son 4 minutos: cada número vale 5 minutos. 4 × 5 = 20."
      },
      {
        "texto": "4:35",
        "feedback": "Cambiaste las manecillas. La corta marca la hora y la larga, los minutos."
      },
      {
        "texto": "8:20",
        "feedback": "El horario todavía no llega al 8: está entre el 7 y el 8. Son las 7 y algo."
      }
    ],
    "pistas": [
      "Mira primero la manecilla corta (la hora) y después la larga (los minutos).",
      "La corta está entre el 7 y el 8: son las 7. La larga está en el 4: 4 × 5 = 20 minutos."
    ],
    "solucion": "Son las 7:20. Cuenta de 5 en 5 desde el 12 hasta el 4: 5, 10, 15, 20. ✓"
  },
  {
    "id": "ti-pm",
    "eje": "medicion",
    "enunciado": "Vicente almuerza a las 13:00. ¿Cómo se escribe esa hora usando A.M. o P.M.?",
    "opciones": [
      {
        "texto": "1:00 P.M.",
        "correcta": true
      },
      {
        "texto": "1:00 A.M.",
        "feedback": "A.M. son las horas antes del mediodía, en la madrugada y la mañana. A las 13:00 ya pasó el mediodía."
      },
      {
        "texto": "3:00 P.M.",
        "feedback": "Las 13:00 es 1 hora después de las 12:00 del mediodía: la 1 de la tarde."
      },
      {
        "texto": "13:00 A.M.",
        "feedback": "Con A.M. y P.M. se usan los números del 1 al 12."
      }
    ],
    "pistas": [
      "Las horas después del mediodía se escriben con P.M.",
      "13:00 es 1 hora después de las 12:00."
    ],
    "solucion": "13:00 = 1:00 P.M., la 1 de la tarde. La 1 de la tarde es después del mediodía, así que lleva P.M. ✓"
  },
  {
    "id": "ti-semanas",
    "eje": "medicion",
    "enunciado": "Faltan 35 días para las vacaciones de invierno. ¿Cuántas semanas faltan?",
    "opciones": [
      {
        "texto": "5 semanas",
        "correcta": true
      },
      {
        "texto": "7 semanas",
        "feedback": "Dividiste por 5. Una semana tiene 7 días: 35 : 7."
      },
      {
        "texto": "4 semanas",
        "feedback": "4 semanas son 28 días. Faltan 7 días más: otra semana."
      },
      {
        "texto": "3 semanas",
        "feedback": "Una semana tiene 7 días, no 10."
      }
    ],
    "pistas": [
      "Una semana tiene 7 días.",
      "¿Cuántas veces cabe 7 en 35? 7, 14, 21, 28, 35."
    ],
    "solucion": "35 : 7 = 5 semanas. 5 × 7 = 35. ✓"
  },
  {
    "id": "lo-alturas",
    "eje": "medicion",
    "enunciado": "Cuatro amigos se midieron con una huincha. ¿Quién es el más alto?",
    "visual": {
      "tipo": "tabla",
      "encabezados": [
        "Nombre",
        "Estatura"
      ],
      "filas": [
        [
          "Lucas",
          "1 m y 45 cm"
        ],
        [
          "Juan",
          "1 m y 55 cm"
        ],
        [
          "León",
          "143 cm"
        ],
        [
          "Miguel",
          "152 cm"
        ]
      ]
    },
    "opciones": [
      {
        "texto": "Lucas",
        "feedback": "1 m y 45 cm son 145 cm. Hay alguien más alto."
      },
      {
        "texto": "Juan",
        "correcta": true
      },
      {
        "texto": "León",
        "feedback": "143 cm es la estatura más baja de los cuatro."
      },
      {
        "texto": "Miguel",
        "feedback": "152 parece más que «1 m y 55 cm», pero 1 m y 55 cm son 155 cm."
      }
    ],
    "pistas": [
      "Pasa todas las estaturas a centímetros. 1 m = 100 cm.",
      "Lucas 145 cm, Juan 155 cm, León 143 cm, Miguel 152 cm."
    ],
    "solucion": "Juan es el más alto: mide 155 cm. 155 > 152 > 145 > 143. ✓"
  },
  {
    "id": "lo-camioneta",
    "eje": "medicion",
    "enunciado": "Una camioneta mide 5 metros y 32 centímetros de largo. ¿Cuánto mide en centímetros?",
    "opciones": [
      {
        "texto": "532 cm",
        "correcta": true
      },
      {
        "texto": "37 cm",
        "feedback": "Sumaste 5 + 32 como si los dos fueran centímetros. 5 metros son 500 cm."
      },
      {
        "texto": "5 032 cm",
        "feedback": "5 metros son 500 cm, no 5 000."
      },
      {
        "texto": "5 320 cm",
        "feedback": "Agregaste un 0 al final. 500 + 32 = 532."
      }
    ],
    "pistas": [
      "1 metro = 100 centímetros.",
      "5 m = 500 cm. Después suma los 32 cm."
    ],
    "solucion": "500 + 32 = 532 cm. 532 cm = 5 m y 32 cm. ✓"
  },
  {
    "id": "ap-patio",
    "eje": "medicion",
    "enunciado": "El patio rectangular de una casa mide 5 m de largo y 3 m de ancho. ¿Cuántos metros de reja se necesitan para cercarlo completo?",
    "visual": {
      "tipo": "poligono",
      "puntos": [
        [
          0,
          0
        ],
        [
          250,
          0
        ],
        [
          250,
          150
        ],
        [
          0,
          150
        ]
      ],
      "lados": [
        "5 m",
        "3 m"
      ]
    },
    "opciones": [
      {
        "texto": "16 m",
        "correcta": true
      },
      {
        "texto": "8 m",
        "feedback": "Sumaste solo dos lados (5 + 3). El rectángulo tiene 4 lados y la reja va alrededor de todo."
      },
      {
        "texto": "15 m",
        "feedback": "15 es el área (5 × 3): lo que cubre por dentro. La reja va por el borde."
      },
      {
        "texto": "13 m",
        "feedback": "Te faltó un lado. Suma los 4: 5 + 3 + 5 + 3."
      }
    ],
    "pistas": [
      "La reja va por todo el borde: es el perímetro.",
      "El rectángulo tiene 2 lados de 5 m y 2 lados de 3 m."
    ],
    "solucion": "5 + 3 + 5 + 3 = 16 m. 2 × 5 + 2 × 3 = 10 + 6 = 16. ✓"
  },
  {
    "id": "ap-cuadrado",
    "eje": "medicion",
    "enunciado": "El perímetro de un cuadrado es 20 cm. ¿Cuánto mide cada lado?",
    "opciones": [
      {
        "texto": "5 cm",
        "correcta": true
      },
      {
        "texto": "10 cm",
        "feedback": "Dividiste por 2, pero el cuadrado tiene 4 lados iguales."
      },
      {
        "texto": "4 cm",
        "feedback": "4 es la cantidad de lados, no lo que mide cada uno."
      },
      {
        "texto": "16 cm",
        "feedback": "Restaste 20 − 4. Hay que repartir los 20 cm en 4 lados iguales."
      }
    ],
    "pistas": [
      "Un cuadrado tiene 4 lados iguales que juntos suman 20 cm.",
      "Reparte 20 en 4 partes iguales: 20 : 4."
    ],
    "solucion": "Cada lado mide 5 cm. 5 + 5 + 5 + 5 = 20. ✓"
  },
  {
    "id": "ap-mitad",
    "eje": "medicion",
    "enunciado": "El ancho de un rectángulo es la mitad de su largo. El largo mide 10 cm. ¿Cuál es el área del rectángulo?",
    "opciones": [
      {
        "texto": "50 cm²",
        "correcta": true
      },
      {
        "texto": "30 cm²",
        "feedback": "30 cm es el perímetro (10 + 5 + 10 + 5). El área es lo que cubre por dentro: largo × ancho."
      },
      {
        "texto": "100 cm²",
        "feedback": "Usaste 10 cm para el largo y para el ancho. El ancho es la mitad: 5 cm."
      },
      {
        "texto": "15 cm²",
        "feedback": "Sumaste 10 + 5. El área se calcula multiplicando."
      }
    ],
    "pistas": [
      "Primero calcula el ancho. Después multiplica largo × ancho.",
      "Ancho: 10 : 2 = 5 cm. Área: 10 × 5."
    ],
    "solucion": "10 × 5 = 50 cm². Son 5 filas de 10 cuadrados de 1 cm². ✓"
  },
  // =========================================================
  // ---------- Datos y probabilidades (10 ejercicios) ----------
  // =========================================================
  {
    "id": "dat-diferencia",
    "eje": "datos",
    "enunciado": "El gráfico muestra la fruta favorita del 4° B. ¿Cuántos estudiantes más prefieren manzana que naranja?",
    "visual": {
      "tipo": "grafico",
      "titulo": "Fruta favorita del 4° B",
      "datos": [
        {
          "etiqueta": "Manzana",
          "valor": 8
        },
        {
          "etiqueta": "Plátano",
          "valor": 5
        },
        {
          "etiqueta": "Naranja",
          "valor": 3
        },
        {
          "etiqueta": "Uva",
          "valor": 6
        }
      ]
    },
    "opciones": [
      {
        "texto": "5",
        "correcta": true
      },
      {
        "texto": "11",
        "feedback": "Sumaste manzana y naranja. \"Cuántos más\" se responde con una resta."
      },
      {
        "texto": "8",
        "feedback": "Ese es solo el total de manzana. Falta compararlo con la naranja."
      },
      {
        "texto": "3",
        "feedback": "Ese es solo el total de naranja. Falta compararlo con la manzana."
      }
    ],
    "pistas": [
      "Lee en el gráfico cuántos eligieron manzana y cuántos eligieron naranja.",
      "Para saber \"cuántos más\", resta el número menor al mayor."
    ],
    "solucion": "Manzana 8, naranja 3: 8 − 3 = 5 estudiantes más."
  },
  {
    "id": "dat-total",
    "eje": "datos",
    "enunciado": "Según el mismo gráfico, ¿cuántos estudiantes respondieron la encuesta?",
    "visual": {
      "tipo": "grafico",
      "titulo": "Fruta favorita del 4° B",
      "datos": [
        {
          "etiqueta": "Manzana",
          "valor": 8
        },
        {
          "etiqueta": "Plátano",
          "valor": 5
        },
        {
          "etiqueta": "Naranja",
          "valor": 3
        },
        {
          "etiqueta": "Uva",
          "valor": 6
        }
      ]
    },
    "opciones": [
      {
        "texto": "22",
        "correcta": true
      },
      {
        "texto": "8",
        "feedback": "Ese es el valor de la barra más alta. Cada estudiante está en una de las barras."
      },
      {
        "texto": "4",
        "feedback": "Contaste cuántas frutas hay. La pregunta es por la cantidad de estudiantes."
      },
      {
        "texto": "19",
        "feedback": "Te faltó sumar una barra. Revisa que sumaste las cuatro frutas."
      }
    ],
    "pistas": [
      "Cada estudiante eligió una fruta. ¿Qué tienes que hacer con los números de todas las barras?",
      "Suma las cuatro barras: 8 + 5 + 3 + 6."
    ],
    "solucion": "8 + 5 + 3 + 6 = 22 estudiantes."
  },
  {
    "id": "gr-picto",
    "eje": "datos",
    "enunciado": "El pictograma muestra cuántas botellas recicló cada curso. ¿Cuántas botellas recicló el 2° básico?",
    "visual": {
      "tipo": "pictograma",
      "titulo": "Botellas recicladas por curso",
      "icono": "botella",
      "valorIcono": 10,
      "unidad": "botellas",
      "datos": [
        {
          "etiqueta": "1° básico",
          "iconos": 4
        },
        {
          "etiqueta": "2° básico",
          "iconos": 6
        },
        {
          "etiqueta": "3° básico",
          "iconos": 8
        },
        {
          "etiqueta": "4° básico",
          "iconos": 5
        }
      ]
    },
    "opciones": [
      {
        "texto": "60 botellas",
        "correcta": true
      },
      {
        "texto": "6 botellas",
        "feedback": "Contaste los dibujos, pero cada uno vale 10 botellas. Mira la clave, abajo del pictograma."
      },
      {
        "texto": "16 botellas",
        "feedback": "Sumaste 6 + 10. Cada dibujo vale 10: hay que multiplicar."
      },
      {
        "texto": "70 botellas",
        "feedback": "Revisa la fila del 2° básico: tiene 6 dibujos."
      }
    ],
    "pistas": [
      "Mira la clave: ¿cuánto vale cada dibujo?",
      "El 2° básico tiene 6 dibujos y cada uno vale 10."
    ],
    "solucion": "6 × 10 = 60 botellas. Cuenta de 10 en 10, un dibujo a la vez: 10, 20, 30, 40, 50, 60. ✓"
  },
  {
    "id": "gr-escala",
    "eje": "datos",
    "enunciado": "El gráfico no tiene números en el eje. Se sabe que 10 niños prefieren el cine. ¿Cuántos niños prefieren el estadio?",
    "visual": {
      "tipo": "grafico",
      "titulo": "Lugares preferidos para ir de paseo",
      "numeros": false,
      "max": 16,
      "paso": 2,
      "datos": [
        {
          "etiqueta": "Museo",
          "valor": 6
        },
        {
          "etiqueta": "Cine",
          "valor": 10
        },
        {
          "etiqueta": "Parque",
          "valor": 14
        },
        {
          "etiqueta": "Estadio",
          "valor": 8
        }
      ]
    },
    "opciones": [
      {
        "texto": "8",
        "correcta": true
      },
      {
        "texto": "4",
        "feedback": "Contaste las líneas hasta el estadio (4), pero cada línea no vale 1. Usa el cine para saber cuánto vale cada línea."
      },
      {
        "texto": "9",
        "feedback": "Pensaste que cada línea vale 1 y restaste 10 − 1. Mira: el cine llega a la línea 5 y vale 10."
      },
      {
        "texto": "5",
        "feedback": "5 son las líneas que alcanza el cine. Primero averigua cuánto vale cada línea."
      }
    ],
    "pistas": [
      "Usa la barra del cine: llega a la línea 5 y vale 10. ¿Cuánto vale cada línea?",
      "10 : 5 = 2. Cada línea vale 2. El estadio llega a la línea 4."
    ],
    "solucion": "4 × 2 = 8 niños prefieren el estadio. La barra del estadio es un poco más baja que la del cine, y 8 < 10. ✓"
  },
  {
    "id": "gr-asistencia",
    "eje": "datos",
    "enunciado": "Durante la semana asistieron 72 estudiantes al taller, pero falta la barra del jueves. ¿Qué día asistió la misma cantidad de estudiantes que el jueves?",
    "visual": {
      "tipo": "grafico",
      "titulo": "Asistencia al taller",
      "max": 24,
      "paso": 2,
      "datos": [
        {
          "etiqueta": "Lunes",
          "valor": 16
        },
        {
          "etiqueta": "Martes",
          "valor": 22
        },
        {
          "etiqueta": "Miércoles",
          "valor": 12
        },
        {
          "etiqueta": "Jueves",
          "valor": null
        },
        {
          "etiqueta": "Viernes",
          "valor": 6
        }
      ]
    },
    "opciones": [
      {
        "texto": "Lunes",
        "correcta": true
      },
      {
        "texto": "Martes",
        "feedback": "El martes fueron 22. Calcula primero cuántos fueron el jueves: 72 menos los otros días."
      },
      {
        "texto": "Miércoles",
        "feedback": "El miércoles fueron 12. Calcula primero cuántos fueron el jueves."
      },
      {
        "texto": "Viernes",
        "feedback": "El viernes fueron 6. Calcula primero cuántos fueron el jueves."
      }
    ],
    "pistas": [
      "Calcula cuántos fueron el jueves: el total menos los otros días.",
      "16 + 22 + 12 + 6 = 56. 72 − 56 = 16."
    ],
    "solucion": "El jueves fueron 16 estudiantes, igual que el lunes. 16 + 22 + 12 + 16 + 6 = 72. ✓"
  },
  {
    "id": "gr-libros",
    "eje": "datos",
    "enunciado": "El gráfico muestra los libros que vendió una librería. ¿Cuál es la diferencia de libros vendidos entre enero y febrero?",
    "visual": {
      "tipo": "grafico",
      "titulo": "Libros vendidos por mes",
      "max": 500,
      "paso": 100,
      "datos": [
        {
          "etiqueta": "Enero",
          "valor": 500
        },
        {
          "etiqueta": "Febrero",
          "valor": 100
        },
        {
          "etiqueta": "Marzo",
          "valor": 400
        },
        {
          "etiqueta": "Abril",
          "valor": 300
        }
      ]
    },
    "opciones": [
      {
        "texto": "400 libros",
        "correcta": true
      },
      {
        "texto": "600 libros",
        "feedback": "Sumaste enero y febrero. La diferencia se calcula restando."
      },
      {
        "texto": "100 libros",
        "feedback": "100 libros se vendieron en febrero. Falta compararlo con enero."
      },
      {
        "texto": "1 300 libros",
        "feedback": "Sumaste todos los meses. La pregunta compara solo enero y febrero."
      }
    ],
    "pistas": [
      "Lee el valor de cada barra en el eje de los números.",
      "Enero: 500. Febrero: 100."
    ],
    "solucion": "500 − 100 = 400 libros. 100 + 400 = 500. ✓"
  },
  {
    "id": "pr-medallas",
    "eje": "datos",
    "enunciado": "Pamela tiene 18 medallas de oro, 12 de plata y 9 de bronce en una caja. Sacará una sin mirar. ¿Cuál de estas oraciones es verdadera?",
    "opciones": [
      {
        "texto": "Es seguro que saque una medalla de oro.",
        "feedback": "No es seguro: también hay medallas de plata y de bronce. Es probable, pero no seguro."
      },
      {
        "texto": "Es menos probable que saque una de bronce que una de plata.",
        "correcta": true
      },
      {
        "texto": "Es más probable que saque una de plata que una de oro.",
        "feedback": "Hay más medallas de oro (18) que de plata (12): es más probable sacar oro."
      },
      {
        "texto": "Es imposible que saque una medalla de bronce.",
        "feedback": "Sí hay medallas de bronce (9): sacar una es posible."
      }
    ],
    "pistas": [
      "Compara cuántas medallas hay de cada tipo.",
      "Oro: 18. Plata: 12. Bronce: 9."
    ],
    "solucion": "Hay menos de bronce (9) que de plata (12): es menos probable sacar bronce. 9 < 12. ✓"
  },
  {
    "id": "pr-mermeladas",
    "eje": "datos",
    "enunciado": "En una tienda hay frascos de mermelada de distintos sabores. Si se saca un frasco al azar, ¿qué dos sabores tienen la misma probabilidad de salir?",
    "visual": {
      "tipo": "tabla",
      "encabezados": [
        "Sabor",
        "Frascos"
      ],
      "filas": [
        [
          "Uva",
          17
        ],
        [
          "Manzana",
          8
        ],
        [
          "Frutilla",
          14
        ],
        [
          "Durazno",
          11
        ],
        [
          "Naranja",
          6
        ],
        [
          "Piña",
          8
        ]
      ]
    },
    "opciones": [
      {
        "texto": "Manzana y piña",
        "correcta": true
      },
      {
        "texto": "Frutilla y durazno",
        "feedback": "Frutilla tiene 14 frascos y durazno 11: no hay la misma cantidad."
      },
      {
        "texto": "Naranja y piña",
        "feedback": "Naranja tiene 6 frascos y piña 8."
      },
      {
        "texto": "Uva y frutilla",
        "feedback": "Uva tiene 17 frascos y frutilla 14."
      }
    ],
    "pistas": [
      "Tienen la misma probabilidad los sabores que tienen la misma cantidad de frascos.",
      "Busca dos números iguales en la tabla."
    ],
    "solucion": "Manzana y piña tienen 8 frascos cada uno. Son los únicos dos sabores con la misma cantidad. ✓"
  },
  {
    "id": "pr-bolsas",
    "eje": "datos",
    "enunciado": "Ganas si sacas una bolita roja sin mirar. ¿Con qué bolsa es más probable ganar?",
    "visual": {
      "tipo": "bolsas",
      "bolsas": [
        {
          "etiqueta": "Bolsa 1",
          "bolitas": {
            "roja": 2,
            "azul": 2
          }
        },
        {
          "etiqueta": "Bolsa 2",
          "bolitas": {
            "roja": 3,
            "azul": 1
          }
        },
        {
          "etiqueta": "Bolsa 3",
          "bolitas": {
            "roja": 1,
            "azul": 3
          }
        },
        {
          "etiqueta": "Bolsa 4",
          "bolitas": {
            "azul": 4
          }
        }
      ]
    },
    "opciones": [
      {
        "texto": "Bolsa 1",
        "feedback": "En la bolsa 1 es igual de probable sacar roja que azul (2 y 2). Hay una bolsa con más rojas."
      },
      {
        "texto": "Bolsa 2",
        "correcta": true
      },
      {
        "texto": "Bolsa 3",
        "feedback": "En la bolsa 3 hay solo 1 roja de 4."
      },
      {
        "texto": "Bolsa 4",
        "feedback": "En la bolsa 4 no hay rojas: es imposible ganar."
      }
    ],
    "pistas": [
      "Todas las bolsas tienen 4 bolitas. Cuenta las rojas de cada una.",
      "Bolsa 1: 2 rojas. Bolsa 2: 3. Bolsa 3: 1. Bolsa 4: ninguna."
    ],
    "solucion": "La bolsa 2 tiene más bolitas rojas: 3 de 4. Con la bolsa 4 es imposible ganar, y con la 2 es lo más probable. ✓"
  },
  {
    "id": "pr-dado",
    "eje": "datos",
    "enunciado": "Lanzas un dado común, con los números del 1 al 6. ¿Qué es imposible?",
    "opciones": [
      {
        "texto": "Sacar un 7",
        "correcta": true
      },
      {
        "texto": "Sacar un número par",
        "feedback": "Es posible: el 2, el 4 y el 6 son pares."
      },
      {
        "texto": "Sacar un 1",
        "feedback": "Es posible: el dado tiene un 1."
      },
      {
        "texto": "Sacar un número menor que 7",
        "feedback": "Esto no es imposible: es seguro. Todos los números del dado son menores que 7."
      }
    ],
    "pistas": [
      "Imposible es algo que no puede pasar nunca.",
      "¿Qué números tiene el dado? ¿Hay alguno que no esté?"
    ],
    "solucion": "El dado no tiene 7: sacar un 7 es imposible. En cambio, sacar un número menor que 7 es seguro. ✓"
  },
];
