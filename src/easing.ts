// FILE: src/easing.ts

import type { EasingMap, EasingFunction } from './types';

const pow = Math.pow;
const sin = Math.sin;
const cos = Math.cos;
const PI = Math.PI;
const c1 = 1.70158;
const c2 = c1 * 1.525;
const c3 = c1 + 1;
const c4 = (2 * PI) / 3;
const c5 = (2 * PI) / 4.5;

export const easingFunctions: EasingMap = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => 1 - (1 - t) * (1 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : 1 - pow(-2 * t + 2, 2) / 2),
  easeInBack: (t: number) => c3 * t * t * t - c1 * t * t,
  easeOutBack: (t: number) => 1 + c3 * pow(t - 1, 3) + c1 * pow(t - 1, 2),
  easeInOutBack: (t: number) =>
    t < 0.5
      ? (pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2,
};

export function getEasingFunction(easing: keyof EasingMap | EasingFunction): EasingFunction {
  if (typeof easing === 'function') return easing;
  return easingFunctions[easing] || easingFunctions.linear;
}

export const easing = easingFunctions;
