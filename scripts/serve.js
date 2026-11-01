import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
};

/** Servidor solo local, sin escrituras, cuentas ni dependencias. */
export function createStaticServer(root) {
  const directory = resolve(root);
  return createServer(async (request, response) => {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405).end();
      return;
    }
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (pathname.split('/').some(part => part.startsWith('.')) || pathname.includes('\\')) {
        response.writeHead(403).end();
        return;
      }
      let file = resolve(directory, `.${pathname}`);
      if (file !== directory && !file.startsWith(directory + sep)) {
        response.writeHead(403).end();
        return;
      }
      if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
      const body = await readFile(file);
      response.writeHead(200, {
        'Content-Type': types[extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      });
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch {
      response.writeHead(404).end('No encontrado');
    }
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const port = Number(process.env.PORT || 4173);
  createStaticServer(root).listen(port, '127.0.0.1', () => {
    console.log(`Vista local: http://127.0.0.1:${port}`);
  });
}
