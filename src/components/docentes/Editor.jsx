import { Component, useMemo, useRef, useState } from 'react';
import { EJES, colorEje } from '../../data/ejes.js';
import { f, leerNumero } from '../../lib/formato.js';
import { nuevoId } from '../../lib/progreso.js';
import { arreglarMiles, NOMBRE_TIPO, problemasEjercicio } from '../../lib/validar.js';
import Pregunta from '../pantallas/Pregunta.jsx';

// Campos que el formulario edita directamente. Lo demás (propio de cada tipo
// interactivo) se edita como JSON en «Campos avanzados».
const COMUNES = ['id', 'tema', 'eje', 'tipo', 'enunciado', 'visual', 'pistas', 'solucion', 'comprobar', 'explicar', 'origen'];
const DEL_FORMULARIO = {
  alternativas: ['opciones', 'ordenFijo', 'columnas'],
  numero: ['respuesta', 'unidad', 'antes', 'errores', 'etiqueta'],
};

function plantilla(tipo, tema) {
  const base = {
    tema,
    tipo,
    enunciado: '',
    pistas: { entender: '', planificar: '', hacer: '' },
    solucion: { texto: '' },
    comprobar: '',
    origen: 'Creado por docente',
  };
  if (tipo === 'numero') return { ...base, respuesta: undefined, unidad: '', errores: {} };
  return {
    ...base,
    opciones: [
      { texto: '', correcta: true },
      { texto: '', error: '' },
      { texto: '', error: '' },
      { texto: '', error: '' },
    ],
  };
}

function sinEje(e) {
  const copia = structuredClone(e);
  delete copia.eje;
  return copia;
}

// Limpia el borrador para guardarlo: miles con espacio fijo, sin campos vacíos.
function limpiar(valor) {
  if (typeof valor === 'string') return arreglarMiles(valor.trim().replace(/[ \t]{2,}/g, ' '));
  if (Array.isArray(valor)) return valor.map(limpiar);
  if (valor && typeof valor === 'object') {
    return Object.fromEntries(
      Object.entries(valor)
        .map(([k, v]) => [k, limpiar(v)])
        .filter(([k, v]) => v !== '' && v !== undefined && !(k === 'errores' && v && !Object.keys(v).length)),
    );
  }
  return valor;
}

// Si el dibujo o un campo avanzado está mal escrito, la vista previa no debe
// botar toda la página.
class Resguardo extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidUpdate(anteriores) {
    if (anteriores.clave !== this.props.clave && this.state.error) this.setState({ error: null });
  }

  render() {
    if (this.state.error) return <p className="gestion-aviso">La vista previa no se pudo dibujar. Revisa el dibujo o los campos avanzados.</p>;
    return this.props.children;
  }
}

function Campo({ etiqueta, ayuda, children, id }) {
  return (
    <div className="editor-campo">
      <label htmlFor={id}>{etiqueta}</label>
      {ayuda && <p className="editor-ayuda">{ayuda}</p>}
      {children}
    </div>
  );
}

function AreaTexto({ id, valor, onCambiar, filas = 2, ...resto }) {
  return <textarea id={id} className="campo" rows={filas} value={valor ?? ''} onChange={(ev) => onCambiar(ev.target.value)} {...resto} />;
}

// Enunciado con botones para marcar datos, pregunta y negritas.
function Enunciado({ valor, onCambiar }) {
  const ref = useRef(null);
  function envolver(abre, cierra) {
    const el = ref.current;
    const { selectionStart: a, selectionEnd: b } = el;
    const elegido = valor.slice(a, b) || 'texto';
    onCambiar(`${valor.slice(0, a)}${abre}${elegido}${cierra}${valor.slice(b)}`);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(a + abre.length, a + abre.length + elegido.length);
    });
  }
  return (
    <Campo
      id="ed-enunciado"
      etiqueta="Enunciado"
      ayuda="Selecciona una parte del texto y márcala. Los datos se subrayan y la pregunta se destaca en amarillo cuando el estudiante pide la ayuda «Entender»."
    >
      <div className="editor-marcas" role="toolbar" aria-label="Marcas del enunciado">
        <button type="button" className="boton boton--suave boton--chico" onClick={() => envolver('[[', ']]')}>
          <span className="marca-dato">Dato</span>
        </button>
        <button type="button" className="boton boton--suave boton--chico" onClick={() => envolver('{{', '}}')}>
          <span className="editor-muestra-pregunta">Pregunta</span>
        </button>
        <button type="button" className="boton boton--suave boton--chico" onClick={() => envolver('**', '**')}>
          <strong>Negrita</strong>
        </button>
      </div>
      <AreaTexto id="ed-enunciado" valor={valor} onCambiar={onCambiar} filas={4} ref={ref} />
    </Campo>
  );
}

