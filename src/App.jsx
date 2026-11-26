import { useEffect, useState } from 'react';
import './App.css';
import { EJES, EJERCICIOS } from './data/ejercicios.js';
import { combinarEjercicios, pedirEjercicios } from './lib/api.js';
import Inicio from './components/Inicio.jsx';
import Practica from './components/Practica.jsx';
import Resumen from './components/Resumen.jsx';

const CLAVE_PROGRESO = 'oh-simce-progreso';
const PREGUNTAS_MIXTA = 6;

function leerProgreso() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_PROGRESO)) ?? {};
  } catch {
    return {};
  }
}

function guardarProgreso(progreso) {
  try {
    localStorage.setItem(CLAVE_PROGRESO, JSON.stringify(progreso));
  } catch {
    // Sin almacenamiento (modo privado): el progreso dura solo esta visita.
  }
}

function mezclar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function crearSesion(ejeId, ejercicios) {
  if (ejeId) {
    const eje = EJES.find((e) => e.id === ejeId);
    return {
      ejeId,
      titulo: eje.nombre,
      ejercicios: ejercicios.filter((e) => e.eje === ejeId),
      clave: Date.now(),
    };
  }
  return {
    ejeId: null,
    titulo: 'Práctica mixta',
    ejercicios: mezclar(ejercicios).slice(0, PREGUNTAS_MIXTA),
    clave: Date.now(),
  };
}

function App() {
  const [pantalla, setPantalla] = useState('inicio');
  const [sesion, setSesion] = useState(null);
  const [resultados, setResultados] = useState([]);
  const [dominados, setDominados] = useState(leerProgreso);
  // Parte con las preguntas del frontend; si el backend responde, se combinan con las suyas.
  const [ejercicios, setEjercicios] = useState(EJERCICIOS);

  useEffect(() => {
    pedirEjercicios()
      .then((remotos) => {
        if (remotos.length > 0) {
          setEjercicios(combinarEjercicios(EJERCICIOS, remotos, EJES.map((e) => e.id)));
        }
      })
      .catch((error) => {
        console.info('Backend no disponible: se usan las preguntas del frontend.', error.message);
      });
  }, []);

  function empezar(ejeId) {
    setSesion(crearSesion(ejeId, ejercicios));
    setPantalla('practica');
    window.scrollTo({ top: 0 });
  }

  function terminar(nuevos) {
    const progreso = { ...dominados };
    nuevos.forEach((r) => {
      if (r.primerIntento) progreso[r.id] = true;
    });
    setDominados(progreso);
    guardarProgreso(progreso);
    setResultados(nuevos);
    setPantalla('resumen');
    window.scrollTo({ top: 0 });
  }

  if (pantalla === 'practica') {
    return <Practica sesion={sesion} onTerminar={terminar} onSalir={() => setPantalla('inicio')} />;
  }

  if (pantalla === 'resumen') {
    return (
      <Resumen
        sesion={sesion}
        resultados={resultados}
        onRepetir={() => empezar(sesion.ejeId)}
        onInicio={() => setPantalla('inicio')}
      />
    );
  }

  return (
    <Inicio
      dominados={dominados}
      ejercicios={ejercicios}
      onElegirEje={empezar}
      onPracticaMixta={() => empezar(null)}
    />
  );
}

export default App;
