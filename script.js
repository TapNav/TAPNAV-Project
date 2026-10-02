const copyButton = document.querySelector("[data-copy-target]");
const copyStatus = document.getElementById("copy-status");

if (copyButton) {
  let resetCopyLabel;
  copyButton.addEventListener("click", async () => {
    const target = document.getElementById(copyButton.dataset.copyTarget);
    if (!target) return;
    window.clearTimeout(resetCopyLabel);

    try {
      await navigator.clipboard.writeText(target.innerText.trim());
      copyButton.textContent = "Copied";
      if (copyStatus) copyStatus.textContent = "BibTeX citation copied.";
    } catch {
      // Local file previews may not have clipboard permission. Select the citation.
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(target);
      selection?.removeAllRanges();
      selection?.addRange(range);
      target.focus({ preventScroll: true });
      copyButton.textContent = "Selected";
      if (copyStatus) copyStatus.textContent = "Citation selected. Press Command+C or Control+C to copy.";
    }
    resetCopyLabel = window.setTimeout(() => {
      copyButton.textContent = "Copy";
    }, 2000);
  });
}

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealElements = [...document.querySelectorAll(".reveal")];
let revealObserver;

function honorMotionPreference() {
  if (!reducedMotion.matches) return;
  document.documentElement.classList.remove("motion-ready");
  revealObserver?.disconnect();
  revealElements.forEach((element) => element.classList.add("is-visible"));
  document.querySelectorAll("video[autoplay]").forEach((video) => {
    video.autoplay = false;
    video.pause();
  });
}

if (!reducedMotion.matches && "IntersectionObserver" in window) {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: "0px 0px 100px 0px" });
  revealElements.forEach((element) => revealObserver.observe(element));
  document.documentElement.classList.add("motion-ready");
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}
honorMotionPreference();
reducedMotion.addEventListener("change", honorMotionPreference);

// The wordmark moves only while it can be seen; CSS owns the animation itself.
const wordmark = document.querySelector(".tapnav-wordmark");
let wordmarkInView = !("IntersectionObserver" in window);
function updateWordmarkMotion() {
  wordmark?.classList.toggle("is-animating", wordmarkInView &&
    document.visibilityState === "visible" && !reducedMotion.matches);
}
if (wordmark) {
  if ("IntersectionObserver" in window) {
    const wordmarkObserver = new IntersectionObserver((entries) => {
      wordmarkInView = entries.some((entry) => entry.isIntersecting);
      updateWordmarkMotion();
    }, { threshold: 0.15 });
    wordmarkObserver.observe(wordmark);
  }
  document.addEventListener("visibilitychange", updateWordmarkMotion);
  reducedMotion.addEventListener("change", updateWordmarkMotion);
  updateWordmarkMotion();
}

// Fetch the nearby experiments first, leaving the rest of the page light.
// The expanded player can still start a video immediately, before observation.
const deferredVideos = [...document.querySelectorAll("video[data-lazy-video]")];
function prepareVideoMetadata(video) {
  if (video.preload !== "none") return;
  video.preload = "metadata";
  if (video.readyState === 0 && video.paused) video.load();
}

if ("IntersectionObserver" in window) {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      prepareVideoMetadata(entry.target);
      videoObserver.unobserve(entry.target);
    });
  }, { rootMargin: "350px 0px", threshold: 0 });
  deferredVideos.forEach((video) => {
    videoObserver.observe(video);
    video.addEventListener("play", () => videoObserver.unobserve(video), { once: true });
  });
} else {
  deferredVideos.forEach(prepareVideoMetadata);
}

// Start visible comparison rows together, without loading every experiment at once.
// The persistent cards keep their visibility when a video moves into the viewer.
const experimentPlayback = new Map();
const experimentRows = new Map();
const experimentCards = new Map();
let experimentDialogOpen = false;
let expandedExperiment = null;
const canObserveExperiments = "IntersectionObserver" in window;

document.querySelectorAll("video[data-scroll-autoplay]").forEach((video) => {
  const card = video.closest(".experiment-video-card") || video;
  const row = video.closest(".simulation-map-row, .real-world-trial-row, .recovery-video-slot") || card;
  if (!experimentRows.has(row)) experimentRows.set(row, { visible: false, videos: [] });
  const state = { video, row, visible: false, blocked: false, request: 0, pending: false };
  experimentRows.get(row).videos.push(state);
  experimentCards.set(card, state);
  experimentPlayback.set(video, state);
});