function CamposAlternativas({ borrador, cambiar }) {
  const opciones = borrador.opciones;
  const cambiarOpcion = (i, cambio) => cambiar({ opciones: opciones.map((o, k) => (k === i ? { ...o, ...cambio } : o)) });
  const marcarCorrecta = (i) =>
    cambiar({
      opciones: opciones.map((o, k) => {
        const { correcta, error, ...resto } = o;
        void correcta;
        return k === i ? { ...resto, correcta: true } : { ...resto, error: error ?? '' };
      }),
    });
  return (
    <fieldset className="editor-grupo">
      <legend>Alternativas</legend>
      <p className="editor-ayuda">
        Marca la correcta. En cada incorrecta, escribe qué error lleva a esa respuesta y una pregunta para que el estudiante lo descubra.
      </p>
      {opciones.map((o, i) => (
        <div key={i} className={o.correcta ? 'editor-opcion editor-opcion--correcta' : 'editor-opcion'}>
          <label className="editor-opcion-correcta">
            <input type="radio" name="correcta" checked={Boolean(o.correcta)} onChange={() => marcarCorrecta(i)} />
            {o.correcta ? 'Correcta' : 'Marcar como correcta'}
          </label>
          <input
            className="campo"
            aria-label={`Texto de la alternativa ${i + 1}`}
            placeholder={`Alternativa ${i + 1}`}
            value={o.texto}
            onChange={(ev) => cambiarOpcion(i, { texto: ev.target.value })}
          />
          {!o.correcta && (
            <AreaTexto
              valor={o.error}
              onCambiar={(v) => cambiarOpcion(i, { error: v })}
              aria-label={`Mensaje de error de la alternativa ${i + 1}`}
              placeholder="¿Qué error lleva a esta respuesta? Termina con una pregunta guía."
            />
          )}
        </div>
      ))}
      <label className="editor-check">
        <input type="checkbox" checked={Boolean(borrador.ordenFijo)} onChange={(ev) => cambiar({ ordenFijo: ev.target.checked || undefined })} />
        Mostrar las alternativas en este orden (por ejemplo, si son números de menor a mayor)
      </label>
    </fieldset>
  );
}

