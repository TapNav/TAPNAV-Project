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

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll("video[autoplay]").forEach((video) => {
    video.autoplay = false;
    video.pause();
  });
}
