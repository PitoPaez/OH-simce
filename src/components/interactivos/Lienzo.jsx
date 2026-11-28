import { useEffect, useImperativeHandle, useRef } from 'react';

// Superficie para escribir con el dedo, un lápiz o el mouse.
// ref expone: borrar(), trazos() → [[{x, y}, ...], ...] en píxeles CSS.
// onTrazo se llama cada vez que se termina un trazo.
export default function Lienzo({ ref, className = '', grosor = 4, color = '#22305a', etiqueta, onTrazo }) {
  const canvasRef = useRef(null);
  const trazosRef = useRef([]);
  const actualRef = useRef(null);

  function contexto() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = grosor;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    return ctx;
  }

  function redibujar() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = contexto();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const t of trazosRef.current) dibujarTrazo(ctx, t);
  }

  function dibujarTrazo(ctx, t) {
    if (t.length === 1) {
      ctx.beginPath();
      ctx.arc(t[0].x, t[0].y, grosor / 2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    ctx.beginPath();
    ctx.moveTo(t[0].x, t[0].y);
    for (const p of t.slice(1)) ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }

  // El tamaño interno del canvas sigue al tamaño en pantalla (nítido en pantallas retina).
  useEffect(() => {
    const canvas = canvasRef.current;
    const ajustar = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      redibujar();
    };
    ajustar();
    const obs = new ResizeObserver(ajustar);
    obs.observe(canvas);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    borrar() {
      trazosRef.current = [];
      redibujar();
    },
    trazos: () => trazosRef.current,
  }));

  function punto(e) {
    const r = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function bajar(e) {
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    canvasRef.current.setPointerCapture(e.pointerId);
    actualRef.current = [punto(e)];
    trazosRef.current = [...trazosRef.current, actualRef.current];
    dibujarTrazo(contexto(), actualRef.current);
  }

  function mover(e) {
    const t = actualRef.current;
    if (!t) return;
    const eventos = e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent];
    const ctx = contexto();
    for (const ev of eventos) {
      const p = punto(ev);
      const ultimo = t.at(-1);
      t.push(p);
      ctx.beginPath();
      ctx.moveTo(ultimo.x, ultimo.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  }

  function subir() {
    if (!actualRef.current) return;
    actualRef.current = null;
    onTrazo?.(trazosRef.current);
  }

  return (
    <canvas
      ref={canvasRef}
      className={`lienzo ${className}`}
      role="img"
      aria-label={etiqueta}
      onPointerDown={bajar}
      onPointerMove={mover}
      onPointerUp={subir}
      onPointerCancel={subir}
    />
  );
}
