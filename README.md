Proyecto Open Humbolt - practica simce

OH Simce es una práctica de Matemática para 4° básico pensada para preparar el
SIMCE. Tiene 18 temas con un ejemplo resuelto cada uno, 111 ejercicios (47 de
ellos interactivos), un ensayo tipo SIMCE y una lista de preguntas para repasar.

```bash
npm install
npm run dev
```

Luego abre la dirección local indicada por Vite, normalmente http://localhost:5173/.

Antes de subir cambios a los ejercicios, revisa que estén completos:

```bash
npm run validar
```

## Cómo está pensada

La explicación completa, con las fuentes, está en
[`docs/FUNDAMENTOS.md`](docs/FUNDAMENTOS.md). En resumen:

- **Ejemplo resuelto primero.** Cada tema parte con un ejemplo paso a paso, que
  se puede saltar.
- **Material concreto en pantalla (COPISI).** Bloques base 10, balanza, reloj,
  recta numérica, figuras para pintar, mapas con coordenadas y cubos por pisos.
- **Ayuda en 4 pasos.** Entender, planificar, hacer y comprobar, como pide el
  programa de estudio (OA b).
- **Retroalimentación según el error.** Cada respuesta equivocada corresponde a
  un error frecuente del SIMCE descrito por la Agencia de Calidad.
- **¿Quién tiene razón?** Compañeros con razonamientos distintos, para
  argumentar.
- **Ensayo tipo SIMCE** de 15 preguntas, sin cronómetro, con revisión al final.
  Se responden en el orden que se quiera, con un mapa de preguntas.
- **Dejar para después.** En la práctica y en el ensayo una pregunta difícil se
  puede dejar para el final, para no quedarse pegado.
- **Repasar por partes.** El estudiante elige qué repasar (las que dejó para
  después, las que le costaron, las que vio resueltas, las del ensayo) y de qué
  temas.

## Panel docente

En `#/docentes`:

- **Resultados.** Errores más frecuentes del curso con el error que hay detrás,
  logro por tema, mapa de calor por estudiante y análisis de cada ejercicio
  (qué respondieron en el primer intento). Se puede descargar como planilla CSV
  y probar con un curso de ejemplo.
- **Ejercicios.** Activar o desactivar ejercicios, crear nuevos (alternativas o
  respuesta numérica) y editar o duplicar cualquiera, con vista previa y la
  misma revisión que `npm run validar`. «Exportar para el repositorio» genera el
  código para dejarlos en la página para todos.
- **Curso y enlace.** Nombre del curso y un enlace que lleva la selección de
  ejercicios a los estudiantes.

### Cómo viajan los datos sin servidor

La página no tiene servidor, así que todo queda en el navegador:

1. El docente crea su curso y comparte el enlace (`#/unirse/...`). La
   configuración va dentro del enlace, comprimida.
2. Cada estudiante practica con su nombre. Un mismo computador puede tener
   varios perfiles (sala de computación).
3. El estudiante descarga un archivo con sus resultados y se lo entrega al
   docente, que lo carga en el panel. Los perfiles del mismo computador
   aparecen solos.

Todo el guardado está en `src/lib/almacen.js`. Para usar un servidor (Firebase,
Supabase u otro), basta con cambiar ese archivo.

[`docs/REVISION-MATERIALES.md`](docs/REVISION-MATERIALES.md) lista los errores
que se encontraron en las presentaciones, la planilla y los ensayos.

## Dónde está cada cosa

| Carpeta | Contenido |
| --- | --- |
| `src/data/ejercicios/` | Temas, ejemplos resueltos y ejercicios, un archivo por eje |
| `src/components/pantallas/` | Inicio, eje, ejemplo, práctica, ensayo y página para docentes |
| `src/components/interactivos/` | Los ejercicios interactivos (bloques, balanza, reloj...) |
| `src/components/visuales/` | Los dibujos de cada ejercicio |
| `src/components/docentes/` | Panel docente: resultados, gestión de ejercicios, editor y curso |
| `src/lib/` | Formato de números, voz, perfiles y progreso, catálogo, análisis de resultados y guardado |
| `src/lib/validar.js` | Reglas de revisión de ejercicios (las usan el script y el editor) |
| `src/index.css` | Colores, tipografía y fondo de cuaderno |
| `scripts/validar-datos.mjs` | Revisión automática de los ejercicios |

## Enlaces directos

| Dirección | Abre |
| --- | --- |
| `#/eje/numeros` | Los temas de un eje |
| `#/tema/fracciones` | La práctica de un tema |
| `#/tema/fracciones/ejemplo` | El ejemplo resuelto de un tema |
| `#/ejercicio/fr-pizza` | Un solo ejercicio, para proyectarlo en clases |
| `#/ensayo` | Un ensayo tipo SIMCE |
| `#/repasar` | Elegir qué repasar |
| `#/docentes` | Panel docente |
| `#/docentes/informacion` | Cómo está pensada, para docentes y familias |

El progreso se guarda solo en el navegador de cada estudiante (localStorage).


18 temas organizados por OA, cada uno con un ejemplo resuelto paso a paso antes de practicar. Quien ya sabe el tema puede saltarlo.

111 ejercicios, 47 de ellos interactivos.
El niño arma números con bloques base 10, ajusta una balanza para resolver ecuaciones y mueve las manecillas de un reloj. 

También ubica puntos en la recta numérica, pinta fracciones, traslada figuras en un mapa, completa figuras simétricas, cuenta cubos “por pisos”, completa gráficos y ordena fichas.

Ayuda en los 4 pasos del programa de estudio (entender, planificar, hacer, comprobar). En el paso “Entender” se destacan la pregunta y los datos dentro del mismo enunciado.

Cada respuesta equivocada tiene su propio mensaje. Corresponde a un error frecuente del SIMCE descrito por la Agencia de Calidad, y el mensaje hace una pregunta para que el niño encuentre su error.

“¿Quién tiene razón?”: compañeros con razonamientos distintos, para practicar la habilidad de argumentar.

Ensayo tipo SIMCE de 15 preguntas, sin cronómetro, con revisión al final y resultado por eje.

“Repasar”, con las preguntas que costaron, y una página para docentes con los OA que cubre cada tema.

La voz lee bien las matemáticas: “3/8” como “3 octavos” y “$800” como “800 pesos”.