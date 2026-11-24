Proyecto Open Humbolt - practica simce

```bash
npm install
npm run dev
```

Luego abre la dirección local indicada por Vite, normalmente http://localhost:5173/.



## ¿Cómo implementar cambios?

Para implementar nuevos cambios en el proyecto, se debe trabajar utilizando ramas independientes, evitando modificar directamente la rama `dev`.

### 1. Cambiar a la rama dev

Primero, asegúrate de estar en la rama `dev`:

```bash
git switch dev
```

Actualiza tu rama con los últimos cambios del repositorio:

```bash
git pull origin dev
```

### 2. Crear una nueva rama

Crea una rama para trabajar en tu implementación:

```bash
git branch nombre-de-tu-rama
```

### 3. Cambiar a tu nueva rama

Cambia a la rama que acabas de crear:

```bash
git switch nombre-de-tu-rama
```

### 4. Realizar los cambios

Ahora puedes modificar el proyecto, implementar funcionalidades, corregir errores o realizar las tareas correspondientes.

### 5. Subir tu rama a GitHub

Una vez terminados los cambios, sube tu rama al repositorio remoto:

```bash
git push origin nombre-de-tu-rama
```

### 6. Crear un Pull Request

Finalmente, desde GitHub:

1. Ingresa al repositorio del proyecto.
2. Selecciona la opción **Pull requests**.
3. Haz clic en **New pull request**.
4. Configura las ramas:
   - **Base:** `dev`
   - **Compare:** `nombre-de-tu-rama`
5. Revisa los cambios y crea el Pull Request.

Una vez creado, el equipo podrá revisar tu implementación y aprobarla para integrar los cambios a la rama `dev`.

---

**Importante:** Cada integrante debe trabajar en su propia rama y evitar realizar cambios directamente sobre `dev` o `main`.




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
## Diseño visual

La página imita un cuaderno de matemáticas cuadriculado. Cada eje del SIMCE tiene
su color de "papel lustre" y el progreso se pinta en cuadritos.

- **Colores y tipografía:** en `src/index.css` (variables `--eje-*`, `--tinta`, etc.).
  La fuente es Andika, diseñada para niños que están aprendiendo a leer.
- **Ejercicios:** en `src/data/ejercicios.js`. Cada uno trae un dibujo, 4 alternativas
  (como el SIMCE), una explicación para cada error típico, pistas y la solución.
- **Dibujos:** en `src/components/Visual.jsx` (modelo de barras, tabla posicional,
  fracciones, recta numérica, balanza, cubo, mapa, área, reloj y gráfico de barras).

Principios pedagógicos que sigue la interfaz: una pregunta por pantalla, representación
pictórica en cada ejercicio (método Concreto-Pictórico-Abstracto), pistas graduales,
retroalimentación inmediata según el error, opción de escuchar el enunciado y mensajes
que valoran el esfuerzo y la estrategia.