function experimentShouldPlay(state) {
  return canObserveExperiments && !experimentDialogOpen && !reducedMotion.matches &&
    document.visibilityState === "visible" && state.visible && experimentRows.get(state.row).visible;
}

function pauseExperiment(state) {
  state.request += 1;
  state.pending = false;
  state.video.pause();
}

function reconcileExperimentPlayback() {
  experimentPlayback.forEach((state) => {
    if (state.video === expandedExperiment && document.visibilityState === "visible") return;
    if (!experimentShouldPlay(state)) {
      if (!state.video.paused || state.pending) pauseExperiment(state);
      return;
    }
    if (state.blocked || state.pending || !state.video.paused) return;
    const request = ++state.request;
    state.pending = true;
    state.video.muted = true;
    let playback;
    try { playback = state.video.play(); }
    catch {
      state.pending = false;
      state.blocked = true;
      return;
    }
    Promise.resolve(playback).then(() => {
      if (state.request === request) state.pending = false;
      // A slow play request must not outlive a scroll, hidden tab, or modal change.
      if (state.video !== expandedExperiment && !experimentShouldPlay(state)) state.video.pause();
      if (document.visibilityState !== "visible") state.video.pause();
    }).catch(() => {
      if (state.request !== request) return;
      state.pending = false;
      state.blocked = true; // Wait for an explicit media interaction, never retry in a loop.
    });
  });
}

function beginExperimentDialog(media) {
  experimentDialogOpen = true;
  expandedExperiment = experimentPlayback.has(media) ? media : null;
  experimentPlayback.forEach((state) => {
    state.blocked = false;
    pauseExperiment(state);
  });
}

function endExperimentDialog() {
  experimentDialogOpen = false;
  expandedExperiment = null;
  reconcileExperimentPlayback();
}

if (experimentPlayback.size && canObserveExperiments) {
  const playbackObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const row = experimentRows.get(entry.target);
      if (row) row.visible = entry.isIntersecting;
      const state = experimentCards.get(entry.target);
      if (state) state.visible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
    });
    reconcileExperimentPlayback();
  }, { rootMargin: "-70px 0px -20px 0px", threshold: [0, 0.25] });
  new Set([...experimentRows.keys(), ...experimentCards.keys()]).forEach((element) => playbackObserver.observe(element));
  document.addEventListener("visibilitychange", reconcileExperimentPlayback);
  reducedMotion.addEventListener("change", reconcileExperimentPlayback);
}

const pageIndex = document.querySelector(".page-index");
const readingProgress = document.querySelector(".reading-progress");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
let glassBounds = null;
let glassFrame = 0;
let glassPointerX = 0;
let glassPointerInside = false;

function resetGlassPointer() {
  window.cancelAnimationFrame(glassFrame);
  glassFrame = 0;
  glassBounds = null;
  glassPointerInside = false;
  pageIndex?.classList.remove("has-pointer");
}

function scheduleGlassReflection() {
  if (!glassPointerInside || !glassBounds || glassFrame) return;
  glassFrame = window.requestAnimationFrame(() => {
    glassFrame = 0;
    if (!glassBounds) return;
    const x = Math.max(0, Math.min(glassBounds.width, glassPointerX - glassBounds.left));
    pageIndex.style.setProperty("--glass-x", `${x.toFixed(2)}px`);
    pageIndex.classList.add("has-pointer");
  });
}

function measureGlassBounds() {
  if (!pageIndex || !glassPointerInside) return;
  const bounds = pageIndex.getBoundingClientRect();
  glassBounds = { left: bounds.left, width: bounds.width };
  scheduleGlassReflection();
}

if (pageIndex) {
  pageIndex.addEventListener("pointerenter", (event) => {
    if (!finePointer.matches || reducedMotion.matches || event.pointerType === "touch" ||
        document.visibilityState !== "visible") return;
    glassPointerInside = true;
    glassPointerX = event.clientX;
    measureGlassBounds();
  }, { passive: true });
  pageIndex.addEventListener("pointermove", (event) => {
    if (!glassPointerInside || event.pointerType === "touch") return;
    glassPointerX = event.clientX;
    scheduleGlassReflection();
  }, { passive: true });
  pageIndex.addEventListener("pointerleave", resetGlassPointer, { passive: true });
  pageIndex.addEventListener("pointercancel", resetGlassPointer, { passive: true });
  window.addEventListener("resize", measureGlassBounds, { passive: true });
  window.addEventListener("blur", resetGlassPointer);
  finePointer.addEventListener("change", resetGlassPointer);
  reducedMotion.addEventListener("change", resetGlassPointer);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") resetGlassPointer();
  });
}

