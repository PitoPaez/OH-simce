import { EJES } from '../../data/ejes.js';

// Para docentes y familias: cómo está pensada la práctica y qué Objetivos de
// Aprendizaje cubre.
export default function Informacion({ ir, catalogo }) {
  const { temas: TEMAS, activos: EJERCICIOS } = catalogo;
  return (
    <>
      <p className="inicio-intro">
        OH Simce es una práctica de Matemática para 4° básico basada en el programa de estudio del Mineduc y en el análisis de errores frecuentes del SIMCE que
        publicó la Agencia de Calidad de la Educación.
      </p>

      <section className="docentes-seccion">
        <h2>Cómo funciona un ejercicio</h2>
        <ul className="docentes-lista">
          <li>
            <strong>Primero un ejemplo resuelto.</strong> Cada tema parte con un ejemplo paso a paso. Quien ya sabe, puede saltarlo.
          </li>
          <li>
            <strong>Dibujos y material en pantalla.</strong> Bloques base 10, balanzas, rectas, relojes y figuras para pintar, siguiendo el método COPISI
            (concreto, pictórico, simbólico).
          </li>
          <li>
            <strong>Ayuda en 4 pasos.</strong> Entender, planificar, hacer y comprobar (OA b del programa). Se entrega de a una, de la más general a la más
            concreta.
          </li>
          <li>
            <strong>Retroalimentación según el error.</strong> Cada alternativa incorrecta corresponde a un error frecuente descrito por la Agencia de Calidad.
            El mensaje hace una pregunta para que el estudiante encuentre su error, en vez de solo marcarlo.
          </li>
          <li>
            <strong>¿Quién tiene razón?</strong> Algunos ejercicios muestran a compañeros con razonamientos distintos, para practicar la habilidad de argumentar y
            comunicar.
          </li>
          <li>
            <strong>Sin cronómetro.</strong> La rapidez no es la meta. Las preguntas que costaron quedan en «Repasar», para practicarlas otro día.
          </li>
          <li>
            <strong>Dejar para después.</strong> Si una pregunta cuesta, se puede dejar para el final, en la práctica y en el ensayo, como se hace en la prueba.
            Así nadie se queda pegado. Las que quedan sin hacer pasan a «Repasar».
          </li>
        </ul>
        <p>
          Cada ejercicio se puede abrir directamente con la dirección <code>#/ejercicio/</code> y su código, por ejemplo <code>#/ejercicio/vp-alicia</code>, para
          proyectarlo y discutirlo en clases.
        </p>
      </section>

      <section className="docentes-seccion">
        <h2>Objetivos de Aprendizaje cubiertos</h2>
        <table className="v-tabla docentes-tabla">
          <thead>
            <tr>
              <th scope="col">Eje</th>
              <th scope="col">Tema</th>
              <th scope="col">OA</th>
              <th scope="col">Ejercicios activos</th>
            </tr>
          </thead>
          <tbody>
            {TEMAS.map((t) => (
              <tr key={t.id}>
                <td>{EJES.find((e) => e.id === t.eje).nombre}</td>
                <td>
                  <button type="button" className="boton--enlace" onClick={() => ir(`/tema/${t.id}`)}>
                    {t.nombre}
                  </button>
                </td>
                <td>{t.oa.join(', ')}</td>
                <td>{EJERCICIOS.filter((e) => e.tema === t.id).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="docentes-seccion">
        <h2>Privacidad</h2>
        <p>
          La página no tiene servidor: el progreso se guarda solo en el navegador de cada estudiante. Para que el docente vea los resultados, cada estudiante
          descarga un archivo y se lo entrega. Se pide solo el nombre y la inicial del apellido.
        </p>
      </section>
    </>
  );
}
