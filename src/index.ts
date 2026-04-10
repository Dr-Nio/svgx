// FILE: src/index.ts

// Core exports
export { animate } from './core/animate';
export { timeline, Timeline } from './core/timeline';
export { easing, getEasingFunction } from './easing';

// Types
export type {
  AnimationProperties,
  AnimationOptions,
  AnimationControl,
  Target,
  TransformValues,
  EasingFunction,
  TimelineOptions,
} from './types';

// Utility exports
export { getElements, getPathLength, setTransform } from './utils/dom';
export { clamp, lerp, mapRange } from './utils/math';

// Default export for convenient importing
import { animate } from './core/animate';
import { timeline } from './core/timeline';
import { easing } from './easing';

export default {
  animate,
  timeline,
  easing,
};
