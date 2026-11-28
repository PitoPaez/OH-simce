import { useState, useEffect, useRef } from 'react';
import bolitasRojas from '../../assets/images/numeros-y-operaciones/bolitas-rojas.png';
import bolitasAmarillas from '../../assets/images/numeros-y-operaciones/bolitas-amarillas.png';
import bolitasAzules from '../../assets/images/numeros-y-operaciones/bolitas-azules.png';
import { BotonComprobar } from './ArrastrarPosicional.jsx';

const BOLSAS = [
  { id: 'rojas', num: 112, color: 'roja', etiqueta: '112 rojas', img: bolitasRojas, alt: 'Bolsa con 112 bolitas rojas' },
  { id: 'amarillas', num: 43, color: 'amarilla', etiqueta: '43 amarillas', img: bolitasAmarillas, alt: 'Bolsa con 43 bolitas amarillas' },
  { id: 'azules', num: 103, color: 'azul', etiqueta: '103 azules', img: bolitasAzules, alt: 'Bolsa con 103 bolitas azules' },
];

export default function SumaBolitas({ ejercicio, resuelto, onResponder }) {
  const columnas = ['C', 'D', 'U'];

  // Filas en la cuadrícula: cada fila guarda el id de la bolsa ('rojas' | 'amarillas' | 'azules' | null)
  const [fila1, setFila1] = useState(null);
  const [fila2, setFila2] = useState(null);
  const [fila3, setFila3] = useState(null);

  // Alineación pedagógica del 43: 'derecha' (D y U: correcto) | 'izquierda' (C y D: error común que da 645)
  const [alineacion43, setAlineacion43] = useState('derecha');

  // Signo interactivo: comienza en '+' y el estudiante puede alternar con '−'
  const [signo, setSigno] = useState('+');

  // Arrastre y selección táctil
  const [bolsaSeleccionada, setBolsaSeleccionada] = useState(null);
  const [arrastrando, setArrastrando] = useState(null);
  const [dragOverFila, setDragOverFila] = useState(null);

  // Casillas de resultado { 0: Centenas, 1: Decenas, 2: Unidades }
  const [resultado, setResultado] = useState({ 0: '', 1: '', 2: '' });
  const [celdaActiva, setCeldaActiva] = useState(2); // Comienza en Unidades (derecha a izquierda)

  const inputRef0 = useRef(null);
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRefs = [inputRef0, inputRef1, inputRef2];

  // Auto-completar al resolver
  useEffect(() => {
    if (resuelto) {
      setFila1('rojas');
      setFila2('amarillas');
      setFila3('azules');
      setAlineacion43('derecha');
      setSigno('+');
      setResultado({ 0: '2', 1: '5', 2: '8' });
      setBolsaSeleccionada(null);
    }
  }, [resuelto]);

  const todasColocadas = Boolean(fila1 && fila2 && fila3);
  const todasLlenas = resultado[0] !== '' && resultado[1] !== '' && resultado[2] !== '';

  // Enfocar en la casilla de las unidades cuando se colocan las 3 bolsas
  useEffect(() => {
    if (todasColocadas && !resuelto && !resultado[0] && !resultado[1] && !resultado[2]) {
      inputRef2.current?.focus();
      setCeldaActiva(2);
    }
  }, [todasColocadas, resuelto, resultado]);

  // Colocar bolsa en una fila
  function colocarEnFila(bolsaId, targetFila, alignCol = null) {
    if (resuelto) return;

    // Si la bolsa ya estaba en otra fila, liberarla
    if (fila1 === bolsaId) setFila1(null);
    if (fila2 === bolsaId) setFila2(null);
    if (fila3 === bolsaId) setFila3(null);

    if (targetFila === 1) setFila1(bolsaId);
    else if (targetFila === 2) setFila2(bolsaId);
    else if (targetFila === 3) setFila3(bolsaId);

    // Si es el 43 y se soltó en una columna específica:
    if (bolsaId === 'amarillas') {
      if (alignCol === 'C') setAlineacion43('izquierda');
      else if (alignCol === 'D' || alignCol === 'U') setAlineacion43('derecha');
    }

    setBolsaSeleccionada(null);
    setArrastrando(null);
    setDragOverFila(null);
  }

  function quitarDeFila(targetFila) {
    if (resuelto) return;
    if (targetFila === 1) setFila1(null);
    else if (targetFila === 2) setFila2(null);
    else if (targetFila === 3) setFila3(null);
  }

  function handleBolsaClick(bolsaId) {
    if (resuelto) return;
    if (fila1 === bolsaId) {
      quitarDeFila(1);
      return;
    }
    if (fila2 === bolsaId) {
      quitarDeFila(2);
      return;
    }
    if (fila3 === bolsaId) {
      quitarDeFila(3);
      return;
    }

    if (bolsaSeleccionada === bolsaId) {
      setBolsaSeleccionada(null);
      return;
    }

    // Auto-ubicar en la primera fila disponible
    if (!fila1) colocarEnFila(bolsaId, 1);
    else if (!fila2) colocarEnFila(bolsaId, 2);
    else if (!fila3) colocarEnFila(bolsaId, 3);
    else setBolsaSeleccionada(bolsaId);
  }

  // Drag and drop
  function handleDragStart(e, bolsaId) {
    if (resuelto) return;
    setArrastrando(bolsaId);
    e.dataTransfer.setData('text/plain', bolsaId);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragEnd() {
    setArrastrando(null);
    setDragOverFila(null);
  }

  function handleDragOver(e, filaNum) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverFila !== filaNum) setDragOverFila(filaNum);
  }

  function handleDrop(e, filaNum, col = null) {
    e.preventDefault();
    setDragOverFila(null);
    const bolsaId = e.dataTransfer.getData('text/plain') || arrastrando;
    if (bolsaId) {
      colocarEnFila(bolsaId, filaNum, col);
    }
  }

  // Alternar alineación del 43
  function alternarAlineacion43() {
    if (resuelto) return;
    setAlineacion43((prev) => (prev === 'derecha' ? 'izquierda' : 'derecha'));
  }

  // Alternar signo (+ o −)
  function alternarSigno() {
    if (resuelto) return;
    setSigno((prev) => (prev === '+' ? '−' : '+'));
  }

  // Manejo de inputs del resultado
  function manejarInputResultado(idx, valor) {
    if (resuelto || !todasColocadas) return;
    const soloDigito = valor.replace(/[^\d]/g, '').slice(-1);

    setResultado((prev) => ({
      ...prev,
      [idx]: soloDigito,
    }));

    // Navegación intuitiva de derecha a izquierda o hacia adelante
    if (soloDigito) {
      if (idx > 0) {
        setCeldaActiva(idx - 1);
        inputRefs[idx - 1].current?.focus();
      }
    }
  }

  function manejarKeyDown(idx, e) {
    if (resuelto || !todasColocadas) return;
    if (e.key === 'Backspace') {
      if (!resultado[idx] && idx < 2) {
        e.preventDefault();
        setCeldaActiva(idx + 1);
        inputRefs[idx + 1].current?.focus();
      }
    } else if (e.key === 'ArrowLeft') {
      if (idx > 0) {
        e.preventDefault();
        setCeldaActiva(idx - 1);
        inputRefs[idx - 1].current?.focus();
      }
    } else if (e.key === 'ArrowRight') {
      if (idx < 2) {
        e.preventDefault();
        setCeldaActiva(idx + 1);
        inputRefs[idx + 1].current?.focus();
      }
    } else if (e.key === 'Enter') {
      if (todasLlenas) {
        e.preventDefault();
        comprobar();
      }
    }
  }

  function reiniciar() {
    if (resuelto) return;
    setFila1(null);
    setFila2(null);
    setFila3(null);
    setAlineacion43('derecha');
    setSigno('+');
    setResultado({ 0: '', 1: '', 2: '' });
    setCeldaActiva(2);
    setBolsaSeleccionada(null);
  }

  // Obtener cifras a renderizar para una fila dada
  function obtenerCifrasFila(bolsaId) {
    if (!bolsaId) return null;
    const item = BOLSAS.find((b) => b.id === bolsaId);
    if (!item) return null;

    if (item.num === 43) {
      if (alineacion43 === 'izquierda') {
        // Desalineado: 4 en C, 3 en D, U vacía
        return ['4', '3', '·'];
      }
      // Correcto: C vacía, 4 en D, 3 en U
      return ['·', '4', '3'];
    }

    return String(item.num).split('');
  }

  // Comprobar respuesta
  function comprobar() {
    if (!todasColocadas) {
      onResponder({
        correcta: false,
        clave: 'incompleto',
      });
      return;
    }

    // Validar signo de la operación (debe ser suma +)
    if (signo !== '+') {
      onResponder({
        correcta: false,
        clave: 'signo-resta',
        valor: '−',
      });
      return;
    }

    const valorFormado = `${resultado[0]}${resultado[1]}${resultado[2]}`;

    // Si el 43 está alineado a la izquierda (como 430)
    if (alineacion43 === 'izquierda') {
      if (valorFormado === '645') {
        onResponder({
          correcta: false,
          clave: '645',
          valor: '645',
        });
        return;
      }
      onResponder({
        correcta: false,
        clave: '43-desalineado',
        valor: valorFormado,
      });
      return;
    }

    // Alineación correcta (derecha)
    const esCorrecto = valorFormado === '258';
    let clave = 'otro';

    if (esCorrecto) {
      clave = 'ok';
    } else if (valorFormado === '645') {
      clave = '645';
    } else if (valorFormado === '155') {
      clave = '155';
    } else if (valorFormado === '268') {
      clave = '268';
    } else if (valorFormado === '215') {
      clave = '215';
    } else if (valorFormado === '245') {
      clave = '245';
    } else if (ejercicio.errores && ejercicio.errores[valorFormado]) {
      clave = valorFormado;
    }

    onResponder({
      correcta: esCorrecto,
      clave,
      valor: valorFormado,
    });
  }

  const cifrasFila1 = obtenerCifrasFila(fila1);
  const cifrasFila2 = obtenerCifrasFila(fila2);
  const cifrasFila3 = obtenerCifrasFila(fila3);

  const hayFilaCon43 = fila1 === 'amarillas' || fila2 === 'amarillas' || fila3 === 'amarillas';

  return (
    <div className="simce-canicas-interactivo simce-suma-bolitas-interactivo">
      {/* Guía paso a paso */}
      <p className="simce-guia-instruccion">
        {!todasColocadas
          ? 'Arrastra o toca las 3 bolsas de bolitas para colocarlas en la tabla de suma:'
          : signo !== '+'
            ? '¿Qué operación corresponde si Marcia junta todas sus bolitas? ¡Toca el signo para cambiarlo a +!'
            : hayFilaCon43 && alineacion43 === 'izquierda'
              ? '⚠️ ¡Observa el 43! ¿Está en las columnas correctas? Toca la fila para cambiar su alineación.'
              : 'Escribe el resultado de la suma en las casillas (puedes empezar por las Unidades):'}
      </p>

      {/* Contenedor principal: Izquierda Bolsas | Derecha Tabla */}
      <div className="simce-pantalla-flex simce-pantalla-flex--suma">
        {/* Panel izquierdo: 3 Bolsas */}
        <div className="simce-bolsas-panel">
          <div className="simce-bolsas-grid">
            {BOLSAS.map((bolsa) => {
              const colocada = fila1 === bolsa.id || fila2 === bolsa.id || fila3 === bolsa.id;
              const seleccionada = bolsaSeleccionada === bolsa.id;

              return (
                <div
                  key={bolsa.id}
                  className={`simce-bolsa-card simce-bolsa-card--${bolsa.color} ${colocada ? 'simce-bolsa-card--colocada' : ''} ${
                    seleccionada ? 'simce-bolsa-card--seleccionada' : ''
                  }`}
                  draggable={!resuelto && !colocada}
                  onDragStart={(e) => handleDragStart(e, bolsa.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleBolsaClick(bolsa.id)}
                  role="button"
                  tabIndex={0}
                  title={
                    colocada
                      ? 'Colocada en la tabla (haz clic para quitar)'
                      : `Arrastra o toca la bolsa de ${bolsa.etiqueta}`
                  }
                >
                  <div className="simce-bolsa-img-wrapper">
                    <img src={bolsa.img} alt={bolsa.alt} className="simce-bolsa-img" />
                    {colocada && <span className="simce-check-badge">✓</span>}
                  </div>
                  <div className="simce-bolsa-info">
                    <span className="simce-bolsa-num">{bolsa.num}</span>
                    <span className="simce-bolsa-tag">{bolsa.color === 'roja' ? 'Rojas' : bolsa.color === 'amarilla' ? 'Amarillas' : 'Azules'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ayuda didáctica para la alineación del 43 */}
          {hayFilaCon43 && !resuelto && (
            <div className="simce-alineacion-box">
              <span className="simce-alineacion-titulo">Alineación del 43:</span>
              <button
                type="button"
                className={`simce-btn-alinear ${alineacion43 === 'derecha' ? 'simce-btn-alinear--activo' : ''}`}
                onClick={alternarAlineacion43}
                title="Cambiar posición del 43 entre C-D o D-U"
              >
                {alineacion43 === 'derecha' ? '✓ Alineado a la derecha (4 decenas, 3 unidades)' : '⚠️ Alineado a la izquierda (en Centenas)'}
              </button>
              <span className="simce-alineacion-hint">Toca el botón o la casilla vacía para mover el 43</span>
            </div>
          )}
        </div>

        {/* Panel derecho: Tabla de cálculo con 3 filas */}
        <div className="simce-tabla-columna">
          {/* Cabecera C D U */}
          <div className="simce-header-cdu">
            <span className="simce-spacer-signo"></span>
            {columnas.map((col) => (
              <span key={col} className="simce-th-letra">
                {col}
              </span>
            ))}
          </div>
          <div className="simce-linea-azul"></div>

          {/* Renderizado de las 3 filas */}
          {[
            { filaNum: 1, bolsaId: fila1, cifras: cifrasFila1 },
            { filaNum: 2, bolsaId: fila2, cifras: cifrasFila2 },
            { filaNum: 3, bolsaId: fila3, cifras: cifrasFila3 },
          ].map(({ filaNum, bolsaId, cifras }) => {
            const es43 = bolsaId === 'amarillas';
            return (
              <div
                key={filaNum}
                className={`simce-fila-datos ${dragOverFila === filaNum ? 'simce-fila-datos--dragover' : ''} ${
                  !bolsaId ? 'simce-fila-datos--vacia' : ''
                } ${es43 ? 'simce-fila-datos--es43' : ''}`}
                onDragOver={(e) => handleDragOver(e, filaNum)}
                onDragLeave={() => setDragOverFila(null)}
                onDrop={(e) => handleDrop(e, filaNum)}
                onClick={() => {
                  if (bolsaSeleccionada) colocarEnFila(bolsaSeleccionada, filaNum);
                  else if (es43) alternarAlineacion43();
                  else if (bolsaId) quitarDeFila(filaNum);
                }}
                title={
                  bolsaId
                    ? es43
                      ? 'Haz clic para cambiar la alineación del 43'
                      : 'Haz clic para quitar de la tabla'
                    : 'Arrastra o toca una bolsa para colocarla aquí'
                }
              >
                {/* Signo interactivo al lado de la última fila, espaciador en las demás */}
                {filaNum === 3 ? (
                  <button
                    type="button"
                    className={`simce-btn-signo ${signo === '+' ? 'simce-btn-signo--mas' : 'simce-btn-signo--menos'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      alternarSigno();
                    }}
                    title="Toca para cambiar la operación (+ o −)"
                    aria-label={`Operación actual: ${signo === '+' ? 'Suma (+)' : 'Resta (−)'}. Toca para cambiar.`}
                  >
                    {signo}
                  </button>
                ) : (
                  <span className="simce-spacer-signo"></span>
                )}

                {columnas.map((col, idx) => {
                  const valor = cifras ? cifras[idx] : null;
                  const esPunto = valor === '·';
                  const casillaVaciaFila = !cifras;

                  return (
                    <div
                      key={col}
                      className={`simce-casilla-cuadro ${cifras ? 'simce-casilla-cuadro--ocupada' : ''} ${
                        esPunto ? 'simce-casilla-cuadro--punto' : ''
                      }`}
                      onDrop={(e) => {
                        e.stopPropagation();
                        handleDrop(e, filaNum, col);
                      }}
                      onClick={
                        es43
                          ? (e) => {
                              e.stopPropagation();
                              alternarAlineacion43();
                            }
                          : undefined
                      }
                    >
                      {casillaVaciaFila ? (
                        <span className="simce-placeholder-letra">{col}</span>
                      ) : esPunto ? (
                        <span className="simce-placeholder-punto" title="Columna vacía">
                          ·
                        </span>
                      ) : (
                        <span className="simce-digito-puesto">{valor}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Línea divisoria gruesa */}
          <div className="simce-linea-operacion"></div>

          {/* Fila de resultado */}
          <div className="simce-fila-resultado">
            <span className="simce-spacer-signo"></span>
            {[0, 1, 2].map((idx) => {
              const esActiva = celdaActiva === idx && todasColocadas && !resuelto;
              return (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  id={`simce-suma-res-col-${idx}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  autoComplete="off"
                  className={`simce-casilla-resultado ${esActiva ? 'simce-casilla-resultado--activa' : ''} ${
                    !todasColocadas ? 'simce-casilla-resultado--bloqueada' : ''
                  }`}
                  value={resultado[idx]}
                  placeholder="·"
                  disabled={!todasColocadas || resuelto}
                  onChange={(e) => manejarInputResultado(idx, e.target.value)}
                  onKeyDown={(e) => manejarKeyDown(idx, e)}
                  onFocus={(e) => {
                    setCeldaActiva(idx);
                    e.target.select();
                  }}
                  aria-label={`Resultado ${columnas[idx]}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Pie interactivo con Limpiar y Comprobar */}
      <div className="interactivo-pie">
        <button
          type="button"
          className="boton boton--texto"
          onClick={reiniciar}
          disabled={resuelto || (!fila1 && !fila2 && !fila3 && resultado[0] === '' && resultado[1] === '' && resultado[2] === '')}
        >
          Limpiar tabla
        </button>
        <BotonComprobar disabled={resuelto || !todasColocadas || !todasLlenas} onClick={comprobar} />
      </div>
    </div>
  );
}
