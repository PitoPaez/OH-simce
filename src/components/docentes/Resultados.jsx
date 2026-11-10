import { useMemo, useRef, useState } from 'react';
import { EJES, colorEje } from '../../data/ejes.js';
import { almacen, descargar, nombreArchivo } from '../../lib/almacen.js';
import { analizar, cursosDe, logro, nombreEstudiante, tablaCSV } from '../../lib/analisis.js';
import { cursoDeEjemplo } from '../../lib/datosEjemplo.js';
import { leerArchivoResultados } from '../../lib/progreso.js';
import { textoPlano } from '../../lib/formato.js';
import { etiquetaRespuesta, mensajeError } from '../../lib/retro.js';
import Texto, { ConFracciones } from '../ui/Texto.jsx';
import Visual from '../visuales/Visual.jsx';

const DIA = 86400000;
const PERIODOS = [
  { id: 'todo', nombre: 'Todo' },
  { id: '7', nombre: 'Últimos 7 días' },
  { id: '30', nombre: 'Últimos 30 días' },
];
const VISTAS = [
  { id: 'errores', nombre: 'Errores frecuentes' },
  { id: 'temas', nombre: 'Por tema' },
  { id: 'estudiantes', nombre: 'Por estudiante' },
];

const pct = (v) => (v === null || v === undefined ? '—' : `${Math.round(v * 100)}%`);
const fecha = (ms) => (ms ? new Date(ms).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }) : '—');

// Barra de una sola medida (logro, o cuántos estudiantes cometen un error).
function Medidor({ valor, texto }) {
  return (
    <span className="medidor">
      <span className="medidor-pista">
        <span className="medidor-relleno" style={{ width: `${Math.round((valor ?? 0) * 100)}%` }} />
      </span>
      <span className="medidor-valor">{texto ?? pct(valor)}</span>
    </span>
  );
}

// Cómo terminaron las preguntas: a la primera, con ayuda o viendo la solución.
const PARTES_RESULTADO = [
  { id: 'solo', nombre: 'A la primera', clase: 'r-solo' },
  { id: 'ayuda', nombre: 'Con ayuda o corrigiendo', clase: 'r-ayuda' },
  { id: 'solucion', nombre: 'Vio la solución', clase: 'r-solucion' },
];

function BarraResultados({ conteo }) {
  const total = PARTES_RESULTADO.reduce((s, p) => s + conteo[p.id], 0);
  if (!total) return <span className="sin-datos">Sin datos</span>;
  const nombre = PARTES_RESULTADO.map((p) => `${p.nombre}: ${conteo[p.id]}`).join(', ');
  return (
    <span className="barra-resultados" role="img" aria-label={nombre} title={nombre}>
      {PARTES_RESULTADO.map((p) => (conteo[p.id] ? <span key={p.id} className={p.clase} style={{ flexGrow: conteo[p.id] }} /> : null))}
    </span>
  );
}

function LeyendaResultados() {
  return (
    <p className="leyenda">
      {PARTES_RESULTADO.map((p) => (
        <span key={p.id}>
          <span className={`leyenda-muestra ${p.clase}`} aria-hidden="true" />
          {p.nombre}
        </span>
      ))}
    </p>
  );
}

// Mapa de calor: color más oscuro = más logro a la primera.
const PASOS_CALOR = [0.2, 0.4, 0.6, 0.8];
function pasoCalor(v) {
  if (v === null || v === undefined) return 'calor-vacio';
  return `calor-${PASOS_CALOR.filter((p) => v >= p).length}`;
}

function LeyendaCalor() {
  return (
    <p className="leyenda">
      <span>Logro a la primera:</span>
      {['0–19%', '20–39%', '40–59%', '60–79%', '80–100%'].map((t, i) => (
        <span key={t}>
          <span className={`leyenda-muestra calor-${i}`} aria-hidden="true" />
          {t}
        </span>
      ))}
      <span>
        <span className="leyenda-muestra calor-vacio" aria-hidden="true" />
        Sin datos
      </span>
    </p>
  );
}

