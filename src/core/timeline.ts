// FILE: src/core/timeline.ts

import type { Target, AnimationProperties, AnimationOptions, AnimationControl } from '../types';
import { animate } from './animate';

export interface TimelineOptions {
  repeat?: number;
  yoyo?: boolean;
  onComplete?: () => void;
}

interface TimelineSegment {
  target: Target;
  properties: AnimationProperties;
  options: AnimationOptions;
  offset: number;
}

export class Timeline {
  private segments: TimelineSegment[] = [];
  private totalDuration = 0;
  private repeat: number | boolean = 0;
  private yoyo: boolean = false;
  private onComplete?: () => void;
  private controls: AnimationControl[] = [];
  private isPlaying = false;
  
  constructor(options: TimelineOptions = {}) {
    this.repeat = options.repeat || 0;
    this.yoyo = options.yoyo || false;
    this.onComplete = options.onComplete;
  }
  
  add(
    target: Target,
    properties: AnimationProperties,
    options?: AnimationOptions,
    offset?: string | number
  ): this {
    let relativeOffset = 0;
    if (typeof offset === 'string') {
      if (offset.startsWith('+=')) {
        relativeOffset = this.totalDuration + parseFloat(offset.slice(2));
      } else if (offset.startsWith('-=')) {
        relativeOffset = this.totalDuration - parseFloat(offset.slice(2));
      } else {
        relativeOffset = parseFloat(offset);
      }
    } else if (typeof offset === 'number') {
      relativeOffset = offset;
    } else {
      relativeOffset = this.totalDuration;
    }
    
    const duration = options?.duration || 1000;
    const finalOptions: AnimationOptions = {
      duration,
      delay: (options?.delay || 0) + relativeOffset,
      easing: options?.easing,
      repeat: 0, // Timeline segments don't repeat individually
      onComplete: options?.onComplete,
    };
    
    this.segments.push({
      target,
      properties,
      options: finalOptions,
      offset: relativeOffset,
    });
    
    this.totalDuration = Math.max(this.totalDuration, relativeOffset + duration);
    return this;
  }
  
  play(): this {
    if (this.isPlaying) return this;
    this.isPlaying = true;
    
    // Clear any existing animations
    this.controls.forEach(control => control.kill());
    this.controls = [];
    
    // Start all segments with their absolute delays
    for (const segment of this.segments) {
      const control = animate(segment.target, segment.properties, segment.options);
      this.controls.push(control);
    }
    
    // Handle timeline repeat logic
    if ((typeof this.repeat === 'number' && this.repeat > 0) || this.repeat === true) {
      const repeatCount = this.repeat === true ? Infinity : this.repeat;
      let iteration = 0;
      
      const scheduleRepeat = () => {
        if (iteration >= repeatCount) {
          if (this.onComplete) this.onComplete();
          return;
        }
        
        setTimeout(() => {
          iteration++;
          this.controls.forEach(control => control.kill());
          this.controls = [];
          
          // Restart with reversed direction if yoyo
          const direction = this.yoyo && iteration % 2 === 1 ? -1 : 1;
          for (const segment of this.segments) {
            const modifiedProps = { ...segment.properties };
            if (direction === -1 && segment.properties.draw !== undefined) {
              // Reverse draw: go from 1 to 0 instead of 0 to 1
              modifiedProps.draw = 1 - (segment.properties.draw || 0);
            }
            const control = animate(segment.target, modifiedProps, segment.options);
            this.controls.push(control);
          }
          
          // Wait for all to complete
          Promise.all(this.controls.map(c => c.then(() => {}))).then(() => {
            scheduleRepeat();
          });
        }, this.totalDuration);
      };
      
      Promise.all(this.controls.map(c => c.then(() => {}))).then(() => {
        scheduleRepeat();
      });
    } else {
      Promise.all(this.controls.map(c => c.then(() => {}))).then(() => {
        if (this.onComplete) this.onComplete();
      });
    }
    
    return this;
  }
  
  pause(): this {
    this.controls.forEach(control => control.pause());
    this.isPlaying = false;
    return this;
  }
  
  resume(): this {
    this.controls.forEach(control => control.resume());
    this.isPlaying = true;
    return this;
  }
  
  kill(): this {
    this.controls.forEach(control => control.kill());
    this.controls = [];
    this.isPlaying = false;
    return this;
  }
  
  getDuration(): number {
    return this.totalDuration;
  }
}

export function timeline(options?: TimelineOptions): Timeline {
  return new Timeline(options);
}
