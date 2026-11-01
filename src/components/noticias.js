import { element, setLink } from '../utils/dom.js?v=20261101';
import { safeUrl } from '../utils/urls.js?v=20261101';

export function initNoticias(noticias) {
  const list = document.getElementById('news-list');
  if (!list) return;
  list.replaceChildren();

  noticias.filter(noticia => noticia.publicado === true).forEach(noticia => {
    const article = element('article', 'news-item');
    if (safeUrl(noticia.imagen, true)) {
      const image = element('img');
      image.src = noticia.imagen;
      image.alt = noticia.alt || '';
      image.loading = 'lazy';
      article.append(image);
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(noticia.fecha || '')) {
      const date = new Date(`${noticia.fecha}T12:00:00`);
      if (!Number.isNaN(date.getTime())) {
        const time = element('time', '', date.toLocaleDateString('es-BO', {
          year: 'numeric', month: 'long', day: 'numeric',
        }));
        time.dateTime = noticia.fecha;
        article.append(time);
      }
    }
    article.append(element('h3', '', noticia.titulo), element('p', '', noticia.resumen));
    if (safeUrl(noticia.enlace)) {
      const anchor = element('a', 'text-link', 'Leer publicación ↗');
      setLink(anchor, noticia.enlace);
      article.append(anchor);
    }
    list.append(article);
  });
}
