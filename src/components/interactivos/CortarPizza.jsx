import { useState, useEffect } from 'react';
import pizzaImg from '../../assets/images/numeros-y-operaciones/pizza.png';
import cuchilloImg from '../../assets/images/numeros-y-operaciones/cuchillo.png';
import { BotonComprobar } from './ArrastrarPosicional.jsx';

/**
 * Componente interactivo para fracciones con pizza y cuchillo:
 * "Una pizza se cortó en 8 partes iguales y la familia se comió 3. ¿Qué fracción de la pizza se comieron?"
 * 
 * - El estudiante usa el cuchillo para cortar la pizza (1 entero -> 2 -> 4 -> 6 -> 8 partes).
 * - El denominador de la fracción se ajusta dinámicamente con cada corte.
 * - Al cortar en 8 partes, el estudiante toca los trozos para comerlos (1/8 -> 2/8 -> 3/8).
 * - Sin teclado, con botón Reiniciar y Comprobar.
 */
export default function CortarPizza({ ejercicio, resuelto, onResponder }) {
  // Pasos de cortes: 0 cortes = 1 parte, 1 = 2 partes, 2 = 4 partes, 3 = 6 partes, 4 = 8 partes
  const PASOS_CORTES = [1, 2, 4, 6, 8];

  const [pasoCorte, setPasoCorte] = useState(0); // índice 0 a 4
  const [trozosComidos, setTrozosComidos] = useState([]); // índices de trozos comidos
  const [cuchilloSeleccionado, setCuchilloSeleccionado] = useState(false);
  const [arrastrandoCuchillo, setArrastrandoCuchillo] = useState(false);
  const [animandoCorte, setAnimandoCorte] = useState(false);
  const [dragOverPizza, setDragOverPizza] = useState(false);

  const partesActuales = PASOS_CORTES[pasoCorte];
  const numComidos = trozosComidos.length;

  // Si ya está resuelto
  useEffect(() => {
    if (resuelto) {
      setPasoCorte(4); // 8 partes
      setTrozosComidos([0, 1, 2]); // 3 trozos comidos
      setCuchilloSeleccionado(false);
    }
  }, [resuelto]);

  // Hacer un corte
  function hacerCorte() {
    if (resuelto) return;
    if (pasoCorte < PASOS_CORTES.length - 1) {
      setAnimandoCorte(true);
      setTimeout(() => setAnimandoCorte(false), 450);

      setPasoCorte((prev) => prev + 1);
      setTrozosComidos([]); // al hacer un nuevo corte se reinician los trozos
      setCuchilloSeleccionado(false);
    }
  }

  // Tocar un trozo de pizza para comerlo o devolverlo
  function toggleTrozo(index) {
    if (resuelto) return;
    if (partesActuales === 1) return; // No se come la pizza entera de un bocado

    setTrozosComidos((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  }

  // Reiniciar
  function reiniciar() {
    if (resuelto) return;
    setPasoCorte(0);
    setTrozosComidos([]);
    setCuchilloSeleccionado(false);
  }

  // Drag and drop del cuchillo
  function handleDragStart(e) {
    if (resuelto || pasoCorte >= PASOS_CORTES.length - 1) return;
    setArrastrandoCuchillo(true);
    e.dataTransfer.setData('text/plain', 'cuchillo');
    e.dataTransfer.effectAllowed = 'copy';
  }

  function handleDragEnd() {
    setArrastrandoCuchillo(false);
    setDragOverPizza(false);
  }

  function handlePizzaDragOver(e) {
    if (resuelto || pasoCorte >= PASOS_CORTES.length - 1) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!dragOverPizza) setDragOverPizza(true);
  }

  function handlePizzaDragLeave() {
    setDragOverPizza(false);
  }

  function handlePizzaDrop(e) {
    if (resuelto || pasoCorte >= PASOS_CORTES.length - 1) return;
    e.preventDefault();
    setDragOverPizza(false);
    setArrastrandoCuchillo(false);
    hacerCorte();
  }

  // Clic en la pizza: si el cuchillo está seleccionado, corta; si no y está cortada, come
  function handlePizzaClick() {
    if (resuelto) return;
    if (cuchilloSeleccionado && pasoCorte < PASOS_CORTES.length - 1) {
      hacerCorte();
    }
  }

  // Validación
  function validar() {
    if (resuelto) return;

    if (partesActuales < 8) {
      onResponder?.({ correcta: false, clave: 'cortes-incompletos', valor: `${numComidos}/${partesActuales}` });
      return;
    }

    if (numComidos === 0) {
      onResponder?.({ correcta: false, clave: 'sin-comer', valor: '0/8' });
      return;
    }

    if (numComidos === 5) {
      onResponder?.({ correcta: false, clave: '5/8', valor: '5/8' });
      return;
    }

    if (numComidos === 3 && partesActuales === 8) {
      onResponder?.({ correcta: true, clave: '3/8', valor: '3/8' });
    } else {
      onResponder?.({ correcta: false, clave: 'otra-cantidad', valor: `${numComidos}/8` });
    }
  }

  // Generador de rutas SVG para cada rebanada
  const cx = 150;
  const cy = 150;
  const radio = 135;

  function calcularRutaTrozo(i, total) {
    if (total === 1) {
      return `M ${cx - radio} ${cy} A ${radio} ${radio} 0 1 0 ${cx + radio} ${cy} A ${radio} ${radio} 0 1 0 ${cx - radio} ${cy} Z`;
    }

    const anguloPaso = (2 * Math.PI) / total;
    const anguloInicio = i * anguloPaso - Math.PI / 2;
    const anguloFin = (i + 1) * anguloPaso - Math.PI / 2;

    const x1 = cx + radio * Math.cos(anguloInicio);
    const y1 = cy + radio * Math.sin(anguloInicio);
    const x2 = cx + radio * Math.cos(anguloFin);
    const y2 = cy + radio * Math.sin(anguloFin);

    const largeArcFlag = anguloFin - anguloInicio > Math.PI ? 1 : 0;

    return `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radio} ${radio} 0 ${largeArcFlag} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
  }

  // Centro de cada trozo para calcular desplazamiento hover o número
  function calcularCentroTrozo(i, total) {
    const anguloPaso = (2 * Math.PI) / total;
    const anguloMedio = (i + 0.5) * anguloPaso - Math.PI / 2;
    const dist = radio * 0.55;
    return {
      x: cx + dist * Math.cos(anguloMedio),
      y: cy + dist * Math.sin(anguloMedio),
    };
  }

  return (
    <div className="cortar-pizza-interactivo">



      {/* Área principal: Cuchillo + Pizza + Fracción Dinámica */}
      <div className="cortar-pizza-escenario">
        {/* Panel del cuchillo */}
        <div className="cortar-pizza-herramientas">
          <div className="herramienta-card">
            <span className="herramienta-titulo">Cuchillo</span>

            <div
              className={`cuchillo-item ${cuchilloSeleccionado ? 'cuchillo-item--seleccionado' : ''} ${arrastrandoCuchillo ? 'cuchillo-item--arrastrando' : ''
                } ${pasoCorte >= 4 ? 'cuchillo-item--deshabilitado' : ''}`}
              draggable={!resuelto && pasoCorte < 4}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onClick={() => {
                if (resuelto || pasoCorte >= 4) return;
                setCuchilloSeleccionado((prev) => !prev);
              }}
              role="button"
              tabIndex={0}
              title={
                pasoCorte < 4
                  ? 'Arrastra a la pizza o toca para cortar'
                  : 'La pizza ya está cortada en 8 partes'
              }
            >
              <img
                src={cuchilloImg}
                alt="Cuchillo para cortar pizza"
                className="cuchillo-img"
                draggable={false}
              />
            </div>

            <button
              type="button"
              className="corte-boton"
              onClick={hacerCorte}
              disabled={resuelto || pasoCorte >= 4}
            >
              {pasoCorte < 4 ? '🔪 Cortar pizza' : '✓ 8 partes listas'}
            </button>

            <span className="corte-contador">
              Cortes: <strong>{pasoCorte} / 4</strong>
            </span>
          </div>

          <button
            type="button"
            className="cortar-pizza-btn-reiniciar"
            onClick={reiniciar}
            disabled={resuelto || (pasoCorte === 0 && numComidos === 0)}
          >
            🔄 Reiniciar pizza
          </button>
        </div>

        {/* Plato y Pizza interactiva */}
        <div
          className={`pizza-mesa-contenedor ${dragOverPizza ? 'pizza-mesa--dragover' : ''} ${animandoCorte ? 'pizza-mesa--cortando' : ''
            }`}
          onDragOver={handlePizzaDragOver}
          onDragLeave={handlePizzaDragLeave}
          onDrop={handlePizzaDrop}
          onClick={handlePizzaClick}
        >
          {/* Animación del cuchillo cortando */}
          {animandoCorte && (
            <div className="cuchillo-slash-overlay">
              <img src={cuchilloImg} alt="" className="cuchillo-slash-img" />
              <div className="corte-destello-linea" />
            </div>
          )}

          <div className="pizza-svg-wrapper">
            <svg
              viewBox="0 0 300 300"
              className="pizza-svg"
              aria-label={`Pizza dividida en ${partesActuales} partes`}
            >
              <defs>
                {/* Plato base sombreado */}
                <radialGradient id="platoGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="70%" stopColor="#f8fafc" />
                  <stop offset="96%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </radialGradient>

                {/* ClipPath para cada rebanada */}
                {Array.from({ length: partesActuales }).map((_, i) => (
                  <clipPath key={`clip-${partesActuales}-${i}`} id={`slice-clip-${i}`}>
                    <path d={calcularRutaTrozo(i, partesActuales)} />
                  </clipPath>
                ))}
              </defs>

              {/* Plato base */}
              <circle cx={cx} cy={cy} r="146" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="4" />
              <circle cx={cx} cy={cy} r="140" fill="url(#platoGrad)" stroke="#e2e8f0" strokeWidth="2" />

              {/* Trozos de la pizza */}
              {Array.from({ length: partesActuales }).map((_, i) => {
                const estaComido = trozosComidos.includes(i);
                const centro = calcularCentroTrozo(i, partesActuales);

                return (
                  <g
                    key={`slice-group-${partesActuales}-${i}`}
                    className={`pizza-slice ${estaComido ? 'pizza-slice--comido' : ''} ${partesActuales > 1 ? 'pizza-slice--interactivo' : ''
                      }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (cuchilloSeleccionado && pasoCorte < 4) {
                        hacerCorte();
                      } else {
                        toggleTrozo(i);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Trozo ${i + 1} de ${partesActuales}. ${estaComido ? 'Comido. Toca para devolver.' : 'Toca para comer.'
                      }`}
                  >
                    {/* Hueco en el plato si fue comido */}
                    {estaComido ? (
                      <g className="hueco-comido">
                        <path
                          d={calcularRutaTrozo(i, partesActuales)}
                          fill="rgba(226, 232, 240, 0.45)"
                          stroke="#cbd5e1"
                          strokeDasharray="4 4"
                          strokeWidth="2"
                        />
                        <text
                          x={centro.x}
                          y={centro.y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="trozo-comido-etiqueta"
                        >
                          Comido
                        </text>
                      </g>
                    ) : (
                      /* Trozo con la imagen real de la pizza */
                      <g clipPath={`url(#slice-clip-${i})`} className="trozo-grafico">
                        <image
                          href={pizzaImg}
                          x={cx - radio}
                          y={cy - radio}
                          width={radio * 2}
                          height={radio * 2}
                          preserveAspectRatio="xMidYMid slice"
                        />
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Líneas divisorias de cortes */}
              {partesActuales > 1 &&
                Array.from({ length: partesActuales }).map((_, i) => {
                  const anguloPaso = (2 * Math.PI) / partesActuales;
                  const angulo = i * anguloPaso - Math.PI / 2;
                  const xEnd = cx + radio * Math.cos(angulo);
                  const yEnd = cy + radio * Math.sin(angulo);
                  return (
                    <line
                      key={`corte-line-${i}`}
                      x1={cx}
                      y1={cy}
                      x2={xEnd}
                      y2={yEnd}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="pizza-corte-linea"
                    />
                  );
                })}
            </svg>
          </div>
        </div>

        {/* Tarjeta de la Fracción Dinámica */}
        <div className="cortar-pizza-fraccion-panel">
          <div className="fraccion-card-titulo">Fracción de pizza comida:</div>

          <div className="fraccion-display-box">
            {/* Numerador dinámico */}
            <div className="fraccion-elemento fraccion-numerador">
              <span className={`fraccion-numero ${numComidos > 0 ? 'fraccion-numero--activo' : ''}`}>
                {numComidos}
              </span>
              <span className="fraccion-etiqueta">
                {numComidos === 1 ? 'trozo comido' : 'trozos comidos'}
              </span>
            </div>

            {/* Barra fraccionaria */}
            <div className="fraccion-barra-linea" />

            {/* Denominador dinámico */}
            <div className="fraccion-elemento fraccion-denominador">
              <span className={`fraccion-numero ${partesActuales === 8 ? 'fraccion-numero--completo' : ''}`}>
                {partesActuales}
              </span>
              <span className="fraccion-etiqueta">
                {partesActuales === 1 ? 'entero' : 'partes iguales en total'}
              </span>
            </div>
          </div>

          {/* Comparación textual para reforzar el concepto */}
          <div className="fraccion-explicacion">
            {partesActuales < 8 ? (
              <span>Corta la pizza hasta que el número de abajo sea <strong>8</strong>.</span>
            ) : numComidos === 0 ? (
              <span>Toca los trozos para comer <strong>3</strong> de las 8 partes.</span>
            ) : (
              <span>
                Se han comido <strong>{numComidos}</strong> de las <strong>{partesActuales}</strong> partes iguales.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pie con botón Comprobar */}
      <div className="interactivo-pie">
        <BotonComprobar
          onClick={validar}
          disabled={resuelto || (partesActuales < 8 && numComidos === 0)}
        >
          {resuelto ? '¡Completado! ✓' : 'Comprobar'}
        </BotonComprobar>
      </div>
    </div>
  );
}
