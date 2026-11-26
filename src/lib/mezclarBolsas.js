// Reparte al azar el contenido de las bolsas entre "Bolsa 1", "Bolsa 2", ...
// cada vez que se abre la pregunta, para que la respuesta correcta no esté
// siempre en el mismo lugar.
//
// Se usa en ejercicios con  "mezclarBolsas": true  y un dibujo de tipo "bolsas".
// En los textos (enunciado, feedback, pistas y solución) cada bolsa se nombra
// por su lugar en los datos, y aquí se reemplaza por su nombre nuevo:
//   {B2} → "Bolsa 4"     {b2} → "bolsa 4"
// Las opciones se emparejan con las bolsas por su texto ("Bolsa 2").

// Lugar (0, 1, 2…) donde quedó la bolsa correcta la última vez, para no repetirlo
// dos veces seguidas.
const ultimoLugar = new Map();

function mezclar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export function mezclarBolsas(ejercicio) {
  const bolsas = ejercicio.visual?.bolsas;
  if (!ejercicio.mezclarBolsas || !Array.isArray(bolsas) || bolsas.length < 2) return ejercicio;

  const etiquetas = bolsas.map((b) => b.etiqueta);
  const indiceCorrecta = etiquetas.indexOf(ejercicio.opciones?.find((o) => o.correcta)?.texto);

  // destino[i] = lugar nuevo del contenido que estaba en la bolsa i
  let destino = mezclar(etiquetas.map((_, i) => i));
  for (let intento = 0; intento < 20 && indiceCorrecta >= 0; intento++) {
    if (destino[indiceCorrecta] !== ultimoLugar.get(ejercicio.id)) break;
    destino = mezclar(etiquetas.map((_, i) => i));
  }
  if (indiceCorrecta >= 0) ultimoLugar.set(ejercicio.id, destino[indiceCorrecta]);

  const nombreNuevo = (i) => etiquetas[destino[i]];
  const reemplazar = (texto) =>
    typeof texto === 'string'
      ? texto.replace(/\{([Bb])(\d+)\}/g, (todo, letra, n) => {
          const i = Number(n) - 1;
          if (i < 0 || i >= etiquetas.length) return todo;
          const nombre = nombreNuevo(i);
          return letra === 'B' ? nombre : nombre.toLowerCase();
        })
      : texto;

  // En el lugar j queda el contenido de la bolsa que se movió a j.
  const nuevasBolsas = etiquetas.map((etiqueta, j) => ({ ...bolsas[destino.indexOf(j)], etiqueta }));

  return {
    ...ejercicio,
    enunciado: reemplazar(ejercicio.enunciado),
    visual: { ...ejercicio.visual, bolsas: nuevasBolsas },
    opciones: ejercicio.opciones?.map((o) => {
      const i = etiquetas.indexOf(o.texto);
      return { ...o, texto: i >= 0 ? nombreNuevo(i) : o.texto, feedback: reemplazar(o.feedback) };
    }),
    pistas: ejercicio.pistas?.map(reemplazar),
    solucion: reemplazar(ejercicio.solucion),
  };
}
