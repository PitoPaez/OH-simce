import { useMemo, useState } from 'react';
import { f } from '../../lib/formato.js';
import { Grafico } from '../visuales/datos.jsx';
import { ConFracciones } from '../ui/Texto.jsx';
import { BotonComprobar } from './Numero.jsx';

// Completar la barra que falta en un gráfico (OA 25 y 27).
// ejercicio: { grafico: { titulo, datos, max, paso }, faltante: índice, respuesta }
export function BarraGrafico({ ejercicio, resuelto, onResponder }) {
  const { grafico, faltante, respuesta } = ejercicio;
  const [valor, setValor] = useState(0);
  const max = grafico.max;
  const cambiar = (d) => setValor((v) => Math.min(max, Math.max(0, v + d)));
  const etiqueta = grafico.datos[faltante].etiqueta;
  return (
    <div className="barra-int">
      <Grafico {...grafico} editable={faltante} valorEditable={valor} />
      <div className="stepper" role="group" aria-label={`Altura de la barra de ${etiqueta}`}>
        <span className="stepper-titulo">{etiqueta}</span>
        <button type="button" className="boton-redondo" onClick={() => cambiar(-1)} disabled={resuelto} aria-label="Bajar 1">
          −1
        </button>
        <output className="stepper-valor">{f(valor)}</output>
        <button type="button" className="boton-redondo" onClick={() => cambiar(1)} disabled={resuelto} aria-label="Subir 1">
          +1
        </button>
      </div>
      <div className="interactivo-pie interactivo-pie--centro">
        <BotonComprobar
          disabled={resuelto}
          onClick={() => onResponder({ correcta: valor === respuesta, clave: String(valor), valor: f(valor) })}
        />
      </div>
    </div>
  );
}

