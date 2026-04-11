// FILE: src/svg/transform.ts

import type { TransformValues } from '../types';
import { getCurrentTransform, setTransform } from '../utils/dom';

export interface TransformAnimationState {
  element: Element;
  startValues: TransformValues;
  endValues: TransformValues;
  baseTransform: string;  // store existing transform
}

export function prepareTransformAnimation(
  element: Element,
  targetTransform: TransformValues
): TransformAnimationState {
  const baseTransform = getCurrentTransform(element);
  // Parse existing transform if needed (simplified: assume identity for animated props)
  const startValues: TransformValues = {};
  return {
    element,
    startValues,
    endValues: { ...targetTransform },
    baseTransform,
  };
}

export function updateTransformAnimation(state: TransformAnimationState, progress: number): void {
  const current: TransformValues = {};
  for (const key in state.endValues) {
    const start = (state.startValues as any)[key] || 0;
    const end = (state.endValues as any)[key] || 0;
    (current as any)[key] = start + (end - start) * progress;
  }
  // Apply new transform on top of the base transform
  const newTransform = state.baseTransform ? `${state.baseTransform} ` : '';
  const parts: string[] = [];
  if (current.x !== undefined || current.y !== undefined) {
    parts.push(`translate(${current.x ?? 0}, ${current.y ?? 0})`);
  }
  if (current.scale !== undefined) parts.push(`scale(${current.scale})`);
  if (current.rotate !== undefined) parts.push(`rotate(${current.rotate})`);
  if (current.skewX !== undefined) parts.push(`skewX(${current.skewX})`);
  if (current.skewY !== undefined) parts.push(`skewY(${current.skewY})`);
  
  if (parts.length) {
    state.element.setAttribute('transform', newTransform + parts.join(' '));
  }
}
