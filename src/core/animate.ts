// FILE: src/core/animate.ts

import type { AnimationProperties, AnimationOptions, AnimationControl, Target } from '../types';
import { createAnimation } from './AnimationEngine';

export function animate(
  target: Target,
  properties: AnimationProperties,
  options: AnimationOptions
): AnimationControl {
  return createAnimation(target, properties, options);
}
