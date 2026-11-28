import { useState } from 'react';
import { imagenDatos } from '../../lib/imagenes.js';

// Ordenar tarjetas en casillas (de menos a más probable, por ejemplo).
// Se puede arrastrar con el mouse o, en tablets y con teclado, tocar una
// tarjeta y después la casilla donde va.
//
// datos: { elementos: [{ id, texto, imagen }], casillas: [texto], correcto: [id],
//          feedbackInvertido, feedback }
// onComprobar(correcto, clave, feedback)
export default function Ordenar({ datos, resuelto, onComprobar }) {
  const { elementos, casillas, correcto } = datos;
  const [colocados, setColocados] = useState(() => casillas.map(() => null));
  const [elegido, setElegido] = useState(null);

  const ubicados = resuelto ? correcto : colocados;
  const enBanco = elementos.filter((e) => !ubicados.includes(e.id));
  const completo = colocados.every(Boolean);
  const porId = (id) => elementos.find((e) => e.id === id);

  function colocar(id, casilla) {
    setColocados((prev) => {
      const nuevo = prev.map((x) => (x === id ? null : x));
      nuevo[casilla] = id;
      return nuevo;
    });
    setElegido(null);
  }

  function devolver(id) {
    setColocados((prev) => prev.map((x) => (x === id ? null : x)));
    setElegido(null);
  }

  function tocarCasilla(i) {
    if (resuelto) return;
    if (elegido) colocar(elegido, i);
    else if (colocados[i]) setElegido(colocados[i]);
  }

  function comprobar() {
    const clave = colocados.join(',');
    if (colocados.every((id, i) => id === correcto[i])) {
      onComprobar(true, clave);
      return;
    }
    const invertido = colocados.every((id, i) => id === correcto[correcto.length - 1 - i]);
    const bien = colocados.filter((id, i) => id === correcto[i]).length;
    const feedback = invertido
      ? datos.feedbackInvertido
      : `${datos.feedback} Tienes ${bien} de ${correcto.length} en su lugar.`;
    onComprobar(false, clave, feedback);
  }

  const soltarEn = (destino) => ({
    onDragOver: (e) => {
      if (!resuelto) e.preventDefault();
    },
    onDrop: (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData('text/plain');
      if (!porId(id)) return;
      if (destino === 'banco') devolver(id);
      else colocar(id, destino);
    },
  });

  function tarjeta(elemento) {
    const activa = elegido === elemento.id;
    return (
      <button
        key={elemento.id}
        type="button"
        className={`ordenar__tarjeta${activa ? ' ordenar__tarjeta--elegida' : ''}`}
        draggable={!resuelto}
        disabled={resuelto}
        aria-pressed={activa}
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', elemento.id);
          e.dataTransfer.effectAllowed = 'move';
        }}
        onClick={(e) => {
          e.stopPropagation();
          setElegido(activa ? null : elemento.id);
        }}
      >
        <img src={imagenDatos(elemento.imagen)} alt="" draggable="false" />
        <span>{elemento.texto}</span>
      </button>
    );
  }

  return (
    <div className="ordenar">
      <p className="ordenar__ayuda">
        {resuelto
          ? 'Este es el orden correcto:'
          : 'Arrastra cada tarjeta a su casilla, o tócala y después toca la casilla.'}
      </p>

      <div className={`ordenar__banco${enBanco.length === 0 ? ' ordenar__banco--vacio' : ''}`} {...soltarEn('banco')}>
        {enBanco.map((e) => tarjeta(e))}
        {enBanco.length === 0 && !resuelto && <span className="ordenar__nota">Todas las tarjetas están ubicadas.</span>}
      </div>

      <ol className="ordenar__casillas">
        {casillas.map((nombre, i) => {
          const id = ubicados[i];
          return (
            <li
              key={nombre}
              className={`ordenar__casilla${id ? ' ordenar__casilla--llena' : ''}${elegido && !id ? ' ordenar__casilla--lista' : ''}${resuelto ? ' ordenar__casilla--correcta' : ''}`}
              {...soltarEn(i)}
              onClick={() => tocarCasilla(i)}
            >
              <span className="ordenar__nombre">
                <span className="ordenar__num">{i + 1}</span> {nombre}
              </span>
              {id ? (
                tarjeta(porId(id))
              ) : (
                <button
                  type="button"
                  className="ordenar__hueco"
                  disabled={resuelto || !elegido}
                  aria-label={`Poner la tarjeta elegida en la casilla ${i + 1}: ${nombre}`}
                >
                  {elegido ? 'Toca aquí' : 'Vacía'}
                </button>
              )}
            </li>
          );
        })}
      </ol>
      <p className="ordenar__escala" aria-hidden="true">
        <span>menos probable</span>
        <span>más probable</span>
      </p>

      {!resuelto && (
        <div className="ordenar__acciones">
          {elegido && colocados.includes(elegido) && (
            <button type="button" className="boton boton--suave" onClick={() => devolver(elegido)}>
              Sacar tarjeta
            </button>
          )}
          <button type="button" className="boton boton--principal" disabled={!completo} onClick={comprobar}>
            Comprobar orden
          </button>
        </div>
      )}
    </div>
  );
}
