import { useEffect, useState } from 'react';
import './App.css';
import { EJES } from './data/ejes.js';
import { EJERCICIOS, TEMAS } from './data/index.js';
import { guardarProgreso, idsParaRepasar, leerProgreso } from './lib/progreso.js';
import Inicio from './components/pantallas/Inicio.jsx';
import Eje from './components/pantallas/Eje.jsx';
import Ejemplo from './components/pantallas/Ejemplo.jsx';
import Practica from './components/pantallas/Practica.jsx';
import Ensayo from './components/pantallas/Ensayo.jsx';
import Docentes from './components/pantallas/Docentes.jsx';

const PREGUNTAS_ENSAYO_POR_EJE = 3;
const MAXIMO_REPASO = 8;

function mezclar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Rutas con # para que el botón "atrás" del navegador funcione y para poder
// compartir un tema o un ejercicio con un enlace.
function leerRuta() {
  const ruta = window.location.hash.replace(/^#/, '') || '/';
  return ruta.split('/').filter(Boolean);
}

function crearSesion(partes, progreso) {
  const [tipo, id] = partes;
  const clave = Date.now();
  if (tipo === 'tema') {
    const tema = TEMAS.find((t) => t.id === id);
    if (!tema) return null;
    return { tipo, ejeId: tema.eje, titulo: tema.nombre, ejercicios: EJERCICIOS.filter((e) => e.tema === id), clave };
  }
  if (tipo === 'ejercicio') {
    const ejercicio = EJERCICIOS.find((e) => e.id === id);
    if (!ejercicio) return null;
    return { tipo, ejeId: ejercicio.eje, titulo: 'Un ejercicio', ejercicios: [ejercicio], clave };
  }
  if (tipo === 'repasar') {
    const ids = idsParaRepasar(progreso);
    const ejercicios = EJERCICIOS.filter((e) => ids.includes(e.id)).slice(0, MAXIMO_REPASO);
    return ejercicios.length ? { tipo, ejeId: null, titulo: 'Repasar', ejercicios, clave } : null;
  }
  if (tipo === 'ensayo') {
    const ejercicios = EJES.flatMap((eje) =>
      mezclar(EJERCICIOS.filter((e) => e.eje === eje.id && e.tipo === 'alternativas' && !e.soloPractica)).slice(0, PREGUNTAS_ENSAYO_POR_EJE),
    );
    return { tipo, ejeId: null, titulo: 'Ensayo tipo SIMCE', ejercicios: mezclar(ejercicios), clave };
  }
  return null;
}

export default function App() {
  const [partes, setPartes] = useState(leerRuta);
  const [progreso, setProgreso] = useState(leerProgreso);
  const [sesion, setSesion] = useState(() => crearSesion(leerRuta(), leerProgreso()));

  useEffect(() => {
    const alCambiar = () => {
      const nuevas = leerRuta();
      setPartes(nuevas);
      setSesion(crearSesion(nuevas, leerProgreso()));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', alCambiar);
    return () => window.removeEventListener('hashchange', alCambiar);
  }, []);

  function actualizar(cambio) {
    setProgreso((prev) => {
      const nuevo = cambio(prev);
      guardarProgreso(nuevo);
      return nuevo;
    });
  }

  const ir = (ruta) => {
    window.location.hash = ruta;
  };

  const registrar = (id, estado) => actualizar((p) => ({ ...p, ejercicios: { ...p.ejercicios, [id]: estado } }));
  const repetir = () => setSesion(crearSesion(partes, progreso));

  const [tipo, id, extra] = partes;

  if (tipo === 'eje' && EJES.some((e) => e.id === id)) return <Eje ejeId={id} progreso={progreso} ir={ir} />;

  if (tipo === 'docentes') return <Docentes ir={ir} />;

  if (tipo === 'tema') {
    const tema = TEMAS.find((t) => t.id === id);
    if (tema && (extra === 'ejemplo' || !progreso.ejemplosVistos[tema.id])) {
      const practicar = () => {
        actualizar((p) => ({ ...p, ejemplosVistos: { ...p.ejemplosVistos, [tema.id]: true }, ultimoTema: tema.id }));
        if (extra === 'ejemplo') ir(`/tema/${tema.id}`);
      };
      return <Ejemplo key={tema.id} tema={tema} onPracticar={practicar} onSalir={() => ir(`/eje/${tema.eje}`)} />;
    }
  }

  if (sesion && (tipo === 'tema' || tipo === 'ejercicio' || tipo === 'repasar')) {
    const volver = sesion.ejeId && tipo === 'tema' ? `/eje/${sesion.ejeId}` : '/';
    return (
      <Practica
        key={sesion.clave}
        sesion={sesion}
        onRegistrar={(idEj, estado) => {
          registrar(idEj, estado);
          if (tipo === 'tema') actualizar((p) => ({ ...p, ultimoTema: id }));
        }}
        onRepetir={repetir}
        onSalir={() => ir(volver)}
        textoSalir={tipo === 'tema' ? 'Elegir otro tema' : 'Volver al inicio'}
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
          actualizar((p) => {
            const ejercicios = { ...p.ejercicios };
            resultados.forEach((r) => {
              if (!r.correcta) ejercicios[r.id] = 'ayuda';
            });
            const correctas = resultados.filter((r) => r.correcta).length;
            return { ...p, ejercicios, ensayos: [...p.ensayos, { fecha: new Date().toISOString(), correctas, total: resultados.length }] };
          })
        }
      />
    );
  }

  return <Inicio progreso={progreso} ir={ir} />;
}
