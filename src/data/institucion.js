// Identidad, ubicación, redes y recursos compartidos del instituto.
export const institucion = {
  nombre: 'Instituto Tecnológico Santa Cruz',
  sitioWeb: 'https://www.itsc.edu.bo/',
  portal: 'https://tecnologico-santa-cruz.github.io/',
  correo: 'institutotecnologicosantacruz@gmail.com',
  direccion: 'Av. Paragua, entre 3er Anillo interno y externo',
  ciudad: 'Santa Cruz de la Sierra, Bolivia',
  mapa: 'https://www.google.com/maps?ll=-17.769422,-63.156704&z=16&t=m&hl=es-419&gl=BO&mapclient=embed&cid=1259026861083397859',
  logo: 'assets/logo-itsc-verde.svg',
  fotoPortada: 'assets/santa-cruz.jpg',
  qr: {
    vector: 'assets/qr-itsc.svg',
    descarga: 'assets/qr-itsc.png',
    nombreDescarga: 'QR-Tecnologico-Santa-Cruz.png',
  },
  redes: [
    { id: 'facebook', nombre: 'Facebook', descripcion: 'Noticias y comunidad', url: 'https://www.facebook.com/Tecnoitsc' },
    { id: 'tiktok', nombre: 'TikTok', descripcion: '@itsc_rm2312', url: 'https://www.tiktok.com/@itsc_rm2312' },
    // Una URL vacía mantiene oculta la red en todas las secciones.
    { id: 'instagram', nombre: 'Instagram', descripcion: 'Conecta con nuestra comunidad.', url: '' },
    { id: 'linkedin', nombre: 'LinkedIn', descripcion: 'Conecta con nuestra comunidad.', url: '' },
  ],
};
