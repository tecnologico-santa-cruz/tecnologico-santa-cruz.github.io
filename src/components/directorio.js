import { element, icon, setLink } from '../utils/dom.js?v=20261101';
import { contactLabel, normalize, safeUrl, whatsappUrl } from '../utils/urls.js?v=20261101';

/** Datos derivados: los contactos y redes nunca se duplican aquí. */
export function buildDirectory(institucion, contactos, accesos = []) {
  const social = institucion.redes.filter(red => safeUrl(red.url)).map(red => ({
    titulo: red.nombre,
    descripcion: red.descripcion,
    icono: red.id,
    categoria: 'Redes sociales',
    url: red.url,
  }));
  const whatsapp = contactos.filter(contacto => whatsappUrl(contacto)).map(contacto => ({
    titulo: contacto.nombre,
    descripcion: contactLabel(contacto),
    icono: 'whatsapp',
    categoria: 'Atención',
    url: whatsappUrl(contacto),
  }));
  const website = safeUrl(institucion.sitioWeb);
  const institution = [
    { titulo: 'Sitio institucional', descripcion: website ? new URL(website).hostname : '', icono: 'institute', categoria: 'Institución', url: website },
    { titulo: 'Cómo llegar', descripcion: institucion.direccion, icono: 'map', categoria: 'Institución', url: institucion.mapa },
    { titulo: 'Correo electrónico', descripcion: institucion.correo, icono: 'mail', categoria: 'Atención', url: institucion.correo ? `mailto:${institucion.correo}` : '' },
  ];
  // Facebook y TikTok conservan su posición inicial; las redes opcionales van al final.
  return [
    ...social.filter(red => ['facebook', 'tiktok'].includes(red.icono)),
    ...whatsapp,
    ...institution,
    ...social.filter(red => !['facebook', 'tiktok'].includes(red.icono)),
    ...accesos,
  ].filter(row => safeUrl(row.url));
}

export function initDirectorio(institucion, contactos, accesos) {
  const grid = document.getElementById('link-grid');
  const query = document.getElementById('search');
  if (!grid || !query) return;
  const rows = buildDirectory(institucion, contactos, accesos);
  let filter = 'Todos';

  function render() {
    const search = normalize(query.value.trim());
    const visible = rows.filter(row => (filter === 'Todos' || row.categoria === filter)
      && normalize(`${row.titulo} ${row.descripcion} ${row.categoria}`).includes(search));
    grid.replaceChildren();
    visible.forEach(row => {
      const card = element('a', `link-card brand-${row.icono}`);
      setLink(card, row.url);
      const top = element('div', 'card-top');
      const symbol = element('span', 'icon-box');
      if (row.icono === 'institute' && safeUrl(institucion.logo, true)) {
        const image = element('img');
        image.src = institucion.logo;
        image.alt = '';
        image.width = 64;
        image.height = 64;
        symbol.append(image);
      } else {
        symbol.append(icon(row.icono));
      }
      top.append(symbol, element('span', 'card-category', row.categoria));
      card.append(top, element('strong', '', row.titulo), element('p', '', row.descripcion), element('span', 'card-arrow', '↗'));
      grid.append(card);
    });
    const empty = document.getElementById('empty');
    const count = document.getElementById('results');
    if (empty) empty.hidden = visible.length !== 0;
    if (count) count.textContent = `${visible.length} accesos disponibles`;
  }

  function setFilter(value) {
    filter = value;
    document.querySelectorAll('[data-filter]').forEach(button => {
      const active = button.dataset.filter === filter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    render();
  }

  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => setFilter(button.dataset.filter));
  });
  document.querySelectorAll('[data-filter-link]').forEach(anchor => {
    anchor.addEventListener('click', () => {
      query.value = '';
      setFilter(anchor.dataset.filterLink);
    });
  });
  query.addEventListener('input', render);
  render();
}
