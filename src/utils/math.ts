// FILE: src/utils/math.ts

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function mapRange(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number {
  return ((value - fromMin) / (fromMax - fromMin)) * (toMax - toMin) + toMin;
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}
