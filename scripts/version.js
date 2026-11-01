import { readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const version = process.argv[2];
if (!version || !/^[a-zA-Z0-9_-]+$/.test(version)) {
  console.error('Uso: npm run version -- 20261101 (o 20261101-2)');
  process.exit(1);
}
const root = fileURLToPath(new URL('../', import.meta.url));
async function update(file) {
  let content = await readFile(file, 'utf8');
  content = content.replace(/\?v=[a-zA-Z0-9_-]+/g, `?v=${version}`);
  if (file.endsWith('.js')) {
    content = content.replace(/(from\s+['"]\.\.?\/[^'"?]+\.js)(['"])/g, `$1?v=${version}$2`);
  }
  await writeFile(file, content);
}
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (/\.(js|css)$/.test(file)) await update(file);
  }
}
await update(join(root, 'index.html'));
await walk(join(root, 'src'));
await walk(join(root, 'css'));
console.log(`Recursos actualizados a la versión ${version}`);
