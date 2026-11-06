import { EJES, colorEje } from '../../data/ejes.js';
import { EJERCICIOS, TEMAS } from '../../data/index.js';
import Cuadritos from '../ui/Cuadritos.jsx';
import IconoEje from '../ui/IconoEje.jsx';

export default function Eje({ ejeId, progreso, ir }) {
  const eje = EJES.find((e) => e.id === ejeId);
  const temas = TEMAS.filter((t) => t.eje === ejeId);

  return (
    <main className="pagina eje" style={{ '--eje': colorEje(ejeId) }}>
      <nav className="barra">
        <button type="button" className="boton boton--texto" onClick={() => ir('/')}>
          Inicio
        </button>
      </nav>
      <header className="eje-encabezado">
        <span className="indice-papel indice-papel--grande" aria-hidden="true">
          <IconoEje eje={ejeId} />
        </span>
        <div>
          <h1>{eje.nombre}</h1>
          <p className="inicio-intro">Elige un tema. La primera vez verás un ejemplo resuelto antes de practicar.</p>
        </div>
      </header>

      <ul className="temas">
        {temas.map((tema) => {
          const ejercicios = EJERCICIOS.filter((e) => e.tema === tema.id);
          const logrados = ejercicios.filter((e) => progreso.ejercicios[e.id] === 'solo').length;
          return (
            <li key={tema.id} className="tema">
              <button type="button" className="tema-principal" onClick={() => ir(`/tema/${tema.id}`)}>
                <span className="tema-nombre">{tema.nombre}</span>
                <span className="tema-desc">{tema.descripcion}</span>
                <span className="tema-progreso">
                  <Cuadritos
                    estados={ejercicios.map((e) => {
                      const estado = progreso.ejercicios[e.id];
                      return estado === 'solo' ? 'solo' : estado ? 'ayuda' : 'vacio';
                    })}
                    etiqueta={`${logrados} de ${ejercicios.length} logrados`}
                  />
                  <span className="indice-cuenta">
                    {logrados} de {ejercicios.length}
                  </span>
                </span>
              </button>
              <div className="tema-secundario">
                <span className="tema-oa" title="Objetivos de Aprendizaje de las Bases Curriculares">
                  OA {tema.oa.join(', ')}
                </span>
                <button type="button" className="boton boton--texto" onClick={() => ir(`/tema/${tema.id}/ejemplo`)}>
                  Ver el ejemplo
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
