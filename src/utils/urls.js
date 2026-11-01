/** Validar enlaces antes de asignarlos al DOM. No acepta javascript: ni data:. */
export function safeUrl(value, relative = false) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = relative ? new URL(value, 'https://local.invalid/') : new URL(value);
    const allowed = relative ? ['https:', 'http:'] : ['https:', 'http:', 'mailto:'];
    return allowed.includes(url.protocol) ? (relative ? value : url.href) : '';
  } catch {
    return '';
  }
}

export function whatsappUrl(contacto) {
  const number = `${contacto.codigoPais}${contacto.numero}`;
  return /^\d{10,15}$/.test(number) ? `https://wa.me/${number}` : '';
}

export function contactLabel(contacto) {
  return `+${contacto.codigoPais} ${contacto.numero}`;
}

export function normalize(text) {
  return String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}
