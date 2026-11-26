import { useEffect, useMemo, useRef, useState } from 'react';
import { f } from '../../lib/formato.js';
import { imagenDatos } from '../../lib/imagenes.js';
import { EscenaQuiosco } from './EscenaQuiosco.jsx';

// ---------- Gráfico de barras ----------
// valor null = barra que falta. numeros=false oculta la escala del eje
// (para preguntas donde hay que deducirla).
export function Grafico({ titulo, datos, max, paso = 1, numeros = true, ejeY, valorEditable, editable }) {
  const tope = max ?? Math.max(...datos.map((d) => d.valor ?? 0));
  const alto = 200;
  const escala = alto / tope;
  const x0 = 54;
  const anchoUtil = 420 - x0;
  const anchoBarra = Math.min(60, (anchoUtil / datos.length) * 0.6);
  const hueco = anchoUtil / datos.length;
  const lineas = [];
  for (let v = 0; v <= tope; v += paso) lineas.push(v);
  return (
    <svg viewBox="0 0 440 290" role="img" aria-label={`${titulo}: ${datos.map((d) => `${d.etiqueta} ${d.valor ?? 'sin dato'}`).join(', ')}`}>
      {titulo && (
        <text x="240" y="18" className="v-etq v-fuerte">
          {titulo}
        </text>
      )}
      {ejeY && (
        <text x="14" y="140" className="v-etq v-chica" transform="rotate(-90 14 140)">
          {ejeY}
        </text>
      )}
      {lineas.map((v) => (
        <g key={v}>
          <line x1={x0} y1={240 - v * escala} x2="430" y2={240 - v * escala} className="v-guia" />
          {numeros && (
            <text x={x0 - 10} y={245 - v * escala} className="v-etq v-chica v-der">
              {f(v)}
            </text>
          )}
        </g>
      ))}
      {datos.map((d, i) => {
        const valor = editable === i ? valorEditable : d.valor;
        const x = x0 + hueco * i + (hueco - anchoBarra) / 2;
        return (
          <g key={d.etiqueta}>
            {valor !== null && valor !== undefined ? (
              <rect
                x={x}
                y={240 - valor * escala}
                width={anchoBarra}
                height={valor * escala}
                className={editable === i ? 'v-barra-editable' : 'v-pintado'}
              />
            ) : (
              <text x={x + anchoBarra / 2} y="226" className="v-num v-acento">
                ?
              </text>
            )}
            <text x={x + anchoBarra / 2} y="266" className="v-etq v-chica">
              {d.etiqueta}
            </text>
          </g>
        );
      })}
      <line x1={x0} y1="240" x2="430" y2="240" className="v-trazo" />
    </svg>
  );
}

// ---------- Pictograma con escala ----------
function IconoPicto({ tipo, medio }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={medio ? 'v-picto v-picto--medio' : 'v-picto'}>
      <defs>
        <clipPath id="mitad-picto">
          <rect x="0" y="0" width="16" height="32" />
        </clipPath>
      </defs>
      <g clipPath={medio ? 'url(#mitad-picto)' : undefined}>
        {tipo === 'botella' && <path d="M13 3h6v5l3 4v17H10V12l3-4z" className="v-picto-relleno" />}
        {tipo === 'carita' && (
          <>
            <circle cx="16" cy="16" r="13" className="v-picto-relleno" />
            <circle cx="11.5" cy="13" r="1.8" className="v-picto-detalle" />
            <circle cx="20.5" cy="13" r="1.8" className="v-picto-detalle" />
            <path d="M10 19c3 4 9 4 12 0" className="v-picto-trazo" />
          </>
        )}
        {tipo === 'helado' && (
          <>
            <circle cx="16" cy="11" r="8" className="v-picto-relleno" />
            <path d="M9 14h14l-7 15z" className="v-picto-cono" />
          </>
        )}
      </g>
    </svg>
  );
}

