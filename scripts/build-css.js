// scripts/build-css.js (updated)
import fs from 'fs';
import path from 'path';
import { generateCSS, defaultConfig } from '../src/styles/generateCss.js';

const distDir = path.resolve(process.cwd(), 'dist');
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

// Write CSS
const css = generateCSS(defaultConfig);
fs.writeFileSync(path.join(distDir, 'svgx.css'), css);

// Write initializer script
const initScript = `// SVGX Auto-initializer for CSS utility classes
(function() {
  function initSVGX() {
    document.querySelectorAll('.svg-draw').forEach(path => {
      if (path.getTotalLength) {
        const len = path.getTotalLength();
        path.style.setProperty('--svgx-length', len);
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSVGX);
  } else {
    initSVGX();
  }
})();
`;
fs.writeFileSync(path.join(distDir, 'svgx.init.js'), initScript);
console.log('✅ CSS and initializer generated in dist/');
