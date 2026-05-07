/* video.js — Plyr initialization + lazy loading for videos */
(function () {
  const players = [];

  // Lazy load video sources when element enters viewport
  function setupLazyLoad() {
    const videos = document.querySelectorAll('.over-promo-video');
    videos.forEach(function (video) {
      if (video._lazySetup) return;
      video._lazySetup = true;

      ScrollTrigger.create({
        trigger: video,
        onEnter: function () {
          loadVideoSources(video);
        },
        once: true,
      });
    });
  }

  function loadVideoSources(videoEl) {
    const sources = videoEl.querySelectorAll('source[data-src], source[data-src-mobile]');
    sources.forEach(function (source) {
      const dataSrc = source.getAttribute('data-src') || source.getAttribute('data-src-mobile');
      if (dataSrc && !source.getAttribute('src')) {
        source.setAttribute('src', dataSrc);
        videoEl.load();
      }
    });
  }

  function initPlyr() {
    document.querySelectorAll('.ex-reel, .over-promo-video').forEach(function (el) {
      if (!el._plyrInitialized) {
        players.push(new Plyr(el, {
          controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
          resetOnEnd: true,
          tooltips: { controls: false, seek: true },
          hideControls: true,
        }));
        el._plyrInitialized = true;
      }
    });
    window.__plyrPlayers = players;
  }

  function init() {
    setupLazyLoad();
    initPlyr();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Global helper: pause all players (used by grid.js + go())
  window.pauseAllPlayers = function () {
    (window.__plyrPlayers || []).forEach(function (p) {
      try { p.pause(); } catch (e) {}
    });
  };
})();
