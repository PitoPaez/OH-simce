import { useRef, useState } from 'react';
import { CM, limitar, useArrastre } from './comun.js';

// Medir en centímetros. visual:
//   modo: 'mover'    una regla que se arrastra para medir un objeto; el
//                    estudiante escribe cuánto mide. Responde el número ('7').
//         'estirar'  una huincha que se estira hasta el largo pedido.
//                    Responde los cm estirados ('13').
//   largo            cm de la regla o máximo de la huincha
//   objeto           solo en 'mover': { src, largo, nombre }. La imagen
//                    (public/imagenes/) debe ocupar todo su ancho: ese ancho es su largo.
//   inicio           solo en 'mover': dónde parte el 0 de la regla respecto del
//                    borde del objeto, en cm (negativo: a la izquierda)

// Marcas de mm, medio cm y cm, con el número de cada cm. Empieza en x = 0.
function Escala({ cm }) {
  const marcas = [];
  for (let k = 0; k <= cm * 10; k++) {
    const x = (k * CM) / 10;
    const alto = k % 10 === 0 ? 22 : k % 5 === 0 ? 14 : 8;
    marcas.push(<line key={k} x1={x} y1={0} x2={x} y2={alto} className={k % 10 === 0 ? 'escala__cm' : 'escala__mm'} />);
    if (k % 10 === 0) {
      marcas.push(
        <text key={`n${k}`} x={x} y={44} className="escala__numero">
          {k / 10}
        </text>,
      );
    }
  }
  return marcas;
}

function Botones({ menos, mas, onMover, bloqueado }) {
  return (
    <div className="herramienta__controles">
      <button type="button" className="boton boton--suave" onClick={() => onMover(-1)} disabled={bloqueado}>
        ← {menos}
      </button>
      <button type="button" className="boton boton--suave" onClick={() => onMover(1)} disabled={bloqueado}>
        {mas} →
      </button>
    </div>
  );
}

// Regla que se mueve sobre un objeto fijo.
function Regla({ visual, bloqueado, onResponder }) {
  const { largo, objeto, inicio = 0 } = visual;
  const bordeObjeto = 2.5; // cm desde la izquierda del dibujo
  const ancho = Math.max(largo + 3.5, bordeObjeto + objeto.largo + 1);
  const mover = (cm) => setPosicion(limitar(Math.round(cm * 2) / 2, 0.4, ancho - largo - 0.4));

  const [posicion, setPosicion] = useState(limitar(bordeObjeto + inicio, 0.4, ancho - largo - 0.4));
  const [medida, setMedida] = useState('');
  const svgRef = useRef(null);
  const agarre = useRef(0);
  const arrastre = useArrastre(
    svgRef,
    ({ x }, empieza) => {
      if (empieza) agarre.current = x / CM - posicion;
      mover(x / CM - agarre.current);
    },
    !bloqueado,
  );

  function comprobar(evento) {
    evento.preventDefault();
    const numero = Number.parseFloat(medida.replace(',', '.'));
    if (Number.isFinite(numero)) onResponder(String(numero));
  }

  return (
    <>
      <svg ref={svgRef} viewBox={`0 0 ${ancho * CM} 160`} className="herramienta__dibujo" aria-hidden="true">
        <image href={`${import.meta.env.BASE_URL}imagenes/${objeto.src}`} x={bordeObjeto * CM} y={20} width={objeto.largo * CM} height={56} preserveAspectRatio="xMinYMax meet" />
        <g transform={`translate(${posicion * CM} 80)`} className={bloqueado ? undefined : 'movible'} {...arrastre}>
          <rect x={-14} y={0} width={largo * CM + 28} height={64} rx={6} className="regla" />
          <Escala cm={largo} />
        </g>
      </svg>
      <Botones menos="Mover regla" mas="Mover regla" onMover={(paso) => mover(posicion + paso / 2)} bloqueado={bloqueado} />
      <form className="herramienta__respuesta" onSubmit={comprobar}>
        <label htmlFor="medida">{objeto.nombre} mide</label>
        <input id="medida" className="campo" inputMode="decimal" autoComplete="off" value={medida} onChange={(e) => setMedida(e.target.value)} disabled={bloqueado} />
        <span>cm</span>
        <button type="submit" className="boton boton--principal" disabled={bloqueado || !medida.trim()}>
          Comprobar
        </button>
      </form>
    </>
  );
}

// Huincha que sale de su caja y se estira de 1 en 1 cm.
function Huincha({ visual, bloqueado, onResponder }) {
  const { largo: maximo } = visual;
  const cero = 100; // donde sale la cinta de la caja
  const sobra = 18; // cinta después de la última marca, para que la punta no tape el número
  const [estirado, setEstirado] = useState(2);
  const svgRef = useRef(null);
  const estirar = (cm) => setEstirado(limitar(Math.round(cm), 1, maximo));
  const arrastre = useArrastre(svgRef, ({ x }) => estirar((x - cero) / CM), !bloqueado);
  const fin = cero + estirado * CM + sobra;

  return (
    <>
      <svg ref={svgRef} viewBox={`0 0 ${cero + maximo * CM + sobra + 50} 170`} className="herramienta__dibujo" aria-hidden="true">
        <rect x={cero} y={60} width={estirado * CM + sobra} height={46} className="huincha__cinta" />
        <g transform={`translate(${cero} 62)`}>
          <Escala cm={estirado} />
        </g>
        <rect x={10} y={34} width={cero - 6} height={100} rx={18} className="huincha__caja" />
        <circle cx={57} cy={84} r={22} className="huincha__centro" />
        <rect x={fin} y={52} width={10} height={62} rx={2} className="huincha__punta" />
        <g className={bloqueado ? undefined : 'movible'} {...arrastre}>
          <rect x={fin - 40} y={26} width={90} height={124} fill="transparent" />
          <circle cx={fin + 5} cy={136} r={16} className="huincha__tirador" />
        </g>
      </svg>
      <Botones menos="Recoger 1 cm" mas="Estirar 1 cm" onMover={(paso) => estirar(estirado + paso)} bloqueado={bloqueado} />
      <button type="button" className="boton boton--principal" onClick={() => onResponder(String(estirado))} disabled={bloqueado}>
        Comprobar
      </button>
    </>
  );
}

export default function Medir(props) {
  return props.visual.modo === 'estirar' ? <Huincha {...props} /> : <Regla {...props} />;
}
