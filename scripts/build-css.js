// FILE: scripts/build-css.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

// Import the CSS generator dynamically
async function buildCSS() {
  const { generateCSS, defaultConfig } = await import('../src/styles/generateCss.ts');
  
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  const css = generateCSS(defaultConfig);
  fs.writeFileSync(path.resolve(distDir, 'svgx.css'), css);
  console.log('✅ CSS generated at dist/svgx.css');
}

buildCSS().catch(console.error);
