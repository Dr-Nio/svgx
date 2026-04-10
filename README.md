# SVGX - Modern SVG Animation Library

[![npm version](https://badge.fury.io/js/svgx.svg)](https://www.npmjs.com/package/svgx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

SVGX is a lightweight, developer-friendly SVG animation library that combines the best of Tailwind CSS (utility-first) and GSAP (powerful JS API).

## Features

- 🎨 **Utility-first CSS** - Animate with simple classes like `.svg-draw` and `.svg-duration-500`
- ⚡ **Powerful JS API** - Full programmatic control with `animate()` function
- 📅 **Timeline System** - Sequence complex animations with chainable API
- 🎯 **SVG-First** - Specialized for path drawing, transforms, and opacity
- 🔄 **Loop & Yoyo** - Built-in repeat and reverse animations
- 📦 **Zero Dependencies** - Small footprint, high performance
- 🧩 **Tree-shakable** - Import only what you need
- 📘 **TypeScript** - Full type definitions included

## Installation

```bash
npm install svgx
```

## Or use CDN:

```bash
<script src="https://unpkg.com/svgx@1.0.0/dist/svgx.umd.js"></script>
<link rel="stylesheet" href="https://unpkg.com/svgx@1.0.0/dist/svgx.css">
```

## Quick Start
- **CSS Utility Classes**

```bash
<svg viewBox="0 0 100 100">
  <path class="svg-draw svg-duration-1000 svg-ease-out" d="M10,50 L90,50" stroke="black" stroke-width="2"/>
</svg>
```

## JavaScript API

```bash
import { animate } from 'svgx';

// Draw a path
animate('#myPath', {
  draw: 1,
  opacity: 0.5,
  transform: { rotate: 360 }
}, {
  duration: 1000,
  easing: 'easeOut',
  repeat: 2,
  yoyo: true
});
```

## Timeline

```bash
import { timeline } from 'svgx';

const tl = timeline()
  .add('#path1', { draw: 1 }, { duration: 500 })
  .add('#path2', { opacity: 1 }, { duration: 300 }, '-=0.2')
  .add('#circle', { transform: { scale: 1.5 } }, { duration: 400 })
  .play();
```

## API Reference

```bash
animate(target, properties, options)
```

- **Parameters:**

target: CSS selector string, Element, or array of Elements

properties: Object with animation targets

    draw: number (0-1) - path drawing progress

    opacity: number (0-1)

    transform: Object with x, y, scale, rotate, skewX, skewY

    morph: string - target path selector (placeholder)

options: Animation options

    duration: number (ms)

    delay: number (ms)

    easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'easeInBack' | 'easeOutBack' | 'easeInOutBack'

    repeat: number | true (infinite)

    yoyo: boolean

    onComplete: function

    onUpdate: function

Returns: AnimationControl object with pause(), resume(), seek(), kill(), then()

## timeline(options)

Creates a new timeline for sequencing animations.

## Methods:

add(target, properties, options, offset) - Add animation to timeline

play() - Start timeline

pause() / resume() - Control playback

kill() - Stop all animations

getDuration() - Get total timeline length

## Examples

- **Path Drawing Animation**

```bash
import { animate } from 'svgx';

animate('#logo-path', {
  draw: 1,
  transform: { scale: 1.2 }
}, {
  duration: 1500,
  easing: 'easeOutBack'
});
```

## Complete Logo Reveal

```bash
import { timeline } from 'svgx';

timeline()
  .add('#logo-outline', { draw: 1 }, { duration: 800 })
  .add('#logo-fill', { opacity: 1 }, { duration: 400 }, '-=0.3')
  .add('#logo-text', { transform: { x: 20 } }, { duration: 600 })
  .play();
```

## Browser Support

SVGX works in all modern browsers that support ES6 and SVG.

## Contributing

We welcome contributions! Please see CONTRIBUTING.md for guidelines.

## License

MIT © SVGX Contributors

## CDN

```bash
<script src="https://unpkg.com/svgx@1.0.0/dist/svgx.umd.js"></script>
<link rel="stylesheet" href="https://unpkg.com/svgx@1.0.0/dist/svgx.css">
```
## Basic Usage

## CSS Utility Classes

- **Add classes directly to your SVG elements:**

```bash
<svg>
  <path class="svg-draw svg-duration-1000 svg-ease-out" d="..."/>
</svg>
```
