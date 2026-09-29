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
by map in two columns; real-world pairs remain side by side.
Placeholders do not request missing files or expose inactive play controls.

## Framework and evaluation layout

The full-width system overview precedes a shared row for tactile sensing and
the low-level controller, before the videos. Detailed planning subsections are
omitted from the page; their original figure files remain in `figures/`.
Controller accuracy and yaw-noise sensitivity share a row after the navigation
results. These paired sections stack on smaller screens. Framework and compact
evaluation plots link to their full-size original images. Retained body text
and figure captions have not been rewritten for this layout revision.

## Research-page design

The page refines the original green research-page design: a centered paper title,
serif abstract and conclusion, and a large teaser with a dark caption. The teaser
is wider and closer to the resource links. Smaller radii, lighter borders and
shadows, and plain figure captions keep the research images prominent.

Comparison videos retain their map and trial groups. Neutral placeholders and
green TAPNAV labels distinguish the methods without repeating decorated cards.
The original footer attribution is retained. No separate logo or brand navigation
has been added. The title emphasizes its tactile-perception phrase with a serif
italic. A single pale-green abstract area adds contrast to the page; the remaining
body sections keep their plain backgrounds. Figure links reveal a full-size hint
on hover or keyboard focus, while unavailable video slots remain static.

A simple section index sits below the teaser. The overview video
has a dark green presentation area, and experiment headings use a compact
title-and-introduction row on desktop. Both adapt to narrow screens.

The page uses local system fonts, one stylesheet, and a small script for citation
copying and reduced-motion handling. It needs no external library or build step.
The Video link opens the existing overview demo; figure links open full-size
images. The copy button announces success or selects the citation when clipboard
access is unavailable. Reduced-motion settings disable automatic video playback.

Paper metadata, body text, captions, and original media are unchanged. PDF and
Code remain unavailable until real links are supplied. CSS and JavaScript URLs
include content versions to refresh cached local previews; update these versions
in `index.html` when editing those files.

## Real-world media

| Position | Supplied source | Web duration | Processing |
| --- | --- | --- | --- |
| Trial 01, TAPNAV | TAPNAV_4th_floor_website_79s.mp4 | 79 s | Copied unchanged |
| Trial 01, Odometry-only | IMG_9992.MOV | 79 s | Full source at 2.73510548x, full-person mosaic, compressed |
| Trial 02, TAPNAV | TAPNAV_2nd_floor_website_45s.mp4 | 45 s | Copied unchanged |
| Trial 02, Odometry-only | IMG_9986.MOV | 45 s | Full source at 9.52025927x, full-person mosaic, compressed |
| Drift Recovery | TAPNAV_1st_floor_20s_v9_resynced_cropped_labeled_mosaic.mp4 | 20 s | Copied unchanged |

Both baseline derivatives use 1440 x 810 H.264, 25 fps, SDR Rec.709, and no
sound. Their full timelines are retained, without cropping or segment omissions.
Moving, manually reviewed full-person rectangles use coarse pixelation, including
partially visible people at frame edges. Posters come from the redacted outputs.
The supplied TAPNAV clips and all original Downloads files are unchanged.

Visible baseline speed labels are rounded to 2.74x and 9.52x. Matching display
durations does not indicate equal real-world runtime or synchronize individual
events. Twelve simulation baseline slots remain empty; all four TAPNAV simulation slots
and all five real-world slots are filled.
Asset URLs carry content hashes to prevent stale unredacted browser cache entries.

## Simulation media

The four supplied TAPNAV simulation videos fill the first column of Maps 01–04.
Their encoded video streams are copied without re-encoding, preserving the supplied
4x playback timing. MP4 indexes are moved to the start for faster web loading.

| Position | Supplied source | Duration |
| --- | --- | --- |
| Map 01, TAPNAV | ref1_bend_seed01_northup_4x.mp4 | 150.96 s |
| Map 02, TAPNAV | ref2_hall_seed10_northup_4x.mp4 | 129 s |
| Map 03, TAPNAV | ref3_zsuite_seed05_northup_4x.mp4 | 157.28 s |
| Map 04, TAPNAV | ref4_room_seed01_0915_move_0p4_northup_4x.mp4 | 187.72 s |

Each clip uses H.264 at 960 x 720 and 25 fps, with no audio. The existing video
slots use `object-fit: contain` to show the full 4:3 frame within the 16:9 grid.
Posters are extracted from the supplied clips. Controls, inline playback, and
metadata preloading match the real-world videos. The three baseline columns
remain placeholders. Original Downloads files are unchanged.
