import { useState, useEffect } from 'react';

export function BotonComprobar({ onClick, disabled, children = 'Comprobar' }) {
  return (
    <button type="button" className="boton boton--principal boton-comprobar" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

/**
 * Componente interactivo para arrastrar dígitos a la tabla de valor posicional (o tocarlos para asignar).
 * Soporta HTML5 Drag & Drop y Touch / Clic para accesibilidad total (desktop, tablets, smartphones).
 */
export default function ArrastrarPosicional({ ejercicio, resuelto, onResponder }) {
  const columnas = ejercicio.columnas ?? ['C', 'D', 'U'];
  const disponiblesIniciales = ejercicio.disponibles ?? [7, 5, 6, 2, 9, 8];

  // Estado de las casillas en la tabla: objeto con clave colIndex -> número o null
  const [colocados, setColocados] = useState(() => {
    const inicial = {};
    columnas.forEach((_, i) => {
      inicial[i] = null;
    });
    return inicial;
  });

  const [arrastrando, setArrastrando] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);
  const [seleccionado, setSeleccionado] = useState(null);

  // Si está resuelto, aseguramos mostrar la solución en la tabla
  useEffect(() => {
    if (resuelto) {
      const objetivo = ejercicio.solucionPosicional ?? [2, 7, 5];
      const sol = {};
      columnas.forEach((col, i) => {
        const val = Array.isArray(objetivo) ? objetivo[i] : objetivo[col];
        sol[i] = { id: `sol-${i}-${val}`, num: val };
      });
      setColocados(sol);
      setSeleccionado(null);
    }
  }, [resuelto, ejercicio.solucionPosicional, columnas]);

  // Lista de items disponibles con un id único para manejar repetidos si los hubiera
  const itemsDisponibles = disponiblesIniciales.map((num, idx) => ({
    id: `item-${idx}-${num}`,
    num,
  }));

  const valoresColocados = Object.values(colocados).filter((v) => v !== null);

  function ponerEnColumna(colIdx, item) {
    if (resuelto) return;
    setColocados((prev) => {
      const nuevo = { ...prev };
      // Si el item ya estaba en otra columna, lo quitamos de allá
      for (const key of Object.keys(nuevo)) {
        if (nuevo[key]?.id === item.id) {
          nuevo[key] = null;
        }
      }
      nuevo[colIdx] = item;
      return nuevo;
    });
    setSeleccionado(null);
  }

  function quitarDeColumna(colIdx) {
    if (resuelto) return;
    setColocados((prev) => ({
      ...prev,
      [colIdx]: null,
    }));
  }

  // Drag and Drop handlers
  function handleDragStart(e, item) {
    if (resuelto) return;
    setArrastrando(item);
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragEnd() {
    setArrastrando(null);
    setDragOverCol(null);
  }

  function handleDragOver(e, colIdx) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colIdx) {
      setDragOverCol(colIdx);
    }
  }

  function handleDragLeave(colIdx) {
    if (dragOverCol === colIdx) {
      setDragOverCol(null);
    }
  }

  function handleDrop(e, colIdx) {
    e.preventDefault();
    setDragOverCol(null);
    try {
      const data = e.dataTransfer.getData('text/plain');
      const item = data ? JSON.parse(data) : arrastrando;
      if (item) {
        ponerEnColumna(colIdx, item);
      }
    } catch {
      if (arrastrando) {
        ponerEnColumna(colIdx, arrastrando);
      }
    }
    setArrastrando(null);
  }

  // Tocar para seleccionar y tocar para colocar (soporte perfecto para móviles / tablets)
  function handleItemClick(item) {
    if (resuelto) return;
    // Si ya está seleccionado, deseleccionar
    if (seleccionado?.id === item.id) {
      setSeleccionado(null);
      return;
    }
    // Si el usuario toca un número disponible, buscamos la primera casilla vacía o lo seleccionamos
    const primerVacio = columnas.findIndex((_, idx) => !colocados[idx]);
    if (primerVacio !== -1) {
      ponerEnColumna(primerVacio, item);
    } else {
      setSeleccionado(item);
    }
  }

  function handleCellClick(colIdx) {
    if (resuelto) return;
    if (seleccionado) {
      ponerEnColumna(colIdx, seleccionado);
    } else if (colocados[colIdx]) {
      quitarDeColumna(colIdx);
    }
  }

  function resetear() {
    if (resuelto) return;
    const inicial = {};
    columnas.forEach((_, i) => {
      inicial[i] = null;
    });
    setColocados(inicial);
    setSeleccionado(null);
  }

  // Comprobar respuesta
  function comprobar() {
    const cifrasActuales = columnas.map((_, i) => (colocados[i] ? colocados[i].num : null));
    const objetivo = ejercicio.solucionPosicional ?? [2, 7, 5];

    let esCorrecto = false;
    if (Array.isArray(objetivo)) {
      esCorrecto = cifrasActuales.every((val, idx) => Number(val) === Number(objetivo[idx]));
    } else {
      esCorrecto = columnas.every((col, idx) => Number(cifrasActuales[idx]) === Number(objetivo[col]));
    }

    const valorFormado = cifrasActuales.map((c) => (c !== null ? c : '')).join('');

    let clave = 'otro';
    if (esCorrecto) {
      clave = 'ok';
    } else if (ejercicio.errores && ejercicio.errores[valorFormado]) {
      clave = valorFormado;
    } else if (cifrasActuales[0] === 7 && cifrasActuales[1] === 5 && cifrasActuales[2] === 2) {
      clave = '752';
    } else if (cifrasActuales[0] === 2 && cifrasActuales[1] === 5 && cifrasActuales[2] === 7) {
      clave = '257';
    } else if (cifrasActuales[0] === 5 && cifrasActuales[1] === 2 && cifrasActuales[2] === 7) {
      clave = '527';
    }

    onResponder({
      correcta: esCorrecto,
      clave,
      valor: valorFormado,
    });
  }

  const todasLlenas = columnas.every((_, i) => colocados[i] !== null);

  return (
    <div className="arrastrar-posicional">
      {/* Tabla C D U estilo Simce */}
      <div className="arrastrar-tabla-wrapper">
        <table className="v-tabla-posicional arrastrar-tabla">
          <thead>
            <tr>
              {columnas.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {columnas.map((col, idx) => {
                const item = colocados[idx];
                const isOver = dragOverCol === idx;
                return (
                  <td
                    key={col}
                    className={`arrastrar-celda ${isOver ? 'arrastrar-celda--over' : ''} ${item ? 'arrastrar-celda--ocupada' : ''}`}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragLeave={() => handleDragLeave(idx)}
                    onDrop={(e) => handleDrop(e, idx)}
                    onClick={() => handleCellClick(idx)}
                    title={item ? 'Haz clic para quitar' : 'Arrastra o toca un número para colocarlo aquí'}
                  >
                    {item ? (
                      <div
                        className="arrastrar-numero-puesto"
                        draggable={!resuelto}
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragEnd={handleDragEnd}
                      >
                        {item.num}
                      </div>
                    ) : (
                      <span className="arrastrar-celda-placeholder">·</span>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="arrastrar-instruccion">
        Arrastra los números a la tabla de valor posicional o tócalos para ubicarlos:
      </p>

      {/* Caja contenedor con los números disponibles */}
      <div
        className="arrastrar-caja-numeros"
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        }}
        onDrop={(e) => {
          e.preventDefault();
          if (resuelto) return;
          try {
            const data = e.dataTransfer.getData('text/plain');
            const item = data ? JSON.parse(data) : arrastrando;
            if (item) {
              setColocados((prev) => {
                const nuevo = { ...prev };
                for (const key of Object.keys(nuevo)) {
                  if (nuevo[key]?.id === item.id) {
                    nuevo[key] = null;
                  }
                }
                return nuevo;
              });
            }
          } catch {
            // fallback
          }
          setArrastrando(null);
        }}
      >
        <div className="arrastrar-numeros-dispersos">
          {itemsDisponibles.map((item, idx) => {
            const estaPuesto = Object.values(colocados).some((colItem) => colItem?.id === item.id);
            const esSeleccionado = seleccionado?.id === item.id;

            return (
              <div
                key={item.id}
                className={`arrastrar-ficha ${estaPuesto ? 'arrastrar-ficha--oculta' : ''} ${esSeleccionado ? 'arrastrar-ficha--seleccionada' : ''} arrastrar-pos-${idx}`}
                draggable={!resuelto && !estaPuesto}
                onDragStart={(e) => handleDragStart(e, item)}
                onDragEnd={handleDragEnd}
                onClick={() => !estaPuesto && handleItemClick(item)}
                role="button"
                tabIndex={estaPuesto ? -1 : 0}
                aria-label={`Número ${item.num}`}
              >
                {item.num}
              </div>
            );
          })}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="interactivo-pie">
        <button
          type="button"
          className="boton boton--texto"
          onClick={resetear}
          disabled={resuelto || valoresColocados.length === 0}
        >
          Limpiar tabla
        </button>
        <BotonComprobar disabled={resuelto || !todasLlenas} onClick={comprobar} />
      </div>
    </div>
  );
}
