import { useEffect, useState } from 'react';
import { archivoResultados } from '../../lib/progreso.js';
import { descargar, nombreArchivo } from '../../lib/almacen.js';
import { decodificar } from '../../lib/compartir.js';

function contarHechos(perfil) {
  return Object.keys(perfil.progreso.ejercicios).length;
}

function FormNombre({ inicial = '', texto, onListo, autoFocus = false }) {
  const [nombre, setNombre] = useState(inicial);
  const limpio = nombre.trim();
  return (
    <form
      className="form-nombre"
      onSubmit={(ev) => {
        ev.preventDefault();
        if (limpio) onListo(limpio);
      }}
    >
      <label htmlFor="nombre-estudiante">Tu nombre y la inicial de tu apellido</label>
      <div className="form-nombre-fila">
        <input
          id="nombre-estudiante"
          className="campo"
          value={nombre}
          onChange={(ev) => setNombre(ev.target.value)}
          maxLength={40}
          autoComplete="off"
          placeholder="Por ejemplo: Sofía M."
          autoFocus={autoFocus}
        />
        <button type="submit" className="boton boton--principal" disabled={!limpio}>
          {texto}
        </button>
      </div>
    </form>
  );
}

function ListaPerfiles({ perfiles, activo, onElegir }) {
  return (
    <ul className="perfiles">
      {perfiles.map((p) => (
        <li key={p.id}>
          <button type="button" className={p.id === activo ? 'perfil-boton perfil-boton--activo' : 'perfil-boton'} onClick={() => onElegir(p.id)}>
            <span className="perfil-inicial" aria-hidden="true">
              {(p.nombre || '?').slice(0, 1).toUpperCase()}
            </span>
            <span className="perfil-texto">
              <span className="perfil-nombre">{p.nombre || 'Sin nombre'}</span>
              <span className="perfil-detalle">
                {p.curso ? `${p.curso.nombre} · ` : ''}
                {contarHechos(p)} {contarHechos(p) === 1 ? 'ejercicio' : 'ejercicios'}
              </span>
            </span>
            {p.id === activo && <span className="perfil-marca">Eres tú</span>}
          </button>
        </li>
      ))}
    </ul>
  );
}

// ¿Quién está practicando? En un computador compartido (la sala de
// computación) cada estudiante elige su nombre. No hay claves: los datos son
// solo de práctica y quedan en este navegador.
export default function Perfil({ estudiantes, curso, onElegir, onCrear, onRenombrar, ir }) {
  const perfil = estudiantes.perfiles[estudiantes.activo];
  const otros = Object.values(estudiantes.perfiles).filter((p) => p.nombre || contarHechos(p));
  const [nuevo, setNuevo] = useState(!perfil.nombre && otros.length <= 1);
  const [entregado, setEntregado] = useState(false);

  function entregar() {
    descargar(`${nombreArchivo('oh-simce', perfil.nombre || 'estudiante', perfil.curso?.nombre, new Date().toISOString().slice(0, 10))}.json`, archivoResultados([perfil]));
    setEntregado(true);
  }

  return (
    <main className="pagina perfil">
      <nav className="barra">
        <button type="button" className="boton boton--texto" onClick={() => ir('/')}>
          Inicio
        </button>
      </nav>

      {!perfil.nombre ? (
        <section className="perfil-seccion">
          <h1>¿Cómo te llamas?</h1>
          <p className="inicio-intro">Así tu profesora o profesor puede ver cómo vas y qué preguntas te están costando.</p>
          {curso.curso && <p className="perfil-curso">Curso: {curso.curso.nombre}</p>}
          <FormNombre texto="Listo" onListo={onRenombrar} autoFocus />
        </section>
      ) : (
        <section className="perfil-seccion">
          <h1>Hola, {perfil.nombre}</h1>
          {perfil.curso && <p className="perfil-curso">Curso: {perfil.curso.nombre}</p>}
          <div className="perfil-entregar">
            <h2>Entregar mis resultados</h2>
            <p>
              Descarga un archivo con lo que has practicado y entrégaselo a tu profesora o profesor (por correo, Classroom o como te diga). No incluye nada más que
              tus respuestas de esta página.
            </p>
            <button type="button" className="boton boton--principal" onClick={entregar}>
              Descargar mis resultados
            </button>
            {entregado && <p className="perfil-ok">Listo. El archivo quedó en la carpeta de descargas.</p>}
          </div>
        </section>
      )}

      {otros.length > 0 && (
        <section className="perfil-seccion">
          <h2>{perfil.nombre ? '¿No eres tú?' : '¿Ya practicaste en este computador?'}</h2>
          <p>Toca tu nombre para seguir donde quedaste.</p>
          <ListaPerfiles perfiles={otros} activo={estudiantes.activo} onElegir={onElegir} />
        </section>
      )}

      {perfil.nombre && (
        <section className="perfil-seccion">
          {nuevo ? (
            <>
              <h2>Soy nueva o nuevo aquí</h2>
              <FormNombre texto="Empezar" onListo={onCrear} autoFocus />
            </>
          ) : (
            <button type="button" className="boton boton--suave" onClick={() => setNuevo(true)}>
              Soy otra persona y es mi primera vez
            </button>
          )}
        </section>
      )}
    </main>
  );
}

// Llegada desde el enlace del curso que comparte el docente: trae los
// ejercicios activos y los creados por el docente.
export function Unirse({ codigo, estudiantes, onUnirse, ir }) {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let vigente = true;
    decodificar(codigo)
      .then((d) => {
        if (!vigente) return;
        if (d?.v !== 1 || !d.curso) throw new Error('formato');
        setDatos(d);
      })
      .catch(() => vigente && setError(true));
    return () => {
      vigente = false;
    };
  }, [codigo]);

  const perfiles = Object.values(estudiantes.perfiles).filter((p) => p.nombre);
  const unirse = (idPerfil, nombre) => {
    const { curso, desactivados = [], propios = [], modificados = {} } = datos;
    onUnirse({ curso, desactivados, propios, modificados }, idPerfil, nombre);
  };

  if (error) {
    return (
      <main className="pagina perfil">
        <h1>El enlace no funcionó</h1>
        <p className="inicio-intro">Puede que se haya copiado incompleto. Pídele a tu profesora o profesor que te lo envíe de nuevo.</p>
        <div className="acciones-fila">
          <button type="button" className="boton boton--suave" onClick={() => ir('/')}>
            Ir al inicio
          </button>
        </div>
      </main>
    );
  }

  if (!datos) {
    return (
      <main className="pagina perfil">
        <p className="inicio-intro">Abriendo el enlace del curso…</p>
      </main>
    );
  }

  return (
    <main className="pagina perfil">
      <p className="marca">
        OH Simce <span>Matemática 4° básico</span>
      </p>
      <h1>Te estás uniendo a {datos.curso.nombre}</h1>
      <p className="inicio-intro">Tu profesora o profesor preparó los ejercicios para tu curso.</p>
      <section className="perfil-seccion">
        <h2>Escribe tu nombre</h2>
        <FormNombre texto="Unirme" onListo={(nombre) => unirse(null, nombre)} autoFocus={!perfiles.length} />
      </section>
      {perfiles.length > 0 && (
        <section className="perfil-seccion">
          <h2>¿Ya practicaste en este computador?</h2>
          <p>Toca tu nombre para unirte con lo que ya hiciste.</p>
          <ListaPerfiles perfiles={perfiles} activo={null} onElegir={(id) => unirse(id)} />
        </section>
      )}
    </main>
  );
}
