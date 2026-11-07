const fs = require('fs');
const path = require('path');

const rootClient = path.resolve(__dirname, '../node_modules/@prisma/client');
const apiClient = path.resolve(__dirname, '../apps/api/node_modules/@prisma/client');

if (fs.existsSync(rootClient) && !fs.existsSync(apiClient)) {
  fs.mkdirSync(path.dirname(apiClient), { recursive: true });
  try {
    fs.symlinkSync(rootClient, apiClient, 'junction');
    console.log('[ensure-prisma-client] Symlinked @prisma/client into apps/api/node_modules');
  } catch (err) {
    fs.cpSync(rootClient, apiClient, { recursive: true });
    console.log('[ensure-prisma-client] Copied @prisma/client into apps/api/node_modules');
  }
} else {
  console.log('[ensure-prisma-client] @prisma/client is already available in apps/api/node_modules');
}
