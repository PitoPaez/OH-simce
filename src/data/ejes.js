// Los cinco ejes de Matemática de 4° básico (Bases Curriculares) que evalúa
// el SIMCE. Cada uno tiene un color de "papel lustre" definido en index.css.
export const EJES = [
  { id: 'numeros', nombre: 'Números y operaciones', descripcion: 'Números hasta 10\u00a0000, las cuatro operaciones, dinero, fracciones y decimales' },
  { id: 'patrones', nombre: 'Patrones y álgebra', descripcion: 'Secuencias, ecuaciones e inecuaciones con la balanza' },
  { id: 'geometria', nombre: 'Geometría', descripcion: 'Mapas, traslaciones, cuerpos, simetría y ángulos' },
  { id: 'medicion', nombre: 'Medición', descripcion: 'La hora, metros y centímetros, perímetro, área y volumen' },
  { id: 'datos', nombre: 'Datos y probabilidades', descripcion: 'Tablas, gráficos, pictogramas y qué tan probable es algo' },
];

export const colorEje = (id) => (id ? `var(--eje-${id})` : 'var(--eje-mixta)');
