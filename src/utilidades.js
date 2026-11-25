// Funciones pequeñas que usan varias pantallas.

export function mezclar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Leer en voz alta (botón «Escuchar»).
export const puedeHablar = typeof window !== 'undefined' && 'speechSynthesis' in window;

export function hablar(texto) {
  if (!puedeHablar) return;
  window.speechSynthesis.cancel();
  const voz = new SpeechSynthesisUtterance(texto);
  voz.lang = 'es-CL';
  voz.rate = 0.9;
  window.speechSynthesis.speak(voz);
}

export function callar() {
  if (puedeHablar) window.speechSynthesis.cancel();
}

// Progreso: ids de los ejercicios logrados a la primera. Queda en este navegador.
const CLAVE_PROGRESO = 'oh-simce-progreso';

export function leerProgreso() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_PROGRESO)) ?? {};
  } catch {
    return {};
  }
}

export function guardarProgreso(progreso) {
  try {
    localStorage.setItem(CLAVE_PROGRESO, JSON.stringify(progreso));
  } catch {
    // Sin almacenamiento (modo privado): el progreso dura solo esta visita.
  }
}
