import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { createStaticServer } from '../scripts/serve.js';

// PLAYWRIGHT_MODULE permite usar un entorno ya instalado sin copiar dependencias.
const modulePath = process.env.PLAYWRIGHT_MODULE;
const { chromium } = modulePath
  ? await import(pathToFileURL(resolve(modulePath)).href) : await import('playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
const server = createStaticServer(root);
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({
  headless: true,
  ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}),
});
const errors = [];
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
page.on('pageerror', error => errors.push(error.message));
const output = resolve(root, 'test-results');
await mkdir(output, { recursive: true });

try {
  await page.goto(base);
  await page.locator('.link-card').first().waitFor();
  assert.equal(await page.locator('.link-card').count(), 7);
  assert.equal(await page.locator('a[href^="tel:"]').count(), 0);
  assert.equal(await page.locator('.carousel-slide').count(), 2);
  await page.locator('.carousel-slide img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
  assert.equal(await page.locator('.brand img,.hero-logo,.brand-institute img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), true);
  await page.screenshot({ path: resolve(output, 'desktop.png') });

  const actual = {};
  for (const width of [1366, 390]) {
    await page.setViewportSize({ width, height: 900 });
    actual[width] = await page.evaluate(() => Object.fromEntries(['.header', '.hero', '#enlaces', '#galeria', '#contacto', '#comparte'].map(selector => {
      const node = document.querySelector(selector);
      const bounds = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return [selector, { height: bounds.height, color: style.color, background: style.backgroundColor }];
    })));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  }
  console.log('Métricas de diseño:', JSON.stringify(actual));
  if (process.env.BASELINE_METRICS) {
    const previous = JSON.parse(await readFile(process.env.BASELINE_METRICS, 'utf8'));
    for (const width of [1366, 390]) for (const selector of Object.keys(previous[width])) {
      assert.equal(actual[width][selector].color, previous[width][selector].color, `${width} ${selector} color`);
      assert.equal(actual[width][selector].background, previous[width][selector].background, `${width} ${selector} fondo`);
      assert.ok(Math.abs(actual[width][selector].height - previous[width][selector].height) < 5, `${width} ${selector} altura: ${actual[width][selector].height} vs ${previous[width][selector].height}`);
    }
  }
  await page.screenshot({ path: resolve(output, 'mobile.png') });
  await page.getByRole('button', { name: 'Abrir menú', exact: true }).click();
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
  await page.getByRole('navigation').getByRole('link', { name: 'Oferta académica' }).click();
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');

  await page.locator('#search').fill('academica');
  assert.equal(await page.locator('.link-card').count(), 1);
  await page.locator('#search').fill('inexistente');
  assert.equal(await page.locator('#empty').isVisible(), true);
  await page.locator('#search').fill('');
  await page.getByRole('button', { name: 'Atención', exact: true }).click();
  assert.equal(await page.locator('.link-card').count(), 3);
  await page.getByRole('button', { name: 'Todos', exact: true }).click();

  await page.locator('.floating-contact').click();
  assert.equal(await page.locator('#dialog-links a').count(), 3);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog').evaluate(node => node.open), false);

  await page.locator('[data-slide="next"]').click();
  assert.equal(await page.locator('.carousel-status').innerText(), '2 / 2');
  await page.locator('.carousel').focus();
  await page.keyboard.press('ArrowLeft');
  assert.equal(await page.locator('.carousel-status').innerText(), '1 / 2');
  await page.locator('.carousel-pause').click();
  assert.equal(await page.locator('.carousel-pause').innerText(), 'Reanudar');

  // Prueba de crecimiento real: un tercer afiche sin tocar el HTML ni controles.
  const galleryUrl = '**/src/data/galeria.js*';
  const gallerySource = await readFile(resolve(root, 'src/data/galeria.js'), 'utf8');
  await page.route(galleryUrl, route => route.fulfill({
    contentType: 'text/javascript',
    body: gallerySource + '\ngaleria.push({...galeria[0], titulo: "Tercer afiche de prueba"}); opcionesGaleria.intervaloMs = 1000;\n',
  }));
  await page.reload();
  await page.locator('.carousel-slide').nth(2).waitFor({ state: 'attached' });
  assert.equal(await page.locator('[data-slide-index]').count(), 3);
  await page.mouse.move(0, 0);
  await page.waitForFunction(() => document.querySelector('.carousel-status').textContent !== '1 / 3', {}, { timeout: 4000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.locator('.carousel-pause').waitFor();
  assert.equal(await page.locator('.carousel-pause').innerText(), 'Reanudar');
  await page.waitForTimeout(1200);
  assert.equal(await page.locator('.carousel-status').innerText(), '1 / 3');
  await page.emulateMedia({ reducedMotion: 'no-preference' });

  // Un cambio en datos debe aparecer en tarjeta, contacto y ventana de ayuda.
  await page.route('**/src/data/contactos.js*', route => route.fulfill({
    contentType: 'text/javascript',
    body: 'export const contactos = [{id:"prueba", nombre:"Canal actualizado", codigoPais:"591", numero:"70000000"}];',
  }));
  await page.reload();
  await page.locator('.link-card').first().waitFor();
  assert.equal(await page.locator('.link-card[href="https://wa.me/59170000000"]').count(), 1);
  assert.equal(await page.locator('#contact-whatsapp a[href="https://wa.me/59170000000"]').count(), 1);
  assert.equal(await page.locator('#contact-whatsapp strong').innerText(), '+591 70000000');
  await page.locator('.floating-contact').click();
  assert.equal(await page.locator('#dialog-links a[href="https://wa.me/59170000000"]').count(), 1);
  await page.keyboard.press('Escape');

  // Cero o una diapositiva también son configuraciones válidas.
  await page.unroute(galleryUrl);
  await page.route(galleryUrl, route => route.fulfill({ contentType: 'text/javascript', body: 'export const galeria=[]; export const opcionesGaleria={};' }));
  await page.reload();
  await page.locator('.link-card').first().waitFor();
  assert.equal(await page.locator('#galeria').isVisible(), false);
  await page.unroute(galleryUrl);
  await page.route(galleryUrl, route => route.fulfill({ contentType: 'text/javascript', body: gallerySource + '\ngaleria.splice(1);\n' }));
  await page.reload();
  await page.locator('.carousel-slide').waitFor();
  assert.equal(await page.locator('.carousel-controls').isVisible(), false);

  await page.locator('#comparte').scrollIntoViewIfNeeded();
  await page.locator('.share-qr img').evaluate(image => image.decode());
  assert.equal(await page.locator('[data-share]').getAttribute('href').then(url => new URL(url).searchParams.get('text').includes('https://tecnologico-santa-cruz.github.io/')), true);
  const download = page.waitForEvent('download');
  await page.locator('.qr-download').click();
  assert.equal((await download).suggestedFilename(), 'QR-Tecnologico-Santa-Cruz.png');

  await page.route('**/src/data/noticias.js*', route => route.fulfill({
    contentType: 'text/javascript',
    body: 'export const noticias=[{publicado:true,titulo:"<b>Texto literal</b>",resumen:"Comunicado de prueba",fecha:"2026-11-01"},{publicado:false,titulo:"Borrador oculto",resumen:"No publicar"}];',
  }));
  await page.reload();
  await page.locator('.news-item').waitFor();
  assert.equal(await page.locator('.news-item').count(), 1);
  assert.equal(await page.locator('.news-item h3').innerText(), '<b>Texto literal</b>');
  assert.equal(await page.locator('.news-item h3 b').count(), 0);

  // Los inicializadores también sirven cuando una página no incluye una sección.
  const html = (await readFile(resolve(root, 'index.html'), 'utf8'))
    .replace(/<section class="contact-section"[\s\S]*?<\/section>/, '')
    .replace(/<section id="galeria"[\s\S]*?<\/section>/, '')
    .replace('id="navigation"', 'id="navigation-omitida"');
  await page.route(base + '/', route => route.fulfill({ contentType: 'text/html', body: html }));
  await page.reload();
  await page.locator('.link-card').first().waitFor();
  assert.equal(await page.locator('#galeria').count(), 0);
  assert.deepEqual(errors, []);
  console.log('OK: diseño, navegación, filtros, contactos centralizados, QR y galería de 0/1/3 imágenes.');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
