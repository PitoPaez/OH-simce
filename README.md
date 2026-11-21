Proyecto Open Humbolt - practica simce


```bash
npm install
npm run dev
```

Luego abre la dirección local indicada por Vite, normalmente http://localhost:5173/.

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

