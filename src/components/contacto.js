import { element, icon, setLink } from '../utils/dom.js?v=20261101';
import { contactLabel, whatsappUrl } from '../utils/urls.js?v=20261101';

export function initContacto(contactos, institucion) {
  const valid = contactos.filter(contacto => whatsappUrl(contacto));
  const list = document.getElementById('contact-whatsapp');
  if (list) {
    list.replaceChildren();
    valid.forEach(contacto => {
      const anchor = element('a');
      setLink(anchor, whatsappUrl(contacto));
      const detail = element('div');
      detail.append(
        element('small', '', contacto.nombre.toLocaleUpperCase('es')),
        element('strong', '', contactLabel(contacto)),
      );
      anchor.append(icon('whatsapp'), detail, element('span', '', '↗'));
      list.append(anchor);
    });
  }

  const dialog = document.getElementById('contact-dialog');
  const links = document.getElementById('dialog-links');
  const message = document.getElementById('dialog-message');
  if (!dialog || !links || !message) return;

  function openContact() {
    links.replaceChildren();
    const options = valid.map(contacto => [
      `${contacto.nombre} · ${contactLabel(contacto)}`, whatsappUrl(contacto),
    ]);
    if (institucion.correo) options.push(['Enviar un correo', `mailto:${institucion.correo}`]);
    options.forEach(([label, url]) => {
      const anchor = element('a', 'button primary', `${label} ↗`);
      if (setLink(anchor, url)) links.append(anchor);
    });
    message.textContent = valid.length
      ? 'Elige el canal de atención para tu consulta.'
      : 'El canal de WhatsApp todavía no está disponible en este portal. Puedes comunicarte por correo.';
    if (!dialog.open) dialog.showModal();
  }

  document.querySelectorAll('[data-contact]').forEach(button => {
    button.addEventListener('click', openContact);
  });
  dialog.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
}
