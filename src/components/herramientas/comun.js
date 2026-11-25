import { useRef } from 'react';

// Lo que comparten las herramientas interactivas.

// 1 cm en las coordenadas de los dibujos. El dibujo se escala a la pantalla.
export const CM = 40;

export function limitar(valor, minimo, maximo) {
  return Math.min(maximo, Math.max(minimo, valor));
}

// Para arrastrar algo dentro de un SVG con el dedo o el mouse. alMover recibe
// el punto en coordenadas del dibujo y si el arrastre recién empieza.
export function useArrastre(svgRef, alMover, activo) {
  const arrastrando = useRef(false);
  const punto = (evento) => {
    const p = svgRef.current.createSVGPoint();
    p.x = evento.clientX;
    p.y = evento.clientY;
    return p.matrixTransform(svgRef.current.getScreenCTM().inverse());
  };
  return {
    onPointerDown(evento) {
      if (!activo) return;
      arrastrando.current = true;
      evento.currentTarget.setPointerCapture(evento.pointerId);
      alMover(punto(evento), true);
    },
    onPointerMove(evento) {
      if (arrastrando.current) alMover(punto(evento), false);
    },
    onPointerUp() {
      arrastrando.current = false;
    },
  };
}
