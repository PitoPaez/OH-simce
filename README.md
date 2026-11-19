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
