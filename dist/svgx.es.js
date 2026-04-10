var U = Object.defineProperty;
var b = (t, e, s) => e in t ? U(t, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : t[e] = s;
var d = (t, e, s) => (b(t, typeof e != "symbol" ? e + "" : e, s), s);
function v(t) {
  return typeof t == "string" ? Array.from(document.querySelectorAll(t)) : t instanceof Element ? [t] : t instanceof NodeList ? Array.from(t) : t;
}
function q(t) {
  return t.getTotalLength();
}
function X(t, e, s) {
  s || (s = q(t)), t.style.strokeDasharray = `${s}`, t.style.strokeDashoffset = `${e}`;
}
function z(t, e) {
  const s = [];
  if (e.x !== void 0 || e.y !== void 0) {
    const n = e.x ?? 0, o = e.y ?? 0;
    s.push(`translate(${n}, ${o})`);
  }
  e.scale !== void 0 && s.push(`scale(${e.scale})`), e.rotate !== void 0 && s.push(`rotate(${e.rotate})`), e.skewX !== void 0 && s.push(`skewX(${e.skewX})`), e.skewY !== void 0 && s.push(`skewY(${e.skewY})`), s.length && t.setAttribute("transform", s.join(" "));
}
function B(t, e) {
  t.style.opacity = String(e);
}
const y = Math.pow, k = 1.70158, P = k * 1.525, V = k + 1, C = {
  linear: (t) => t,
  easeIn: (t) => t * t,
  easeOut: (t) => 1 - (1 - t) * (1 - t),
  easeInOut: (t) => t < 0.5 ? 2 * t * t : 1 - y(-2 * t + 2, 2) / 2,
  easeInBack: (t) => V * t * t * t - k * t * t,
  easeOutBack: (t) => 1 + V * y(t - 1, 3) + k * y(t - 1, 2),
  easeInOutBack: (t) => t < 0.5 ? y(2 * t, 2) * ((P + 1) * 2 * t - P) / 2 : (y(2 * t - 2, 2) * ((P + 1) * (t * 2 - 2) + P) + 2) / 2
};
function G(t) {
  return typeof t == "function" ? t : C[t] || C.linear;
}
const Y = C;
function $(t, e, s) {
  return Math.min(s, Math.max(e, t));
}
function _(t, e, s, n, o) {
  return (t - e) / (s - e) * (o - n) + n;
}
function tt(t, e, s) {
  return t + (e - t) * s;
}
function N(t, e) {
  const s = q(t), n = s, o = s * (1 - e);
  return {
    element: t,
    length: s,
    startOffset: n,
    endOffset: o
  };
}
function R(t, e) {
  const s = t.startOffset + (t.endOffset - t.startOffset) * e;
  X(t.element, s, t.length);
}
function W(t, e) {
  return {
    element: t,
    startValues: {},
    endValues: { ...e }
  };
}
function j(t, e) {
  const s = {};
  for (const n in t.endValues) {
    const o = t.startValues[n] || 0, r = t.endValues[n] || 0;
    s[n] = o + (r - o) * e;
  }
  z(t.element, s);
}
function L(t, e) {
  const s = document.querySelector(e);
  return s ? (console.warn("Morph animation is a placeholder - full implementation coming soon"), {
    element: t,
    targetPath: s.getAttribute("d") || ""
  }) : null;
}
let H = 0;
const u = /* @__PURE__ */ new Map();
let c = null;
function D(t) {
  let e = !1;
  for (const [s, n] of u.entries()) {
    if (n.isPaused) {
      e = !0;
      continue;
    }
    const o = t - n.startTime;
    let r = 0, f = !1;
    if (o >= n.duration + n.delay)
      n.repeat !== void 0 && (n.repeat === !0 || n.currentIteration < n.repeat - 1) ? (n.currentIteration++, n.startTime = t, n.yoyo && (n.direction *= -1), r = n.direction === 1 ? 0 : 1, n.onUpdate && n.onUpdate()) : (f = !0, r = n.direction === 1 ? 1 : 0);
    else if (o < n.delay)
      r = 0;
    else {
      const l = (o - n.delay) / n.duration;
      r = n.direction === 1 ? $(l, 0, 1) : 1 - $(l, 0, 1);
    }
    const h = n.easing(r);
    for (const l of n.elements) {
      if (n.properties.draw !== void 0) {
        const m = n.drawStates.get(l);
        m && R(m, h);
      }
      if (n.properties.transform) {
        const m = n.transformStates.get(l);
        m && j(m, h);
      }
      if (n.properties.opacity !== void 0) {
        const m = n.opacityStart.get(l) || 0, A = n.opacityEnd.get(l) || 1, S = m + (A - m) * h;
        B(l, S);
      }
      n.properties.morph && n.morphStates.get(l);
    }
    n.onUpdate && n.onUpdate(), f ? (n.onComplete && n.onComplete(), u.delete(s)) : e = !0;
  }
  e && c === null ? c = requestAnimationFrame(function s(n) {
    c = null, D(n), u.size > 0 && (c = requestAnimationFrame(s));
  }) : !e && c !== null && (cancelAnimationFrame(c), c = null);
}
function J(t, e, s) {
  const n = v(t);
  if (n.length === 0)
    throw new Error(`SVGX: No elements found for target: ${t}`);
  const o = s.duration, r = s.delay || 0, f = G(s.easing || "linear"), h = s.repeat === !0 ? !0 : s.repeat || 0, l = s.yoyo || !1, m = s.onComplete, A = s.onUpdate, S = performance.now() + r, p = H++, E = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map();
  for (const i of n) {
    if (e.draw !== void 0 && i instanceof SVGPathElement) {
      const a = N(i, e.draw);
      E.set(i, a);
    }
    if (e.transform) {
      const a = W(i, e.transform);
      O.set(i, a);
    }
    if (e.opacity !== void 0) {
      const a = parseFloat(i.style.opacity) || 1;
      I.set(i, a), M.set(i, e.opacity);
    }
    if (e.morph && i instanceof SVGPathElement) {
      const a = L(i, e.morph);
      a && T.set(i, a);
    }
  }
  const x = {
    id: p,
    elements: n,
    startTime: S,
    duration: o,
    delay: r,
    easing: f,
    repeat: h,
    yoyo: l,
    currentIteration: 0,
    direction: 1,
    isPaused: !1,
    pausedTime: 0,
    pausedStart: 0,
    onComplete: m,
    onUpdate: A,
    drawStates: E,
    transformStates: O,
    morphStates: T,
    opacityStart: I,
    opacityEnd: M,
    properties: e
  };
  u.set(p, x), c === null && (c = requestAnimationFrame((i) => {
    c = null, D(i), u.size > 0 && (c = requestAnimationFrame(function a(w) {
      c = null, D(w), u.size > 0 && (c = requestAnimationFrame(a));
    }));
  }));
  let g = !1;
  return {
    pause() {
      const i = u.get(p);
      i && !i.isPaused && !g && (i.isPaused = !0, i.pausedStart = performance.now());
    },
    resume() {
      const i = u.get(p);
      if (i && i.isPaused && !g) {
        const a = performance.now() - i.pausedStart;
        i.startTime += a, i.isPaused = !1;
      }
    },
    seek(i) {
      const a = u.get(p);
      a && !g && (a.startTime = performance.now() - i, a.isPaused && (a.pausedStart = performance.now()));
    },
    kill() {
      g = !0, u.delete(p);
    },
    then(i) {
      return new Promise((a) => {
        const w = () => {
          u.has(p) ? requestAnimationFrame(w) : (i(), a());
        };
        w();
      });
    }
  };
}
function F(t, e, s) {
  return J(t, e, s);
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
  add(e, s, n, o) {
    let r = 0;
    typeof o == "string" ? o.startsWith("+=") ? r = this.totalDuration + parseFloat(o.slice(2)) : o.startsWith("-=") ? r = this.totalDuration - parseFloat(o.slice(2)) : r = parseFloat(o) : typeof o == "number" ? r = o : r = this.totalDuration;
    const f = (n == null ? void 0 : n.duration) || 1e3, h = {
      duration: f,
      delay: ((n == null ? void 0 : n.delay) || 0) + r,
      easing: n == null ? void 0 : n.easing,
      repeat: 0,
      // Timeline segments don't repeat individually
      onComplete: n == null ? void 0 : n.onComplete
    };
    return this.segments.push({
      target: e,
      properties: s,
      options: h,
      offset: r
    }), this.totalDuration = Math.max(this.totalDuration, r + f), this;
  }
  play() {
    if (this.isPlaying)
      return this;
    this.isPlaying = !0, this.controls.forEach((e) => e.kill()), this.controls = [];
    for (const e of this.segments) {
      const s = F(e.target, e.properties, e.options);
      this.controls.push(s);
    }
    if (typeof this.repeat == "number" && this.repeat > 0 || this.repeat === !0) {
      const e = this.repeat === !0 ? 1 / 0 : this.repeat;
      let s = 0;
      const n = () => {
        if (s >= e) {
          this.onComplete && this.onComplete();
          return;
        }
        setTimeout(() => {
          s++, this.controls.forEach((r) => r.kill()), this.controls = [];
          const o = this.yoyo && s % 2 === 1 ? -1 : 1;
          for (const r of this.segments) {
            const f = { ...r.properties };
            o === -1 && r.properties.draw !== void 0 && (f.draw = 1 - (r.properties.draw || 0));
            const h = F(r.target, f, r.options);
            this.controls.push(h);
          }
          Promise.all(this.controls.map((r) => r.then(() => {
          }))).then(() => {
            n();
          });
        }, this.totalDuration);
      };
      Promise.all(this.controls.map((o) => o.then(() => {
      }))).then(() => {
        n();
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
const et = {
  animate: F,
  timeline: Q,
  easing: Y
};
export {
  K as Timeline,
  F as animate,
  $ as clamp,
  et as default,
  Y as easing,
  G as getEasingFunction,
  v as getElements,
  q as getPathLength,
  tt as lerp,
  _ as mapRange,
  z as setTransform,
  Q as timeline
};
//# sourceMappingURL=svgx.es.js.map
