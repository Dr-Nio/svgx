// FILE: src/svg/draw.ts

import { getPathLength, setStrokeDashoffset } from '../utils/dom';

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
  // Set up the path so it starts fully hidden
  element.style.strokeDasharray = `${length}`;
  element.style.strokeDashoffset = `${length}`;
  
  const startOffset = length;
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
