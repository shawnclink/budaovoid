import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const og = await readFile(join(root, 'public/og.svg'));
await sharp(og).png().toFile(join(root, 'public/og.png'));

const icon = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="10" fill="#f6f3ea"/>
  <path d="M32 11v42" stroke="#b4462a" stroke-width="4" stroke-linecap="square"/>
  <path d="M19 32h26" stroke="#191a18" stroke-width="3" stroke-linecap="square"/>
</svg>`);
await sharp(icon).png().toFile(join(root, 'public/apple-touch-icon.png'));

console.log('Generated public/og.png and public/apple-touch-icon.png');
