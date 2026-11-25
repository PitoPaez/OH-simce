import { useState } from 'react';

// Calendario de un mes para tocar un día. visual:
//   anio, mes   mes de 1 (enero) a 12 (diciembre)
//   hoy         día marcado como «hoy» (opcional)
// Responde el número del día, por ejemplo '21'.

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const SEMANA = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

export default function Calendario({ visual, bloqueado, onResponder }) {
  const { anio, mes, hoy } = visual;
  const [elegido, setElegido] = useState(null);
  const vacios = (new Date(anio, mes - 1, 1).getDay() + 6) % 7; // la semana parte el lunes
  const dias = Array.from({ length: new Date(anio, mes, 0).getDate() }, (_, i) => i + 1);

  return (
    <>
      <p className="calendario__titulo">
        {MESES[mes - 1]} {anio}
      </p>
      <div className="calendario">
        {SEMANA.map((dia) => (
          <abbr key={dia} title={dia} className="calendario__semana">
            {dia[0].toUpperCase()}
          </abbr>
        ))}
        {Array.from({ length: vacios }, (_, i) => (
          <span key={`v${i}`} />
        ))}
        {dias.map((dia) => (
          <button
            key={dia}
            type="button"
            className={`calendario__dia${dia === hoy ? ' calendario__dia--hoy' : ''}${dia === elegido ? ' calendario__dia--elegido' : ''}`}
            onClick={() => setElegido(dia)}
            disabled={bloqueado}
            aria-pressed={dia === elegido}
            aria-label={`${SEMANA[(vacios + dia - 1) % 7]} ${dia}${dia === hoy ? ', hoy' : ''}`}
          >
            {dia}
            {dia === hoy && <span className="calendario__hoy">hoy</span>}
          </button>
        ))}
      </div>
      <button type="button" className="boton boton--principal" onClick={() => onResponder(String(elegido))} disabled={bloqueado || !elegido}>
        Comprobar
      </button>
    </>
  );
}
