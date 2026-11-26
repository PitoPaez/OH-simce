// Ruta de las imágenes de los ejercicios (carpeta public/img/datos).
export const imagenDatos = (nombre) => `${import.meta.env.BASE_URL}img/datos/${nombre}.png`;

// Sellos de correcto / incorrecto (carpeta public/img/sellos).
export const imagenSello = (tipo) => `${import.meta.env.BASE_URL}img/sellos/sello-${tipo}.png`;