function CamposNumero({ borrador, cambiar }) {
  const [respuesta, setRespuesta] = useState(borrador.respuesta === undefined ? '' : f(borrador.respuesta));
  const errores = Object.entries(borrador.errores ?? {}).filter(([k]) => k !== 'otro');
  const [nuevo, setNuevo] = useState('');
  const cambiarErrores = (lista, otro = borrador.errores?.otro) => cambiar({ errores: { ...Object.fromEntries(lista), ...(otro !== undefined ? { otro } : {}) } });
  const nuevoValor = leerNumero(nuevo);
  return (
    <fieldset className="editor-grupo">
      <legend>Respuesta numérica</legend>
      <div className="editor-fila">
        <Campo id="ed-respuesta" etiqueta="Respuesta correcta">
          <input
            id="ed-respuesta"
            className="campo"
            inputMode="decimal"
            value={respuesta}
            onChange={(ev) => {
              setRespuesta(ev.target.value);
              cambiar({ respuesta: leerNumero(ev.target.value) ?? undefined });
            }}
          />
        </Campo>
        <Campo id="ed-unidad" etiqueta="Unidad (opcional)">
          <input id="ed-unidad" className="campo" value={borrador.unidad ?? ''} placeholder="cm, kg, pesos…" onChange={(ev) => cambiar({ unidad: ev.target.value })} />
        </Campo>
      </div>
      <p className="editor-ayuda">
        Respuestas equivocadas frecuentes y qué error hay detrás. <code>{'{valor}'}</code> se reemplaza por lo que respondió el estudiante.
      </p>
      {errores.map(([valor, mensaje]) => (
        <div key={valor} className="editor-error-numero">
          <span className="editor-error-valor">{f(Number(valor))}</span>
          <AreaTexto valor={mensaje} aria-label={`Mensaje si responde ${valor}`} onCambiar={(v) => cambiarErrores(errores.map(([k, m]) => [k, k === valor ? v : m]))} />
          <button type="button" className="boton boton--texto" onClick={() => cambiarErrores(errores.filter(([k]) => k !== valor))}>
            Quitar
          </button>
        </div>
      ))}
      <div className="editor-fila editor-fila--abajo">
        <Campo id="ed-nuevo-error" etiqueta="Agregar respuesta equivocada">
          <input id="ed-nuevo-error" className="campo" inputMode="decimal" value={nuevo} onChange={(ev) => setNuevo(ev.target.value)} />
        </Campo>
        <button
          type="button"
          className="boton boton--suave"
          disabled={nuevoValor === null || errores.some(([k]) => k === String(nuevoValor))}
          onClick={() => {
            cambiarErrores([...errores, [String(nuevoValor), '']]);
            setNuevo('');
          }}
        >
          Agregar
        </button>
      </div>
      <Campo id="ed-otro" etiqueta="Mensaje para cualquier otra respuesta (opcional)">
        <AreaTexto id="ed-otro" valor={borrador.errores?.otro} onCambiar={(v) => cambiarErrores(errores, v)} />
      </Campo>
    </fieldset>
  );
}

function CamposAvanzados({ borrador, setBorrador, abierto }) {
  const delFormulario = DEL_FORMULARIO[borrador.tipo] ?? [];
  const propios = Object.fromEntries(Object.entries(borrador).filter(([k]) => !COMUNES.includes(k) && !delFormulario.includes(k)));
  const [texto, setTexto] = useState(() => JSON.stringify(propios, null, 2));
  const [dibujo, setDibujo] = useState(() => (borrador.visual ? JSON.stringify(borrador.visual, null, 2) : ''));
  const [error, setError] = useState(null);

  function aplicar(nuevoTexto, nuevoDibujo) {
    try {
      const campos = JSON.parse(nuevoTexto || '{}');
      const visual = nuevoDibujo.trim() ? JSON.parse(nuevoDibujo) : undefined;
      const comunes = Object.fromEntries(Object.entries(borrador).filter(([k]) => (COMUNES.includes(k) || delFormulario.includes(k)) && k !== 'visual'));
      setBorrador({ ...comunes, ...campos, ...(visual ? { visual } : {}) });
      setError(null);
    } catch {
      setError('El texto no es JSON válido. Revisa comas, comillas y llaves.');
    }
  }

  return (
    <details className="editor-grupo editor-avanzado" open={abierto}>
      <summary>Campos avanzados (dibujo y datos del tipo {NOMBRE_TIPO[borrador.tipo] ?? borrador.tipo})</summary>
      <p className="editor-ayuda">
        Para docentes que conocen el formato de los ejercicios (está explicado en <code>docs/FUNDAMENTOS.md</code>). Lo más simple es duplicar un ejercicio parecido y
        cambiar los números.
      </p>
      <Campo id="ed-visual" etiqueta="Dibujo (visual)">
        <AreaTexto
          id="ed-visual"
          className="campo campo--codigo"
          valor={dibujo}
          filas={6}
          spellCheck={false}
          onCambiar={(v) => {
            setDibujo(v);
            aplicar(texto, v);
          }}
        />
      </Campo>
      <Campo id="ed-propios" etiqueta="Datos del tipo">
        <AreaTexto
          id="ed-propios"
          className="campo campo--codigo"
          valor={texto}
          filas={8}
          spellCheck={false}
          onCambiar={(v) => {
            setTexto(v);
            aplicar(v, dibujo);
          }}
        />
      </Campo>
      {error && <p className="editor-error">{error}</p>}
    </details>
  );
}