export function Pictograma({ titulo, datos, valorIcono, icono = 'carita', unidad }) {
  return (
    <div className="v-pictograma">
      {titulo && <p className="v-pictograma-titulo">{titulo}</p>}
      <table>
        <tbody>
          {datos.map((d) => (
            <tr key={d.etiqueta}>
              <th scope="row">{d.etiqueta}</th>
              <td>
                {Array.from({ length: Math.ceil(d.iconos) }, (_, i) => (
                  <IconoPicto key={i} tipo={icono} medio={i + 1 > d.iconos} />
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="v-pictograma-clave">
        <IconoPicto tipo={icono} /> = {f(valorIcono)} {unidad}
      </p>
    </div>
  );
}

// =========================================================
// Dibujos con imágenes (ejercicios de la PPT "ejercicios de prueba").
// Las imágenes están en public/img/datos/<nombre>.png
// =========================================================

// ---------- Caja con colaciones (probabilidades) ----------
// 1) La caja se ve desde arriba, abierta, con cada unidad en un lugar al azar
//    (se respeta la cantidad de cada colación para que se puedan contar).
// 2) Al responder bien, las tapas se cierran, la caja gira y se ve de frente.
// 3) Una mano entra por el agujero y saca una colación al azar, con la misma
//    probabilidad que tiene cada una (más unidades = más fácil que salga).

// Reparte n objetos en una cuadrícula con celdas elegidas al azar y un pequeño
// desplazamiento y giro, para que parezcan tirados en la caja sin taparse.
function repartirAlAzar(n) {
  const columnas = Math.max(1, Math.ceil(Math.sqrt(n * 1.6)));
  const filas = Math.ceil(n / columnas) + (n > 3 ? 1 : 0);
  const celdas = Array.from({ length: columnas * filas }, (_, i) => i);
  for (let i = celdas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [celdas[i], celdas[j]] = [celdas[j], celdas[i]];
  }
  return celdas.slice(0, n).map((celda) => {
    const col = celda % columnas;
    const fila = Math.floor(celda / columnas);
    const dx = (Math.random() - 0.5) * 0.4;
    const dy = (Math.random() - 0.5) * 0.4;
    return {
      x: ((col + 0.5 + dx) / columnas) * 100,
      y: ((fila + 0.5 + dy) / filas) * 100,
      giro: Math.round((Math.random() - 0.5) * 60),
    };
  });
}

// Elige una colación según su probabilidad (cantidad / total).
function sacarAlAzar(items) {
  const total = items.reduce((suma, item) => suma + item.cantidad, 0);
  let r = Math.random() * total;
  for (const item of items) {
    r -= item.cantidad;
    if (r < 0) return item;
  }
  return items.at(-1);
}

const sinMovimiento = () =>
  typeof window !== 'undefined' && Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

// Mano con los dedos hacia abajo. La colación aparece en la mano cuando ya está dentro de la caja.
function Mano({ item }) {
  return (
    <g className="v-caja-frente__mano">
      {/* manga y puño */}
      <rect x="176" y="-320" width="48" height="300" rx="10" fill="#4f7fd6" stroke="#2f5aa8" strokeWidth="3" />
      <rect x="172" y="-34" width="56" height="18" rx="7" fill="#f4f6fb" stroke="#2f5aa8" strokeWidth="3" />
      {/* colación (detrás de los dedos, como si la agarrara) */}
      {item && (
        <image
          className="v-caja-frente__premio"
          href={imagenDatos(item.imagen)}
          x="163"
          y="34"
          width="74"
          height="74"
          preserveAspectRatio="xMidYMid meet"
        />
      )}
      {/* palma y dedos */}
      <path
        d="M180 -16 C176 6 176 26 180 44 L220 44 C224 26 224 6 220 -16 Z"
        fill="#f2c39b"
        stroke="#b97b4f"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {[184, 194, 205, 215].map((x, i) => (
        <rect key={x} x={x - 5} y="36" width="10" height={i === 0 || i === 3 ? 22 : 28} rx="5" fill="#f2c39b" stroke="#b97b4f" strokeWidth="2.5" />
      ))}
      <path d="M220 4 C234 10 238 24 230 36" fill="none" stroke="#b97b4f" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function CajaDeFrente({ titulo, item, intento }) {
  return (
    <svg viewBox="0 -100 400 440" className="v-caja-frente" role="img" aria-label={`${titulo ?? 'Caja'} cerrada, vista de frente`}>
      <defs>
        {/* lo que baja de la línea del agujero queda "dentro" de la caja */}
        <clipPath id="v-caja-dentro">
          <rect x="0" y="-400" width="400" height="560" />
        </clipPath>
      </defs>
      {/* tapa de arriba (cerrada) con un agujero para meter la mano */}
      <polygon points="80,120 320,120 362,178 38,178" fill="#e2b984" stroke="#9c6f38" strokeWidth="3" strokeLinejoin="round" />
      <line x1="200" y1="120" x2="200" y2="178" stroke="#9c6f38" strokeWidth="2" />
      <ellipse cx="200" cy="160" rx="52" ry="12" fill="#3b2a18" />
      <g clipPath="url(#v-caja-dentro)">
        {item !== undefined && <Mano key={intento} item={item} />}
      </g>
      <path d="M148 160 A52 12 0 0 0 252 160" fill="none" stroke="#9c6f38" strokeWidth="3" />
      {/* cara frontal */}
      <rect x="38" y="178" width="324" height="150" rx="4" fill="#d9ad72" stroke="#9c6f38" strokeWidth="3" />
      <rect x="185" y="178" width="30" height="150" fill="#c99a5e" opacity="0.55" />
      <rect x="100" y="226" width="200" height="54" rx="8" fill="#fffaf0" stroke="#9c6f38" strokeWidth="2" />
      <text x="200" y="260" textAnchor="middle" className="v-caja-frente__rotulo">
        {titulo ?? 'Colaciones'}
      </text>
    </svg>
  );
}

export function Caja({ titulo, items, estado }) {
  const resuelto = Boolean(estado?.resuelto);
  const total = items.reduce((suma, item) => suma + item.cantidad, 0);

  // Una ficha por unidad, con posición al azar (fija mientras dure la pregunta).
  const unidades = useMemo(() => {
    const lista = items.flatMap((item) =>
      Array.from({ length: item.cantidad }, (_, i) => ({ item, clave: `${item.id}-${i}` })),
    );
    const lugares = repartirAlAzar(lista.length);
    return lista.map((u, i) => ({ ...u, ...lugares[i] }));
  }, [items]);

  // abierta → cerrando → frente → mano → listo
  const [fase, setFase] = useState('abierta');
  const [sacado, setSacado] = useState(null);
  const [intento, setIntento] = useState(0);
  const timerOtraVez = useRef(null);

  useEffect(() => {
    if (!resuelto) return undefined;
    const t = sinMovimiento() ? [0, 50, 100, 150] : [0, 1500, 2300, 5300];
    const timers = [
      setTimeout(() => setFase('cerrando'), t[0]),
      setTimeout(() => setFase('frente'), t[1]),
      setTimeout(() => {
        setSacado(sacarAlAzar(items));
        setFase('mano');
      }, t[2]),
      setTimeout(() => setFase('listo'), t[3]),
    ];
    return () => timers.forEach(clearTimeout);
  }, [resuelto, items]);

  useEffect(() => () => clearTimeout(timerOtraVez.current), []);

  function sacarOtraVez() {
    setSacado(sacarAlAzar(items));
    setIntento((n) => n + 1);
    setFase('mano');
    clearTimeout(timerOtraVez.current);
    timerOtraVez.current = setTimeout(() => setFase('listo'), sinMovimiento() ? 50 : 3000);
  }

  const deFrente = fase === 'frente' || fase === 'mano' || fase === 'listo';

  return (
    <div className={`v-colaciones v-colaciones--${fase}`}>
      <div className="v-colaciones__escena">
        <div className="v-colaciones__arriba" aria-hidden={deFrente}>
          <div className="v-colaciones__caja">
            <ul className="v-colaciones__interior" aria-label={`${titulo}: ${total} colaciones vistas desde arriba`}>
              {unidades.map((u) => (
                <li
                  key={u.clave}
                  className="v-colaciones__unidad"
                  style={{ left: `${8 + u.x * 0.84}%`, top: `${9 + u.y * 0.82}%`, '--giro': `${u.giro}deg` }}
                >
                  <img src={imagenDatos(u.item.imagen)} alt={u.item.nombre} draggable="false" />
                </li>
              ))}
            </ul>
            <span className="v-colaciones__tapa v-colaciones__tapa--arriba" aria-hidden="true" />
            <span className="v-colaciones__tapa v-colaciones__tapa--abajo" aria-hidden="true" />
            <span className="v-colaciones__tapa v-colaciones__tapa--izq" aria-hidden="true" />
            <span className="v-colaciones__tapa v-colaciones__tapa--der" aria-hidden="true" />
          </div>
        </div>

        {deFrente && (
          <div className="v-colaciones__frente">
            <CajaDeFrente titulo={titulo} item={fase === 'frente' ? undefined : sacado} intento={intento} />
          </div>
        )}
      </div>

      {/* cantidades, para poder contar sin tener que buscar dentro de la caja */}
      <ul className="v-colaciones__leyenda" aria-label="Cantidad de cada colación">
        {items.map((item) => (
          <li key={item.id}>
            <img src={imagenDatos(item.imagen)} alt="" draggable="false" />
            <span>
              {item.cantidad} {item.nombre}
            </span>
          </li>
        ))}
      </ul>

      <div className="v-colaciones__resultado" aria-live="polite">
        {fase === 'listo' && sacado && (
          <>
            <p>
              Sofía sacó <strong>{sacado.singular ?? sacado.nombre}</strong>{' '}
              <span className="v-colaciones__prob">
                (tenía {sacado.cantidad} de {total} posibilidades)
              </span>
            </p>
            <button type="button" className="boton boton--suave" onClick={sacarOtraVez}>
              Sacar otra vez
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ---------- Máquina de peluches (probabilidades) ----------
// La máquina es una imagen PNG (public/img/datos/maquina-garra.png) con el vidrio y la
// puerta de premios transparentes; detrás se dibujan los peluches y la garra.
// Si la respuesta es incorrecta, la garra pesca un peluche al azar (que no sea el
// destacado); si es correcta, pesca el destacado. Luego lo suelta por la salida y
// cae en la puerta de premios.

// Coordenadas en el mismo sistema que la imagen (600 x 900).
const GARRA_CASA = { x: 145, y: 205 };
const TAMANO_PELUCHE = 74;
const PUERTA = { x: 160, y: 786 };
// Lugares del montón de peluches: filas de atrás (arriba) hacia adelante (abajo).
const LUGARES_MONTON = [
  [315, 420], [380, 414], [445, 420],
  [282, 466], [347, 462], [412, 466], [477, 462],
  [252, 514], [317, 512], [382, 516], [447, 512], [500, 516],
];

function armarMonton(grupos) {
  const peluches = grupos.flatMap((g) =>
    Array.from({ length: g.cantidad }, (_, i) => ({ id: `${g.id}-${i}`, grupo: g, imagen: g.imagenes[i % g.imagenes.length] })),
  );
  const lugares = LUGARES_MONTON.slice(0, peluches.length);
  for (let i = lugares.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lugares[i], lugares[j]] = [lugares[j], lugares[i]];
  }
  // Los de atrás se dibujan primero para que los de adelante queden encima.
  return peluches
    .map((p, i) => ({
      ...p,
      x: lugares[i][0] + Math.round((Math.random() - 0.5) * 14),
      y: lugares[i][1] + Math.round((Math.random() - 0.5) * 10),
      giro: Math.round((Math.random() - 0.5) * 50),
    }))
    .sort((a, b) => a.y - b.y);
}

function Garra({ abierta }) {
  const giro = abierta ? 28 : 4;
  const tenaza = (lado) => (
    <g transform={`translate(${lado * 14} 8)`}>
      <g className="v-garra__tenaza" style={{ transform: `rotate(${lado * giro}deg)` }}>
        <path
          d={`M0 0 L${lado * 16} 30 L${lado * 6} 56`}
          fill="none"
          stroke="#8b93a8"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>
  );
  return (
    <>
      <rect x="-3" y="-700" width="6" height="690" fill="#5b6378" />
      {tenaza(-1)}
      {tenaza(1)}
      <rect x="-22" y="-14" width="44" height="24" rx="8" fill="#c7cede" stroke="#5b6378" strokeWidth="3" />
      <circle cx="0" cy="-2" r="5" fill="#e24f8a" />
    </>
  );
}

const pausa = (ms) => new Promise((r) => setTimeout(r, ms));

export function MaquinaPeluches({ grupos, destacado, estado }) {
  const total = grupos.reduce((suma, g) => suma + g.cantidad, 0);
  const monton = useMemo(() => armarMonton(grupos), [grupos]);
  const resuelto = Boolean(estado?.resuelto);
  const intentos = estado?.intentos ?? 0;

  const [garra, setGarra] = useState({ ...GARRA_CASA, abierta: true, ms: 0 });
  const [premio, setPremio] = useState(null); // { peluche, x, y, giro, ms, cae }
  const [mensaje, setMensaje] = useState(null);
  const jugada = useRef(0);

  // Cada respuesta (incorrecta o la correcta) echa a andar la garra.
  useEffect(() => {
    if (!resuelto && intentos === 0) return undefined;
    const id = ++jugada.current;
    const sigue = () => jugada.current === id;
    const candidatos = resuelto
      ? monton.filter((p) => p.grupo.id === destacado)
      : monton.filter((p) => p.grupo.id !== destacado);
    const elegido = candidatos[Math.floor(Math.random() * candidatos.length)];
    const rapido = sinMovimiento();
    const t = (ms) => (rapido ? 1 : ms);

    async function jugar() {
      setMensaje(null);
      setPremio({ peluche: elegido, x: elegido.x, y: elegido.y, giro: elegido.giro, ms: 0 });
      setGarra({ ...GARRA_CASA, abierta: true, ms: t(500) });
      await pausa(t(550));
      if (!sigue()) return;
      // se mueve sobre el peluche
      setGarra({ x: elegido.x, y: GARRA_CASA.y, abierta: true, ms: t(1000) });
      await pausa(t(1050));
      if (!sigue()) return;
      // baja
      setGarra({ x: elegido.x, y: elegido.y - 52, abierta: true, ms: t(900) });
      await pausa(t(950));
      if (!sigue()) return;
      // cierra la tenaza
      setGarra({ x: elegido.x, y: elegido.y - 52, abierta: false, ms: t(350) });
      await pausa(t(450));
      if (!sigue()) return;
      // sube con el peluche
      setGarra({ ...GARRA_CASA, x: elegido.x, abierta: false, ms: t(900) });
      setPremio({ peluche: elegido, x: elegido.x, y: GARRA_CASA.y + 52, giro: 0, ms: t(900) });
      await pausa(t(1000));
      if (!sigue()) return;
      // va hasta la salida
      setGarra({ ...GARRA_CASA, abierta: false, ms: t(1000) });
      setPremio({ peluche: elegido, x: GARRA_CASA.x, y: GARRA_CASA.y + 52, giro: 0, ms: t(1000) });
      await pausa(t(1150));
      if (!sigue()) return;
      // lo suelta y cae a la puerta de premios
      setGarra({ ...GARRA_CASA, abierta: true, ms: t(300) });
      setPremio({ peluche: elegido, x: PUERTA.x, y: PUERTA.y, giro: Math.round((Math.random() - 0.5) * 40), ms: t(850), cae: true });
      await pausa(t(950));
      if (!sigue()) return;
      setMensaje({ peluche: elegido, correcto: resuelto });
    }
    jugar();
    return () => {
      jugada.current++;
    };
  }, [resuelto, intentos, monton, destacado]);

  const enMovimiento = premio?.peluche.id;
  const movido = (ms, cae) => ({
    transition: `transform ${ms}ms ${cae ? 'cubic-bezier(0.55, 0, 1, 0.45)' : 'ease-in-out'}`,
  });
  const nombre = (g) => g.singular ?? g.nombre;

  return (
    <div className="v-garra">
      <svg viewBox="0 0 600 900" className="v-garra__svg" role="img" aria-label={`Máquina de peluches con ${total} peluches`}>
        <defs>
          <linearGradient id="v-garra-fondo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fdeaf3" />
            <stop offset="1" stopColor="#dfe8fb" />
          </linearGradient>
          <clipPath id="v-garra-vidrio">
            <rect x="70" y="150" width="460" height="410" />
          </clipPath>
        </defs>

        {/* interior: fondo, riel, piso, salida y hueco de la puerta de premios */}
        <rect x="70" y="150" width="460" height="410" fill="url(#v-garra-fondo)" />
        <rect x="70" y="158" width="460" height="12" fill="#8b93a8" />
        <rect x="70" y="540" width="460" height="20" fill="#c98fb0" />
        <rect x="95" y="730" width="130" height="100" fill="#2b1d2e" />
        <rect x="95" y="812" width="130" height="18" fill="#4a3550" />
        <rect x="88" y="420" width="114" height="140" fill="#ffffff" opacity="0.35" stroke="#ffffff" strokeWidth="4" />
        <text x="145" y="500" textAnchor="middle" className="v-garra__tobogan">SALIDA</text>

        {/* montón de peluches (el que se está pescando se dibuja aparte) */}
        {monton
          .filter((p) => p.id !== enMovimiento)
          .map((p) => (
            <g key={p.id} transform={`translate(${p.x} ${p.y}) rotate(${p.giro})`}>
              <image
                href={imagenDatos(p.imagen)}
                x={-TAMANO_PELUCHE / 2}
                y={-TAMANO_PELUCHE / 2}
                width={TAMANO_PELUCHE}
                height={TAMANO_PELUCHE}
              />
            </g>
          ))}

        {/* peluche pescado */}
        {premio && (
          <g style={{ transform: `translate(${premio.x}px, ${premio.y}px)`, ...movido(premio.ms, premio.cae) }}>
            <g style={{ transform: `rotate(${premio.giro}deg)`, ...movido(premio.ms, premio.cae) }}>
              <image
                href={imagenDatos(premio.peluche.imagen)}
                x={-TAMANO_PELUCHE / 2}
                y={-TAMANO_PELUCHE / 2}
                width={TAMANO_PELUCHE}
                height={TAMANO_PELUCHE}
                className={premio.peluche.grupo.id === destacado ? 'v-garra__premio--destacado' : undefined}
              />
            </g>
          </g>
        )}

        {/* garra (solo se ve dentro del vidrio) */}
        <g clipPath="url(#v-garra-vidrio)">
          <g style={{ transform: `translate(${garra.x}px, ${garra.y}px)`, ...movido(garra.ms) }}>
            <Garra abierta={garra.abierta} />
          </g>
        </g>

        {/* la máquina va encima: el vidrio y la puerta son transparentes */}
        <image href={imagenDatos('maquina-garra')} x="0" y="0" width="600" height="900" />
      </svg>

      <ul className="v-maquina__conteo">
        {grupos.map((g) => (
          <li key={g.id}>
            <img src={imagenDatos(g.imagenes[0])} alt="" draggable="false" />
            {g.cantidad} {g.nombre}
          </li>
        ))}
      </ul>

      <p className="v-garra__mensaje" aria-live="polite">
        {mensaje &&
          (mensaje.correcto ? (
            <>
              ¡La garra sacó <strong>{nombre(mensaje.peluche.grupo)}</strong>! Tenía solo {mensaje.peluche.grupo.cantidad} de{' '}
              {total} posibilidades.
            </>
          ) : (
            <>
              La garra sacó <strong>{nombre(mensaje.peluche.grupo)}</strong> ({mensaje.peluche.grupo.cantidad} de {total}{' '}
              posibilidades).
            </>
          ))}
      </p>
    </div>
  );
}

// ---------- Gráfico de barras con íconos ----------
// Si el dibujo trae "escena" (una imagen en public/img/datos), primero se ve esa
// escena con una pizarra pequeña que resume las ventas; a los 4 segundos (o al
// tocarla) la pizarra crece hasta ocupar todo el recuadro y muestra el gráfico.
const ESPERA_PIZARRA = 4000;
const CRECER_PIZARRA = 900;

export function GraficoIconos(props) {
  const { escena, datos } = props;
  const [fase, setFase] = useState(escena ? 'escena' : 'ejercicio');

  useEffect(() => {
    if (fase === 'escena') {
      const t = setTimeout(() => setFase('creciendo'), ESPERA_PIZARRA);
      return () => clearTimeout(t);
    }
    if (fase === 'creciendo') {
      const t = setTimeout(() => setFase('ejercicio'), sinMovimiento() ? 10 : CRECER_PIZARRA);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [fase]);

  if (!escena) return <GraficoIconosBase {...props} />;

  const visible = (d) => !d.oculto || props.estado?.revelar;
  // escena: "kiosco" usa el kiosco dibujado (EscenaQuiosco); otro nombre, una imagen PNG
  const dibujada = escena === 'kiosco';

  return (
    <div className={`v-escena v-escena--${fase}${dibujada ? ' v-escena--kiosco' : ''}`}>
      {fase !== 'ejercicio' &&
        (dibujada ? (
          <div
            className="v-escena__fondo"
            role="img"
            aria-label="Kiosco en la calle: dos niñas y un niño miran el anaquel con jugos, sándwiches de pollo, helados y manzanas, y el vendedor se los muestra. A la izquierda cuelga una pizarra con las ventas del día."
          >
            <EscenaQuiosco />
          </div>
        ) : (
          <img
            className="v-escena__fondo"
            src={imagenDatos(escena)}
            alt="Quiosco dentro de la escuela: un vendedor atiende a los estudiantes. En la pared hay una pizarra con las ventas del día."
            draggable="false"
          />
        ))}
      <div className="v-escena__pizarra">
        {fase === 'escena' && (
          <button
            type="button"
            className="v-escena__resumen"
            onClick={() => setFase('creciendo')}
            aria-label="Ver la pizarra con el gráfico de ventas"
          >
            <span className="v-escena__titulo">Ventas de hoy</span>
            <span className="v-escena__lista">
              {datos.map((d) => (
                <span key={d.etiqueta} className="v-escena__item">
                  <img src={imagenDatos(d.imagen)} alt={d.etiqueta} draggable="false" />
                  <span>{visible(d) ? d.valor : '?'}</span>
                </span>
              ))}
            </span>
          </button>
        )}
        {fase === 'ejercicio' && <GraficoIconosBase {...props} />}
      </div>
    </div>
  );
}

function GraficoIconosBase({ titulo, datos, max, paso = 1, estado }) {
  const tope = max ?? Math.max(...datos.map((d) => d.valor));
  const lineas = [];
  for (let v = 0; v <= tope; v += paso) lineas.push(v);
  const visible = (d) => !d.oculto || estado?.revelar;
  return (
    <div
      className="v-gicono"
      role="img"
      aria-label={`${titulo}: ${datos.map((d) => `${d.etiqueta} ${visible(d) ? d.valor : 'sin dato'}`).join(', ')}`}
    >
      {titulo && <p className="v-gicono__titulo">{titulo}</p>}
      <div className="v-gicono__area">
        <div className="v-gicono__escala" aria-hidden="true">
          {lineas.map((v) => (
            <span key={v} style={{ bottom: `${(v / tope) * 100}%` }}>
              {v}
            </span>
          ))}
        </div>
        <div className="v-gicono__barras">
          {lineas.map((v) => (
            <span key={v} className="v-gicono__guia" style={{ bottom: `${(v / tope) * 100}%` }} aria-hidden="true" />
          ))}
          {datos.map((d) => (
            <div key={d.etiqueta} className="v-gicono__col">
              {visible(d) ? (
                <div
                  className={d.oculto ? 'v-gicono__barra v-gicono__barra--nueva' : 'v-gicono__barra'}
                  style={{ height: `${(d.valor / tope) * 100}%` }}
                >
                  <span>{d.valor}</span>
                </div>
              ) : (
                <div className="v-gicono__barra v-gicono__barra--falta" style={{ height: '30%' }}>
                  <span>?</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="v-gicono__etiquetas">
        <span aria-hidden="true" />
        {datos.map((d) => (
          <span key={d.etiqueta} className="v-gicono__etq">
            <img src={imagenDatos(d.imagen)} alt="" draggable="false" />
            {d.etiqueta}
          </span>
        ))}
      </div>
    </div>
  );
}
