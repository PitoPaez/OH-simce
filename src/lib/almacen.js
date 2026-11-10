// Único lugar de la página que guarda y lee datos.
//
// Hoy todo queda en el navegador (localStorage): no hay servidor ni cuentas.
// Si más adelante el equipo agrega un servidor (por ejemplo Firebase o
// Supabase), basta con cambiar estas funciones; el resto de la página no
// sabe dónde se guardan las cosas.
//
//   oh-simce-v3            perfiles de estudiantes de este navegador y sus respuestas
//   oh-simce-curso-v1      configuración del curso (ejercicios activos, creados y editados)
//   oh-simce-docente-v1    resultados que el docente importó desde archivos

const CLAVES = {
  estudiantes: 'oh-simce-v3',
  curso: 'oh-simce-curso-v1',
  docente: 'oh-simce-docente-v1',
  antiguo: 'oh-simce-progreso-v2',
};

function leer(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave));
  } catch {
    return null;
  }
}

// Devuelve false si no se pudo guardar (modo privado o almacenamiento lleno).
function escribir(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

export const almacen = {
  leerEstudiantes: () => leer(CLAVES.estudiantes),
  guardarEstudiantes: (valor) => escribir(CLAVES.estudiantes, valor),
  leerProgresoAntiguo: () => leer(CLAVES.antiguo),
  leerCurso: () => leer(CLAVES.curso),
  guardarCurso: (valor) => escribir(CLAVES.curso, valor),
  leerDocente: () => leer(CLAVES.docente),
  guardarDocente: (valor) => escribir(CLAVES.docente, valor),
};

// Descarga un archivo generado en la página (resultados, ejercicios, CSV).
export function descargar(nombre, contenido, tipo = 'application/json') {
  const texto = typeof contenido === 'string' ? contenido : JSON.stringify(contenido, null, 2);
  const url = URL.createObjectURL(new Blob([texto], { type: `${tipo};charset=utf-8` }));
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function nombreArchivo(...partes) {
  return partes
    .filter(Boolean)
    .join('-')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}
