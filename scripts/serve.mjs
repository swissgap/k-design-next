#!/usr/bin/env node
/**
 * Winziger Entwicklungsserver ohne Abhängigkeiten.
 *   node scripts/serve.mjs [port]
 * Liefert das Projektverzeichnis aus; / zeigt die Demo-Seite.
 */
import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {dirname, extname, join, normalize} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv[2]) || 4173;

const TYPES = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.mjs': 'text/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.woff2': 'font/woff2',
	'.png': 'image/png',
	'.jpg': 'image/jpeg'
};

createServer(async (request, response) => {
	let path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
	if (path === '/') path = '/demo/index.html';

	const file = join(ROOT, normalize(path).replace(/^(\.\.[/\\])+/, ''));
	if (!file.startsWith(ROOT)) {
		response.writeHead(403).end('Verboten');
		return;
	}

	try {
		const info = await stat(file);
		const target = info.isDirectory() ? join(file, 'index.html') : file;
		const body = await readFile(target);
		response.writeHead(200, {
			'content-type': TYPES[extname(target)] ?? 'application/octet-stream',
			'cache-control': 'no-store'
		});
		response.end(body);
	} catch {
		response.writeHead(404, {'content-type': 'text/plain; charset=utf-8'});
		response.end('Nicht gefunden: ' + path);
	}
}).listen(PORT, () => {
	console.log(`k-design-next läuft auf http://localhost:${PORT}/`);
});
