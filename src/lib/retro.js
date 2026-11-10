// Retroalimentación: qué mensaje ve el estudiante según su respuesta. Lo usan
// la pregunta (para responderle al estudiante) y el panel docente (para mostrar
// qué error hay detrás de cada respuesta equivocada).

// Mensaje cuando el error no tiene uno propio en el ejercicio.
export const GENERICO = {
  numero: 'Tu respuesta fue {valor}. Revisa tu cálculo paso a paso, o pide ayuda.',
  bloques: 'Formaste {valor}. Compara columna por columna: ¿cuántas unidades de mil, centenas, decenas y unidades necesitas?',
  pintar: 'Pintaste {valor}. Fíjate en el número de arriba de la fracción: dice cuántas partes hay que pintar.',
  recta: 'Pusiste el punto en {valor}. Cuenta los saltos entre las marcas: ¿cuánto vale cada salto?',
  balanza: 'Con □ = {valor} la balanza no queda como se pide. Mira hacia dónde se inclina y ajusta el valor.',
  reloj: 'El reloj marca {valor}. Revisa las dos manecillas: la corta es la hora y la larga, los minutos.',
  cuadricula: 'Quedó en {valor}. Recuerda: primero la letra (la columna, abajo) y después el número (la fila, al costado).',
  noRectangulo: 'Los cuadrados que pintaste no forman un rectángulo. Un rectángulo no tiene huecos ni partes que sobresalen.',
  otraArea: 'Es un rectángulo, pero tiene {valor} cuadrados. ¿Cuántos tiene que tener?',
  otroPerimetro: 'Es un rectángulo, pero su perímetro es {valor} cm. Recorre el borde y cuenta los lados de los cuadritos.',
  ladoEquivocado: 'Pintaste cuadrados en el lado que ya estaba listo. Pinta solo al otro lado de la línea roja.',
  copiada:
    'Copiaste la figura tal cual, como un timbre. Al reflejarla queda dada vuelta, como en un espejo: lo que está cerca de la línea sigue cerca de la línea.',
  noEspejo: 'Todavía no es el reflejo. Cada cuadrado debe quedar a la misma distancia de la línea roja que su pareja, pero al otro lado.',
  barra: 'La barra quedó en {valor}. Usa el total y los datos de las otras barras para calcular la que falta.',
  alReves: 'Los ordenaste al revés. Lee otra vez: ¿se pide de menor a mayor o de mayor a menor?',
  otro: 'Todavía no está bien. Revisa con calma uno por uno.',
  alternativas: 'Esa no es. Lee otra vez la pregunta y revisa los datos.',
};

// Cómo se muestra al docente una respuesta que no es un número ni un texto.
const ETIQUETAS = {
  noRectangulo: 'Pintó una figura que no es rectángulo',
  otraArea: 'Rectángulo de {valor} cuadrados',
  otroPerimetro: 'Rectángulo de perímetro {valor} cm',
  ladoEquivocado: 'Pintó en el lado que ya estaba listo',
  copiada: 'Copió la figura sin reflejarla',
  noEspejo: 'Reflejo que no calza',
  alReves: 'Ordenó al revés',
  igual: 'Dejó la balanza en equilibrio',
  otro: 'Otra respuesta',
};

const conValor = (texto, valor) => texto.replaceAll('{valor}', valor ?? '');

function opcionesDe(ejercicio) {
  if (ejercicio.tipo === 'quien') return (ejercicio.personas ?? []).map((p) => ({ ...p, texto: p.nombre }));
  return ejercicio.opciones ?? [];
}

// resultado: { clave, valor, error? } tal como lo entrega un interactivo o
// una alternativa.
export function mensajeError(ejercicio, resultado) {
  if (resultado.error) return resultado.error;
  const opcion = opcionesDe(ejercicio).find((o) => o.texto === resultado.clave);
  if (opcion) return opcion.correcta ? '' : opcion.error ?? GENERICO.alternativas;
  const mapa = ejercicio.errores ?? {};
  const texto = mapa[resultado.clave] ?? GENERICO[resultado.clave] ?? mapa.otro ?? GENERICO[ejercicio.tipo] ?? GENERICO.otro;
  return conValor(texto, resultado.valor);
}

// Texto corto de la respuesta, para el panel docente.
export function etiquetaRespuesta(ejercicio, { clave, valor }) {
  if (ETIQUETAS[clave]) return conValor(ETIQUETAS[clave], valor);
  if (ejercicio.tipo === 'quien') return `Le dio la razón a ${clave}`;
  return valor || clave || 'Sin respuesta';
}
