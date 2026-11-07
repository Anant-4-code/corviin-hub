const fs = require('fs');
const path = require('path');

const rootClient = path.resolve(__dirname, '../node_modules/@prisma/client');
const apiClient = path.resolve(__dirname, '../apps/api/node_modules/@prisma/client');

if (fs.existsSync(rootClient)) {
  fs.mkdirSync(path.dirname(apiClient), { recursive: true });
  try {
    if (fs.existsSync(apiClient)) {
      try { fs.rmSync(apiClient, { recursive: true, force: true }); } catch (_) {}
    }
    fs.cpSync(rootClient, apiClient, { recursive: true, dereference: true });
    console.log('[ensure-prisma-client] Successfully copied @prisma/client into apps/api/node_modules');
  } catch (err) {
    console.error('[ensure-prisma-client] Copy error:', err.message);
  }
} else {
  console.log('[ensure-prisma-client] Warning: root node_modules/@prisma/client not found');
}
