// FILE: scripts/build-css.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateCSS, defaultConfig } from '../src/styles/generateCss.js';  // ← now .js

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const css = generateCSS(defaultConfig);
fs.writeFileSync(path.resolve(distDir, 'svgx.css'), css);
console.log('✅ CSS generated at dist/svgx.css');
