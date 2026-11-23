import { useState } from 'react';
import './App.css';
import { EJES, EJERCICIOS } from './data/ejercicios.js';
import Inicio from './components/Inicio.jsx';
import Practica from './components/Practica.jsx';
import Resumen from './components/Resumen.jsx';
import { guardarProgreso, leerProgreso, mezclar } from './utilidades.js';

const PREGUNTAS_MIXTA = 6;

// Por eje: los ejercicios en el orden del JSON. Mixta: 6 al azar.
function crearSesion(ejeId) {
  if (ejeId) {
    const eje = EJES.find((e) => e.id === ejeId);
    return {
      ejeId,
      titulo: eje.nombre,
      ejercicios: EJERCICIOS.filter((e) => e.eje === ejeId),
      clave: Date.now(),
    };
  }
  return {
    ejeId: null,
    titulo: 'Práctica mixta',
    ejercicios: mezclar(EJERCICIOS).slice(0, PREGUNTAS_MIXTA),
    clave: Date.now(),
  };
}

function App() {
  const [pantalla, setPantalla] = useState('inicio');
  const [sesion, setSesion] = useState(null);
  const [resultados, setResultados] = useState([]);
  const [dominados, setDominados] = useState(leerProgreso);

  function empezar(ejeId) {
    setSesion(crearSesion(ejeId));
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
      onElegirEje={empezar}
      onPracticaMixta={() => empezar(null)}
    />
  );
}

export default App;
