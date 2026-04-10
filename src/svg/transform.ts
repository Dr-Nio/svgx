// FILE: src/svg/transform.ts

import type { TransformValues } from '../types';
import { setTransform } from '../utils/dom';

export interface TransformAnimationState {
  element: Element;
  startValues: TransformValues;
  endValues: TransformValues;
}

export function prepareTransformAnimation(
  element: Element,
  targetTransform: TransformValues
): TransformAnimationState {
  // For simplicity, start from identity/current attribute
  // In real implementation, parse existing transform
  const startValues: TransformValues = {};
  return {
    element,
    startValues,
    endValues: { ...targetTransform },
  };
}

export function updateTransformAnimation(state: TransformAnimationState, progress: number): void {
  const current: TransformValues = {};
  
  for (const key in state.endValues) {
    const start = (state.startValues as any)[key] || 0;
    const end = (state.endValues as any)[key] || 0;
    (current as any)[key] = start + (end - start) * progress;
  }
  
  setTransform(state.element, current);
}
