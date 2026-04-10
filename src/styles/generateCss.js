// FILE: src/styles/generateCss.js

export const defaultConfig = {
  durations: {
    '0': 0,
    '75': 75,
    '100': 100,
    '150': 150,
    '200': 200,
    '300': 300,
    '500': 500,
    '700': 700,
    '1000': 1000,
  },
  delays: {
    '0': 0,
    '75': 75,
    '100': 100,
    '150': 150,
    '200': 200,
    '300': 300,
    '500': 500,
    '700': 700,
    '1000': 1000,
  },
  easings: {
    'linear': 'linear',
    'in': 'cubic-bezier(0.4, 0, 1, 1)',
    'out': 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export function generateCSS(config = defaultConfig) {
  let css = '/* SVGX Utility Classes */\n\n';
  
  css += '.svg-draw {\n';
  css += '  animation-name: svgx-draw;\n';
  css += '  animation-fill-mode: forwards;\n';
  css += '}\n\n';
  
  // Duration classes
  css += '/* Durations */\n';
  for (const [name, ms] of Object.entries(config.durations)) {
    css += `.svg-duration-${name} {\n`;
    css += `  animation-duration: ${ms}ms;\n`;
    css += '}\n';
  }
  css += '\n';
  
  // Delay classes
  css += '/* Delays */\n';
  for (const [name, ms] of Object.entries(config.delays)) {
    css += `.svg-delay-${name} {\n`;
    css += `  animation-delay: ${ms}ms;\n`;
    css += '}\n';
  }
  css += '\n';
  
  // Easing classes
  css += '/* Easings */\n';
  for (const [name, easingValue] of Object.entries(config.easings)) {
    css += `.svg-ease-${name} {\n`;
    css += `  animation-timing-function: ${easingValue};\n`;
    css += '}\n';
  }
  css += '\n';
  
  // Keyframes
  css += '@keyframes svgx-draw {\n';
  css += '  0% {\n';
  css += '    stroke-dashoffset: var(--svgx-length, 1000);\n';
  css += '  }\n';
  css += '  100% {\n';
  css += '    stroke-dashoffset: 0;\n';
  css += '  }\n';
  css += '}\n';
  
  return css;
}