// Crear, editar o duplicar un ejercicio, con vista previa tal como la verá el
// estudiante y la misma revisión que `npm run validar`.
export default function Editor({ modo, id, ir, catalogo, cambiarCurso }) {
  const original = id ? catalogo.porId.get(id) : null;
  const origenOriginal = id ? catalogo.origen(id) : null;
  const [borrador, setBorrador] = useState(() => {
    if (modo === 'nuevo' || !original) return plantilla('alternativas', catalogo.temas[0].id);
    const copia = sinEje(original);
    if (modo === 'duplicar') {
      delete copia.id;
      copia.origen = `Creado por docente, a partir de ${original.id}`;
    }
    return copia;
  });

  const cambiar = (cambio) => setBorrador((prev) => ({ ...prev, ...cambio }));
  const tipoSimple = borrador.tipo === 'alternativas' || borrador.tipo === 'numero';
  const limpio = useMemo(() => limpiar({ ...borrador, id: borrador.id ?? 'nuevo' }), [borrador]);
  const problemas = problemasEjercicio(limpio, catalogo.temas);
  // En la vista previa, las alternativas vacías se muestran con un nombre provisorio.
  const vista = {
    ...limpio,
    eje: catalogo.temas.find((t) => t.id === limpio.tema)?.eje,
    ...(limpio.opciones ? { opciones: limpio.opciones.map((o, i) => ({ ...o, texto: o.texto ?? `(alternativa ${i + 1})` })) } : {}),
  };
  const claveVista = JSON.stringify(limpio);

  if (id && !original) {
    return (
      <p className="vacio">
        No existe el ejercicio <code>{id}</code>. <a href="#/docentes/ejercicios">Volver a los ejercicios</a>
      </p>
    );
  }

  function guardar() {
    const tema = catalogo.temas.find((t) => t.id === limpio.tema);
    if (modo === 'editar' && origenOriginal !== 'propio') {
      cambiarCurso((prev) => ({ ...prev, modificados: { ...prev.modificados, [id]: { ...limpio, id } } }));
    } else if (modo === 'editar') {
      cambiarCurso((prev) => ({ ...prev, propios: prev.propios.map((e) => (e.id === id ? { ...limpio, id } : e)) }));
    } else {
      const nuevo = { ...limpio, id: nuevoId(`doc-${tema.id}`).slice(0, tema.id.length + 10) };
      cambiarCurso((prev) => ({ ...prev, propios: [...prev.propios, nuevo] }));
    }
    ir('/docentes/ejercicios');
  }

  const titulo = modo === 'nuevo' ? 'Crear un ejercicio' : modo === 'duplicar' ? `Duplicar ${id}` : `Editar ${id}`;

  return (
    <div className="editor">
      <div className="editor-formulario">
        <button type="button" className="boton boton--texto" onClick={() => ir('/docentes/ejercicios')}>
          ← Volver a los ejercicios
        </button>
        <h2>{titulo}</h2>
        {modo === 'editar' && origenOriginal !== 'propio' && (
          <p className="gestion-nota">Es un ejercicio de la página. Tus cambios se guardan aparte y siempre puedes volver al original.</p>
        )}

        <div className="editor-fila">
          <Campo id="ed-tema" etiqueta="Tema">
            <select id="ed-tema" className="campo" value={borrador.tema} onChange={(ev) => cambiar({ tema: ev.target.value })}>
              {EJES.map((eje) => (
                <optgroup key={eje.id} label={eje.nombre}>
                  {catalogo.temas
                    .filter((t) => t.eje === eje.id)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre} (OA {t.oa.join(', ')})
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </Campo>
          <Campo id="ed-tipo" etiqueta="Tipo de respuesta">
            {modo === 'nuevo' ? (
              <select
                id="ed-tipo"
                className="campo"
                value={borrador.tipo}
                onChange={(ev) => setBorrador((prev) => ({ ...plantilla(ev.target.value, prev.tema), enunciado: prev.enunciado, pistas: prev.pistas, solucion: prev.solucion, comprobar: prev.comprobar }))}
              >
                <option value="alternativas">Alternativas (A, B, C, D)</option>
                <option value="numero">Respuesta numérica</option>
              </select>
            ) : (
              <p id="ed-tipo" className="editor-fijo">
                {NOMBRE_TIPO[borrador.tipo] ?? borrador.tipo}
              </p>
            )}
          </Campo>
        </div>

        <Enunciado valor={borrador.enunciado} onCambiar={(v) => cambiar({ enunciado: v })} />

        {borrador.tipo === 'alternativas' && <CamposAlternativas borrador={borrador} cambiar={cambiar} />}
        {borrador.tipo === 'numero' && <CamposNumero borrador={borrador} cambiar={cambiar} />}

        <fieldset className="editor-grupo">
          <legend>Ayuda en 4 pasos</legend>
          <p className="editor-ayuda">Se entrega de a una, de la más general a la más concreta. Ninguna debe dar la respuesta directamente, salvo «Hacer».</p>
          <Campo id="ed-entender" etiqueta="1. Entender (opcional)" ayuda="Si lo dejas vacío, se destacan la pregunta y los datos marcados en el enunciado.">
            <AreaTexto id="ed-entender" valor={borrador.pistas?.entender} onCambiar={(v) => cambiar({ pistas: { ...borrador.pistas, entender: v } })} />
          </Campo>
          <Campo id="ed-planificar" etiqueta="2. Planificar" ayuda="¿Qué operación o estrategia sirve? Sin hacer el cálculo.">
            <AreaTexto id="ed-planificar" valor={borrador.pistas?.planificar} onCambiar={(v) => cambiar({ pistas: { ...borrador.pistas, planificar: v } })} />
          </Campo>
          <Campo id="ed-hacer" etiqueta="3. Hacer" ayuda="El cálculo paso a paso.">
            <AreaTexto id="ed-hacer" valor={borrador.pistas?.hacer} onCambiar={(v) => cambiar({ pistas: { ...borrador.pistas, hacer: v } })} />
          </Campo>
          <Campo id="ed-solucion" etiqueta="Solución" ayuda="Se muestra al acertar o al pedir «Ver cómo se resuelve».">
            <AreaTexto id="ed-solucion" valor={borrador.solucion?.texto} onCambiar={(v) => cambiar({ solucion: { ...borrador.solucion, texto: v } })} />
          </Campo>
          <Campo id="ed-comprobar" etiqueta="4. Comprobar" ayuda="Cómo revisar que la respuesta tiene sentido, por ejemplo con la operación inversa.">
            <AreaTexto id="ed-comprobar" valor={borrador.comprobar} onCambiar={(v) => cambiar({ comprobar: v })} />
          </Campo>
        </fieldset>

        <Campo id="ed-origen" etiqueta="Origen" ayuda="De dónde viene el ejercicio (un ensayo, un libro, creado por ti).">
          <input id="ed-origen" className="campo" value={borrador.origen ?? ''} onChange={(ev) => cambiar({ origen: ev.target.value })} />
        </Campo>

        <CamposAvanzados key={tipoSimple ? 'simple' : 'avanzado'} borrador={borrador} setBorrador={setBorrador} abierto={!tipoSimple} />

        <div className="editor-guardar">
          {problemas.length > 0 ? (
            <div className="editor-problemas" role="status">
              <p>Antes de guardar, falta revisar:</p>
              <ul>
                {[...new Set(problemas)].map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="editor-listo" role="status">
              El ejercicio está completo.
            </p>
          )}
          <div className="acciones-fila">
            <button type="button" className="boton boton--principal" onClick={guardar} disabled={problemas.length > 0}>
              Guardar
            </button>
            <button type="button" className="boton boton--suave" onClick={() => ir('/docentes/ejercicios')}>
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <aside className="editor-vista" aria-label="Vista previa" style={{ '--eje': colorEje(vista.eje ?? 'numeros') }}>
        <p className="editor-vista-titulo">Así lo verá el estudiante</p>
        <div className="editor-vista-marco practica">
          <Resguardo clave={claveVista}>
            {limpio.enunciado ? (
              <Pregunta key={claveVista} ejercicio={vista} esUltima onTerminar={() => {}} onPendiente={() => {}} />
            ) : (
              <p className="editor-ayuda">Escribe el enunciado para ver la vista previa.</p>
            )}
          </Resguardo>
        </div>
      </aside>
    </div>
  );
}
