import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { institucion } from '../src/data/institucion.js';
import { contactos } from '../src/data/contactos.js';
import { galeria } from '../src/data/galeria.js';
import { noticias } from '../src/data/noticias.js';
import { accesos } from '../src/data/accesos.js';
import { buildDirectory } from '../src/components/directorio.js';
import { contactLabel, safeUrl, whatsappUrl } from '../src/utils/urls.js';

test('Los datos de contacto son válidos, únicos y no contienen fijos retirados', () => {
  assert.equal(new Set(contactos.map(contacto => contacto.id)).size, contactos.length);
  contactos.forEach(contacto => {
    assert.match(contacto.nombre, /\S/);
    assert.match(contacto.codigoPais, /^\d{1,3}$/);
    assert.match(contacto.numero, /^\d{6,12}$/);
    assert.ok(whatsappUrl(contacto));
    assert.doesNotMatch(contacto.numero, /3492192|3489901|3460808/);
  });
});

test('Cambiar un contacto cambia el enlace y el número visible del directorio', () => {
  const changed = [{ ...contactos[0], numero: '70000000', nombre: 'Canal de prueba' }];
  const row = buildDirectory(institucion, changed).find(item => item.titulo === 'Canal de prueba');
  assert.equal(row.url, whatsappUrl(changed[0]));
  assert.equal(row.descripcion, contactLabel(changed[0]));
});

test('URLs peligrosas o incompletas se rechazan, incluyendo accesos adicionales', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,x', '', undefined]) {
    assert.equal(safeUrl(url), '');
    assert.equal(safeUrl(url, true), '');
  }
  assert.equal(whatsappUrl({ codigoPais: '591', numero: 'texto' }), '');
  assert.ok(safeUrl('assets/qr-itsc.svg', true));
  assert.equal(buildDirectory(institucion, [], [{ titulo: 'Malo', url: 'javascript:x' }]).some(row => row.titulo === 'Malo'), false);
});

test('Redes opcionales vacías no crean accesos y se habilitan desde los datos', () => {
  const changed = { ...institucion, redes: [{ id: 'instagram', nombre: 'Instagram', descripcion: '', url: 'https://instagram.com/ejemplo' }] };
  assert.equal(buildDirectory(changed, []).filter(row => row.titulo === 'Instagram').length, 1);
  assert.equal(buildDirectory(institucion, contactos, accesos).filter(row => row.titulo === 'Instagram').length, 0);
});

test('Las imágenes locales referenciadas existen y las noticias publicadas tienen contenido', async () => {
  const images = [institucion.logo, institucion.fotoPortada, institucion.qr.vector, institucion.qr.descarga, ...galeria.map(item => item.imagen)];
  for (const image of images) {
    assert.ok(safeUrl(image, true));
    if (!/^https?:/.test(image)) await access(new URL(`../${image}`, import.meta.url));
  }
  noticias.filter(noticia => noticia.publicado === true).forEach(noticia => {
    assert.ok(noticia.titulo && noticia.resumen);
  });
});

test('El HTML no repite números de WhatsApp ni mantiene enlaces de fijos', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const contacto of contactos) assert.equal(html.includes(contacto.numero), false);
  assert.doesNotMatch(html, /href=["']tel:/);
});
