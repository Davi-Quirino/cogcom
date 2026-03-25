document.addEventListener("DOMContentLoaded", function () {
  lucide.createIcons();

  // ─── Mobile Menu Toggle ───
  var menuBtn = document.getElementById("open-menu");
  var closeBtn = document.getElementById("close-menu");
  var mobileMenu = document.getElementById("mobile-menu");

  function toggleMenu() {
    var isHidden = mobileMenu.classList.contains("hidden-menu");
    if (isHidden) {
      mobileMenu.classList.remove("hidden-menu");
      mobileMenu.classList.add("visible-menu");
      document.body.style.overflow = "hidden";
    } else {
      mobileMenu.classList.remove("visible-menu");
      mobileMenu.classList.add("hidden-menu");
      document.body.style.overflow = "";
    }
  }

  if (menuBtn) menuBtn.addEventListener("click", toggleMenu);
  if (closeBtn) closeBtn.addEventListener("click", toggleMenu);

  // Close mobile menu when clicking on nav links
  mobileMenu.querySelectorAll("a[href^='#']").forEach(function (link) {
    link.addEventListener("click", function () {
      if (mobileMenu.classList.contains("visible-menu")) {
        toggleMenu();
      }
    });
  });

  // ─── FAQ Accordion ───
  window.toggleFaq = function (header) {
    var item = header.closest(".faq-item");
    var body = item.querySelector(".faq-body");
    var iconBarV = header.querySelector(".faq-icon-bar-v");
    var isOpen = item.classList.contains("is-open");

    document.querySelectorAll(".faq-item.is-open").forEach(function (openItem) {
      openItem.classList.remove("is-open");
      openItem.querySelector(".faq-body").style.height = "0";
      var v = openItem.querySelector(".faq-icon-bar-v");
      if (v) v.style.transform = "translateX(-50%) rotate(0deg)";
      var bars = openItem.querySelectorAll(".faq-icon div");
      bars.forEach(function (b) {
        b.style.backgroundColor = "var(--brown-400)";
      });
      var num = openItem.querySelector(".faq-header span");
      if (num) num.style.color = "var(--brown-400)";
      var q = openItem.querySelector(".faq-header h3");
      if (q) q.style.color = "var(--cream-50)";
    });

    if (!isOpen) {
      item.classList.add("is-open");
      body.style.height = body.scrollHeight + "px";
      if (iconBarV)
        iconBarV.style.transform = "translateX(-50%) rotate(90deg)";
      var bars = item.querySelectorAll(".faq-icon div");
      bars.forEach(function (b) {
        b.style.backgroundColor = "var(--gold)";
      });
      var num = item.querySelector(".faq-header span");
      if (num) num.style.color = "var(--gold)";
      var q = item.querySelector(".faq-header h3");
      if (q) q.style.color = "var(--gold)";
    }
  };

  // ─── Scroll Reveal Observer ───
  var observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".scroll-reveal").forEach(function (el) {
    observer.observe(el);
  });

  // ─── Video Scrubbing (Apple-style Canvas + GSAP) ───
  initVideoScrub();

  // ─── Image Fallback Handler ───
  initImageFallback();
});

function initVideoScrub() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  var video = document.getElementById("hero-video");
  if (!video) return;

  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d", { alpha: false });
  canvas.className = "hero-canvas";
  canvas.style.cssText =
    "position:absolute;top:0;left:0;width:100%;height:100%;" +
    "object-fit:cover;object-position:80% center;z-index:0;" +
    "transform:translate3d(0,0,0);backface-visibility:hidden";
  video.parentElement.insertBefore(canvas, video.nextSibling);

  function drawFrame() {
    if (video.readyState >= 2) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
  }

  function startScrub() {
    var duration = video.duration;
    canvas.width = video.videoWidth || 1920;
    canvas.height = video.videoHeight || 1080;
    video.pause();
    video.currentTime = 0;

    video.addEventListener("seeked", drawFrame);

    if (video.readyState >= 2) {
      drawFrame();
      video.style.opacity = "0";
    } else {
      video.addEventListener(
        "canplay",
        function () {
          drawFrame();
          video.style.opacity = "0";
        },
        { once: true }
      );
    }

    var proxy = { t: 0 };
    gsap.to(proxy, {
      t: duration,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero-wrapper",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
      onUpdate: function () {
        video.currentTime = proxy.t;
      },
    });
  }

  var sourceEl = video.querySelector("source");
  var videoSrc = sourceEl ? sourceEl.src : video.src;

  fetch(videoSrc)
    .then(function (res) {
      return res.blob();
    })
    .then(function (blob) {
      var blobUrl = URL.createObjectURL(blob);
      if (sourceEl) sourceEl.remove();
      video.src = blobUrl;
      video.addEventListener("loadeddata", startScrub, { once: true });
      video.load();
    })
    .catch(function () {
      if (video.readyState >= 2) startScrub();
      else video.addEventListener("loadeddata", startScrub, { once: true });
      video.load();
    });
}

function initImageFallback() {
  var fallbacks = [
    "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg",
    "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg",
    "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c543a9e1-f226-4ced-80b0-feb8445a75b9_1600w.jpg",
    "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/5bab247f-35d9-400d-a82b-fd87cfe913d2_1600w.webp",
    "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/30104e3c-5eea-4b93-93e9-5313698a7156_1600w.webp",
  ];
  var tried = new Set();

  function hash(s) {
    for (var x = 0, i = 0; i < s.length; i++)
      x = ((x << 5) - x + s.charCodeAt(i)) | 0;
    return fallbacks[Math.abs(x) % fallbacks.length];
  }

  function replaceImg(t) {
    var s = t.src;
    if (s && !tried.has(s)) {
      tried.add(s);
      t.src = hash(s);
    }
  }

  window.addEventListener(
    "error",
    function (e) {
      var t = e.target;
      if (t && t.tagName === "IMG") replaceImg(t);
    },
    true
  );

  function checkBroken() {
    document.querySelectorAll("img").forEach(function (i) {
      if (i.complete && !i.naturalWidth && i.src) replaceImg(i);
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", checkBroken);
  else checkBroken();
}
