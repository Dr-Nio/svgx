// SVGX Auto-initializer for CSS utility classes
(function() {
  function initSVGX() {
    document.querySelectorAll('.svg-draw').forEach(path => {
      if (path.getTotalLength) {
        const len = path.getTotalLength();
        path.style.setProperty('--svgx-length', len);
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSVGX);
  } else {
    initSVGX();
  }
})();
