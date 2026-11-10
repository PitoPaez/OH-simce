// Un curso inventado, para conocer el panel de resultados antes de tener
// datos reales. Los nombres son ficticios y los resultados se generan al azar
// (siempre los mismos), con algunos errores más frecuentes que otros, como
// pasa en una sala de clases.

const NOMBRES = [
  'Agustina R.', 'Bastián M.', 'Catalina F.', 'Diego A.', 'Emilia C.', 'Fernanda P.', 'Gaspar L.', 'Héctor V.',
  'Ignacia S.', 'Javiera T.', 'Joaquín O.', 'Laura N.', 'Lucas G.', 'Magdalena H.', 'Maximiliano B.', 'Monserrat D.',
  'Nicolás E.', 'Olivia Q.', 'Pablo I.', 'Renata U.', 'Santiago K.', 'Trinidad Z.', 'Valentina Y.', 'Cristóbal J.',
];

function azar(semilla) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function numeroDe(texto) {
  let h = 2166136261;
  for (const c of texto) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

// Respuestas equivocadas posibles de un ejercicio: [clave, valor].
function equivocadas(e) {
  if (e.tipo === 'alternativas') return e.opciones.filter((o) => !o.correcta).map((o) => [o.texto, o.texto]);
  if (e.tipo === 'quien') return e.personas.filter((o) => !o.correcta).map((o) => [o.nombre, o.nombre]);
  if (e.tipo === 'pintarCuadricula') {
    if (e.modo === 'simetria') return [['copiada', ''], ['noEspejo', ''], ['ladoEquivocado', '']];
    return e.perimetro ? [['otroPerimetro', String(e.perimetro + 2)], ['noRectangulo', '']] : [['otraArea', String((e.area ?? 6) + 2)], ['noRectangulo', '']];
  }
  if (e.tipo === 'ordenar') return [['alReves', ''], ['otro', '']];
  return Object.keys(e.errores ?? {})
    .filter((k) => k !== 'otro')
    .map((k) => [k, k]);
}

export function cursoDeEjemplo(catalogo) {
  const curso = { id: 'ejemplo', nombre: '4° A (ejemplo)' };
  const ahora = Date.now();
  const dia = 86400000;
  return NOMBRES.map((nombre, n) => {
    const r = azar(1000 + n);
    const habilidad = 0.35 + r() * 0.55;
    const intentos = [];
    const ejercicios = {};
    catalogo.activos.forEach((e) => {
      if (r() > 0.6) return;
      const re = azar(numeroDe(e.id));
      const dificultad = re() * 0.6;
      // El primer error de la lista es el «favorito» de este ejercicio.
      const malas = equivocadas(e);
      const favorita = Math.floor(re() * malas.length);
      const f = ahora - Math.floor(r() * 21 * dia);
      const elegirMala = () => malas[r() < 0.6 ? favorita : Math.floor(r() * malas.length)];
      if (r() < 0.05) {
        intentos.push({ e: e.id, f, m: 'tema', r: 'pendiente', x: malas.length && r() < 0.5 ? [elegirMala()] : undefined });
        ejercicios[e.id] = 'pendiente';
        return;
      }
      if (r() < habilidad * (1 - dificultad) + 0.1) {
        intentos.push({ e: e.id, f, m: 'tema', r: 'solo' });
        ejercicios[e.id] = 'solo';
        return;
      }
      // Sin respuestas equivocadas conocidas, solo se registra que necesitó ayuda.
      const x = malas.length ? [elegirMala()] : [];
      if (malas.length && r() < 0.45) {
        const otra = malas[Math.floor(r() * malas.length)];
        if (otra[0] !== x[0][0]) x.push(otra);
      }
      const resultado = x.length > 1 && r() < 0.4 ? 'solucion' : 'ayuda';
      intentos.push({ e: e.id, f, m: 'tema', r: resultado, x: x.length ? x : undefined, a: Math.floor(r() * 3) });
      ejercicios[e.id] = resultado;
    });
    const ensayos = [0, 1].slice(0, 1 + Math.floor(r() * 2)).map((k) => ({
      fecha: new Date(ahora - (14 - k * 7) * dia).toISOString(),
      correctas: Math.round(15 * (habilidad - 0.1 + r() * 0.2)),
      total: 15,
    }));
    intentos.sort((a, b) => a.f - b.f);
    return {
      id: `ejemplo-${n}`,
      nombre,
      curso,
      creado: ahora - 30 * dia,
      progreso: { ejercicios, ejemplosVistos: {}, ensayos, ultimoTema: null },
      intentos,
    };
  });
}
