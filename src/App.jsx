import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { EJES } from './data/ejes.js';
import { anotar, cargarEstudiantes, crearPerfil, guardarEstudiantes, idsParaRepasar, PARTES_REPASO } from './lib/progreso.js';
import { armarCatalogo, guardarCurso, leerCurso } from './lib/catalogo.js';
import Inicio from './components/pantallas/Inicio.jsx';
import Eje from './components/pantallas/Eje.jsx';
import Ejemplo from './components/pantallas/Ejemplo.jsx';
import Practica from './components/pantallas/Practica.jsx';
import Ensayo from './components/pantallas/Ensayo.jsx';
import Repasar from './components/pantallas/Repasar.jsx';
import Perfil, { Unirse } from './components/pantallas/Perfil.jsx';
import Docentes from './components/docentes/Docentes.jsx';

const PREGUNTAS_ENSAYO_POR_EJE = 3;

function mezclar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Rutas con # para que el botón "atrás" del navegador funcione y para poder
// compartir un tema o un ejercicio con un enlace. Lo que va después de «?»
// son opciones (por ejemplo, qué temas repasar).
function leerRuta() {
  const [ruta, consulta = ''] = window.location.hash.replace(/^#/, '').split('?');
  return { partes: (ruta || '/').split('/').filter(Boolean), opciones: new URLSearchParams(consulta) };
}

function crearSesion({ partes, opciones }, progreso, catalogo) {
  const [tipo, id] = partes;
  const clave = Date.now();
  if (tipo === 'tema') {
    const tema = catalogo.temas.find((t) => t.id === id);
    if (!tema) return null;
    const ejercicios = catalogo.activos.filter((e) => e.tema === id);
    return ejercicios.length ? { tipo, ejeId: tema.eje, titulo: tema.nombre, ejercicios, clave } : null;
  }
  if (tipo === 'ejercicio') {
    // Un ejercicio por enlace se abre aunque esté desactivado, para que el
    // docente pueda probarlo o proyectarlo.
    const ejercicio = catalogo.porId.get(id);
    if (!ejercicio) return null;
    return { tipo, ejeId: ejercicio.eje, titulo: 'Un ejercicio', ejercicios: [ejercicio], clave };
  }
  if (tipo === 'repasar' && id === 'practicar') {
    const partesElegidas = opciones.get('partes')?.split(',') ?? PARTES_REPASO.map((p) => p.id);
    const temas = opciones.get('temas')?.split(',');
    const cuantas = Number(opciones.get('n')) || Infinity;
    const ids = idsParaRepasar(progreso, partesElegidas);
    const ejercicios = mezclar(catalogo.activos.filter((e) => ids.includes(e.id) && (!temas || temas.includes(e.tema)))).slice(0, cuantas);
    return ejercicios.length ? { tipo: 'repaso', ejeId: null, titulo: 'Repasar', ejercicios, clave } : null;
  }
  if (tipo === 'ensayo') {
    const ejercicios = EJES.flatMap((eje) =>
      mezclar(catalogo.activos.filter((e) => e.eje === eje.id && e.tipo === 'alternativas' && !e.soloPractica)).slice(0, PREGUNTAS_ENSAYO_POR_EJE),
    );
    return ejercicios.length ? { tipo, ejeId: null, titulo: 'Ensayo tipo SIMCE', ejercicios: mezclar(ejercicios), clave } : null;
  }
  return null;
}

export default function App() {
  const [ruta, setRuta] = useState(leerRuta);
  const [estudiantes, setEstudiantes] = useState(cargarEstudiantes);
  const [curso, setCurso] = useState(leerCurso);
  const catalogo = useMemo(() => armarCatalogo(curso), [curso]);
  const perfil = estudiantes.perfiles[estudiantes.activo];
  const progreso = perfil.progreso;

  // La sesión se arma al llegar a una ruta, con el progreso de ese momento.
  const actual = useRef({ progreso, catalogo });
  actual.current = { progreso, catalogo };
  const [sesion, setSesion] = useState(() => crearSesion(leerRuta(), progreso, catalogo));

  useEffect(() => {
    const alCambiar = () => {
      const nueva = leerRuta();
      setRuta(nueva);
      setSesion(crearSesion(nueva, actual.current.progreso, actual.current.catalogo));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', alCambiar);
    return () => window.removeEventListener('hashchange', alCambiar);
  }, []);

  function cambiarEstudiantes(cambio) {
    setEstudiantes((prev) => {
      const nuevo = cambio(prev);
      guardarEstudiantes(nuevo);
      return nuevo;
    });
  }

  const cambiarPerfil = (cambio) =>
    cambiarEstudiantes((prev) => ({ ...prev, perfiles: { ...prev.perfiles, [prev.activo]: cambio(prev.perfiles[prev.activo]) } }));
  const actualizar = (cambio) => cambiarPerfil((p) => ({ ...p, progreso: cambio(p.progreso) }));

  const cambiarCurso = (cambio) =>
    setCurso((prev) => {
      const nuevo = guardarCurso(typeof cambio === 'function' ? cambio(prev) : cambio);
      return nuevo;
    });

  const ir = (destino) => {
    window.location.hash = destino;
  };

  // Guarda el estado de un ejercicio y anota el intento para el panel docente.
  const registrar = (id, estado, detalle = {}, modo = 'tema') =>
    cambiarPerfil((p) => {
      const conEstado = { ...p, progreso: { ...p.progreso, ejercicios: { ...p.progreso.ejercicios, [id]: estado } } };
      return anotar(conEstado, { e: id, m: modo, r: estado, ...(detalle.x?.length ? { x: detalle.x } : {}), ...(detalle.a ? { a: detalle.a } : {}) });
    });

  const repetir = () => setSesion(crearSesion(ruta, progreso, catalogo));

  const elegirPerfil = (id) => cambiarEstudiantes((prev) => ({ ...prev, activo: id }));
  const nuevoPerfil = (nombre, cursoDelPerfil) =>
    cambiarEstudiantes((prev) => {
      const p = crearPerfil(nombre, cursoDelPerfil);
      return { activo: p.id, perfiles: { ...prev.perfiles, [p.id]: p } };
    });
  const borrarPerfil = (id) =>
    cambiarEstudiantes((prev) => {
      const perfiles = { ...prev.perfiles };
      delete perfiles[id];
      if (!Object.keys(perfiles).length) {
        const p = crearPerfil();
        return { activo: p.id, perfiles: { [p.id]: p } };
      }
      return { activo: perfiles[prev.activo] ? prev.activo : Object.keys(perfiles)[0], perfiles };
    });

  const [tipo, id, extra] = ruta.partes;

  if (tipo === 'eje' && EJES.some((e) => e.id === id)) return <Eje ejeId={id} progreso={progreso} catalogo={catalogo} ir={ir} />;

  if (tipo === 'docentes') {
    return (
      <Docentes
        partes={ruta.partes.slice(1)}
        ir={ir}
        catalogo={catalogo}
        curso={curso}
        cambiarCurso={cambiarCurso}
        estudiantes={estudiantes}
        borrarPerfil={borrarPerfil}
      />
    );
  }

  if (tipo === 'perfil') {
    return (
      <Perfil
        estudiantes={estudiantes}
        curso={curso}
        onElegir={(idPerfil) => {
          elegirPerfil(idPerfil);
          ir('/');
        }}
        onCrear={(nombre) => {
          nuevoPerfil(nombre, curso.curso);
          ir('/');
        }}
        onRenombrar={(nombre) => {
          cambiarPerfil((p) => ({ ...p, nombre, curso: p.curso ?? curso.curso }));
          ir('/');
        }}
        ir={ir}
      />
    );
  }

  if (tipo === 'unirse' && id) {
    return (
      <Unirse
        key={id}
        codigo={id}
        estudiantes={estudiantes}
        onUnirse={(datos, idPerfil, nombre) => {
          cambiarCurso((prev) => ({ ...prev, ...datos }));
          if (idPerfil) {
            cambiarEstudiantes((prev) => ({
              activo: idPerfil,
              perfiles: { ...prev.perfiles, [idPerfil]: { ...prev.perfiles[idPerfil], curso: datos.curso } },
            }));
          } else nuevoPerfil(nombre, datos.curso);
          ir('/');
        }}
        ir={ir}
      />
    );
  }

  if (tipo === 'repasar' && (id !== 'practicar' || !sesion)) return <Repasar progreso={progreso} catalogo={catalogo} ir={ir} />;

  if (tipo === 'tema') {
    const tema = catalogo.temas.find((t) => t.id === id);
    if (tema && (extra === 'ejemplo' || !progreso.ejemplosVistos[tema.id])) {
      const practicar = () => {
        actualizar((p) => ({ ...p, ejemplosVistos: { ...p.ejemplosVistos, [tema.id]: true }, ultimoTema: tema.id }));
        if (extra === 'ejemplo') ir(`/tema/${tema.id}`);
      };
      return <Ejemplo key={tema.id} tema={tema} onPracticar={practicar} onSalir={() => ir(`/eje/${tema.eje}`)} />;
    }
  }

  if (sesion && (tipo === 'tema' || tipo === 'ejercicio' || tipo === 'repasar')) {
    const volver = sesion.ejeId && tipo === 'tema' ? `/eje/${sesion.ejeId}` : tipo === 'repasar' ? '/repasar' : '/';
    return (
      <Practica
        key={sesion.clave}
        sesion={sesion}
        onRegistrar={(idEj, estado, detalle) => {
          registrar(idEj, estado, detalle, sesion.tipo);
          if (tipo === 'tema') actualizar((p) => ({ ...p, ultimoTema: id }));
        }}
        onPendiente={(idEj, detalle) => registrar(idEj, 'pendiente', detalle, sesion.tipo)}
        onRepetir={repetir}
        onSalir={() => ir(volver)}
        textoSalir={tipo === 'tema' ? 'Elegir otro tema' : tipo === 'repasar' ? 'Elegir qué repasar' : 'Volver al inicio'}
        onVerEjemplo={(temaId) => ir(`/tema/${temaId}/ejemplo`)}
      />
    );
  }

  if (sesion && tipo === 'ensayo') {
    return (
      <Ensayo
        key={sesion.clave}
        sesion={sesion}
        onSalir={() => ir('/')}
        onRepetir={repetir}
        onTerminar={(resultados) =>
          cambiarPerfil((p) => {
            const ejercicios = { ...p.progreso.ejercicios };
            let conIntentos = p;
            resultados.forEach((r) => {
              if (!r.correcta) ejercicios[r.id] = 'ensayo';
              conIntentos = anotar(conIntentos, {
                e: r.id,
                m: 'ensayo',
                r: r.correcta ? 'correcta' : r.texto ? 'incorrecta' : 'blanco',
                ...(r.texto && !r.correcta ? { x: [[r.texto, r.texto]] } : {}),
                ...(r.marcada ? { p: 1 } : {}),
              });
            });
            const correctas = resultados.filter((r) => r.correcta).length;
            const ensayos = [...p.progreso.ensayos, { fecha: new Date().toISOString(), correctas, total: resultados.length }];
            return { ...conIntentos, progreso: { ...p.progreso, ejercicios, ensayos } };
          })
        }
      />
    );
  }

  return <Inicio progreso={progreso} perfil={perfil} catalogo={catalogo} ir={ir} />;
}