// Ordenar mediante Drag and Drop (arrastrar y soltar) o tocando las fichas (ideal para pantallas táctiles y teclado).
// ejercicio: { elementos: [{ texto, detalle }] } en el orden correcto.
export function Ordenar({ ejercicio, resuelto, onResponder }) {
  const { elementos, ranuras } = ejercicio;
  const mezclados = useMemo(() => {
    // Orden fijo pero distinto del correcto y del inverso: se rota por la mitad.
    const indices = elementos.map((_, i) => i);
    const k = Math.ceil(indices.length / 2);
    return [...indices.slice(k), ...indices.slice(0, k)];
  }, [elementos]);

  // secuencia representa las posiciones fijas [0, 1, 2, ...]: cada una contiene el índice del elemento o null
  const [secuencia, setSecuencia] = useState(() => Array(elementos.length).fill(null));
  const [arrastrando, setArrastrando] = useState(null); // { tipo: 'disponible' | 'ranura', indiceElemento, ranuraOrigen }
  const [dragOverRanura, setDragOverRanura] = useState(null);

  // Elementos colocados actualmente en alguna ranura
  const elementosColocados = secuencia.filter((x) => x !== null);

  function ponerEnRanura(posDestino, indiceElemento) {
    if (resuelto) return;
    setSecuencia((prev) => {
      const nuevo = [...prev];
      // Si el elemento ya estaba en otra ranura, liberamos esa ranura o intercambiamos
      const posExistente = nuevo.indexOf(indiceElemento);
      if (posExistente !== -1) {
        nuevo[posExistente] = nuevo[posDestino]; // Intercambio si había uno en destino
      }
      nuevo[posDestino] = indiceElemento;
      return nuevo;
    });
  }

  function sacarDeRanura(pos) {
    if (resuelto) return;
    setSecuencia((prev) => {
      const nuevo = [...prev];
      nuevo[pos] = null;
      return nuevo;
    });
  }

  // Tocar una ficha disponible: busca la primera ranura vacía y la coloca allí
  function clickDisponible(i) {
    if (resuelto) return;
    const primeraVacia = secuencia.findIndex((val) => val === null);
    if (primeraVacia !== -1) {
      ponerEnRanura(primeraVacia, i);
    }
  }

  // Drag and Drop handlers
  function handleDragStart(e, info) {
    if (resuelto) return;
    setArrastrando(info);
    e.dataTransfer.setData('text/plain', JSON.stringify(info));
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragEnd() {
    setArrastrando(null);
    setDragOverRanura(null);
  }

  function handleDragOver(e, pos) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverRanura !== pos) {
      setDragOverRanura(pos);
    }
  }

  function handleDragLeave(pos) {
    if (dragOverRanura === pos) {
      setDragOverRanura(null);
    }
  }

  function handleDrop(e, posDestino) {
    e.preventDefault();
    setDragOverRanura(null);
    try {
      const data = e.dataTransfer.getData('text/plain');
      const info = data ? JSON.parse(data) : arrastrando;
      if (info && info.indiceElemento !== undefined) {
        ponerEnRanura(posDestino, info.indiceElemento);
      }
    } catch {
      if (arrastrando && arrastrando.indiceElemento !== undefined) {
        ponerEnRanura(posDestino, arrastrando.indiceElemento);
      }
    }
    setArrastrando(null);
  }

  function comprobar() {
    const completa = secuencia.every((v) => v !== null);
    if (!completa) return;
    const correcta = secuencia.every((v, i) => v === i);
    const alReves = secuencia.every((v, i) => v === elementos.length - 1 - i);
    onResponder({ correcta, clave: correcta ? 'ok' : alReves ? 'alReves' : 'otro', valor: '' });
  }

  return (
    <div className="ordenar">
      <ol className="ordenar-ranuras">
        {elementos.map((_, pos) => {
          const i = secuencia[pos];
          const isOver = dragOverRanura === pos;
          return (
            <li
              key={pos}
              className={`ordenar-ranura ${isOver ? 'ordenar-ranura--over' : ''}`}
              onDragOver={(e) => handleDragOver(e, pos)}
              onDragLeave={() => handleDragLeave(pos)}
              onDrop={(e) => handleDrop(e, pos)}
            >
              <span className="ordenar-pos">{ranuras?.[pos] ?? `${pos + 1}°`}</span>
              {i !== null && i !== undefined ? (
                <button
                  type="button"
                  className="ordenar-ficha ordenar-ficha--puesta"
                  onClick={() => sacarDeRanura(pos)}
                  disabled={resuelto}
                  draggable={!resuelto}
                  onDragStart={(e) => handleDragStart(e, { tipo: 'ranura', indiceElemento: i, ranuraOrigen: pos })}
                  onDragEnd={handleDragEnd}
                  title="Haz clic para quitar o arrastra a otra posición"
                >
                  <span>
                    <ConFracciones texto={elementos[i].texto} />
                  </span>
                  {elementos[i].detalle && <span className="ordenar-detalle">{elementos[i].detalle}</span>}
                  <span className="visualmente-oculto"> (toca para sacar)</span>
                </button>
              ) : (
                <span className={`ordenar-vacia ${isOver ? 'ordenar-vacia--over' : ''}`} />
              )}
            </li>
          );
        })}
      </ol>

      <div className="ordenar-disponibles" role="group" aria-label="Elementos para ordenar">
        {mezclados.map((i) => {
          const estaPuesto = secuencia.includes(i);
          if (estaPuesto) return null;
          return (
            <button
              key={i}
              type="button"
              className="ordenar-ficha"
              onClick={() => clickDisponible(i)}
              disabled={resuelto}
              draggable={!resuelto}
              onDragStart={(e) => handleDragStart(e, { tipo: 'disponible', indiceElemento: i })}
              onDragEnd={handleDragEnd}
              title="Arrastra a un rectángulo o haz clic para colocar"
            >
              <span>
                <ConFracciones texto={elementos[i].texto} />
              </span>
              {elementos[i].detalle && <span className="ordenar-detalle">{elementos[i].detalle}</span>}
            </button>
          );
        })}
      </div>

      <div className="interactivo-pie">
        <button
          type="button"
          className="boton boton--texto"
          onClick={() => setSecuencia(Array(elementos.length).fill(null))}
          disabled={resuelto || elementosColocados.length === 0}
        >
          Empezar de nuevo
        </button>
        <BotonComprobar disabled={resuelto || elementosColocados.length < elementos.length} onClick={comprobar} />
      </div>
    </div>
  );
}
