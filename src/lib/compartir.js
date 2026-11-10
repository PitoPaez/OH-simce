// Enlace para compartir la configuración del curso con los estudiantes.
//
// Sin servidor, la configuración viaja dentro del enlace mismo, después del
// «#», así que nunca sale del navegador hacia un servidor. Se comprime para
// que el enlace no sea tan largo.
//   z...  JSON comprimido (deflate) en base64 para URL
//   j...  JSON sin comprimir, si el navegador no sabe comprimir

function aBase64(bytes) {
  let s = '';
  bytes.forEach((b) => {
    s += String.fromCharCode(b);
  });
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function deBase64(texto) {
  const s = atob(texto.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(s, (c) => c.charCodeAt(0));
}

async function pasarPor(bytes, transformacion) {
  const flujo = new Blob([bytes]).stream().pipeThrough(transformacion);
  return new Uint8Array(await new Response(flujo).arrayBuffer());
}

export async function codificar(datos) {
  const bytes = new TextEncoder().encode(JSON.stringify(datos));
  if (typeof CompressionStream === 'function') {
    return `z${aBase64(await pasarPor(bytes, new CompressionStream('deflate-raw')))}`;
  }
  return `j${aBase64(bytes)}`;
}

export async function decodificar(codigo) {
  const tipo = codigo[0];
  const bytes = deBase64(codigo.slice(1));
  const texto = new TextDecoder().decode(tipo === 'z' ? await pasarPor(bytes, new DecompressionStream('deflate-raw')) : bytes);
  return JSON.parse(texto);
}

// Lo que viaja en el enlace: solo lo que necesitan los estudiantes.
export function datosParaCompartir(config) {
  const { curso, desactivados, propios, modificados, actualizado } = config;
  return { v: 1, curso, desactivados, propios, modificados, actualizado };
}

export function enlaceDelCurso(codigo) {
  const { origin, pathname } = window.location;
  return `${origin}${pathname}#/unirse/${codigo}`;
}
