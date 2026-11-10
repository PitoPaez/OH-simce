// Catálogo de ejercicios: los de la página más los cambios del docente.
//
// La configuración del curso (`curso`) es:
//   curso        { id, nombre } o null
//   desactivados ids de ejercicios que no aparecen en la práctica, el repaso ni el ensayo
//   propios      ejercicios creados por el docente
//   modificados  { id: ejercicio } versiones editadas de ejercicios de la página
//   actualizado  fecha del último cambio (milisegundos)
import { EJERCICIOS, TEMAS } from '../data/index.js';
import { almacen } from './almacen.js';

export const CURSO_VACIO = { curso: null, desactivados: [], propios: [], modificados: {}, actualizado: 0 };

export function leerCurso() {
  return { ...CURSO_VACIO, ...(almacen.leerCurso() ?? {}) };
}

export function guardarCurso(config) {
  const nuevo = { ...config, actualizado: Date.now() };
  almacen.guardarCurso(nuevo);
  return nuevo;
}

const conEje = (e) => ({ ...e, eje: TEMAS.find((t) => t.id === e.tema)?.eje ?? e.eje });

export function armarCatalogo(config = CURSO_VACIO) {
  const desactivados = new Set(config.desactivados);
  const base = EJERCICIOS.map((e) => (config.modificados[e.id] ? conEje({ ...config.modificados[e.id], id: e.id }) : e));
  const propios = config.propios.filter((e) => TEMAS.some((t) => t.id === e.tema)).map(conEje);
  // Los creados por el docente van después de los de su mismo tema.
  const todos = TEMAS.flatMap((t) => [...base.filter((e) => e.tema === t.id), ...propios.filter((e) => e.tema === t.id)]);
  const porId = new Map(todos.map((e) => [e.id, e]));
  const origen = (id) => (config.propios.some((e) => e.id === id) ? 'propio' : config.modificados[id] ? 'modificado' : 'pagina');
  return {
    temas: TEMAS,
    todos,
    activos: todos.filter((e) => !desactivados.has(e.id)),
    porId,
    activo: (id) => porId.has(id) && !desactivados.has(id),
    origen,
    original: (id) => EJERCICIOS.find((e) => e.id === id),
  };
}
