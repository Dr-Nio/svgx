var V = Object.defineProperty;
var q = (t, e, n) => e in t ? V(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var d = (t, e, n) => (q(t, typeof e != "symbol" ? e + "" : e, n), n);
function X(t) {
  return typeof t == "string" ? Array.from(document.querySelectorAll(t)) : t instanceof Element ? [t] : t instanceof NodeList ? Array.from(t) : t;
}
function M(t) {
  return t.getTotalLength();
}
function U(t, e, n) {
  n || (n = M(t)), t.style.strokeDasharray = `${n}`, t.style.strokeDashoffset = `${e}`;
}
function Y(t) {
  return t.getAttribute("transform") || "";
}
function _(t, e) {
  const n = [];
  if (e.x !== void 0 || e.y !== void 0) {
    const s = e.x ?? 0, r = e.y ?? 0;
    n.push(`translate(${s}, ${r})`);
  }
  e.scale !== void 0 && n.push(`scale(${e.scale})`), e.rotate !== void 0 && n.push(`rotate(${e.rotate})`), e.skewX !== void 0 && n.push(`skewX(${e.skewX})`), e.skewY !== void 0 && n.push(`skewY(${e.skewY})`), n.length && t.setAttribute("transform", n.join(" "));
}
function z(t, e) {
  t.style.opacity = String(e);
}
const y = Math.pow, A = 1.70158, k = A * 1.525, x = A + 1, $ = {
  linear: (t) => t,
  easeIn: (t) => t * t,
  easeOut: (t) => 1 - (1 - t) * (1 - t),
  easeInOut: (t) => t < 0.5 ? 2 * t * t : 1 - y(-2 * t + 2, 2) / 2,
  easeInBack: (t) => x * t * t * t - A * t * t,
  easeOutBack: (t) => 1 + x * y(t - 1, 3) + A * y(t - 1, 2),
  easeInOutBack: (t) => t < 0.5 ? y(2 * t, 2) * ((k + 1) * 2 * t - k) / 2 : (y(2 * t - 2, 2) * ((k + 1) * (t * 2 - 2) + k) + 2) / 2
};
function B(t) {
  return typeof t == "function" ? t : $[t] || $.linear;
}
const G = $;
function I(t, e, n) {
  return Math.min(n, Math.max(e, t));
}
function tt(t, e, n) {
  return t + (e - t) * n;
}
function et(t, e, n, s, r) {
  return (t - e) / (n - e) * (r - s) + s;
}
function j(t, e) {
  const n = M(t);
  t.style.strokeDasharray = `${n}`, t.style.strokeDashoffset = `${n}`;
  const s = n, r = n * (1 - e);
  return {
    element: t,
    length: n,
    startOffset: s,
    endOffset: r
  };
}
function N(t, e) {
  const n = t.startOffset + (t.endOffset - t.startOffset) * e;
  U(t.element, n, t.length);
}
function R(t, e) {
  const n = Y(t);
  return {
    element: t,
    startValues: {},
    endValues: { ...e },
    baseTransform: n
  };
}
function W(t, e) {
  const n = {};
  for (const o in t.endValues) {
    const c = t.startValues[o] || 0, f = t.endValues[o] || 0;
    n[o] = c + (f - c) * e;
  }
  const s = t.baseTransform ? `${t.baseTransform} ` : "", r = [];
  (n.x !== void 0 || n.y !== void 0) && r.push(`translate(${n.x ?? 0}, ${n.y ?? 0})`), n.scale !== void 0 && r.push(`scale(${n.scale})`), n.rotate !== void 0 && r.push(`rotate(${n.rotate})`), n.skewX !== void 0 && r.push(`skewX(${n.skewX})`), n.skewY !== void 0 && r.push(`skewY(${n.skewY})`), r.length && t.element.setAttribute("transform", s + r.join(" "));
}
function L(t, e) {
  const n = document.querySelector(e);
  return n ? (console.warn("Morph animation is a placeholder - full implementation coming soon"), {
    element: t,
    targetPath: n.getAttribute("d") || ""
  }) : null;
}
let H = 0;
const m = /* @__PURE__ */ new Map();
let l = null;
function D(t) {
  let e = !1;
  for (const [n, s] of m.entries()) {
    if (s.isPaused) {
      e = !0;
      continue;
    }
    const r = t - s.startTime;
    let o = 0, c = !1;
    if (r >= s.duration + s.delay)
      s.repeat !== void 0 && (s.repeat === !0 || s.currentIteration < s.repeat - 1) ? (s.currentIteration++, s.startTime = t, s.yoyo && (s.direction *= -1), o = s.direction === 1 ? 0 : 1, s.onUpdate && s.onUpdate()) : (c = !0, o = s.direction === 1 ? 1 : 0);
    else if (r < s.delay)
      o = 0;
    else {
      const u = (r - s.delay) / s.duration;
      o = s.direction === 1 ? I(u, 0, 1) : 1 - I(u, 0, 1);
    }
    const f = s.easing(o);
    for (const u of s.elements) {
      if (s.properties.draw !== void 0) {
        const h = s.drawStates.get(u);
        h && N(h, f);
      }
      if (s.properties.transform) {
        const h = s.transformStates.get(u);
        h && W(h, f);
      }
      if (s.properties.opacity !== void 0) {
        const h = s.opacityStart.get(u) || 0, P = s.opacityEnd.get(u) || 1, S = h + (P - h) * f;
        z(u, S);
      }
      s.properties.morph && s.morphStates.get(u);
    }
    s.onUpdate && s.onUpdate(), c ? (s.onComplete && s.onComplete(), m.delete(n)) : e = !0;
  }
  e && l === null ? l = requestAnimationFrame(function n(s) {
    l = null, D(s), m.size > 0 && (l = requestAnimationFrame(n));
  }) : !e && l !== null && (cancelAnimationFrame(l), l = null);
}
function J(t, e, n) {
  const s = X(t);
  if (s.length === 0)
    throw new Error(`SVGX: No elements found for target: ${t}`);
  const r = n.duration, o = n.delay || 0, c = B(n.easing || "linear"), f = n.repeat === !0 ? !0 : n.repeat || 0, u = n.yoyo || !1, h = n.onComplete, P = n.onUpdate, S = performance.now() + o, p = H++, C = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map();
  for (const i of s) {
    if (e.draw !== void 0 && i instanceof SVGPathElement) {
      const a = j(i, e.draw);
      C.set(i, a);
    }
    if (e.transform) {
      const a = R(i, e.transform);
      F.set(i, a);
    }
    if (e.opacity !== void 0) {
      const a = parseFloat(i.style.opacity) || 1;
      O.set(i, a), v.set(i, e.opacity);
    }
    if (e.morph && i instanceof SVGPathElement) {
      const a = L(i, e.morph);
      a && E.set(i, a);
    }
  }
  const b = {
    id: p,
    elements: s,
    startTime: S,
    duration: r,
    delay: o,
    easing: c,
    repeat: f,
    yoyo: u,
    currentIteration: 0,
    direction: 1,
    isPaused: !1,
    pausedTime: 0,
    pausedStart: 0,
    onComplete: h,
    onUpdate: P,
    drawStates: C,
    transformStates: F,
    morphStates: E,
    opacityStart: O,
    opacityEnd: v,
    properties: e
  };
  m.set(p, b), l === null && (l = requestAnimationFrame((i) => {
    l = null, D(i), m.size > 0 && (l = requestAnimationFrame(function a(w) {
      l = null, D(w), m.size > 0 && (l = requestAnimationFrame(a));
    }));
  }));
  let g = !1;
  return {
    pause() {
      const i = m.get(p);
      i && !i.isPaused && !g && (i.isPaused = !0, i.pausedStart = performance.now());
    },
    resume() {
      const i = m.get(p);
      if (i && i.isPaused && !g) {
        const a = performance.now() - i.pausedStart;
        i.startTime += a, i.isPaused = !1;
      }
    },
    seek(i) {
      const a = m.get(p);
      a && !g && (a.startTime = performance.now() - i, a.isPaused && (a.pausedStart = performance.now()));
    },
    kill() {
      g = !0, m.delete(p);
    },
    then(i) {
      return new Promise((a) => {
        const w = () => {
          m.has(p) ? requestAnimationFrame(w) : (i(), a());
        };
        w();
      });
    }
  };
}
function T(t, e, n) {
  return J(t, e, n);
}
class K {
  constructor(e = {}) {
    d(this, "segments", []);
    d(this, "totalDuration", 0);
    d(this, "repeat", 0);
    d(this, "yoyo", !1);
    d(this, "onComplete");
    d(this, "controls", []);
    d(this, "isPlaying", !1);
    this.repeat = e.repeat || 0, this.yoyo = e.yoyo || !1, this.onComplete = e.onComplete;
  }
  add(e, n, s, r) {
    let o = 0;
    typeof r == "string" ? r.startsWith("+=") ? o = this.totalDuration + parseFloat(r.slice(2)) : r.startsWith("-=") ? o = this.totalDuration - parseFloat(r.slice(2)) : o = parseFloat(r) : typeof r == "number" ? o = r : o = this.totalDuration;
    const c = (s == null ? void 0 : s.duration) || 1e3, f = {
      duration: c,
      delay: ((s == null ? void 0 : s.delay) || 0) + o,
      easing: s == null ? void 0 : s.easing,
      repeat: 0,
      // Timeline segments don't repeat individually
      onComplete: s == null ? void 0 : s.onComplete
    };
    return this.segments.push({
      target: e,
      properties: n,
      options: f,
      offset: o
    }), this.totalDuration = Math.max(this.totalDuration, o + c), this;
  }
  play() {
    if (this.isPlaying)
      return this;
    this.isPlaying = !0, this.controls.forEach((e) => e.kill()), this.controls = [];
    for (const e of this.segments) {
      const n = T(e.target, e.properties, e.options);
      this.controls.push(n);
    }
    if (typeof this.repeat == "number" && this.repeat > 0 || this.repeat === !0) {
      const e = this.repeat === !0 ? 1 / 0 : this.repeat;
      let n = 0;
      const s = () => {
        if (n >= e) {
          this.onComplete && this.onComplete();
          return;
        }
        setTimeout(() => {
          n++, this.controls.forEach((o) => o.kill()), this.controls = [];
          const r = this.yoyo && n % 2 === 1 ? -1 : 1;
          for (const o of this.segments) {
            const c = { ...o.properties };
            r === -1 && o.properties.draw !== void 0 && (c.draw = 1 - (o.properties.draw || 0));
            const f = T(o.target, c, o.options);
            this.controls.push(f);
          }
          Promise.all(this.controls.map((o) => o.then(() => {
          }))).then(() => {
            s();
          });
        }, this.totalDuration);
      };
      Promise.all(this.controls.map((r) => r.then(() => {
      }))).then(() => {
        s();
      });
    } else
      Promise.all(this.controls.map((e) => e.then(() => {
      }))).then(() => {
        this.onComplete && this.onComplete();
      });
    return this;
  }
  pause() {
    return this.controls.forEach((e) => e.pause()), this.isPlaying = !1, this;
  }
  resume() {
    return this.controls.forEach((e) => e.resume()), this.isPlaying = !0, this;
  }
  kill() {
    return this.controls.forEach((e) => e.kill()), this.controls = [], this.isPlaying = !1, this;
  }
  getDuration() {
    return this.totalDuration;
  }
}
function Q(t) {
  return new K(t);
}
const nt = {
  animate: T,
  timeline: Q,
  easing: G
};
export {
  K as Timeline,
  T as animate,
  I as clamp,
  nt as default,
  G as easing,
  B as getEasingFunction,
  X as getElements,
  M as getPathLength,
  tt as lerp,
  et as mapRange,
  _ as setTransform,
  Q as timeline
};
//# sourceMappingURL=svgx.es.js.map