const sectionLinks = [...document.querySelectorAll('.page-index a[href^="#"]')]
  .map((link) => ({ link, section: document.getElementById(link.hash.slice(1)) }))
  .filter(({ section }) => section);
let scrollUpdatePending = false;
let layoutUpdatePending = false;
let scrollRange = 0;
let sectionThreshold = 0;
let sectionPositions = [];
let currentActiveLink = null;
let indexIsScrolled = false;
let pendingNavigation = null;
let navigationSettleTimer = 0;
let navigationFallbackTimer = 0;
let arrivalHeading = null;
let arrivalTimer = 0;
let indicatorFrame = 0;
let indicatorTime = null;
let indicatorInitialized = false;
const indicatorSpring = {
  x: 0, width: 0, velocityX: 0, velocityWidth: 0, targetX: 0, targetWidth: 0,
};
pageIndex?.classList.add("has-spring-indicator");

function paintIndicator() {
  pageIndex?.style.setProperty("--active-x", `${indicatorSpring.x.toFixed(3)}px`);
  pageIndex?.style.setProperty("--active-width", `${indicatorSpring.width.toFixed(3)}px`);
  const velocity = indicatorSpring.velocityX;
  const stretch = 1 + Math.min(1, Math.abs(velocity) / 2200) * 0.06;
  const lean = Math.max(-1, Math.min(1, velocity / 2400)) * 3;
  pageIndex?.style.setProperty("--active-stretch", velocity === 0 ? "1" : stretch.toFixed(4));
  pageIndex?.style.setProperty("--active-lean", velocity === 0 ? "0deg" : `${lean.toFixed(3)}deg`);
}

function stopIndicator() {
  window.cancelAnimationFrame(indicatorFrame);
  indicatorFrame = 0;
  indicatorTime = null;
  pageIndex?.classList.remove("is-moving");
  pageIndex?.style.setProperty("--active-stretch", "1");
  pageIndex?.style.setProperty("--active-lean", "0deg");
}

function animateIndicator(timestamp) {
  indicatorFrame = 0;
  const dt = indicatorTime === null ? 1 / 60 : Math.min((timestamp - indicatorTime) / 1000, 1 / 30);
  indicatorTime = timestamp;
  // The exact critically damped solution stays stable at different refresh rates.
  // Retargeting changes only the destination, so motion keeps its momentum.
  const frequency = 19;
  const decay = Math.exp(-frequency * dt);
  for (const [value, velocity, target] of [
    ["x", "velocityX", "targetX"],
    ["width", "velocityWidth", "targetWidth"],
  ]) {
    const displacement = indicatorSpring[value] - indicatorSpring[target];
    const momentum = indicatorSpring[velocity] + frequency * displacement;
    indicatorSpring[value] = indicatorSpring[target] + (displacement + momentum * dt) * decay;
    indicatorSpring[velocity] = (indicatorSpring[velocity] - frequency * momentum * dt) * decay;
  }
  const settled = Math.abs(indicatorSpring.x - indicatorSpring.targetX) < 0.04 &&
    Math.abs(indicatorSpring.width - indicatorSpring.targetWidth) < 0.04 &&
    Math.abs(indicatorSpring.velocityX) < 0.4 && Math.abs(indicatorSpring.velocityWidth) < 0.4;
  if (settled) {
    indicatorSpring.x = indicatorSpring.targetX;
    indicatorSpring.width = indicatorSpring.targetWidth;
    indicatorSpring.velocityX = 0;
    indicatorSpring.velocityWidth = 0;
    indicatorTime = null;
    pageIndex?.classList.remove("is-moving");
  }
  paintIndicator();
  if (!settled) indicatorFrame = window.requestAnimationFrame(animateIndicator);
}