function Kpi({ valor, texto }) {
  return (
    <div className="kpi">
      <span className="kpi-valor">{valor}</span>
      <span className="kpi-texto">{texto}</span>
    </div>
  );
}

function ChipTema({ ejercicio, catalogo }) {
  const tema = catalogo.temas.find((t) => t.id === ejercicio.tema);
  return (
    <span className="chip-tema" style={{ '--eje': colorEje(ejercicio.eje) }}>
      {tema?.nombre}
    </span>
  );
}

function enunciadoCorto(e) {
  const t = textoPlano(e.enunciado);
  return t.length > 140 ? `${t.slice(0, 137)}…` : t;
}

// ---- Vistas -----------------------------------------------------------------

function VistaErrores({ analisis, catalogo, ir, totalEstudiantes }) {
  const [cuantos, setCuantos] = useState(12);
  if (!analisis.errores.length) return <p className="vacio">Todavía no hay respuestas equivocadas registradas con estos filtros.</p>;
  return (
    <>
      <p className="vista-intro">
        Las respuestas equivocadas que más estudiantes dieron, con el error que suele haber detrás. El mensaje es el mismo que vio el estudiante al
        equivocarse.
      </p>
      <ol className="errores">
        {analisis.errores.slice(0, cuantos).map((f) => (
          <li key={`${f.ejercicio.id}|${f.clave}`} className="error-item" style={{ '--eje': colorEje(f.ejercicio.eje) }}>
            <div className="error-cabeza">
              <ChipTema ejercicio={f.ejercicio} catalogo={catalogo} />
              <Medidor valor={f.estudiantes.size / totalEstudiantes} texto={`${f.estudiantes.size} de ${totalEstudiantes} ${totalEstudiantes === 1 ? 'estudiante' : 'estudiantes'}`} />
            </div>
            <p className="error-enunciado">{enunciadoCorto(f.ejercicio)}</p>
            <p className="error-respuesta">
              Respondieron: <strong>{<ConFracciones texto={f.etiqueta} />}</strong>
            </p>
            <p className="error-mensaje">
              <Texto texto={f.mensaje} />
            </p>
            <details className="error-quienes">
              <summary>Quiénes</summary>
              <p>{[...f.estudiantes.values()].sort((a, b) => a.localeCompare(b, 'es')).join(', ')}</p>
            </details>
            <div className="error-acciones">
              <button type="button" className="boton boton--texto" onClick={() => ir(`/docentes/resultados/ejercicio/${f.ejercicio.id}`)}>
                Ver todas las respuestas
              </button>
              <a className="boton boton--texto" href={`#/ejercicio/${f.ejercicio.id}`} target="_blank" rel="noreferrer">
                Abrir para proyectar
              </a>
            </div>
          </li>
        ))}
      </ol>
      {analisis.errores.length > cuantos && (
        <button type="button" className="boton boton--suave" onClick={() => setCuantos((n) => n + 12)}>
          Ver más errores
        </button>
      )}
    </>
  );
}

