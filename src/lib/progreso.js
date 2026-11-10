// Perfiles de estudiantes, su progreso y el registro de sus respuestas.
//
// En un mismo navegador puede haber varios perfiles (por ejemplo, el
// computador de la sala de computación). Cada perfil guarda:
//
//   progreso.ejercicios   estado de cada ejercicio (ver ESTADOS)
//   progreso.ensayos      resultado de cada ensayo
//   intentos              una línea por pregunta terminada, para el panel docente
//
// Cada intento es { e, f, m, r, x?, a?, p? }, con nombres cortos porque se
// guardan cientos:
//   e  id del ejercicio
//   f  fecha (milisegundos)
//   m  modo: 'tema' | 'repaso' | 'ejercicio' | 'ensayo'
//   r  resultado: un estado de ESTADOS, o en el ensayo 'correcta' | 'incorrecta' | 'blanco'
//   x  respuestas equivocadas, en orden: [[clave, valor], ...]
//   a  cuántas ayudas pidió
//   p  1 si la marcó como pendiente en el ensayo
import { almacen } from './almacen.js';

export const ESTADOS = {
  solo: 'Correcta a la primera y sin ayuda',
  ayuda: 'Correcta con ayuda o después de corregir',
  solucion: 'Vio cómo se resuelve',
  pendiente: 'La dejó para después',
  ensayo: 'Incorrecta o sin responder en un ensayo',
};

// Partes de «Repasar», para que el estudiante elija qué repasar.
export const PARTES_REPASO = [
  { id: 'pendiente', nombre: 'Las que dejé para después', estados: ['pendiente'] },
  { id: 'ayuda', nombre: 'Las que me costaron', estados: ['ayuda'] },
  { id: 'solucion', nombre: 'Las que vi resueltas', estados: ['solucion'] },
  { id: 'ensayo', nombre: 'Las que no salieron en el ensayo', estados: ['ensayo'] },
];

const MAXIMO_INTENTOS = 1500;

export const PROGRESO_VACIO = { ejercicios: {}, ejemplosVistos: {}, ensayos: [], ultimoTema: null };

export function nuevoId(prefijo = 'p') {
  const azar = globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
  return `${prefijo}-${azar.replace(/-/g, '').slice(0, 12)}`;
}

export function crearPerfil(nombre = '', curso = null, progreso = PROGRESO_VACIO) {
  return { id: nuevoId('p'), nombre: nombre.trim(), curso, creado: Date.now(), progreso: { ...PROGRESO_VACIO, ...progreso }, intentos: [] };
}

function normalizarPerfil(p) {
  return { ...p, nombre: p.nombre ?? '', curso: p.curso ?? null, progreso: { ...PROGRESO_VACIO, ...p.progreso }, intentos: p.intentos ?? [] };
}

// Lee los perfiles de este navegador. La primera vez pasa el progreso de la
// versión anterior (sin perfiles) a un perfil sin nombre.
export function cargarEstudiantes() {
  const guardado = almacen.leerEstudiantes();
  if (guardado?.perfiles && Object.keys(guardado.perfiles).length) {
    const perfiles = Object.fromEntries(Object.values(guardado.perfiles).map((p) => [p.id, normalizarPerfil(p)]));
    const activo = perfiles[guardado.activo] ? guardado.activo : Object.keys(perfiles)[0];
    return { activo, perfiles };
  }
  const perfil = crearPerfil('', null, almacen.leerProgresoAntiguo() ?? PROGRESO_VACIO);
  return { activo: perfil.id, perfiles: { [perfil.id]: perfil } };
}

export function guardarEstudiantes(estado) {
  if (almacen.guardarEstudiantes(estado)) return;
  // Almacenamiento lleno: se conservan los intentos más recientes.
  const perfiles = Object.fromEntries(Object.entries(estado.perfiles).map(([id, p]) => [id, { ...p, intentos: p.intentos.slice(-300) }]));
  almacen.guardarEstudiantes({ ...estado, perfiles });
}

export function anotar(perfil, intento) {
  return { ...perfil, intentos: [...perfil.intentos, { f: Date.now(), ...intento }].slice(-MAXIMO_INTENTOS) };
}

// Ids de los ejercicios que corresponde repasar. `partes` limita a algunas
// partes de PARTES_REPASO (por defecto, todas).
export function idsParaRepasar(progreso, partes = PARTES_REPASO.map((p) => p.id)) {
  const estados = PARTES_REPASO.filter((p) => partes.includes(p.id)).flatMap((p) => p.estados);
  return Object.entries(progreso.ejercicios)
    .filter(([, estado]) => estados.includes(estado))
    .map(([id]) => id);
}

export function parteDeEstado(estado) {
  return PARTES_REPASO.find((p) => p.estados.includes(estado))?.id ?? null;
}

// ---- Archivos de resultados -------------------------------------------------
// El estudiante descarga un archivo con sus resultados y lo entrega a su
// profesor o profesora, que lo carga en el panel docente.

export const FORMATO_RESULTADOS = 'oh-simce-resultados';

export function archivoResultados(perfiles) {
  return {
    formato: FORMATO_RESULTADOS,
    version: 1,
    exportado: new Date().toISOString(),
    perfiles: perfiles.map(({ id, nombre, curso, creado, progreso, intentos }) => ({ id, nombre, curso, creado, progreso, intentos })),
  };
}

// Devuelve los perfiles de un archivo de resultados, o lanza un error con un
// mensaje para mostrar.
export function leerArchivoResultados(texto) {
  let datos;
  try {
    datos = JSON.parse(texto);
  } catch {
    throw new Error('El archivo no es un archivo de resultados de OH Simce.');
  }
  if (datos?.formato !== FORMATO_RESULTADOS || !Array.isArray(datos.perfiles)) {
    throw new Error('El archivo no es un archivo de resultados de OH Simce.');
  }
  return datos.perfiles.filter((p) => p && typeof p.id === 'string').map(normalizarPerfil);
}
