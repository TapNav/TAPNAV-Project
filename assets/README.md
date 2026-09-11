# TapNav asset guide

Keep public page assets compressed and use lowercase filenames without spaces.

## Imported from the current Overleaf project

- `figures/tapnav-teaser.webp`: hardware and simulation teaser.
- `figures/tapnav-system-overview.webp`: full TapNav pipeline.
- `figures/tactile-hardware.webp`: SensX hardware and contact processing.
- `figures/probe-selection.webp`: contact/miss probe representation.
- `figures/information-gain.webp`: hit/miss belief update figure.
- `figures/controller.webp`: upper/lower-body controller diagram.

The original PDF and PNG figures remain in the Overleaf project. These WebP
copies are optimized for GitHub Pages and should be regenerated when the paper
figures change.

## Videos still needed

- `overview.mp4`: 60-90 second overview video, H.264.
- `mapped-navigation.mp4`: mapped-navigation result.
- `unmapped-navigation.mp4`: navigation result without a prior map.
- `contact.mp4`, `opening.mp4`, `recovery.mp4`: short behavior clips.

For a looping hero video, replace the current hero `<img>` with:

```html
<video autoplay muted loop playsinline poster="assets/figures/tapnav-teaser.webp">
  <source src="assets/overview.mp4" type="video/mp4" />
</video>
```

Use the same replacement pattern for each `.video-placeholder` block in
`index.html`. Full-width videos should use a 16:9 aspect ratio. The three
contact-rich behavior clips work best with matching dimensions and durations.
