# TapNav project page

A build-free static project page organized like a standard robotics paper page: paper identity and links, hero video, abstract, video-led experiments, method figures, quantitative results, and BibTeX. Open `index.html` directly for a quick look, or serve the directory locally for an accurate preview.

## Local preview

From this directory:

```bash
python3 preview.py
```

Then open `http://127.0.0.1:8000`. This local-only server supports byte-range
requests so video progress controls can seek immediately. Use `--port 8001`
if the default port is already in use. It requires Python 3, with no packages
to install.

Experiment previews play muted and loop while visible, without progress bars.
Click a preview or its Expand button to open a paused player with playback
and seeking controls. Closing resumes the inline preview at the same position.
The main Method video starts muted when it enters view, with native playback,
seeking, and sound controls. It pauses offscreen and respects manual pauses and
reduced-motion settings. The lower-right Sound off / Sound on button toggles
audio at the current playback position, including in the expanded viewer.
The choice stays synchronized with the native volume controls for this visit.

## Content checklist

- The current teaser, system overview, tactile hardware, planner, information-gain,
  and controller figures were imported from the Overleaf project.
- Verify overview and experiment videos before release.
- Sync the abstract after the manuscript text is finalized.
- Replace disabled resource buttons with real links.
- Replace anonymous author and BibTeX information after the review period.
- Remove `<meta name="robots" content="noindex, nofollow" />` when the page should be indexed.
- Replace the Open Graph preview image and add the final public URL.

## GitHub Pages

The static page can be deployed directly from the root of a GitHub repository without a build step. In GitHub, select **Settings → Pages → Deploy from a branch → main / (root)**.

During double-blind review, do not publish from an identifiable personal account or domain unless the venue explicitly permits it.