function moveIndicator(indicator, snap = false) {
  indicatorSpring.targetX = indicator.left;
  indicatorSpring.targetWidth = indicator.width;
  if (!indicatorInitialized || snap || reducedMotion.matches) {
    stopIndicator();
    indicatorSpring.x = indicator.left;
    indicatorSpring.width = indicator.width;
    indicatorSpring.velocityX = 0;
    indicatorSpring.velocityWidth = 0;
    indicatorInitialized = true;
    paintIndicator();
    return;
  }
  const atRest = Math.abs(indicatorSpring.x - indicatorSpring.targetX) < 0.04 &&
    Math.abs(indicatorSpring.width - indicatorSpring.targetWidth) < 0.04 &&
    Math.abs(indicatorSpring.velocityX) < 0.4 && Math.abs(indicatorSpring.velocityWidth) < 0.4;
  if (!indicatorFrame && !atRest) {
    pageIndex?.classList.add("is-moving");
    indicatorFrame = window.requestAnimationFrame(animateIndicator);
  }
}

function sectionAtPosition(scrollTop) {
  let activeLink = null;
  sectionPositions.forEach(({ link, top }) => {
    if (top <= scrollTop + sectionThreshold) activeLink = link;
  });
  if (scrollRange > 0 && scrollTop / scrollRange >= 0.995) activeLink = sectionLinks.at(-1)?.link;
  return activeLink;
}

function clearPendingNavigation() {
  window.clearTimeout(navigationSettleTimer);
  window.clearTimeout(navigationFallbackTimer);
  navigationSettleTimer = 0;
  navigationFallbackTimer = 0;
  pendingNavigation = null;
}

function clearSectionArrival() {
  window.clearTimeout(arrivalTimer);
  arrivalTimer = 0;
  arrivalHeading?.classList.remove("is-arriving");
  arrivalHeading?.removeEventListener("animationend", onArrivalAnimationEnd);
  arrivalHeading?.removeEventListener("animationcancel", onArrivalAnimationEnd);
  arrivalHeading = null;
}

function onArrivalAnimationEnd(event) {
  if (event.target === arrivalHeading) clearSectionArrival();
}

function markSectionArrival(link) {
  clearSectionArrival();
  if (reducedMotion.matches || document.visibilityState !== "visible") return;
  const section = sectionLinks.find((entry) => entry.link === link)?.section;
  arrivalHeading = section?.querySelector("h2, h3") || null;
  if (!arrivalHeading) return;
  arrivalHeading.addEventListener("animationend", onArrivalAnimationEnd);
  arrivalHeading.addEventListener("animationcancel", onArrivalAnimationEnd);
  arrivalHeading.classList.add("is-arriving");
  arrivalTimer = window.setTimeout(clearSectionArrival, 1100);
}

function releasePendingNavigation(force = false) {
  if (!pendingNavigation || (!force && sectionAtPosition(window.scrollY) !== pendingNavigation)) return;
  const destination = pendingNavigation;
  clearPendingNavigation();
  updateReadingPosition();
  if (!force) markSectionArrival(destination);
}

function scheduleNavigationSettle() {
  if (!pendingNavigation) return;
  window.clearTimeout(navigationSettleTimer);
  navigationSettleTimer = window.setTimeout(() => releasePendingNavigation(), 160);
}

function measureSectionTop(section) {
  // Offset positions ignore the temporary transforms used by reveal animations.
  let top = 0;
  for (let element = section; element; element = element.offsetParent) {
    top += element.offsetTop;
  }
  return top;
}

function measureReadingLayout() {
  layoutUpdatePending = false;
  scrollRange = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  sectionThreshold = Math.min(220, window.innerHeight * 0.3);
  sectionPositions = sectionLinks.map(({ link, section }) => ({
    link,
    top: measureSectionTop(section),
  }));
  updateReadingPosition(true);
}

function scheduleLayoutUpdate() {
  if (layoutUpdatePending) return;
  layoutUpdatePending = true;
  window.requestAnimationFrame(measureReadingLayout);
}

