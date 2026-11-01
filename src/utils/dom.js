import { icons } from '../icons.js?v=20261101';
import { safeUrl } from './urls.js?v=20261101';

export function element(tag, className = '', text = '') {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== '') node.textContent = text;
  return node;
}

export function icon(name) {
  const node = element('span');
  // Solo los SVG locales de src/icons.js entran por innerHTML.
  node.innerHTML = (icons[name] || icons.web).replace(
    '<svg', '<svg aria-hidden="true" focusable="false"',
  );
  return node;
}

export function setLink(anchor, value, relative = false) {
  const url = safeUrl(value, relative);
  if (!url) {
    anchor.removeAttribute('href');
    anchor.hidden = true;
    return false;
  }
  anchor.hidden = false;
  anchor.href = url;
  if (/^https?:/.test(url) || relative) {
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
  }
  return true;
}

export function mountIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(node => {
    node.replaceChildren(icon(node.dataset.icon));
  });
}
