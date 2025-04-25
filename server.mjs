import { createServer } from 'http';
import { readFile, existsSync } from 'fs';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';

// Support __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = __filename.substring(0, __filename.lastIndexOf('/'));

const publicDir = join(__dirname, 'public');

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

createServer((req, res) => {
  let reqPath = req.url === '/' ? '/home-1.html' : req.url;
  const filePath = join(publicDir, decodeURIComponent(reqPath));
  const ext = extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  if (existsSync(filePath)) {
    readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  } else {
    res.writeHead(404);
    res.end('404 Not Found');
  }
}).listen(process.env.PORT);
