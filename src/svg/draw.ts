// FILE: src/svg/draw.ts

import { getPathLength, setStrokeDashoffset } from '../utils/dom';
import type { AnimationProperties, AnimationOptions } from '../types';

export interface DrawAnimationState {
  element: SVGPathElement;
  length: number;
  startOffset: number;
  endOffset: number;
}

export function prepareDrawAnimation(
  element: SVGPathElement,
  targetDrawValue: number
): DrawAnimationState {
  const length = getPathLength(element);
  const startOffset = length; // hidden state
  const endOffset = length * (1 - targetDrawValue);
  return {
    element,
    length,
    startOffset,
    endOffset,
  };
}

export function updateDrawAnimation(state: DrawAnimationState, progress: number): void {
  const currentOffset = state.startOffset + (state.endOffset - state.startOffset) * progress;
  setStrokeDashoffset(state.element, currentOffset, state.length);
}
