// Comunicación con el backend de Spring Boot (repositorio Backend_OH).
// La dirección se puede cambiar con la variable VITE_API_URL (archivo .env).
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

const INTERACCIONES = ['alternativas', 'ordenar', 'numerica'];

// Revisa que un ejercicio que viene del backend tenga lo necesario para mostrarse.
export function esEjercicioValido(e) {
  if (!e || typeof e.id !== 'string' || typeof e.eje !== 'string' || typeof e.enunciado !== 'string') return false;
  if (!Array.isArray(e.pistas) || typeof e.solucion !== 'string') return false;
  const tipo = e.interaccion ?? 'alternativas';
  if (!INTERACCIONES.includes(tipo)) return false;
  if (tipo === 'alternativas') return Array.isArray(e.opciones) && e.opciones.some((o) => o.correcta);
  if (tipo === 'ordenar') {
    const o = e.ordenar;
    return Boolean(o) && Array.isArray(o.elementos) && Array.isArray(o.casillas) && Array.isArray(o.correcto)
      && o.correcto.length === o.casillas.length;
  }
  return Array.isArray(e.pasos) && e.pasos.length > 0 && e.pasos.every((p) => typeof p.respuesta === 'number');
}

// Pide los ejercicios al backend. Cada uno viene con la pregunta completa en "contenido".
// eje (opcional): 'numeros', 'datos', etc.
export async function pedirEjercicios(eje) {
  const url = eje ? `${API_URL}/ejercicios?eje=${encodeURIComponent(eje)}` : `${API_URL}/ejercicios`;
  const respuesta = await fetch(url, { signal: AbortSignal.timeout(4000) });
  if (!respuesta.ok) {
    throw new Error(`El backend respondió con el código ${respuesta.status}`);
  }
  const datos = await respuesta.json();
  return datos.map((e) => ({ ...e.contenido, id: e.id, eje: e.eje })).filter(esEjercicioValido);
}

// Junta los ejercicios del frontend con los del backend: si el backend trae uno con
// el mismo id, se usa la versión del backend (por ejemplo, editada por el docente);
// los que solo existen en el backend se agregan al final de su eje.
export function combinarEjercicios(locales, remotos, ejesValidos) {
  const porId = new Map(remotos.map((e) => [e.id, e]));
  const combinados = locales.map((e) => porId.get(e.id) ?? e);
  const idsLocales = new Set(locales.map((e) => e.id));
  const nuevos = remotos.filter((e) => !idsLocales.has(e.id) && ejesValidos.includes(e.eje));
  return [...combinados, ...nuevos];
}
