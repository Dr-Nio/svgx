// FILE: src/utils/dom.ts

import type { Target, TransformValues } from '../types';

export function getElements(target: Target): Element[] {
  if (typeof target === 'string') {
    return Array.from(document.querySelectorAll(target));
  }
  if (target instanceof Element) {
    return [target];
  }
  if (target instanceof NodeList) {
    return Array.from(target);
  }
  return target;
}

export function getPathLength(path: SVGPathElement): number {
  return path.getTotalLength();
}

export function setStrokeDashoffset(element: SVGPathElement, value: number, totalLength?: number): void {
  if (!totalLength) {
    totalLength = getPathLength(element);
  }
  element.style.strokeDasharray = `${totalLength}`;
  element.style.strokeDashoffset = `${value}`;
}

export function getCurrentTransform(element: Element): string {
  return element.getAttribute('transform') || '';
}

export function setTransform(element: Element, values: TransformValues): void {
  const parts: string[] = [];
  if (values.x !== undefined || values.y !== undefined) {
    const x = values.x ?? 0;
    const y = values.y ?? 0;
    parts.push(`translate(${x}, ${y})`);
  }
  if (values.scale !== undefined) {
    parts.push(`scale(${values.scale})`);
  }
  if (values.rotate !== undefined) {
    parts.push(`rotate(${values.rotate})`);
  }
  if (values.skewX !== undefined) {
    parts.push(`skewX(${values.skewX})`);
  }
  if (values.skewY !== undefined) {
    parts.push(`skewY(${values.skewY})`);
  }
  if (parts.length) {
    element.setAttribute('transform', parts.join(' '));
  }
}

export function setOpacity(element: Element, value: number): void {
  (element as SVGElement).style.opacity = String(value);
}
