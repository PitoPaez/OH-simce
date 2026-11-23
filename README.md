Proyecto Open Humbolt - practica simce

```bash
npm install
npm run dev
```

Luego abre la dirección local indicada por Vite, normalmente http://localhost:5173/.

## Dónde está cada cosa

| Archivo | Qué tiene |
| --- | --- |
| `src/data/ejercicios.json` | Todos los ejercicios. Se practican en el orden del archivo. |
| `src/data/ejercicios.js` | Los ejes y la explicación de cada campo de un ejercicio |
| `public/imagenes/` | Imágenes PNG. Cada una se llama como el id de su ejercicio. |
| `src/components/Visual.jsx` | Qué se muestra en cada ejercicio, según `visual.tipo` |
| `src/components/herramientas/` | Herramientas interactivas: medir, reloj y calendario |
| `src/components/Practica.jsx` | Una pregunta por pantalla, pistas y retroalimentación |
| `src/utilidades.js` | Mezclar, leer en voz alta y guardar el progreso |
| `src/index.css`, `src/App.css` | Colores (`--eje-*`), tipografía y estilos |

## Un ejercicio

```json
{
  "id": "med-reloj-recreo",
  "eje": "medicion",
  "enunciado": "El recreo empieza a las 10:15. Mueve las manecillas para que el reloj marque esa hora.",
  "visual": { "tipo": "reloj", "inicio": "12:00", "descripcion": "...", "mensajeOtro": "..." },
  "opciones": [
    { "texto": "10:15", "correcta": true, "feedback": null },
    { "texto": "3:50", "correcta": false, "feedback": "Pusiste las manecillas al revés..." }
  ],
  "pistas": ["...", "..."],
  "solucion": "..."
}
```

- `opciones` tiene la respuesta correcta y los errores típicos. Cada error
  trae su `feedback`, que es lo que ve el estudiante si responde eso.
- `visual.descripcion` explica qué se ve (la leen los lectores de pantalla).

### Tipos de `visual`

| `tipo` | Qué muestra | Campos | El estudiante… |
| --- | --- | --- | --- |
| `imagen` | `public/imagenes/<id>.png` (o `src`, para usar otra) | `src` (opcional) | elige una alternativa |
| `medir` | Regla (`modo: "mover"`) o huincha (`modo: "estirar"`) en cm | `largo`; en mover también `objeto: { src, largo, nombre }` e `inicio` | mide y escribe, o estira |
| `reloj` | Reloj de manecillas | `inicio` | pone la hora |
| `calendario` | Un mes | `anio`, `mes`, `hoy` | toca un día |

Con `imagen` se muestran las 4 alternativas. Con una herramienta no: lo que
hace el estudiante (por ejemplo `"10:15"` o `"7"`) se busca en el `texto` de
las opciones. Si no está, se muestra `visual.mensajeOtro`.

Las herramientas sirven para cualquier eje: un reloj o una regla se usan en
otro ejercicio solo cambiando sus datos en el JSON. Para agregar una
herramienta nueva, créala en `src/components/herramientas/` y agrégala en
`HERRAMIENTAS` de `src/components/Visual.jsx`.

### Imágenes

PNG en `public/imagenes/`, con el nombre del id del ejercicio
(`num-resta.png`). Conviene exportarlas al doble del tamaño en que se ven
(por ejemplo, 960 px de ancho), con fondo transparente o blanco. En
`medir`, la imagen del objeto debe ocupar todo su ancho, porque ese ancho es
su largo en cm.

## Diseño

La página imita un cuaderno de matemáticas cuadriculado: cada eje tiene su
color de "papel lustre" y el progreso se pinta en cuadritos. La fuente es
Andika, diseñada para niños que están aprendiendo a leer. Una pregunta por
pantalla, un dibujo o herramienta en cada ejercicio, pistas graduales,
retroalimentación según el error y un botón para escuchar el enunciado.
