// FILE: svgx.config.js

// Example configuration file for customizing CSS utility classes
export default {
  durations: {
    '0': 0,
    '100': 100,
    '200': 200,
    '300': 300,
    '500': 500,
    '700': 700,
    '1000': 1000,
    '1500': 1500,
    '2000': 2000,
  },
  delays: {
    '0': 0,
    '100': 100,
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
    'bounce': 'cubic-bezier(0.87, 0, 0.13, 1)',
  },
};
