// Funciones para hablar con el backend de Spring Boot.
// Si existe la variable VITE_API_URL (archivo .env) se usa esa dirección.
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

// Pide al backend la lista de preguntas. Devuelve un arreglo de ejercicios.
export async function pedirEjercicios() {
  const respuesta = await fetch(`${API_URL}/ejercicios`);
  if (!respuesta.ok) {
    throw new Error(`El backend respondió con el código ${respuesta.status}`);
  }
  return respuesta.json();
}
