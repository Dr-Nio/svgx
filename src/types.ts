// FILE: src/types.ts

export type EasingFunction = (t: number) => number;

export interface EasingMap {
  linear: EasingFunction;
  easeIn: EasingFunction;
  easeOut: EasingFunction;
  easeInOut: EasingFunction;
  easeInBack: EasingFunction;
  easeOutBack: EasingFunction;
  easeInOutBack: EasingFunction;
  [key: string]: EasingFunction;
}

export interface TransformValues {
  x?: number;
  y?: number;
  scale?: number;
  rotate?: number;
  skewX?: number;
  skewY?: number;
}

export interface AnimationProperties {
  draw?: number; // 0 to 1
  opacity?: number;
  transform?: TransformValues;
  morph?: string; // placeholder for morph target ID
}

export interface AnimationOptions {
  duration: number;
  delay?: number;
  easing?: keyof EasingMap | EasingFunction;
  repeat?: number | true; // true = infinite
  yoyo?: boolean;
  onComplete?: () => void;
  onUpdate?: () => void;
}

export interface AnimationControl {
  pause(): void;
  resume(): void;
  seek(time: number): void;
  kill(): void;
  then(onFulfilled: () => void): Promise<void>;
}

export type Target = string | Element | NodeListOf<Element> | Element[];

export interface TimelineItem {
  target: Target;
  properties: AnimationProperties;
  options: AnimationOptions;
  offset: number;
  startTime: number;
}
