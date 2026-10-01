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

## Experiment videos

The Experiments section pairs each video group with its results:

- Simulation Results: four map rows, with TAPNAV on the left and Odometry-only
  on the right (8 videos). IDs follow `sim-map-01-tapnav` and
  `sim-map-01-odometry-only` through Map 04.
- Real-World Experiments: two trials, each with TAPNAV on the left and
  Odometry-only on the right (4 videos).
- Drift Recovery: one video within the real-world section.

Each map and trial retains its two-column comparison on smaller screens.
Video frames use a 16:9 slot with `object-fit: contain` to preserve the complete
source image. All experiment video slots are populated. The Random-touch and
Sweep-touch video placeholders have been removed; quantitative results and
existing explanatory text are unchanged.

## Framework and evaluation layout

The full-width system overview precedes a shared row for tactile sensing and
the low-level controller, after the main overview video at the start of Method. Detailed planning subsections are
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

Comparison videos retain their map and trial groups. Green TAPNAV labels distinguish the methods without repeating decorated cards.
The original footer attribution is retained. No separate logo or brand navigation
has been added. The title emphasizes its tactile-perception phrase with a serif
italic. A single pale-green abstract area adds contrast to the page; the remaining
body sections keep their plain backgrounds. Figure links reveal a full-size hint
on hover or keyboard focus, and videos retain native playback controls.

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
events. All eight simulation slots and all five real-world slots are filled.
Asset URLs carry content hashes to prevent stale unredacted browser cache entries.

## Simulation media

The TAPNAV column combines each matching simulation (left) and global planner
(right) into a single 1920 x 720 video. Both complete input frames are preserved
without cropping or additional acceleration. The supplied 4x timing, 25 fps,
full duration, and frame count are retained. Outputs use H.264, yuv420p, CRF 20,
and fast-start MP4 indexing. Posters are extracted from the combined videos.

| Map | Simulation source | Global planner source | Duration |
| --- | --- | --- | --- |
| 01 | ref1_bend_seed01_northup_4x.mp4 | ref1_bend_seed01_global_planner_northup_4x.mp4 | 150.96 s |
| 02 | ref2_hall_seed10_northup_4x.mp4 | ref2_hall_seed10_global_planner_northup_4x.mp4 | 129 s |
| 03 | ref3_zsuite_seed05_northup_4x.mp4 | ref3_zsuite_seed05_global_planner_northup_4x.mp4 | 157.28 s |
| 04 | ref4_room_seed01_0915_move_0p4_northup_4x.mp4 | ref4_room_seed01_0915_move_0p4_global_planner_northup_4x.mp4 | 187.72 s |

Source Downloads files are unchanged.

## Odometry-only simulation failure cases

Each Odometry-only video combines the matching simulation on the left and global
planner on the right. Both complete 960 x 720 inputs are preserved side by side,
without cropping, padding, or additional acceleration. The combined 1920 x 720
H.264 files use 25 fps, yuv420p, CRF 20, and fast-start MP4 indexing.

Every input pair has identical duration and frame count. Frames are aligned from
the start, preserving the supplied 4x playback timing and full source timelines.
The web player contains the wide frame without cropping and supports fullscreen.

| Map | Simulation source | Global planner source | Duration |
| --- | --- | --- | --- |
| 01 | ref1_bend_seed06_odom_global_northup_4x.mp4 | ref1_bend_seed06_odom_global_global_planner_northup_4x.mp4 | 149.08 s |
| 02 | ref2_hall_seed11_odom_global_northup_4x.mp4 | ref2_hall_seed11_odom_global_global_planner_northup_4x.mp4 | 259.88 s |
| 03 | ref3_zsuite_seed14_odom_global_northup_4x.mp4 | ref3_zsuite_seed14_odom_global_global_planner_northup_4x.mp4 | 395.44 s |
| 04 | ref4_room_seed04_odom_global_northup_4x.mp4 | ref4_room_seed04_odom_global_global_planner_northup_4x.mp4 | 328.92 s |

Posters come from the combined outputs. Source Downloads files are unchanged.

## Method layout update

The 179.8-second main video now appears directly after the Method heading, before
System Overview. Tactile sensing and controller titles remain top-aligned; their
complete figure-and-text blocks are vertically centered below the title row.
The two component sections continue to stack naturally on narrow screens.
