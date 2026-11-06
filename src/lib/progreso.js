// Progreso del estudiante, guardado solo en este navegador.
//
// Estado de cada ejercicio:
//   'solo'      correcto al primer intento y sin pedir ayuda
//   'ayuda'     correcto, pero con ayuda o después de corregir un error
//   'solucion'  vio cómo se resuelve
// Los que no quedan en 'solo' pasan a la lista "Repasar" (práctica espaciada).
const CLAVE = 'oh-simce-progreso-v2';

const VACIO = { ejercicios: {}, ejemplosVistos: {}, ensayos: [], ultimoTema: null };

export function leerProgreso() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE));
    return guardado ? { ...VACIO, ...guardado } : VACIO;
  } catch {
    return VACIO;
  }
}

export function guardarProgreso(progreso) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(progreso));
  } catch {
    // Sin almacenamiento (modo privado): el progreso dura solo esta visita.
  }
}

export function idsParaRepasar(progreso) {
  return Object.entries(progreso.ejercicios)
    .filter(([, estado]) => estado !== 'solo')
    .map(([id]) => id);
}
