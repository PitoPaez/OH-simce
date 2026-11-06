// Formato de números como en el SIMCE: miles separados con espacio (7 560)
// y decimales con coma (7,40). Se usa un espacio que no se corta ( )
// para que el número nunca quede partido en dos líneas.
const ESPACIO = ' ';

export function f(numero) {
  const [entero, decimal] = String(numero).split('.');
  const conMiles = entero.length > 3 ? entero.replace(/\B(?=(\d{3})+(?!\d))/g, ESPACIO) : entero;
  return decimal === undefined ? conMiles : `${conMiles},${decimal}`;
}

// Precio en pesos chilenos: $2 100
export function peso(numero) {
  return `$${f(numero)}`;
}

// Decimal con una cantidad fija de cifras: dec(7.4, 2) -> "7,40"
export function dec(numero, cifras) {
  return numero.toFixed(cifras).replace('.', ',');
}

// Convierte lo que escribe el estudiante en un número.
// Acepta "4 800", "4.800", "4800", "0,38" y "$ 4 800".
export function leerNumero(texto) {
  const limpio = String(texto)
    .replace(/[$\s ]/g, '')
    .trim();
  if (!limpio) return null;
  let normal = limpio;
  if (normal.includes(',')) {
    normal = normal.replace(/\./g, '').replace(',', '.');
  } else if (/^\d{1,3}(\.\d{3})+$/.test(normal)) {
    normal = normal.replace(/\./g, '');
  }
  const valor = Number(normal);
  return Number.isFinite(valor) ? valor : null;
}

// Las marcas del enunciado:
//   [[dato]]       un dato que se necesita para resolver
//   {{pregunta}}   lo que se pregunta
//   **énfasis**    una palabra clave en negrita, como en el SIMCE
// La pregunta puede contener datos y énfasis adentro:
//   {{¿Cuántos suéteres **menos** que abrigos se donaron?}}
const PREGUNTA = /(\{\{.+?\}\})/g;
const INTERNAS = /(\[\[.+?\]\]|\*\*.+?\*\*)/g;

function partirInternas(texto) {
  return texto
    .split(INTERNAS)
    .filter(Boolean)
    .map((trozo) => {
      if (trozo.startsWith('[[')) return { tipo: 'dato', texto: trozo.slice(2, -2) };
      if (trozo.startsWith('**')) return { tipo: 'enfasis', texto: trozo.slice(2, -2) };
      return { tipo: 'texto', texto: trozo };
    });
}

export function partirMarcas(texto) {
  return String(texto)
    .split(PREGUNTA)
    .filter(Boolean)
    .flatMap((trozo) => (trozo.startsWith('{{') ? [{ tipo: 'pregunta', hijos: partirInternas(trozo.slice(2, -2)) }] : partirInternas(trozo)));
}

export function textoPlano(texto) {
  return partirMarcas(texto)
    .map((t) => (t.hijos ? t.hijos.map((h) => h.texto).join('') : t.texto))
    .join('');
}

// Fracciones escritas como "3/8" o números mixtos como "2 1/4".
export const FRACCION = /(\d+\s)?(\d+)\/(\d+)/g;

const NOMBRES_FRACCION = {
  2: ['medio', 'medios'],
  3: ['tercio', 'tercios'],
  4: ['cuarto', 'cuartos'],
  5: ['quinto', 'quintos'],
  6: ['sexto', 'sextos'],
  7: ['séptimo', 'séptimos'],
  8: ['octavo', 'octavos'],
  9: ['noveno', 'novenos'],
  10: ['décimo', 'décimos'],
  12: ['doceavo', 'doceavos'],
  100: ['centésimo', 'centésimos'],
};

export function fraccionEnPalabras(numerador, denominador, entero) {
  const nombres = NOMBRES_FRACCION[denominador];
  const parte = nombres
    ? `${Number(numerador) === 1 ? 'un' : numerador} ${Number(numerador) === 1 ? nombres[0] : nombres[1]}`
    : `${numerador} partido por ${denominador}`;
  return entero ? `${entero} enteros y ${parte}` : parte;
}
