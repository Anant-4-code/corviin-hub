const fs = require('fs');
const path = require('path');

const rootClient = path.resolve(__dirname, '../node_modules/@prisma/client');
const apiClient = path.resolve(__dirname, '../apps/api/node_modules/@prisma/client');

if (fs.existsSync(apiClient) && fs.existsSync(path.join(apiClient, 'index.js'))) {
  fs.cpSync(apiClient, rootClient, { recursive: true, dereference: true });
  console.log('[sync-prisma-client] Synced generated client back to root node_modules');
}
