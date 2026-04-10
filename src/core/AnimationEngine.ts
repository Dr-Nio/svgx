// FILE: src/core/AnimationEngine.ts

import type {
  AnimationProperties,
  AnimationOptions,
  AnimationControl,
  Target,
  TransformValues,
} from '../types';
import { getElements, setOpacity } from '../utils/dom';
import { getEasingFunction } from '../easing';
import { clamp } from '../utils/math';
import { prepareDrawAnimation, updateDrawAnimation } from '../svg/draw';
import { prepareTransformAnimation, updateTransformAnimation } from '../svg/transform';
import { prepareMorphAnimation, updateMorphAnimation } from '../svg/morph';

interface ActiveAnimation {
  id: number;
  elements: Element[];
  startTime: number;
  duration: number;
  delay: number;
  easing: (t: number) => number;
  repeat: number | true;
  yoyo: boolean;
  currentIteration: number;
  direction: 1 | -1;
  isPaused: boolean;
  pausedTime: number;
  pausedStart: number;
  onComplete?: () => void;
  onUpdate?: () => void;
  // Per-element states for different properties
  drawStates: Map<Element, any>;
  transformStates: Map<Element, any>;
  morphStates: Map<Element, any>;
  opacityStart: Map<Element, number>;
  opacityEnd: Map<Element, number>;
  properties: AnimationProperties;
}

let nextId = 0;
const activeAnimations: Map<number, ActiveAnimation> = new Map();
let rafId: number | null = null;
let lastTimestamp = 0;