function updateReadingPosition(refreshIndicator = false) {
  scrollUpdatePending = false;
  const scrollTop = window.scrollY;
  const progress = scrollRange > 0 ? Math.min(1, Math.max(0, scrollTop / scrollRange)) : 0;
  const activeLink = pendingNavigation || sectionAtPosition(scrollTop);
  const activeChanged = activeLink !== currentActiveLink;
  // Only measure the indicator when its destination or the layout changes.
  const indicator = activeLink && (activeChanged || refreshIndicator)
    ? { left: activeLink.offsetLeft, width: activeLink.offsetWidth }
    : null;

  if (readingProgress) readingProgress.style.transform = `scaleX(${progress})`;
  const scrolled = scrollTop > 32;
  if (indexIsScrolled !== scrolled) {
    indexIsScrolled = scrolled;
    pageIndex?.classList.toggle("is-scrolled", scrolled);
  }
  if (activeChanged) {
    if (!activeLink) {
      stopIndicator();
      indicatorInitialized = false;
    }
    currentActiveLink?.removeAttribute("aria-current");
    activeLink?.setAttribute("aria-current", "location");
    currentActiveLink = activeLink;
    pageIndex?.classList.toggle("has-active", Boolean(activeLink));
  }
  if (indicator && pageIndex) {
    moveIndicator(indicator);
  }
}

function scheduleReadingUpdate() {
  scheduleNavigationSettle();
  if (scrollUpdatePending) return;
  scrollUpdatePending = true;
  window.requestAnimationFrame(() => updateReadingPosition());
}

sectionLinks.forEach(({ link }) => {
  link.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey ||
        event.altKey || event.button !== 0) return;
    clearSectionArrival();
    clearPendingNavigation();
    pendingNavigation = link;
    updateReadingPosition();
    scheduleNavigationSettle();
    navigationFallbackTimer = window.setTimeout(() => releasePendingNavigation(true), 2000);
  });
});

function interruptNavigation(event) {
  if (event.type !== "wheel" && event.target?.closest?.(".page-index")) return;
  clearSectionArrival();
  releasePendingNavigation(true);
}

window.addEventListener("wheel", interruptNavigation, { passive: true });
window.addEventListener("touchstart", interruptNavigation, { passive: true });
window.addEventListener("pointerdown", interruptNavigation, { passive: true });
window.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey ||
      !["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key) ||
      event.target?.closest?.("input, textarea, select, button, video, [contenteditable]")) return;
  clearSectionArrival();
  releasePendingNavigation(true);
});
window.addEventListener("scrollend", () => releasePendingNavigation(), { passive: true });
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) clearSectionArrival();
  if (reducedMotion.matches && indicatorInitialized) {
    moveIndicator({ left: indicatorSpring.targetX, width: indicatorSpring.targetWidth }, true);
  }
});

window.addEventListener("scroll", scheduleReadingUpdate, { passive: true });
window.addEventListener("resize", scheduleLayoutUpdate, { passive: true });
window.addEventListener("load", scheduleLayoutUpdate, { once: true });
document.fonts?.ready.then(scheduleLayoutUpdate);
if ("ResizeObserver" in window) {
  const layoutObserver = new ResizeObserver(scheduleLayoutUpdate);
  layoutObserver.observe(document.documentElement);
  if (pageIndex) layoutObserver.observe(pageIndex);
} else {
  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("load", scheduleLayoutUpdate, { once: true });
  });
}
scheduleLayoutUpdate();

