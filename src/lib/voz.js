// Lectura en voz alta (principio de modalidad): ayuda a quienes todavía leen
// lento, porque en el SIMCE de Matemática la comprensión lectora también pesa.
// Siempre la activa el estudiante; nunca se reproduce sola.
import { FRACCION, fraccionEnPalabras, textoPlano } from './formato.js';

export const puedeHablar = typeof window !== 'undefined' && 'speechSynthesis' in window;

function elegirVoz() {
  const voces = window.speechSynthesis.getVoices();
  return (
    voces.find((v) => v.lang === 'es-CL') ||
    voces.find((v) => v.lang === 'es-419' || v.lang === 'es-US' || v.lang === 'es-MX') ||
    voces.find((v) => v.lang.startsWith('es'))
  );
}

// Adapta los símbolos matemáticos para que la voz los lea bien.
export function paraLeer(texto) {
  return textoPlano(texto)
    .replace(/(\d)\u00a0(?=\d{3})/g, '$1')
    .replace(FRACCION, (_, entero, num, den) => fraccionEnPalabras(num, den, entero?.trim()))
    .replace(/\s:\s/g, ' dividido por ')
    .replace(/\+/g, ' más ')
    .replace(/×/g, ' por ')
    .replace(/−/g, ' menos ')
    .replace(/□/g, 'cuadrado')
    .replace(/▲/g, 'triángulo')
    .replace(/●/g, 'círculo')
    .replace(/</g, ' es menor que ')
    .replace(/>/g, ' es mayor que ')
    .replace(/=/g, ' es igual a ')
    .replace(/(\d),(\d)/g, '$1 coma $2')
    .replace(/\$(\d+)/g, '$1 pesos')
    .replace(/cm²/g, 'centímetros cuadrados')
    .replace(/\bcm\b/g, 'centímetros')
    .replace(/(\d) m\b/g, '$1 metros')
    .replace(/\bkm\b/g, 'kilómetros')
    .replace(/\bkg\b/g, 'kilos')
    .replace(/\s+/g, ' ');
}

export function leer(texto) {
  if (!puedeHablar) return;
  window.speechSynthesis.cancel();
  const voz = new SpeechSynthesisUtterance(paraLeer(texto));
  voz.lang = 'es-CL';
  voz.rate = 0.9;
  const elegida = elegirVoz();
  if (elegida) voz.voice = elegida;
  window.speechSynthesis.speak(voz);
}

export function callar() {
  if (puedeHablar) window.speechSynthesis.cancel();
}