function updateAnimations(now: number): void {
  let hasActive = false;
  
  for (const [id, anim] of activeAnimations.entries()) {
    if (anim.isPaused) {
      hasActive = true;
      continue;
    }
    
    const elapsed = now - anim.startTime;
    let progress = 0;
    let isFinished = false;
    
    if (elapsed >= anim.duration + anim.delay) {
      // Handle repeat
      if (anim.repeat !== undefined && (anim.repeat === true || anim.currentIteration < (anim.repeat as number) - 1)) {
        anim.currentIteration++;
        anim.startTime = now;
        if (anim.yoyo) {
          anim.direction *= -1;
        }
        progress = anim.direction === 1 ? 0 : 1;
        if (anim.onUpdate) anim.onUpdate();
      } else {
        isFinished = true;
        progress = anim.direction === 1 ? 1 : 0;
      }
    } else if (elapsed < anim.delay) {
      progress = 0;
    } else {
      const t = (elapsed - anim.delay) / anim.duration;
      progress = anim.direction === 1 ? clamp(t, 0, 1) : 1 - clamp(t, 0, 1);
    }
    
    const easedProgress = anim.easing(progress);
    
    // Apply animations to each element
    for (const element of anim.elements) {
      // Draw animation
      if (anim.properties.draw !== undefined) {
        const state = anim.drawStates.get(element);
        if (state) {
          updateDrawAnimation(state, easedProgress);
        }
      }
      
      // Transform animation
      if (anim.properties.transform) {
        const state = anim.transformStates.get(element);
        if (state) {
          updateTransformAnimation(state, easedProgress);
        }
      }
      
      // Opacity animation
      if (anim.properties.opacity !== undefined) {
        const start = anim.opacityStart.get(element) || 0;
        const end = anim.opacityEnd.get(element) || 1;
        const current = start + (end - start) * easedProgress;
        setOpacity(element, current);
      }
      
      // Morph animation (placeholder)
      if (anim.properties.morph) {
        const state = anim.morphStates.get(element);
        if (state) {
          updateMorphAnimation(state, easedProgress);
        }
      }
    }
    
    if (anim.onUpdate) anim.onUpdate();
    
    if (isFinished) {
      if (anim.onComplete) anim.onComplete();
      activeAnimations.delete(id);
    } else {
      hasActive = true;
    }
  }
  
  if (hasActive && rafId === null) {
    rafId = requestAnimationFrame(function frame(ts) {
      rafId = null;
      updateAnimations(ts);
      if (activeAnimations.size > 0) {
        rafId = requestAnimationFrame(frame);
      }
    });
  } else if (!hasActive && rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

export function createAnimation(
  target: Target,
  properties: AnimationProperties,
  options: AnimationOptions
): AnimationControl {
  const elements = getElements(target);
  if (elements.length === 0) {
    throw new Error(`SVGX: No elements found for target: ${target}`);
  }
  
  const duration = options.duration;
  const delay = options.delay || 0;
  const easingFn = getEasingFunction(options.easing || 'linear');
  const repeat = options.repeat === true ? true : (options.repeat || 0);
  const yoyo = options.yoyo || false;
  const onComplete = options.onComplete;
  const onUpdate = options.onUpdate;
  
  const startTime = performance.now() + delay;
  const id = nextId++;
  
  const drawStates = new Map();
  const transformStates = new Map();
  const morphStates = new Map();
  const opacityStart = new Map();
  const opacityEnd = new Map();
  
  // Prepare per-element animation states
  for (const element of elements) {
    if (properties.draw !== undefined && element instanceof SVGPathElement) {
      const state = prepareDrawAnimation(element, properties.draw);
      drawStates.set(element, state);
    }
    
    if (properties.transform) {
      const state = prepareTransformAnimation(element, properties.transform);
      transformStates.set(element, state);
    }
    
    if (properties.opacity !== undefined) {
      const current = parseFloat((element as SVGElement).style.opacity) || 1;
      opacityStart.set(element, current);
      opacityEnd.set(element, properties.opacity);
    }
    
    if (properties.morph && element instanceof SVGPathElement) {
      const state = prepareMorphAnimation(element, properties.morph);
      if (state) morphStates.set(element, state);
    }
  }
  
  const animation: ActiveAnimation = {
    id,
    elements,
    startTime,
    duration,
    delay,
    easing: easingFn,
    repeat,
    yoyo,
    currentIteration: 0,
    direction: 1,
    isPaused: false,
    pausedTime: 0,
    pausedStart: 0,
    onComplete,
    onUpdate,
    drawStates,
    transformStates,
    morphStates,
    opacityStart,
    opacityEnd,
    properties,
  };
  
  activeAnimations.set(id, animation);
  
  // Start RAF loop
  if (rafId === null) {
    rafId = requestAnimationFrame((ts) => {
      rafId = null;
      updateAnimations(ts);
      if (activeAnimations.size > 0) {
        rafId = requestAnimationFrame(function frame(ts) {
          rafId = null;
          updateAnimations(ts);
          if (activeAnimations.size > 0) {
            rafId = requestAnimationFrame(frame);
          }
        });
      }
    });
  }
  
  let killed = false;
  
  return {
    pause() {
      const anim = activeAnimations.get(id);
      if (anim && !anim.isPaused && !killed) {
        anim.isPaused = true;
        anim.pausedStart = performance.now();
      }
    },
    resume() {
      const anim = activeAnimations.get(id);
      if (anim && anim.isPaused && !killed) {
        const pausedDuration = performance.now() - anim.pausedStart;
        anim.startTime += pausedDuration;
        anim.isPaused = false;
      }
    },
    seek(time: number) {
      const anim = activeAnimations.get(id);
      if (anim && !killed) {
        anim.startTime = performance.now() - time;
        if (anim.isPaused) {
          anim.pausedStart = performance.now();
        }
      }
    },
    kill() {
      killed = true;
      activeAnimations.delete(id);
    },
    then(onFulfilled: () => void): Promise<void> {
      return new Promise((resolve) => {
        const checkComplete = () => {
          if (!activeAnimations.has(id)) {
            onFulfilled();
            resolve();
          } else {
            requestAnimationFrame(checkComplete);
          }
        };
        checkComplete();
      });
    },
  };
}