// Native dialogs retain keyboard focus and Escape behavior. The original media
// moves between the page and viewer, preserving its decoded frame and playhead.
if (typeof HTMLDialogElement !== "undefined" && "showModal" in HTMLDialogElement.prototype) {
  const mediaDialog = document.createElement("dialog");
  mediaDialog.className = "media-dialog";
  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "media-dialog-close";
  closeButton.setAttribute("aria-label", "Close expanded view");
  closeButton.textContent = "Close ×";
  const mediaBody = document.createElement("div");
  mediaBody.className = "media-dialog-body";
  const mediaCaption = document.createElement("p");
  mediaCaption.className = "media-dialog-caption";
  mediaCaption.id = "media-dialog-caption";
  mediaDialog.append(closeButton, mediaBody, mediaCaption);
  document.body.append(mediaDialog);
  let mediaSession = null;

  function visibleRect(element) {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.bottom > 0 &&
      rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth
      ? rect : null;
  }

  function rectTransform(from, to) {
    // Preserve the media's aspect ratio even when its inline player has letterboxing.
    const scale = Math.min(from.width / Math.max(1, to.width), from.height / Math.max(1, to.height));
    const x = from.left + (from.width - to.width * scale) / 2 - to.left;
    const y = from.top + (from.height - to.height * scale) / 2 - to.top;
    return `translate(${x}px, ${y}px) scale(${scale})`;
  }

  function mediaTravelDuration(from, to) {
    if (!from || !to) return 300;
    const distance = Math.hypot(
      from.left + from.width / 2 - to.left - to.width / 2,
      from.top + from.height / 2 - to.top - to.height / 2,
    );
    const resize = Math.max(Math.abs(from.width - to.width), Math.abs(from.height - to.height));
    return Math.round(Math.min(460, 280 + distance * 0.18 + resize * 0.09));
  }

  function cancelMediaAnimation(session) {
    session.animation?.cancel();
    session.animation = null;
  }

  function restoreMedia(session) {
    if (mediaSession !== session) return;
    cancelMediaAnimation(session);
    if (session.isVideo) session.media.pause();
    if (session.isExperiment) {
      session.media.controls = session.inlineControls;
      session.media.muted = true;
    }
    if (session.placeholder.isConnected) {
      session.placeholder.replaceWith(session.media);
    } else if (session.parent.isConnected) {
      const next = session.next?.parentNode === session.parent ? session.next : null;
      session.parent.insertBefore(session.media, next);
    }
    // Pause after restoration too: native autoplay must not resume on reattachment.
    if (session.isVideo) session.media.pause();
    mediaBody.replaceChildren();
    mediaDialog.classList.remove("is-closing", "is-transitioning");
    mediaSession = null;
    document.documentElement.classList.remove("media-is-open");
    session.trigger?.focus({ preventScroll: true });
    endExperimentDialog();
    scheduleLayoutUpdate();
  }

  function finishMediaClose(session) {
    if (mediaSession !== session) return;
    cancelMediaAnimation(session);
    if (mediaDialog.open) mediaDialog.close();
    restoreMedia(session);
  }

  function animateMedia(session, frames, closing = false, duration = 300) {
    mediaDialog.style.setProperty("--media-duration", `${reducedMotion.matches ? 0 : duration}ms`);
    if (reducedMotion.matches || typeof session.media.animate !== "function") {
      mediaDialog.classList.remove("is-transitioning");
      if (closing) finishMediaClose(session);
      else session.phase = "open";
      return;
    }
    mediaDialog.classList.add("is-transitioning");
    const animation = session.media.animate(frames, {
      duration,
      easing: closing ? "cubic-bezier(.4, 0, .2, 1)" : "cubic-bezier(.16, 1, .3, 1)",
      fill: "both",
    });
    session.animation = animation;
    animation.finished.then(() => {
      if (mediaSession !== session || session.animation !== animation) return;
      if (closing) finishMediaClose(session);
      else {
        cancelMediaAnimation(session);
        mediaDialog.classList.remove("is-transitioning");
        session.phase = "open";
      }
    }).catch(() => {}); // A close, resize, or preference change can cancel entry.
  }

  function showMedia(media, label, caption, trigger, play = false) {
    if (mediaSession || mediaDialog.open) return false;
    const sourceBounds = media.getBoundingClientRect();
    const sourceRect = visibleRect(media);
    const placeholder = document.createElement("div");
    placeholder.className = "media-placeholder";
    placeholder.setAttribute("aria-hidden", "true");
    placeholder.style.width = "100%";
    placeholder.style.aspectRatio = `${Math.max(1, sourceBounds.width)} / ${Math.max(1, sourceBounds.height)}`;
    const session = {
      media, placeholder, trigger, parent: media.parentNode, next: media.nextSibling,
      isVideo: media.tagName === "VIDEO", phase: "opening", animation: null,
      isExperiment: experimentPlayback.has(media), inlineControls: media.controls,
    };
    mediaDialog.setAttribute("aria-label", label);
    mediaCaption.textContent = caption;
    mediaCaption.hidden = !caption;
    if (caption) mediaDialog.setAttribute("aria-describedby", mediaCaption.id);
    else mediaDialog.removeAttribute("aria-describedby");
    mediaSession = session;
    beginExperimentDialog(media);
    if (session.isExperiment) media.controls = true;
    media.before(placeholder);
    mediaDialog.showModal();
    document.documentElement.classList.add("media-is-open");
    // moveBefore preserves connected-element state in browsers that support it.
    // The fallback still uses this same video and never changes or reloads its source.
    if (typeof mediaBody.moveBefore === "function") mediaBody.moveBefore(media, null);
    else mediaBody.append(media);
    closeButton.focus({ preventScroll: true });
    const destination = media.getBoundingClientRect();
    animateMedia(session, [
      { transformOrigin: "0 0", transform: sourceRect ? rectTransform(sourceRect, destination) : "translate(0, 14px) scale(.97)", opacity: sourceRect ? 1 : 0 },
      { transformOrigin: "0 0", transform: "none", opacity: 1 },
    ], false, mediaTravelDuration(sourceRect, destination));
    if (session.isVideo && play && !session.isExperiment) media.play().catch(() => {});
    return true;
  }

  function requestMediaClose() {
    const session = mediaSession;
    if (!session || session.phase === "closing") return;
    const from = session.media.getBoundingClientRect();
    const fromOpacity = window.getComputedStyle(session.media).opacity;
    cancelMediaAnimation(session);
    const untransformed = session.media.getBoundingClientRect();
    const destination = visibleRect(session.placeholder);
    session.phase = "closing";
    if (session.isVideo) session.media.pause();
    mediaDialog.classList.add("is-closing");
    animateMedia(session, [
      { transformOrigin: "0 0", transform: rectTransform(from, untransformed), opacity: fromOpacity },
      { transformOrigin: "0 0", transform: destination ? rectTransform(destination, untransformed) : "translate(0, 12px) scale(.97)", opacity: destination ? 1 : 0 },
    ], true, mediaTravelDuration(from, destination));
  }

  closeButton.addEventListener("click", requestMediaClose);
  mediaDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    requestMediaClose();
  });
  mediaDialog.addEventListener("click", (event) => {
    if (event.target !== mediaDialog) return;
    const bounds = mediaDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) requestMediaClose();
  });
  mediaDialog.addEventListener("close", () => {
    // A queued close event from the last view must not disturb a reopened one.
    if (!mediaDialog.open && mediaSession) restoreMedia(mediaSession);
  });
  function settleMediaTransition() {
    const session = mediaSession;
    if (!session) return;
    if (session.phase === "closing") finishMediaClose(session);
    else {
      cancelMediaAnimation(session);
      mediaDialog.classList.remove("is-transitioning");
      session.phase = "open";
    }
  }
  window.addEventListener("resize", settleMediaTransition, { passive: true });
  reducedMotion.addEventListener("change", () => {
    if (!reducedMotion.matches) return;
    if (mediaSession?.isVideo) mediaSession.media.pause();
    settleMediaTransition();
  });

  document.querySelectorAll(".figure-detail-link").forEach((link) => {
    const thumbnail = link.querySelector("img");
    if (!thumbnail) return;
    link.setAttribute("aria-haspopup", "dialog");
    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const caption = link.closest("figure")?.querySelector("figcaption")?.textContent.trim() || "";
      if (showMedia(thumbnail, thumbnail.alt || "Expanded figure", caption, link)) event.preventDefault();
    });
  });

  const mainVideo = document.querySelector(".demo-block video");
  const videoResource = document.querySelector('.paper-links a[href="#demos"]');
  if (mainVideo && videoResource) {
    videoResource.setAttribute("aria-haspopup", "dialog");
    videoResource.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const label = mainVideo.getAttribute("aria-label") || "TAPNAV overview video";
      if (showMedia(mainVideo, label, label, videoResource, true)) event.preventDefault();
    });
  }

  document.querySelectorAll(".experiment-video-card, .demo-block").forEach((card) => {
    const video = card.querySelector("video");
    if (!video) return;
    const label = video.getAttribute("aria-label") || "Research video";
    const expandButton = document.createElement("button");
    expandButton.type = "button";
    expandButton.className = "video-expand";
    expandButton.textContent = "Expand video ↗";
    expandButton.setAttribute("aria-label", `Expand video: ${label}`);
    expandButton.setAttribute("aria-haspopup", "dialog");
    card.append(expandButton);
    expandButton.addEventListener("click", () => {
      const wasPlaying = !video.paused && !video.ended;
      showMedia(video, label, label, expandButton, experimentPlayback.has(video) ? false : wasPlaying);
    });
    if (experimentPlayback.has(video)) {
      video.addEventListener("click", () => {
        if (!mediaSession) showMedia(video, label, label, expandButton, false);
      });
    }
  });
}
