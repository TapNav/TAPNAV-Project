# TapNav asset guide

Keep public page assets compressed and use lowercase filenames without spaces.

## Imported from the final LaTeX references

- `figures/tapnav-teaser.webp`: `Figure 1/realfinal.pdf`.
- `figures/tapnav-system-overview.webp`: `Figure 2/Ver.5.1.pdf`.
- `figures/tactile-hardware.webp`: `Figure 3/Hardware_fig_v5.5.pdf`.
- `figures/tactile-likelihood.webp`: `Figure 4/Ver.10.1.pdf`.
- `figures/information-gain.webp`: `Figure 5/ig_hit_miss_3col.pdf`.
- `figures/controller.webp`: `controller.pdf`.
- `figures/simulation-results.webp`: `Figure 6/Fig6_v3-compressed.pdf`.
- `figures/yaw-noise.webp`: `Figure 8/Fig.8.pdf`.
- `figures/controller-comparison.webp`: `controller_sim.pdf`.
- `figures/real-world-results.webp`: `real_worldVer.2.pdf`.

The original PDF and PNG figures remain in the Overleaf project. These WebP
copies are optimized for GitHub Pages. Always follow the `includegraphics`
paths in `root.tex`; the source folder also contains older figure versions.

## Video

- `letsgo.mp4`: current end-to-end overview demo.

## Experiment video slots

The Experiments section in `index.html` pairs each video group with its results:

- Simulation Results: four map rows, ordered TAPNAV, Random-touch, Sweep-touch,
  Odometry-only (16 videos). IDs follow `sim-map-01-tapnav` through
  `sim-map-04-odometry-only`.
- Real-World Experiments: two trials, each with TAPNAV (left) and Odometry-only
  (right), for four videos total. IDs are `real-world-trial-01-tapnav`,
  `real-world-trial-01-odometry-only`, `real-world-trial-02-tapnav`, and
  `real-world-trial-02-odometry-only`.
- Drift Recovery: `drift-recovery` (1 video), within the real-world section.

Map and trial numbers remain temporary labels. To fill a slot, replace its
`.experiment-video-placeholder` div with a video element, retaining the figure
and caption. Create `assets/videos/` and use the slot ID as the filename:

```html
<video controls playsinline preload="none" aria-label="Map 01, TAPNAV navigation">
  <source src="assets/videos/sim-map-01-tapnav.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
```

Slots use a 16:9 aspect ratio. Desktop shows a 4-by-4 simulation grid and a
2-by-2 real-world comparison grid. Smaller screens keep simulations grouped
by map in two columns; real-world pairs stack only on the narrowest screens.
Placeholders do not request missing files or expose inactive play controls.

## Framework and evaluation layout

The full-width system overview precedes a shared row for tactile sensing and
the low-level controller, before the videos. Detailed planning subsections are
omitted from the page; their original figure files remain in `figures/`.
Controller accuracy and yaw-noise sensitivity share a row after the navigation
results. These paired sections stack on smaller screens. Framework and compact
evaluation plots link to their full-size original images. Retained body text
and figure captions have not been rewritten for this layout revision.
