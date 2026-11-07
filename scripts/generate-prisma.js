const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

// Determine location of prisma CLI binary index.js
const possiblePrismaPaths = [
  path.resolve(__dirname, '../apps/api/node_modules/prisma/build/index.js'),
  path.resolve(__dirname, '../node_modules/prisma/build/index.js'),
];

let prismaCli = possiblePrismaPaths.find(p => fs.existsSync(p));

if (!prismaCli) {
  try {
    prismaCli = require.resolve('prisma/build/index.js');
  } catch (_) {}
}

if (!prismaCli) {
  console.error('[generate-prisma] Could not locate prisma CLI package.');
  process.exit(1);
}

const schemaPath = path.resolve(__dirname, '../apps/api/prisma/schema.prisma');
const configPath = path.resolve(__dirname, '../apps/api/prisma.config.ts');

console.log('[generate-prisma] Running Prisma CLI from:', prismaCli);
console.log('[generate-prisma] Schema:', schemaPath);
console.log('[generate-prisma] Config:', configPath);

const result = spawnSync(
  process.execPath,
  [prismaCli, 'generate', `--schema=${schemaPath}`, `--config=${configPath}`],
  {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..'), // Run from root where root node_modules/@prisma/client lives
    env: process.env,
  }
);

if (result.status !== 0) {
  process.exit(result.status || 1);
}
