import { useState } from 'react';
import { EJES, colorEje } from '../../data/ejes.js';
import { descargar } from '../../lib/almacen.js';
import { textoPlano } from '../../lib/formato.js';
import { NOMBRE_TIPO } from '../../lib/validar.js';

const ESTADOS = [
  { id: '', nombre: 'Todos' },
  { id: 'activos', nombre: 'Activos' },
  { id: 'desactivados', nombre: 'Desactivados' },
  { id: 'propio', nombre: 'Creados por mí' },
  { id: 'modificado', nombre: 'Editados por mí' },
];

const sinTildes = (t) =>
  t
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

// Texto para pegar en src/data/ejercicios/ y dejar los ejercicios en la
// página para todos.
function archivoParaRepositorio(curso, catalogo) {
  const lista = [...curso.propios, ...Object.entries(curso.modificados).map(([id, e]) => ({ ...e, id }))].map((e) => {
    const copia = { ...e };
    delete copia.eje;
    return copia;
  });
  const porEje = EJES.map((eje) => ({
    eje,
    ejercicios: lista.filter((e) => catalogo.temas.find((t) => t.id === e.tema)?.eje === eje.id),
  })).filter((x) => x.ejercicios.length);
  return [
    `// Ejercicios creados o editados en el panel docente de OH Simce (${new Date().toLocaleDateString('es-CL')}).`,
    '//',
    '// Para dejarlos en la página para todos los cursos:',
    '//   1. Copia cada ejercicio en el archivo de su eje, dentro de EJERCICIOS.',
    '//      Los editados reemplazan al ejercicio con el mismo id.',
    '//   2. Corre «npm run validar».',
    '',
    ...porEje.flatMap(({ eje, ejercicios }) => [
      `// ---- src/data/ejercicios/${eje.id}.js ----`,
      `export const ${eje.id.toUpperCase()} = ${JSON.stringify(ejercicios, null, 2)};`,
      '',
    ]),
  ].join('\n');
}

function Interruptor({ activo, onCambiar, etiqueta }) {
  return (
    <button type="button" role="switch" aria-checked={activo} aria-label={etiqueta} className="interruptor" onClick={onCambiar}>
      <span className="interruptor-pista" aria-hidden="true">
        <span className="interruptor-perilla" />
      </span>
      <span className="interruptor-texto">{activo ? 'Activo' : 'Desactivado'}</span>
    </button>
  );
}

