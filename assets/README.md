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

The Navigation Videos section in `index.html` contains 21 static placeholders:

- Simulation: four map rows, each ordered TAPNAV, Random-touch, Sweep-touch,
  Odometry-only (16 videos). IDs follow `sim-map-01-tapnav` through
  `sim-map-04-odometry-only`.
- Real world: `real-world-01` through `real-world-04` (4 videos).
- Recovery: `first-floor-drift-recovery` (1 video).

Map and real-world trial numbers are temporary labels. Rename their headings,
captions, and accessible labels when the final recordings are selected.

To fill a slot, replace its `.experiment-video-placeholder` div with the following
markup, retaining the surrounding figure and caption. Create `assets/videos/`
and use the slot ID as the filename. For example:

```html
<video controls playsinline preload="none" aria-label="Map 01, TAPNAV navigation">
  <source src="assets/videos/sim-map-01-tapnav.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
```

The slots have a 16:9 aspect ratio. Desktop shows a 4-by-4 simulation grid and a
2-by-2 real-world grid. Smaller screens keep methods grouped by map in two
columns; real-world trials stack on narrow phones. Placeholders do not request
missing files and do not expose inactive play controls.
