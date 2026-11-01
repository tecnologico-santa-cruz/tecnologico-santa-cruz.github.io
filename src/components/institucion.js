import { icon, setLink } from '../utils/dom.js?v=20261101';
import { safeUrl } from '../utils/urls.js?v=20261101';

export function initInstitucion(data) {
  document.querySelectorAll('[data-logo]').forEach(node => {
    if (safeUrl(data.logo, true)) {
      if (node.tagName === 'LINK') node.href = data.logo;
      else node.src = data.logo;
    }
  });

  document.querySelectorAll('[data-link]').forEach(anchor => {
    const key = anchor.dataset.link;
    const social = data.redes.find(red => red.id === key);
    const url = key === 'correo' ? `mailto:${data.correo}` : (social?.url || data[key]);
    setLink(anchor, url);
  });

  const fields = {
    'contact-email': data.correo,
    'contact-address': data.direccion,
    year: String(new Date().getFullYear()),
  };
  Object.entries(fields).forEach(([id, text]) => {
    const node = document.getElementById(id);
    if (node) node.textContent = text;
  });

  if (safeUrl(data.fotoPortada, true)) {
    const photo = new URL(data.fotoPortada, document.baseURI).href;
    document.documentElement.style.setProperty('--city-photo', `url(${JSON.stringify(photo)})`);
  }

  const socials = document.getElementById('contact-socials');
  if (socials) {
    socials.replaceChildren();
    data.redes.filter(red => safeUrl(red.url)).forEach(red => {
      const anchor = document.createElement('a');
      setLink(anchor, red.url);
      anchor.setAttribute('aria-label', red.nombre);
      anchor.append(icon(red.id));
      socials.append(anchor);
    });
  }

  document.querySelectorAll('[data-share]').forEach(anchor => {
    const text = `Conoce el ${data.nombre}: ${data.portal}`;
    setLink(anchor, `https://wa.me/?text=${encodeURIComponent(text)}`);
  });
  document.querySelectorAll('[data-qr]').forEach(node => {
    const url = data.qr[node.dataset.qr];
    if (!safeUrl(url, true)) return;
    if (node.tagName === 'IMG') node.src = url;
    else {
      setLink(node, url, true);
      if (node.hasAttribute('download')) {
        node.download = data.qr.nombreDescarga;
        node.removeAttribute('target');
      }
    }
  });
}