// Gestión de ejercicios: activar o desactivar, crear, editar y exportar.
export default function Ejercicios({ ir, catalogo, curso, cambiarCurso }) {
  const [filtros, setFiltros] = useState({ texto: '', eje: '', tema: '', tipo: '', estado: '' });
  const [borrando, setBorrando] = useState(null);
  const desactivados = new Set(curso.desactivados);

  const buscar = sinTildes(filtros.texto.trim());
  const visibles = catalogo.todos.filter((e) => {
    if (filtros.eje && e.eje !== filtros.eje) return false;
    if (filtros.tema && e.tema !== filtros.tema) return false;
    if (filtros.tipo && e.tipo !== filtros.tipo) return false;
    if (filtros.estado === 'activos' && desactivados.has(e.id)) return false;
    if (filtros.estado === 'desactivados' && !desactivados.has(e.id)) return false;
    if ((filtros.estado === 'propio' || filtros.estado === 'modificado') && catalogo.origen(e.id) !== filtros.estado) return false;
    if (buscar && !sinTildes(`${e.id} ${textoPlano(e.enunciado)}`).includes(buscar)) return false;
    return true;
  });
  const temas = catalogo.temas.filter((t) => visibles.some((e) => e.tema === t.id));
  const tipos = [...new Set(catalogo.todos.map((e) => e.tipo))];
  const hayCambios = curso.propios.length > 0 || Object.keys(curso.modificados).length > 0;

  const alternar = (ids, activar) =>
    cambiarCurso((prev) => {
      const set = new Set(prev.desactivados);
      ids.forEach((id) => (activar ? set.delete(id) : set.add(id)));
      return { ...prev, desactivados: [...set] };
    });

  const eliminar = (id) =>
    cambiarCurso((prev) => ({ ...prev, propios: prev.propios.filter((e) => e.id !== id), desactivados: prev.desactivados.filter((x) => x !== id) }));
  const restaurar = (id) =>
    cambiarCurso((prev) => {
      const modificados = { ...prev.modificados };
      delete modificados[id];
      return { ...prev, modificados };
    });

  return (
    <div className="gestion">
      <section className="gestion-resumen">
        <p>
          {catalogo.todos.length} ejercicios · {catalogo.activos.length} activos
          {curso.propios.length > 0 && ` · ${curso.propios.length} ${curso.propios.length === 1 ? 'creado' : 'creados'} por ti`}
          {Object.keys(curso.modificados).length > 0 && ` · ${Object.keys(curso.modificados).length} ${Object.keys(curso.modificados).length === 1 ? 'editado' : 'editados'}`}
        </p>
        <p className="gestion-nota">
          Los ejercicios desactivados no aparecen en la práctica, el repaso ni el ensayo. Los cambios se aplican en este computador; para que lleguen a tus
          estudiantes, <a href="#/docentes/curso">comparte el enlace del curso</a>.
        </p>
        <div className="acciones-fila">
          <button type="button" className="boton boton--principal" onClick={() => ir('/docentes/ejercicios/nuevo')}>
            Crear un ejercicio
          </button>
          {hayCambios && (
            <button
              type="button"
              className="boton boton--suave"
              onClick={() => descargar('ejercicios-docente.js', archivoParaRepositorio(curso, catalogo), 'text/javascript')}
            >
              Exportar para el repositorio
            </button>
          )}
        </div>
      </section>

      <div className="filtros" role="group" aria-label="Filtros">
        <label className="control control--ancho">
          Buscar
          <input
            className="campo campo--chico"
            type="search"
            value={filtros.texto}
            placeholder="Palabra o código"
            onChange={(ev) => setFiltros({ ...filtros, texto: ev.target.value })}
          />
        </label>
        <label className="control">
          Eje
          <select className="campo campo--chico" value={filtros.eje} onChange={(ev) => setFiltros({ ...filtros, eje: ev.target.value, tema: '' })}>
            <option value="">Todos</option>
            {EJES.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="control">
          Tema
          <select className="campo campo--chico" value={filtros.tema} onChange={(ev) => setFiltros({ ...filtros, tema: ev.target.value })}>
            <option value="">Todos</option>
            {catalogo.temas
              .filter((t) => !filtros.eje || t.eje === filtros.eje)
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
          </select>
        </label>
        <label className="control">
          Tipo
          <select className="campo campo--chico" value={filtros.tipo} onChange={(ev) => setFiltros({ ...filtros, tipo: ev.target.value })}>
            <option value="">Todos</option>
            {tipos.map((t) => (
              <option key={t} value={t}>
                {NOMBRE_TIPO[t] ?? t}
              </option>
            ))}
          </select>
        </label>
        <label className="control">
          Estado
          <select className="campo campo--chico" value={filtros.estado} onChange={(ev) => setFiltros({ ...filtros, estado: ev.target.value })}>
            {ESTADOS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!visibles.length && <p className="vacio">Ningún ejercicio coincide con los filtros.</p>}

      {temas.map((tema) => {
        const delTema = visibles.filter((e) => e.tema === tema.id);
        const todosDelTema = catalogo.todos.filter((e) => e.tema === tema.id);
        const activosTema = todosDelTema.filter((e) => !desactivados.has(e.id)).length;
        return (
          <section key={tema.id} className="gestion-tema" style={{ '--eje': colorEje(tema.eje) }}>
            <header className="gestion-tema-cabeza">
              <h2>
                <span className="punto-eje" aria-hidden="true" />
                {tema.nombre}
              </h2>
              <span className="gestion-tema-cuenta">
                {activosTema} de {todosDelTema.length} activos · OA {tema.oa.join(', ')}
              </span>
              <span className="gestion-tema-acciones">
                <button type="button" className="boton boton--texto" onClick={() => alternar(delTema.map((e) => e.id), true)}>
                  Activar todos
                </button>
                <button type="button" className="boton boton--texto" onClick={() => alternar(delTema.map((e) => e.id), false)}>
                  Desactivar todos
                </button>
              </span>
            </header>
            {activosTema === 0 && <p className="gestion-aviso">Este tema no aparece a los estudiantes porque no tiene ejercicios activos.</p>}
            <ul className="gestion-lista">
              {delTema.map((e) => {
                const activo = !desactivados.has(e.id);
                const origen = catalogo.origen(e.id);
                return (
                  <li key={e.id} className={activo ? 'gestion-item' : 'gestion-item gestion-item--apagado'}>
                    <Interruptor activo={activo} onCambiar={() => alternar([e.id], !activo)} etiqueta={`Ejercicio ${e.id} activo`} />
                    <div className="gestion-item-texto">
                      <p className="gestion-enunciado">{textoPlano(e.enunciado)}</p>
                      <p className="gestion-meta">
                        <code>{e.id}</code> · {NOMBRE_TIPO[e.tipo] ?? e.tipo}
                        {origen === 'propio' && <span className="insignia insignia--propio">Creado por ti</span>}
                        {origen === 'modificado' && <span className="insignia insignia--editado">Editado</span>}
                      </p>
                    </div>
                    <div className="gestion-item-acciones">
                      <a className="boton boton--texto" href={`#/ejercicio/${e.id}`} target="_blank" rel="noreferrer">
                        Probar
                      </a>
                      <button type="button" className="boton boton--texto" onClick={() => ir(`/docentes/ejercicios/editar/${e.id}`)}>
                        Editar
                      </button>
                      <button type="button" className="boton boton--texto" onClick={() => ir(`/docentes/ejercicios/duplicar/${e.id}`)}>
                        Duplicar
                      </button>
                      {origen === 'modificado' && (
                        <button type="button" className="boton boton--texto" onClick={() => restaurar(e.id)}>
                          Volver al original
                        </button>
                      )}
                      {origen === 'propio' &&
                        (borrando === e.id ? (
                          <span className="confirmar">
                            ¿Eliminar?
                            <button type="button" className="boton boton--texto boton--peligro" onClick={() => eliminar(e.id)}>
                              Sí, eliminar
                            </button>
                            <button type="button" className="boton boton--texto" onClick={() => setBorrando(null)}>
                              No
                            </button>
                          </span>
                        ) : (
                          <button type="button" className="boton boton--texto" onClick={() => setBorrando(e.id)}>
                            Eliminar
                          </button>
                        ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
