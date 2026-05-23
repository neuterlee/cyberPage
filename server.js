const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = Number(process.env.PORT || 3000);
const stateStart = '/* PRESENTATION_STATE_START */';
const stateEnd = '/* PRESENTATION_STATE_END */';
const maxBodyBytes = 1024 * 1024;

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function isLocalRequest(req) {
  const address = req.socket.remoteAddress;
  return address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1';
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > maxBodyBytes) {
        reject(new Error('Request body is too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function validateState(state) {
  if (!state || typeof state !== 'object') return 'State must be an object';
  if (state.schemaVersion !== 6) return 'schemaVersion must be 6';
  if (typeof state.currentSlideId !== 'string') return 'currentSlideId must be a string';
  if (!Array.isArray(state.slideOrder)) return 'slideOrder must be an array';
  if (!state.slidesById || typeof state.slidesById !== 'object') return 'slidesById must be an object';
  return null;
}

function writePresentationState(state) {
  const presentationPath = path.join(root, 'presentation.html');
  const html = fs.readFileSync(presentationPath, 'utf8');
  const startIndex = html.indexOf(stateStart);
  const endIndex = html.indexOf(stateEnd);

  if (startIndex < 0 || endIndex < 0 || endIndex <= startIndex) {
    throw new Error('Could not find presentation state markers');
  }

  const before = html.slice(0, startIndex + stateStart.length);
  const after = html.slice(endIndex);
  const serialized = ` ${JSON.stringify(state, null, 2)} `;
  fs.writeFileSync(presentationPath, before + serialized + after, 'utf8');
}

async function handleSaveState(req, res) {
  if (!isLocalRequest(req)) {
    send(res, 403, 'Save endpoint is local-only');
    return;
  }

  try {
    const body = await readRequestBody(req);
    const state = JSON.parse(body);
    const validationError = validateState(state);
    if (validationError) {
      send(res, 400, validationError);
      return;
    }

    writePresentationState(state);
    send(res, 200, JSON.stringify({ ok: true }), 'application/json; charset=utf-8');
  } catch (error) {
    send(res, 500, error.message || 'Could not save presentation state');
  }
}

function serveStatic(req, res) {
  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const requestPath = decodeURIComponent(requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname);
  const filePath = path.resolve(root, `.${requestPath}`);

  if (!filePath.startsWith(root)) {
    send(res, 403, 'Forbidden');
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, 404, 'Not found');
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/__save-presentation-state') {
    handleSaveState(req, res);
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 405, 'Method not allowed');
    return;
  }

  serveStatic(req, res);
});

server.listen(port, () => {
  console.log(`cyberPage local server running at http://localhost:${port}`);
});
