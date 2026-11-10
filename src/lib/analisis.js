// Cálculos del panel de resultados docente, a partir de los perfiles de los
// estudiantes (sus intentos) y del catálogo de ejercicios.
import { etiquetaRespuesta, mensajeError } from './retro.js';

const PRACTICA = ['solo', 'ayuda', 'solucion'];

export function nombreEstudiante(perfil) {
  return perfil.nombre || 'Sin nombre';
}

// Clave para agrupar perfiles por curso.
export function claveCurso(perfil) {
  return perfil.curso?.id ?? 'sin-curso';
}

export function cursosDe(perfiles) {
  const mapa = new Map();
  perfiles.forEach((p) => mapa.set(claveCurso(p), p.curso?.nombre ?? 'Sin curso'));
  return [...mapa].map(([id, nombre]) => ({ id, nombre })).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}

const vacioConteo = () => ({ intentos: 0, solo: 0, ayuda: 0, solucion: 0, pendiente: 0, correcta: 0, incorrecta: 0, blanco: 0 });

function sumar(conteo, r) {
  conteo.intentos += 1;
  if (r in conteo) conteo[r] += 1;
}

// Porcentaje de logro a la primera: correctas a la primera (práctica) o
// correctas (ensayo) sobre preguntas terminadas.
export function logro(c) {
  const terminadas = c.solo + c.ayuda + c.solucion + c.correcta + c.incorrecta + c.blanco;
  return terminadas ? (c.solo + c.correcta) / terminadas : null;
}

// filtros: { curso, eje, tema, desde }
export function analizar(perfiles, catalogo, filtros = {}) {
  const elegidos = perfiles.filter((p) => !filtros.curso || claveCurso(p) === filtros.curso);
  const sirve = (id) => {
    const e = catalogo.porId.get(id);
    return e && (!filtros.eje || e.eje === filtros.eje) && (!filtros.tema || e.tema === filtros.tema);
  };

  const porEjercicio = new Map();
  const porTema = new Map(catalogo.temas.map((t) => [t.id, { tema: t, ...vacioConteo(), estudiantes: new Set() }]));
  const errores = new Map();
  const total = vacioConteo();

  const estudiantes = elegidos.map((perfil) => {
    const propio = { perfil, ...vacioConteo(), errores: 0, ultima: null, porEje: {}, porTema: {}, equivocaciones: [] };
    perfil.intentos.forEach((it) => {
      if (!sirve(it.e) || (filtros.desde && it.f < filtros.desde)) return;
      const ej = catalogo.porId.get(it.e);
      sumar(propio, it.r);
      sumar(total, it.r);
      propio.ultima = Math.max(propio.ultima ?? 0, it.f);
      propio.porEje[ej.eje] ??= vacioConteo();
      sumar(propio.porEje[ej.eje], it.r);
      propio.porTema[ej.tema] ??= vacioConteo();
      sumar(propio.porTema[ej.tema], it.r);

      const tema = porTema.get(ej.tema);
      sumar(tema, it.r);
      tema.estudiantes.add(perfil.id);

      if (!porEjercicio.has(it.e)) porEjercicio.set(it.e, { ejercicio: ej, ...vacioConteo(), estudiantes: new Set(), primeras: new Map() });
      const pe = porEjercicio.get(it.e);
      sumar(pe, it.r);
      pe.estudiantes.add(perfil.id);

      // Primera respuesta: análisis de distractores.
      const equivocadas = it.x ?? [];
      const primera = equivocadas.length ? equivocadas[0][0] : it.r === 'pendiente' || it.r === 'blanco' ? `_${it.r}` : PRACTICA.includes(it.r) || it.r === 'correcta' ? '_correcta' : null;
      if (primera) {
        const valor = equivocadas.length ? equivocadas[0][1] : '';
        const fila = pe.primeras.get(primera) ?? { clave: primera, valor, veces: 0 };
        fila.veces += 1;
        pe.primeras.set(primera, fila);
      }

      // Cada respuesta equivocada distinta cuenta una vez por intento.
      const vistas = new Set();
      equivocadas.forEach(([clave, valor]) => {
        if (vistas.has(clave)) return;
        vistas.add(clave);
        propio.errores += 1;
        const k = `${it.e}|${clave}`;
        const fila = errores.get(k) ?? { ejercicio: ej, clave, valor, veces: 0, estudiantes: new Map() };
        fila.veces += 1;
        fila.estudiantes.set(perfil.id, nombreEstudiante(perfil));
        errores.set(k, fila);
        propio.equivocaciones.push({ ejercicio: ej, clave, valor, fecha: it.f });
      });
    });
    return propio;
  });

  const explicar = (fila) => ({
    ...fila,
    etiqueta: etiquetaRespuesta(fila.ejercicio, fila),
    mensaje: mensajeError(fila.ejercicio, fila),
  });

  return {
    total,
    estudiantes,
    activos: estudiantes.filter((s) => s.intentos > 0),
    temas: [...porTema.values()].filter((t) => (!filtros.eje || t.tema.eje === filtros.eje) && (!filtros.tema || t.tema.id === filtros.tema)),
    porEjercicio,
    errores: [...errores.values()]
      .map(explicar)
      .sort((a, b) => b.estudiantes.size - a.estudiantes.size || b.veces - a.veces),
    explicar,
  };
}

// Tabla para abrir en una planilla: una fila por estudiante y una columna por
// tema con el porcentaje de logro a la primera.
export function tablaCSV(analisis, temas) {
  const celda = (v) => {
    const s = String(v ?? '');
    return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const porcentaje = (c) => {
    const l = c && logro(c);
    return l === null || l === undefined ? '' : Math.round(l * 100);
  };
  const filas = [
    ['Estudiante', 'Curso', 'Preguntas', 'Logro a la primera (%)', 'Pendientes', ...temas.map((t) => t.nombre)],
    ...analisis.estudiantes.map((s) => [
      nombreEstudiante(s.perfil),
      s.perfil.curso?.nombre ?? '',
      s.intentos,
      porcentaje(s),
      s.pendiente,
      ...temas.map((t) => porcentaje(s.porTema[t.id])),
    ]),
  ];
  // Punto y coma: Excel en español lo abre en columnas sin preguntar.
  return `﻿${filas.map((f) => f.map(celda).join(';')).join('\r\n')}`;
}
