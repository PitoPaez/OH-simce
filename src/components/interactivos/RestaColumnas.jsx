import { useState, useEffect, useRef } from 'react';
import frascoLleno from '../../assets/images/numeros-y-operaciones/frasco lleno.png';
import frascoMedioVacio from '../../assets/images/numeros-y-operaciones/frasco-medio-vacio.png';
import { BotonComprobar } from './ArrastrarPosicional.jsx';

export default function RestaColumnas({ ejercicio, resuelto, onResponder }) {
  const columnas = ['C', 'D', 'U'];

  // Estados de colocación:
  // fila1: null | 324 | 158
  // fila2: null | 324 | 158
  const [fila1, setFila1] = useState(null);
  const [fila2, setFila2] = useState(null);

  // Signo: empieza en '+' como solicitó el usuario, al hacer clic cambia entre '+' y '−'
  const [signo, setSigno] = useState('+');

  // Arrastre y selección para tablets
  const [frascoSeleccionado, setFrascoSeleccionado] = useState(null); // 324 | 158
  const [arrastrando, setArrastrando] = useState(null); // 324 | 158
  const [dragOverFila, setDragOverFila] = useState(null); // 1 | 2

  // Canjes interactivos (pedir prestado)
  const [canjeU, setCanjeU] = useState(false);
  const [canjeD, setCanjeD] = useState(false);

  // Resultado en casillas: { 0: Centenas, 1: Decenas, 2: Unidades }
  const [resultado, setResultado] = useState({ 0: '', 1: '', 2: '' });
  const [celdaActiva, setCeldaActiva] = useState(0); // Comienza en Centenas al escribir

  // Referencias a los inputs para enfocar y escribir con teclado físico
  const inputRef0 = useRef(null);
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRefs = [inputRef0, inputRef1, inputRef2];

  // Auto-completar si ya está resuelto
  useEffect(() => {
    if (resuelto) {
      setFila1(324);
      setFila2(158);
      setSigno('−');
      setCanjeU(true);
      setCanjeD(true);
      setResultado({ 0: '1', 1: '6', 2: '6' });
    }
  }, [resuelto]);

  const ambosColocados = fila1 !== null && fila2 !== null;
  const todasLlenas = resultado[0] !== '' && resultado[1] !== '' && resultado[2] !== '';

  // Enfocar automáticamente en la primera casilla al colocar ambos frascos
  useEffect(() => {
    if (ambosColocados && !resuelto && !resultado[0] && !resultado[1] && !resultado[2]) {
      inputRefs[0].current?.focus();
      setCeldaActiva(0);
    }
  }, [ambosColocados, resuelto]);

  // Colocar número en una fila
  function colocarEnFila(num, targetFila) {
    if (resuelto) return;
    if (targetFila === 1) {
      if (fila2 === num) setFila2(null);
      setFila1(num);
    } else if (targetFila === 2) {
      if (fila1 === num) setFila1(null);
      setFila2(num);
    }
    setFrascoSeleccionado(null);
    setArrastrando(null);
    setDragOverFila(null);
  }

  function quitarDeFila(targetFila) {
    if (resuelto) return;
    if (targetFila === 1) {
      setFila1(null);
      setCanjeU(false);
      setCanjeD(false);
    } else if (targetFila === 2) {
      setFila2(null);
    }
  }

  // Tocar frasco (Touch / Clic para tablet)
  function handleFrascoClick(num) {
    if (resuelto) return;
    const estaEnFila1 = fila1 === num;
    const estaEnFila2 = fila2 === num;

    if (estaEnFila1) {
      quitarDeFila(1);
      return;
    }
    if (estaEnFila2) {
      quitarDeFila(2);
      return;
    }

    // Si no está colocado:
    if (frascoSeleccionado === num) {
      setFrascoSeleccionado(null);
      return;
    }

    // Auto-ubicar en la primera fila vacía si está disponible
    if (!fila1) {
      colocarEnFila(num, 1);
    } else if (!fila2) {
      colocarEnFila(num, 2);
    } else {
      setFrascoSeleccionado(num);
    }
  }

  // Drag and Drop
  function handleDragStart(e, num) {
    if (resuelto) return;
    setArrastrando(num);
    e.dataTransfer.setData('text/plain', String(num));
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

  function handleDrop(e, filaNum) {
    e.preventDefault();
    setDragOverFila(null);
    try {
      const data = Number(e.dataTransfer.getData('text/plain')) || arrastrando;
      if (data) colocarEnFila(data, filaNum);
    } catch {
      if (arrastrando) colocarEnFila(arrastrando, filaNum);
    }
  }

  // Alternar signo
  function alternarSigno() {
    if (resuelto) return;
    setSigno((prev) => (prev === '+' ? '−' : '+'));
  }

  // Alternar canje al tocar las cifras o botones
  function alternarCanjeU() {
    if (resuelto || !fila1 || fila1 !== 324) return;
    setCanjeU((prev) => !prev);
  }

  function alternarCanjeD() {
    if (resuelto || !fila1 || fila1 !== 324) return;
    setCanjeD((prev) => !prev);
  }

  // Manejo de escritura con teclado físico en los inputs
  function manejarInputResultado(idx, valor) {
    if (resuelto || !ambosColocados) return;
    // Solo permitir dígitos numéricos del 0 al 9
    const soloDigito = valor.replace(/[^\d]/g, '').slice(-1);

    setResultado((prev) => ({
      ...prev,
      [idx]: soloDigito,
    }));

    // Si ingresó un dígito, avanzar automáticamente a la casilla siguiente
    if (soloDigito && idx < 2) {
      setCeldaActiva(idx + 1);
      inputRefs[idx + 1].current?.focus();
    }
  }

  function manejarKeyDown(idx, e) {
    if (resuelto || !ambosColocados) return;
    if (e.key === 'Backspace') {
      if (!resultado[idx] && idx > 0) {
        e.preventDefault();
        setCeldaActiva(idx - 1);
        inputRefs[idx - 1].current?.focus();
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

  // Teclado numérico táctil en pantalla (para tablets)
  function pulsarDigito(digito) {
    if (resuelto || !ambosColocados) return;
    setResultado((prev) => ({
      ...prev,
      [celdaActiva]: String(digito),
    }));
    if (celdaActiva < 2) {
      setCeldaActiva(celdaActiva + 1);
      inputRefs[celdaActiva + 1].current?.focus();
    } else {
      inputRefs[celdaActiva].current?.focus();
    }
  }

  function borrarDigito() {
    if (resuelto || !ambosColocados) return;
    setResultado((prev) => ({
      ...prev,
      [celdaActiva]: '',
    }));
    inputRefs[celdaActiva].current?.focus();
  }

  function reiniciar() {
    if (resuelto) return;
    setFila1(null);
    setFila2(null);
    setSigno('+');
    setCanjeU(false);
    setCanjeD(false);
    setResultado({ 0: '', 1: '', 2: '' });
    setCeldaActiva(0);
    setFrascoSeleccionado(null);
  }

  // Comprobar respuesta
  function comprobar() {
    // 1. Validar signo
    if (signo !== '−') {
      onResponder({
        correcta: false,
        clave: 'signo-suma',
        valor: '+',
      });
      return;
    }

    // 2. Validar orden de las filas (324 arriba, 158 abajo)
    if (fila1 !== 324 || fila2 !== 158) {
      onResponder({
        correcta: false,
        clave: 'orden-invertido',
        valor: `${fila1 ?? 'vacío'} arriba`,
      });
      return;
    }

    // 3. Validar resultado
    const valorFormado = `${resultado[0]}${resultado[1]}${resultado[2]}`;
    const esCorrecto = valorFormado === '166';

    let clave = 'otro';
    if (esCorrecto) {
      clave = 'ok';
    } else if (ejercicio.errores && ejercicio.errores[valorFormado]) {
      clave = valorFormado;
    } else if (valorFormado === '234') {
      clave = '234';
    } else if (valorFormado === '176') {
      clave = '176';
    } else if (valorFormado === '482') {
      clave = '482';
    }

    onResponder({
      correcta: esCorrecto,
      clave,
      valor: valorFormado,
    });
  }

  const cifrasFila1 = fila1 !== null ? String(fila1).split('') : null;
  const cifrasFila2 = fila2 !== null ? String(fila2).split('') : null;

  return (
    <div className="simce-canicas-interactivo">
      {/* Mensaje o guía paso a paso */}
      <p className="simce-guia-instruccion">
        {!ambosColocados
          ? 'Arrastra los frascos a la tabla en el orden correcto (o tócalos para ubicarlos):'
          : signo !== '−'
            ? '¿Qué operación corresponde si Matías regaló canicas? ¡Toca el signo para cambiarlo!'
            : 'Escribe el resultado con tu teclado o con la botonera. Toca una cifra para pedir prestado (canje):'}
      </p>

      {/* Contenedor principal: Izquierda Frascos | Derecha Tabla */}
      <div className="simce-pantalla-flex">
        {/* Panel izquierdo: Los dos frascos con sus números */}
        <div className="simce-frascos-grupo">
          {/* Frasco 324 */}
          <div
            className={`simce-frasco-item ${fila1 === 324 || fila2 === 324 ? 'simce-frasco-item--colocado' : ''} ${frascoSeleccionado === 324 ? 'simce-frasco-item--seleccionado' : ''
              }`}
            draggable={!resuelto && fila1 !== 324 && fila2 !== 324}
            onDragStart={(e) => handleDragStart(e, 324)}
            onDragEnd={handleDragEnd}
            onClick={() => handleFrascoClick(324)}
            role="button"
            tabIndex={0}
            title={
              fila1 === 324 || fila2 === 324
                ? 'Colocado en la tabla (haz clic para quitar)'
                : 'Arrastra o toca el frasco de 324 canicas'
            }
          >
            <div className="simce-frasco-img-wrapper">
              <img src={frascoLleno} alt="Frasco con 324 canicas" className="simce-frasco-img" />
              {(fila1 === 324 || fila2 === 324) && <span className="simce-check-badge">✓</span>}
            </div>
            <span className="simce-frasco-label">324</span>
          </div>

          {/* Frasco 158 */}
          <div
            className={`simce-frasco-item ${fila1 === 158 || fila2 === 158 ? 'simce-frasco-item--colocado' : ''} ${frascoSeleccionado === 158 ? 'simce-frasco-item--seleccionado' : ''
              }`}
            draggable={!resuelto && fila1 !== 158 && fila2 !== 158}
            onDragStart={(e) => handleDragStart(e, 158)}
            onDragEnd={handleDragEnd}
            onClick={() => handleFrascoClick(158)}
            role="button"
            tabIndex={0}
            title={
              fila1 === 158 || fila2 === 158
                ? 'Colocado en la tabla (haz clic para quitar)'
                : 'Arrastra o toca el frasco de 158 canicas'
            }
          >
            <div className="simce-frasco-img-wrapper">
              <img src={frascoMedioVacio} alt="Frasco con 158 canicas" className="simce-frasco-img simce-frasco-img--158" />
              {(fila1 === 158 || fila2 === 158) && <span className="simce-check-badge">✓</span>}
            </div>
            <span className="simce-frasco-label">158</span>
          </div>
        </div>

        {/* Panel derecho: Tabla de cálculo estilo SIMCE idéntica a la imagen */}
        <div className="simce-tabla-columna">
          {/* Fila de canjes / reservas (visible cuando hay canje) */}
          <div className="simce-fila-reservas">
            <span className="simce-spacer-signo"></span>
            <div className="simce-reserva-slot">{canjeD && <span className="simce-num-reserva">2</span>}</div>
            <div className="simce-reserva-slot">
              {canjeD && <span className="simce-num-reserva">11</span>}
              {!canjeD && canjeU && <span className="simce-num-reserva">1</span>}
            </div>
            <div className="simce-reserva-slot">{canjeU && <span className="simce-num-reserva">14</span>}</div>
          </div>





          {/* Fila 1 (Minuendo: recuadros punteados) */}
          <div
            className={`simce-fila-datos ${dragOverFila === 1 ? 'simce-fila-datos--dragover' : ''} ${!fila1 ? 'simce-fila-datos--vacia' : ''
              }`}
            onDragOver={(e) => handleDragOver(e, 1)}
            onDragLeave={() => setDragOverFila(null)}
            onDrop={(e) => handleDrop(e, 1)}
            onClick={() => {
              if (frascoSeleccionado) colocarEnFila(frascoSeleccionado, 1);
              else if (fila1) quitarDeFila(1);
            }}
            title={fila1 ? 'Haz clic para quitar' : 'Arrastra o toca un frasco para colocarlo aquí'}
          >
            <span className="simce-spacer-signo"></span>
            {columnas.map((col, idx) => (
              <div
                key={col}
                className={`simce-casilla-cuadro ${cifrasFila1 ? 'simce-casilla-cuadro--ocupada' : ''}`}
                onClick={
                  cifrasFila1 && idx === 1
                    ? (e) => {
                      e.stopPropagation();
                      alternarCanjeU();
                    }
                    : cifrasFila1 && idx === 0
                      ? (e) => {
                        e.stopPropagation();
                        alternarCanjeD();
                      }
                      : undefined
                }
              >
                {cifrasFila1 ? (
                  <span
                    className={`simce-digito-puesto ${(idx === 1 && (canjeU || canjeD)) || (idx === 0 && canjeD) ? 'simce-digito--tachado' : ''
                      }`}
                  >
                    {cifrasFila1[idx]}
                  </span>
                ) : (
                  <span className="simce-placeholder-letra">{col}</span>
                )}
              </div>
            ))}
          </div>

          {/* Fila 2 (Sustraendo con signo interactivo a la izquierda) */}
          <div
            className={`simce-fila-datos ${dragOverFila === 2 ? 'simce-fila-datos--dragover' : ''} ${!fila2 ? 'simce-fila-datos--vacia' : ''
              }`}
            onDragOver={(e) => handleDragOver(e, 2)}
            onDragLeave={() => setDragOverFila(null)}
            onDrop={(e) => handleDrop(e, 2)}
            onClick={() => {
              if (frascoSeleccionado) colocarEnFila(frascoSeleccionado, 2);
              else if (fila2) quitarDeFila(2);
            }}
            title={fila2 ? 'Haz clic para quitar' : 'Arrastra o toca un frasco para colocarlo aquí'}
          >
            {/* Botón interactivo del signo: inicia en + y cambia a − con un clic */}
            <button
              type="button"
              className={`simce-btn-signo ${signo === '−' ? 'simce-btn-signo--menos' : 'simce-btn-signo--mas'}`}
              onClick={(e) => {
                e.stopPropagation();
                alternarSigno();
              }}
              title="Toca para cambiar la operación (+ o −)"
              aria-label={`Operación actual: ${signo === '+' ? 'Suma (+)' : 'Resta (−)'}. Toca para cambiar.`}
            >
              {signo}
            </button>

            {columnas.map((col, idx) => (
              <div
                key={col}
                className={`simce-casilla-cuadro ${cifrasFila2 ? 'simce-casilla-cuadro--ocupada' : ''}`}
              >
                {cifrasFila2 ? (
                  <span className="simce-digito-puesto">{cifrasFila2[idx]}</span>
                ) : (
                  <span className="simce-placeholder-letra">{col}</span>
                )}
              </div>
            ))}
          </div>

          {/* Línea divisoria gruesa */}
          <div className="simce-linea-operacion"></div>

          {/* Fila 3: Casillas redondeadas de entrada para escribir el resultado */}
          <div className="simce-fila-resultado">
            <span className="simce-spacer-signo"></span>
            {[0, 1, 2].map((idx) => {
              const esActiva = celdaActiva === idx && ambosColocados && !resuelto;
              return (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  id={`simce-resultado-col-${idx}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  autoComplete="off"
                  className={`simce-casilla-resultado ${esActiva ? 'simce-casilla-resultado--activa' : ''} ${!ambosColocados ? 'simce-casilla-resultado--bloqueada' : ''
                    }`}
                  value={resultado[idx]}
                  placeholder="·"
                  disabled={!ambosColocados || resuelto}
                  onChange={(e) => manejarInputResultado(idx, e.target.value)}
                  onKeyDown={(e) => manejarKeyDown(idx, e)}
                  onFocus={(e) => {
                    setCeldaActiva(idx);
                    e.target.select();
                  }}
                  aria-label={`Cifra de las ${columnas[idx]}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Botones de apoyo para el canje si el estudiante desea usarlos */}
      {ambosColocados && fila1 === 324 && !resuelto && (
        <div className="simce-canje-ayudas">
          <button
            type="button"
            className={`boton-canje-tag ${canjeU ? 'boton-canje-tag--activo' : ''}`}
            onClick={alternarCanjeU}
          >
            {canjeU ? '✓ Canje Unidades (14)' : 'Tocar para pedir 1 decena (4 → 14)'}
          </button>
          <button
            type="button"
            className={`boton-canje-tag ${canjeD ? 'boton-canje-tag--activo' : ''}`}
            onClick={alternarCanjeD}
          >
            {canjeD ? '✓ Canje Decenas (11)' : 'Tocar para pedir 1 centena (1 → 11)'}
          </button>
        </div>
      )}



      {/* Pie interactivo con Reiniciar y Comprobar */}
      <div className="interactivo-pie">
        <button
          type="button"
          className="boton boton--texto"
          onClick={reiniciar}
          disabled={resuelto || (!fila1 && !fila2 && resultado[0] === '' && resultado[1] === '' && resultado[2] === '')}
        >
          Limpiar tabla
        </button>
        <BotonComprobar disabled={resuelto || !ambosColocados || !todasLlenas} onClick={comprobar} />
      </div>
    </div>
  );
}
