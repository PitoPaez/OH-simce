import { FRACCION, fraccionEnPalabras, partirMarcas } from '../../lib/formato.js';

// Fracción escrita en vertical, como en el cuaderno y en el SIMCE.
export function Fraccion({ numerador, denominador, entero }) {
  return (
    <span className="frac-mixta" role="img" aria-label={fraccionEnPalabras(numerador, denominador, entero)}>
      {entero && <span className="frac-entero">{entero}</span>}
      <span className="frac" aria-hidden="true">
        <span className="frac-num">{numerador}</span>
        <span className="frac-den">{denominador}</span>
      </span>
    </span>
  );
}

// Reemplaza "3/8" y "2 1/4" por fracciones verticales dentro de un texto.
export function ConFracciones({ texto }) {
  const partes = [];
  let ultimo = 0;
  String(texto).replace(FRACCION, (coincidencia, entero, num, den, indice) => {
    if (indice > ultimo) partes.push(texto.slice(ultimo, indice));
    partes.push(<Fraccion key={indice} numerador={num} denominador={den} entero={entero?.trim()} />);
    ultimo = indice + coincidencia.length;
    return coincidencia;
  });
  if (ultimo < texto.length) partes.push(texto.slice(ultimo));
  return <>{partes}</>;
}

// Texto con las marcas de datos y pregunta. Con `senalar` activo (paso
// "Entender" de la ayuda) se destacan en el mismo enunciado, junto a donde
// se leen, en vez de repetirlos en otro lugar (principio de señalización).
function Trozo({ trozo, senalar }) {
  if (trozo.tipo === 'pregunta') {
    return (
      <span className={senalar ? 'marca-pregunta marca-pregunta--activa' : 'marca-pregunta'}>
        {trozo.hijos.map((h, i) => (
          <Trozo key={i} trozo={h} senalar={senalar} />
        ))}
      </span>
    );
  }
  const contenido = <ConFracciones texto={trozo.texto} />;
  if (trozo.tipo === 'dato') return <span className={senalar ? 'marca-dato marca-dato--activa' : 'marca-dato'}>{contenido}</span>;
  if (trozo.tipo === 'enfasis') return <strong>{contenido}</strong>;
  return contenido;
}

export default function Texto({ texto, senalar = false }) {
  return (
    <>
      {partirMarcas(texto).map((trozo, i) => (
        <Trozo key={i} trozo={trozo} senalar={senalar} />
      ))}
    </>
  );
}