function VistaTemas({ analisis, ir }) {
  const temas = analisis.temas.filter((t) => t.intentos > 0);
  if (!temas.length) return <p className="vacio">Todavía no hay respuestas con estos filtros.</p>;
  return (
    <>
      <LeyendaResultados />
      <div className="tabla-scroll">
        <table className="tabla-docente">
          <thead>
            <tr>
              <th scope="col">Tema</th>
              <th scope="col">Estudiantes</th>
              <th scope="col">Logro a la primera</th>
              <th scope="col">Cómo terminaron</th>
              <th scope="col">Para después</th>
            </tr>
          </thead>
          <tbody>
            {temas.map((t) => (
              <tr key={t.tema.id} style={{ '--eje': colorEje(t.tema.eje) }}>
                <th scope="row">
                  <button type="button" className="boton--enlace tema-enlace" onClick={() => ir(`/docentes/resultados/tema/${t.tema.id}`)}>
                    <span className="punto-eje" aria-hidden="true" />
                    {t.tema.nombre}
                  </button>
                </th>
                <td className="num">{t.estudiantes.size}</td>
                <td>
                  <Medidor valor={logro(t)} />
                </td>
                <td>
                  <BarraResultados conteo={t} />
                </td>
                <td className="num">{t.pendiente || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function DetalleTema({ analisis, catalogo, temaId, ir }) {
  const tema = catalogo.temas.find((t) => t.id === temaId);
  if (!tema) return null;
  const ejercicios = catalogo.todos.filter((e) => e.tema === temaId);
  return (
    <section className="detalle">
      <button type="button" className="boton boton--texto" onClick={() => ir('/docentes/resultados/temas')}>
        ← Todos los temas
      </button>
      <h2>{tema.nombre}</h2>
      <p className="vista-intro">Cada ejercicio del tema, con la respuesta equivocada más frecuente.</p>
      <ul className="ejercicios-tema">
        {ejercicios.map((e) => {
          const datos = analisis.porEjercicio.get(e.id);
          const peor = analisis.errores.find((f) => f.ejercicio.id === e.id);
          return (
            <li key={e.id}>
              <button type="button" className="ejercicio-tema" onClick={() => ir(`/docentes/resultados/ejercicio/${e.id}`)}>
                <span className="ejercicio-tema-texto">{enunciadoCorto(e)}</span>
                <span className="ejercicio-tema-datos">
                  {datos ? (
                    <>
                      <Medidor valor={logro(datos)} />
                      <span className="ejercicio-tema-n">{datos.estudiantes.size} est.</span>
                    </>
                  ) : (
                    <span className="sin-datos">Sin respuestas</span>
                  )}
                </span>
                {peor && (
                  <span className="ejercicio-tema-error">
                    Error más común: <ConFracciones texto={peor.etiqueta} /> ({peor.estudiantes.size})
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function DetalleEjercicio({ analisis, catalogo, id, ir }) {
  const ejercicio = catalogo.porId.get(id);
  if (!ejercicio) return <p className="vacio">Ese ejercicio ya no existe.</p>;
  const datos = analisis.porEjercicio.get(id);
  const primeras = datos ? [...datos.primeras.values()] : [];
  const total = primeras.reduce((s, f) => s + f.veces, 0);
  const correctaTexto = (ejercicio.opciones ?? ejercicio.personas ?? []).find((o) => o.correcta);

  // En los de alternativas se muestran todas, aunque nadie las haya elegido.
  const lista = [
    { clave: '_correcta', valor: '', veces: datos?.primeras.get('_correcta')?.veces ?? 0 },
    ...(ejercicio.tipo === 'alternativas' || ejercicio.tipo === 'quien'
      ? (ejercicio.opciones ?? ejercicio.personas)
          .filter((o) => !o.correcta)
          .map((o) => {
            const clave = o.texto ?? o.nombre;
            return { clave, valor: clave, veces: datos?.primeras.get(clave)?.veces ?? 0 };
          })
      : primeras.filter((f) => !f.clave.startsWith('_'))),
    ...['_pendiente', '_blanco'].map((k) => ({ clave: k, valor: '', veces: datos?.primeras.get(k)?.veces ?? 0 })).filter((f) => f.veces),
  ].sort((a, b) => (a.clave === '_correcta' ? -1 : b.clave === '_correcta' ? 1 : b.veces - a.veces));

  const nombreFila = (f) => {
    if (f.clave === '_correcta') return correctaTexto ? `${correctaTexto.texto ?? correctaTexto.nombre}` : 'Respuesta correcta';
    if (f.clave === '_pendiente') return 'La dejó para después sin responder';
    if (f.clave === '_blanco') return 'Sin responder (ensayo)';
    return etiquetaRespuesta(ejercicio, f);
  };

  return (
    <section className="detalle">
      <button type="button" className="boton boton--texto" onClick={() => ir(`/docentes/resultados/tema/${ejercicio.tema}`)}>
        ← Volver al tema
      </button>
      <div className="detalle-ejercicio">
        <div className="detalle-ejercicio-pregunta">
          <ChipTema ejercicio={ejercicio} catalogo={catalogo} />
          <p className="detalle-enunciado">
            <Texto texto={ejercicio.enunciado} />
          </p>
          {ejercicio.visual && <Visual visual={ejercicio.visual} />}
          <a className="boton boton--suave" href={`#/ejercicio/${ejercicio.id}`} target="_blank" rel="noreferrer">
            Abrir para proyectar
          </a>
        </div>
        <div className="detalle-ejercicio-datos">
          <h2>Primera respuesta de cada intento</h2>
          {total ? (
            <>
              <p className="vista-intro">
                {total} {total === 1 ? 'intento' : 'intentos'} de {datos.estudiantes.size} {datos.estudiantes.size === 1 ? 'estudiante' : 'estudiantes'}. Logro a
                la primera: {pct(logro(datos))}.
              </p>
              <ul className="distractores">
                {lista.map((f) => (
                  <li key={f.clave} className={f.clave === '_correcta' ? 'distractor distractor--correcta' : 'distractor'}>
                    <div className="distractor-fila">
                      <span className="distractor-nombre">
                        {f.clave === '_correcta' && (
                          <span className="distractor-ok" aria-label="Correcta">
                            ✓
                          </span>
                        )}
                        <ConFracciones texto={nombreFila(f)} />
                      </span>
                      <Medidor valor={f.veces / total} texto={`${f.veces} (${pct(f.veces / total)})`} />
                    </div>
                    {!f.clave.startsWith('_') && f.veces > 0 && (
                      <p className="distractor-mensaje">
                        <Texto texto={mensajeError(ejercicio, f)} />
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="vacio">Nadie ha respondido este ejercicio con estos filtros.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function VistaEstudiantes({ analisis, catalogo, ir }) {
  const [orden, setOrden] = useState('nombre');
  const activos = [...analisis.activos].sort((a, b) =>
    orden === 'nombre' ? nombreEstudiante(a.perfil).localeCompare(nombreEstudiante(b.perfil), 'es') : (logro(a) ?? 0) - (logro(b) ?? 0),
  );
  const temas = catalogo.temas.filter((t) => analisis.temas.some((x) => x.tema.id === t.id && x.intentos > 0));
  if (!activos.length) return <p className="vacio">Todavía no hay respuestas con estos filtros.</p>;
  return (
    <>
      <div className="vista-controles">
        <LeyendaCalor />
        <label className="control">
          Ordenar por
          <select className="campo campo--chico" value={orden} onChange={(ev) => setOrden(ev.target.value)}>
            <option value="nombre">Nombre</option>
            <option value="logro">Menor logro primero</option>
          </select>
        </label>
      </div>
      <div className="tabla-scroll">
        <table className="tabla-docente tabla-calor">
          <thead>
            <tr>
              <th scope="col" className="col-fija">
                Estudiante
              </th>
              <th scope="col">Total</th>
              {temas.map((t) => (
                <th key={t.id} scope="col" className="th-tema" style={{ '--eje': colorEje(t.eje) }}>
                  <span title={t.nombre}>{t.nombre}</span>
                </th>
              ))}
              <th scope="col">Para después</th>
            </tr>
          </thead>
          <tbody>
            {activos.map((s) => (
              <tr key={s.perfil.id}>
                <th scope="row" className="col-fija">
                  <button type="button" className="boton--enlace" onClick={() => ir(`/docentes/resultados/estudiante/${s.perfil.id}`)}>
                    {nombreEstudiante(s.perfil)}
                  </button>
                </th>
                <td className={`celda-calor ${pasoCalor(logro(s))}`}>{pct(logro(s))}</td>
                {temas.map((t) => {
                  const c = s.porTema[t.id];
                  const v = c ? logro(c) : null;
                  return (
                    <td
                      key={t.id}
                      className={`celda-calor ${pasoCalor(v)}`}
                      title={c ? `${nombreEstudiante(s.perfil)}, ${t.nombre}: ${pct(v)} a la primera en ${c.intentos} intentos` : `${t.nombre}: sin datos`}
                    >
                      {v === null ? '' : Math.round(v * 100)}
                    </td>
                  );
                })}
                <td className="num">{s.pendiente || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function DetalleEstudiante({ analisis, catalogo, id, ir }) {
  const s = analisis.estudiantes.find((x) => x.perfil.id === id);
  if (!s) return <p className="vacio">No se encontró a ese estudiante con estos filtros.</p>;
  const ensayos = s.perfil.progreso.ensayos ?? [];
  // Equivocaciones agrupadas por ejercicio, las más recientes primero.
  const porEjercicio = new Map();
  [...s.equivocaciones].reverse().forEach((q) => {
    const lista = porEjercicio.get(q.ejercicio.id) ?? [];
    lista.push(q);
    porEjercicio.set(q.ejercicio.id, lista);
  });
  const pendientes = Object.entries(s.perfil.progreso.ejercicios)
    .filter(([, estado]) => estado === 'pendiente')
    .map(([idEj]) => catalogo.porId.get(idEj))
    .filter(Boolean);

  return (
    <section className="detalle">
      <button type="button" className="boton boton--texto" onClick={() => ir('/docentes/resultados/estudiantes')}>
        ← Todos los estudiantes
      </button>
      <h2>{nombreEstudiante(s.perfil)}</h2>
      <p className="vista-intro">
        {s.perfil.curso?.nombre ?? 'Sin curso'} · {s.intentos} preguntas · última actividad {fecha(s.ultima)}
      </p>
      <div className="kpis">
        <Kpi valor={pct(logro(s))} texto="logro a la primera" />
        <Kpi valor={s.errores} texto="respuestas equivocadas" />
        <Kpi valor={pendientes.length} texto="dejadas para después" />
        {ensayos.length > 0 && <Kpi valor={`${ensayos.at(-1).correctas} de ${ensayos.at(-1).total}`} texto="último ensayo" />}
      </div>

      <h3>Por eje</h3>
      <LeyendaResultados />
      <table className="tabla-docente">
        <tbody>
          {EJES.filter((eje) => s.porEje[eje.id]).map((eje) => (
            <tr key={eje.id} style={{ '--eje': colorEje(eje.id) }}>
              <th scope="row">
                <span className="punto-eje" aria-hidden="true" />
                {eje.nombre}
              </th>
              <td>
                <Medidor valor={logro(s.porEje[eje.id])} />
              </td>
              <td>
                <BarraResultados conteo={s.porEje[eje.id]} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {porEjercicio.size > 0 && (
        <>
          <h3>En qué se equivocó</h3>
          <ul className="equivocaciones">
            {[...porEjercicio.entries()].map(([idEj, lista]) => {
              const e = lista[0].ejercicio;
              return (
                <li key={idEj}>
                  <button type="button" className="boton--enlace" onClick={() => ir(`/docentes/resultados/ejercicio/${idEj}`)}>
                    {enunciadoCorto(e)}
                  </button>
                  <ul>
                    {[...new Map(lista.map((q) => [q.clave, q])).values()].map((q) => (
                      <li key={q.clave}>
                        <strong>
                          <ConFracciones texto={etiquetaRespuesta(e, q)} />
                        </strong>
                        : <Texto texto={mensajeError(e, q)} />
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {ensayos.length > 0 && (
        <>
          <h3>Ensayos</h3>
          <ul className="ensayos-lista">
            {ensayos.map((en) => (
              <li key={en.fecha}>
                {fecha(Date.parse(en.fecha))}: {en.correctas} de {en.total}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

// ---- Panel ------------------------------------------------------------------

function unir(...listas) {
  const mapa = new Map();
  listas.flat().forEach((p) => {
    const antes = mapa.get(p.id);
    if (!antes || p.intentos.length >= antes.intentos.length) mapa.set(p.id, p);
  });
  return [...mapa.values()];
}

export default function Resultados({ resto, ir, catalogo, estudiantes }) {
  const [vista = 'errores', idDetalle] = resto;
  const [importados, setImportados] = useState(() => almacen.leerDocente()?.perfiles ?? {});
  const [ejemplo, setEjemplo] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [filtros, setFiltros] = useState({ curso: '', eje: '', periodo: 'todo' });
  const archivo = useRef(null);

  const delDispositivo = Object.values(estudiantes.perfiles);
  const datosEjemplo = useMemo(() => (ejemplo ? cursoDeEjemplo(catalogo) : []), [ejemplo, catalogo]);
  const perfiles = (ejemplo ? datosEjemplo : unir(delDispositivo, Object.values(importados))).filter((p) => p.intentos.length);
  const cursos = cursosDe(perfiles);
  const cursoValido = cursos.some((c) => c.id === filtros.curso) ? filtros.curso : '';
  // La fecha de corte se calcula una vez por cambio de filtro, no en cada render.
  const desde = useMemo(() => (filtros.periodo === 'todo' ? null : Date.now() - Number(filtros.periodo) * DIA), [filtros.periodo]);

  const analisis = useMemo(
    () => analizar(perfiles, catalogo, { curso: cursoValido, eje: filtros.eje, desde }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ejemplo, importados, estudiantes, catalogo, cursoValido, filtros.eje, desde],
  );
  const totalEstudiantes = analisis.activos.length;
  const totalIntentos = analisis.total.intentos;
  const pendientes = analisis.activos.reduce((s, x) => s + Object.values(x.perfil.progreso.ejercicios).filter((v) => v === 'pendiente').length, 0);

  async function cargar(archivos) {
    const nuevos = { ...importados };
    let estudiantesLeidos = 0;
    const malos = [];
    for (const f of archivos) {
      try {
        const lista = leerArchivoResultados(await f.text());
        lista.forEach((p) => {
          nuevos[p.id] = p;
        });
        estudiantesLeidos += lista.length;
      } catch {
        malos.push(f.name);
      }
    }
    setImportados(nuevos);
    almacen.guardarDocente({ perfiles: nuevos });
    setEjemplo(false);
    setMensaje(
      [
        estudiantesLeidos ? `Se cargaron los resultados de ${estudiantesLeidos} ${estudiantesLeidos === 1 ? 'estudiante' : 'estudiantes'}.` : '',
        malos.length ? `No se pudieron leer: ${malos.join(', ')}. ¿Son archivos descargados desde OH Simce?` : '',
      ]
        .filter(Boolean)
        .join(' '),
    );
  }

  function quitarImportados() {
    setImportados({});
    almacen.guardarDocente({ perfiles: {} });
    setMensaje('Se quitaron los archivos cargados. Los resultados de este computador siguen aquí.');
  }

  const nImportados = Object.keys(importados).length;
  const nDispositivo = delDispositivo.filter((p) => p.intentos.length).length;

  return (
    <div className="resultados">
      <section
        className="fuente-datos"
        onDragOver={(ev) => ev.preventDefault()}
        onDrop={(ev) => {
          ev.preventDefault();
          if (ev.dataTransfer.files.length) cargar([...ev.dataTransfer.files]);
        }}
      >
        <div>
          <h2>De dónde vienen los datos</h2>
          {ejemplo ? (
            <p>
              <strong>Estás viendo un curso de ejemplo</strong> con nombres y resultados inventados.
            </p>
          ) : (
            <p>
              {nDispositivo} {nDispositivo === 1 ? 'perfil' : 'perfiles'} de este computador y {nImportados}{' '}
              {nImportados === 1 ? 'estudiante cargado' : 'estudiantes cargados'} desde archivos. Cada estudiante descarga su archivo en «Escribe tu nombre» →
              «Descargar mis resultados». Puedes arrastrar los archivos aquí.
            </p>
          )}
          {mensaje && (
            <p className="fuente-mensaje" role="status">
              {mensaje}
            </p>
          )}
        </div>
        <div className="fuente-acciones">
          <input
            ref={archivo}
            type="file"
            accept=".json,application/json"
            multiple
            hidden
            onChange={(ev) => {
              cargar([...ev.target.files]);
              ev.target.value = '';
            }}
          />
          <button type="button" className="boton boton--principal" onClick={() => archivo.current.click()}>
            Cargar archivos de resultados
          </button>
          <button type="button" className="boton boton--suave" onClick={() => setEjemplo((v) => !v)} aria-pressed={ejemplo}>
            {ejemplo ? 'Volver a mis datos' : 'Ver un curso de ejemplo'}
          </button>
          {totalEstudiantes > 0 && (
            <button
              type="button"
              className="boton boton--texto"
              onClick={() =>
                descargar(
                  `${nombreArchivo('resultados', cursos.find((c) => c.id === cursoValido)?.nombre, new Date().toISOString().slice(0, 10))}.csv`,
                  tablaCSV(analisis, catalogo.temas),
                  'text/csv',
                )
              }
            >
              Descargar planilla (CSV)
            </button>
          )}
          {nImportados > 0 && !ejemplo && (
            <button type="button" className="boton boton--texto" onClick={quitarImportados}>
              Quitar archivos cargados
            </button>
          )}
        </div>
      </section>

      {perfiles.length === 0 ? (
        <section className="vacio-grande">
          <h2>Todavía no hay resultados</h2>
          <ol>
            <li>
              En «Curso y enlace», crea tu curso y comparte el enlace con tus estudiantes.
            </li>
            <li>Cada estudiante practica y, cuando se lo pidas, descarga su archivo de resultados.</li>
            <li>Carga aquí los archivos. Si practican en este mismo computador, sus resultados aparecen solos.</li>
          </ol>
          <p>Mientras tanto, puedes ver cómo se ve el panel con un curso de ejemplo.</p>
        </section>
      ) : (
        <>
          <div className="filtros" role="group" aria-label="Filtros">
            <label className="control">
              Período
              <select className="campo campo--chico" value={filtros.periodo} onChange={(ev) => setFiltros({ ...filtros, periodo: ev.target.value })}>
                {PERIODOS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </label>
            {cursos.length > 1 && (
              <label className="control">
                Curso
                <select className="campo campo--chico" value={cursoValido} onChange={(ev) => setFiltros({ ...filtros, curso: ev.target.value })}>
                  <option value="">Todos</option>
                  {cursos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label className="control">
              Eje
              <select className="campo campo--chico" value={filtros.eje} onChange={(ev) => setFiltros({ ...filtros, eje: ev.target.value })}>
                <option value="">Todos</option>
                {EJES.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="kpis">
            <Kpi valor={totalEstudiantes} texto={totalEstudiantes === 1 ? 'estudiante con actividad' : 'estudiantes con actividad'} />
            <Kpi valor={totalIntentos} texto="preguntas respondidas" />
            <Kpi valor={pct(logro(analisis.total))} texto="logro a la primera" />
            <Kpi valor={pendientes} texto="preguntas dejadas para después" />
          </div>

          {vista === 'tema' ? (
            <DetalleTema analisis={analisis} catalogo={catalogo} temaId={idDetalle} ir={ir} />
          ) : vista === 'ejercicio' ? (
            <DetalleEjercicio analisis={analisis} catalogo={catalogo} id={idDetalle} ir={ir} />
          ) : vista === 'estudiante' ? (
            <DetalleEstudiante analisis={analisis} catalogo={catalogo} id={idDetalle} ir={ir} />
          ) : (
            <>
              <nav className="vistas" aria-label="Vistas de resultados">
                {VISTAS.map((v) => (
                  <a key={v.id} href={`#/docentes/resultados/${v.id}`} className="vista-boton" aria-current={vista === v.id ? 'page' : undefined}>
                    {v.nombre}
                  </a>
                ))}
              </nav>
              {vista === 'errores' && <VistaErrores analisis={analisis} catalogo={catalogo} ir={ir} totalEstudiantes={totalEstudiantes} />}
              {vista === 'temas' && <VistaTemas analisis={analisis} ir={ir} />}
              {vista === 'estudiantes' && <VistaEstudiantes analisis={analisis} catalogo={catalogo} ir={ir} />}
            </>
          )}
        </>
      )}
    </div>
  );
}
