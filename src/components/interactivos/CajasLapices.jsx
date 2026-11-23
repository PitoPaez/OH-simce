import { useState, useEffect, useRef } from 'react';
import cajaVaciaImg from '../../assets/images/numeros-y-operaciones/caja-vacia.png';
import manojoImg from '../../assets/images/numeros-y-operaciones/manojo-8-lapices.png';
import { BotonComprobar } from './ArrastrarPosicional.jsx';

/**
 * Componente interactivo para multiplicación:
 * "6 cajas y cada caja tiene 8 lápices. ¿Cuántos lápices hay en total?"
 * 
 * - Arrastre y toque fluido para tablets.
 * - Sin contadores automáticos para que el niño cuente por sí mismo.
 * - Entrada de respuesta con teclado físico o teclado táctil en pantalla.
 */
export default function CajasLapices({ ejercicio, resuelto, onResponder }) {
  const NUM_CAJAS = 6;
  const LAPICES_POR_CAJA = 8;
  const RESPUESTA_CORRECTA = '48';

  // Estado de cada una de las 6 cajas: true = llena con 8 lápices, false = vacía
  const [cajas, setCajas] = useState(() => Array(NUM_CAJAS).fill(false));

  // Estados de arrastre y selección táctil
  const [manojoSeleccionado, setManojoSeleccionado] = useState(false);
  const [arrastrando, setArrastrando] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Valor escrito en el resultado
  const [resultado, setResultado] = useState('');
  const inputRef = useRef(null);

  // Cuando se resuelve el ejercicio
  useEffect(() => {
    if (resuelto) {
      setCajas(Array(NUM_CAJAS).fill(true));
      setResultado(RESPUESTA_CORRECTA);
      setManojoSeleccionado(false);
    }
  }, [resuelto]);

  // Contar cuántas cajas se han llenado
  const cajasLlenasCount = cajas.filter(Boolean).length;

  // Llenar o vaciar una caja específica
  function toggleCaja(index) {
    if (resuelto) return;
    setCajas((prev) => {
      const nuevo = [...prev];
      nuevo[index] = !nuevo[index];
      return nuevo;
    });
    setManojoSeleccionado(false);
  }

  function llenarCaja(index) {
    if (resuelto) return;
    setCajas((prev) => {
      const nuevo = [...prev];
      nuevo[index] = true;
      return nuevo;
    });
    setManojoSeleccionado(false);
  }

  function vaciarTodas() {
    if (resuelto) return;
    setCajas(Array(NUM_CAJAS).fill(false));
    setManojoSeleccionado(false);
  }

  function llenarTodas() {
    if (resuelto) return;
    setCajas(Array(NUM_CAJAS).fill(true));
    setManojoSeleccionado(false);
  }

  // Drag and Drop (HTML5)
  function handleDragStart(e) {
    if (resuelto) return;
    setArrastrando(true);
    e.dataTransfer.setData('text/plain', 'manojo-8');
    e.dataTransfer.effectAllowed = 'copy';
  }

  function handleDragEnd() {
    setArrastrando(false);
    setDragOverIndex(null);
  }

  function handleDragOver(e, index) {
    if (resuelto) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  }

  function handleDragLeave(index) {
    if (dragOverIndex === index) {
      setDragOverIndex(null);
    }
  }

  function handleDrop(e, index) {
    if (resuelto) return;
    e.preventDefault();
    setDragOverIndex(null);
    setArrastrando(false);
    llenarCaja(index);
  }

  // Clic en la caja
  function handleCajaClick(index) {
    if (resuelto) return;
    if (manojoSeleccionado) {
      llenarCaja(index);
    } else {
      // Si ya está llena, la vacía; si está vacía, la llena (súper intuitivo en tablets)
      toggleCaja(index);
    }
  }

  // Manejo de teclado físico
  function handleInputChange(e) {
    if (resuelto) return;
    const val = e.target.value.replace(/\D/g, '').slice(0, 3);
    setResultado(val);
  }

  function handleKeyDown(e) {
    if (resuelto) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      validar();
    }
  }

  // Manejo de teclado táctil en pantalla
  function handleTeclaVirtual(num) {
    if (resuelto) return;
    setResultado((prev) => {
      const nuevo = (prev + num).slice(0, 3);
      return nuevo;
    });
    inputRef.current?.focus();
  }

  function handleBorrarVirtual() {
    if (resuelto) return;
    setResultado((prev) => prev.slice(0, -1));
    inputRef.current?.focus();
  }

  // Validación y envío de respuesta
  function validar() {
    if (resuelto || !resultado) return;

    const valLimpio = resultado.trim();
    if (valLimpio === RESPUESTA_CORRECTA) {
      onResponder?.({ correcta: true, clave: RESPUESTA_CORRECTA, valor: valLimpio });
    } else if (valLimpio === '14') {
      onResponder?.({ correcta: false, clave: '14', valor: valLimpio });
    } else if (valLimpio === '42') {
      onResponder?.({ correcta: false, clave: '42', valor: valLimpio });
    } else if (valLimpio === '56') {
      onResponder?.({ correcta: false, clave: '56', valor: valLimpio });
    } else {
      onResponder?.({ correcta: false, clave: 'otro', valor: valLimpio });
    }
  }

  return (
    <div className="cajas-lapices-interactivo">
      {/* Suministro y fuente de lápices */}
      <div className="cajas-lapices-suministro-panel">
        <div className="cajas-lapices-suministro-header">
          <span className="suministro-badge">📦 Material disponible</span>
          <span className="suministro-guia">
            Arrastra el manojo a cada caja o tócalo y luego toca la caja
          </span>
        </div>

        <div className="cajas-lapices-suministro-cuerpo">
          <div
            className={`manojo-draggable ${manojoSeleccionado ? 'manojo-draggable--seleccionado' : ''} ${arrastrando ? 'manojo-draggable--arrastrando' : ''
              }`}
            draggable={!resuelto}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={() => {
              if (resuelto) return;
              setManojoSeleccionado((prev) => !prev);
            }}
            title="Arrastra o toca para seleccionar este manojo de 8 lápices"
          >
            <div className="manojo-img-container">
              <img
                src={manojoImg}
                alt="Manojo de 8 lápices"
                className="manojo-img"
                draggable={false}
              />
            </div>
            <div className="manojo-etiqueta">
              <strong>Manojo de 8 lápices</strong>
              <span>(Arrastra a una caja)</span>
            </div>
          </div>

          <div className="cajas-lapices-acciones-rapidas">
            <button
              type="button"
              className="cajas-btn-secundario"
              onClick={llenarTodas}
              disabled={resuelto || cajasLlenasCount === NUM_CAJAS}
              title="Llenar las 6 cajas a la vez"
            >
              ✨ Llenar todas
            </button>
            <button
              type="button"
              className="cajas-btn-secundario"
              onClick={vaciarTodas}
              disabled={resuelto || cajasLlenasCount === 0}
              title="Vaciar las cajas"
            >
              🔄 Vaciar
            </button>
          </div>
        </div>
      </div>

      {/* Cuadrícula de las 6 cajas */}
      <div className="cajas-grid-contenedor">
        <div className="cajas-grid-titulo">
          <span>Las 6 cajas en la sala:</span>
          <span className="cajas-grid-subtitulo">
            {cajasLlenasCount === 0
              ? 'Toca o arrastra para llenar las cajas'
              : cajasLlenasCount < NUM_CAJAS
                ? `Llevas ${cajasLlenasCount} de 6 cajas llenas`
                : '¡Las 6 cajas tienen sus lápices! Ahora cuenta el total.'}
          </span>
        </div>

        <div className="cajas-grid">
          {cajas.map((estaLlena, index) => {
            const isOver = dragOverIndex === index;
            return (
              <div
                key={index}
                className={`caja-slot ${estaLlena ? 'caja-slot--llena' : 'caja-slot--vacia'} ${isOver ? 'caja-slot--dragover' : ''
                  } ${manojoSeleccionado && !estaLlena ? 'caja-slot--esperando' : ''}`}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={() => handleDragLeave(index)}
                onDrop={(e) => handleDrop(e, index)}
                onClick={() => handleCajaClick(index)}
                role="button"
                tabIndex={0}
                title={
                  estaLlena
                    ? `Caja ${index + 1}: llena con 8 lápices. Toca para vaciar.`
                    : `Caja ${index + 1}: vacía. Toca o arrastra un manojo para llenarla.`
                }
              >
                <div className="caja-slot-numero">Caja {index + 1}</div>

                <div className="caja-slot-contenido">
                  {estaLlena ? (
                    <div className="caja-llena-vista">
                      <img
                        src={manojoImg}
                        alt={`Caja ${index + 1} con 8 lápices`}
                        className="caja-manojo-img"
                        draggable={false}
                      />
                      <button
                        type="button"
                        className="caja-quitar-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCaja(index);
                        }}
                        title="Vaciar esta caja"
                        disabled={resuelto}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="caja-vacia-vista">
                      <img
                        src={cajaVaciaImg}
                        alt={`Caja ${index + 1} vacía`}
                        className="caja-vacia-img"
                        draggable={false}
                      />
                      <span className="caja-vacia-texto">Vacía</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Zona de cálculo y respuesta */}
      <div className="cajas-calculo-panel">
        <div className="cajas-calculo-formula">
          <span className="formula-factor">
            <strong>6</strong> cajas
          </span>
          <span className="formula-signo">×</span>
          <span className="formula-factor">
            <strong>8</strong> lápices
          </span>
          <span className="formula-signo">=</span>

          <div className="formula-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className={`cajas-input-resultado ${resultado ? 'cajas-input-resultado--con-valor' : ''}`}
              placeholder="?"
              value={resultado}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={resuelto}
              aria-label="Total de lápices"
              autoComplete="off"
            />
          </div>

          <span className="formula-unidad">lápices en total</span>
        </div>


        {/* Pie con botón Comprobar */}
        <div className="interactivo-pie">
          <BotonComprobar onClick={validar} disabled={resuelto || !resultado}>
            {resuelto ? '¡Completado! ✓' : 'Comprobar'}
          </BotonComprobar>
        </div>
      </div>
    </div>
  );
}
