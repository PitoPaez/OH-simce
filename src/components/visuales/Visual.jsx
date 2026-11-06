// Representaciones pictóricas (etapa "pictórica" de COPISI). Cada ejercicio
// declara su dibujo en los datos con { tipo, ...props }.
import { Arreglo, Balanza, Barras, Columnas, Etapas, FraccionVisual, NumeroDestacado, Posicional, Precios, Recta, Secuencia, Tabla } from './numeros.jsx';
import { Angulos, Coordenadas, Cuerpo, Figura2D, Figuras, Plano, Red, Sala } from './geometria.jsx';
import { Area, Cubos, CubosConPisos, Longitudes, Poligono, Reloj } from './medicion.jsx';
import { Bolsas, Grafico, Pictograma } from './datos.jsx';

const TIPOS = {
  posicional: Posicional,
  numeroDestacado: NumeroDestacado,
  columnas: Columnas,
  barras: Barras,
  arreglo: Arreglo,
  fraccion: FraccionVisual,
  recta: Recta,
  secuencia: Secuencia,
  etapas: Etapas,
  balanza: Balanza,
  precios: Precios,
  tabla: Tabla,
  coordenadas: Coordenadas,
  plano: Plano,
  sala: Sala,
  cuerpo: Cuerpo,
  figura: Figura2D,
  figuras: Figuras,
  red: Red,
  angulos: Angulos,
  reloj: Reloj,
  longitudes: Longitudes,
  poligono: Poligono,
  area: Area,
  cubos: Cubos,
  cubosPisos: CubosConPisos,
  grafico: Grafico,
  pictograma: Pictograma,
  bolsas: Bolsas,
};

// Varios dibujos juntos (por ejemplo, un reloj y una tabla).
function Grupo({ items }) {
  return (
    <div className="v-grupo">
      {items.map((item, i) => (
        <Visual key={i} visual={item} enMarco={false} />
      ))}
    </div>
  );
}

export default function Visual({ visual, enMarco = true }) {
  if (!visual) return null;
  const Componente = visual.tipo === 'grupo' ? Grupo : TIPOS[visual.tipo];
  if (!Componente) {
    console.warn(`Dibujo desconocido: ${visual.tipo}`);
    return null;
  }
  const dibujo = <Componente {...visual} />;
  if (!enMarco) return dibujo;
  return <figure className={`visual visual--${visual.tipo}`}>{dibujo}</figure>;
}
