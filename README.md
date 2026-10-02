# TapNav project page

A build-free static project page organized like a standard robotics paper page: paper identity and links, hero video, abstract, video-led experiments, method figures, quantitative results, and BibTeX. Open `index.html` directly for a quick look, or serve the directory locally for an accurate preview.

## Local preview

From this directory:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Content checklist

- The current teaser, system overview, tactile hardware, planner, information-gain,
  and controller figures were imported from the Overleaf project.
- Add overview and experiment videos when they become available.
- Sync the abstract after the manuscript text is finalized.
- Replace disabled resource buttons with real links.
- Replace anonymous author and BibTeX information after the review period.
- Remove `<meta name="robots" content="noindex, nofollow" />` when the page should be indexed.
- Replace the Open Graph preview image and add the final public URL.

## GitHub Pages

This directory includes `.nojekyll`, so it can be deployed directly from the root of a GitHub repository without a build step. In GitHub, select **Settings → Pages → Deploy from a branch → main / (root)**.

During double-blind review, do not publish from an identifiable personal account or domain unless the venue explicitly permits it.
>>>>>>> 1d35b91 (Initial Setup of TapNav webpage)
