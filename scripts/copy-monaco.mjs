import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'node_modules', 'monaco-editor', 'min', 'vs');
const destination = join(root, 'public', 'monaco', 'vs');

if (!existsSync(source)) {
  console.warn('[copy-monaco] monaco-editor not found, skipping.');
  process.exit(0);
}

rmSync(destination, { recursive: true, force: true });
mkdirSync(dirname(destination), { recursive: true });
cpSync(source, destination, { recursive: true });
console.log('[copy-monaco] Copied Monaco assets to public/monaco/vs');
