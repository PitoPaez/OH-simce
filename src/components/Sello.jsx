import { imagenSello } from '../lib/imagenes';

// Sello circular, como un timbre de tinta, con su centro en la esquina de arriba
// a la derecha del recuadro que lo contiene (ese recuadro debe tener position: relative).
// Son imágenes PNG con fondo transparente:
//   public/img/sellos/sello-correcto.png    (verde, con tic y CORRECTO)
//   public/img/sellos/sello-incorrecto.png  (rojo, con X e INCORRECTO)
// animado: aparece con un golpe de timbre.
const NOMBRES = {
  correcto: 'Correcto',
  incorrecto: 'Incorrecto',
};

export default function Sello({ tipo = 'correcto', animado }) {
  return (
    <div className={`sello sello--${tipo}${animado ? ' sello--animado' : ''}`}>
      <img src={imagenSello(tipo)} alt={NOMBRES[tipo]} draggable="false" />
    </div>
  );
}
