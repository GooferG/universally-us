# Hero Slideshow — Design Spec

**Date:** 2026-04-09
**Status:** Approved

## Overview

Replace the static hero background image on the home page with an auto-cycling crossfade slideshow of 4 images. No user controls. Fully automatic.

## Images

| Order | URL |
|-------|-----|
| 1 (default) | `https://cms.universallyus.com/wp-content/uploads/2024/04/hero-banner-04-min.webp` |
| 2 | `https://cms.universallyus.com/wp-content/uploads/2024/04/hero-banner-02-min.webp` |
| 3 | `https://cms.universallyus.com/wp-content/uploads/2024/04/hero-banner-01-min.webp` |
| 4 | `https://cms.universallyus.com/wp-content/uploads/2024/04/hero-banner-03-min.webp` |

## Components

### `src/components/HeroSlideshow.tsx` (new, `'use client'`)

- Accepts `images: { src: string; alt: string }[]` as props
- Renders all images stacked with `position: absolute; inset: 0; fill`
- Active image: `opacity-100`; inactive: `opacity-0`
- Transition: `transition-opacity duration-1000 ease-in-out`
- `useEffect` sets up `setInterval` at 7000ms to increment index (wraps with modulo)
- Cleanup: clears interval on unmount
- First image gets `priority` prop for fast LCP

### `src/app/page.tsx` (modified)

- Replace single `HERO_IMAGE` constant with `HERO_IMAGES` array
- Replace `<Image src={HERO_IMAGE} ... />` with `<HeroSlideshow images={HERO_IMAGES} />`
- All overlay divs, text content, and layout remain unchanged
- Page stays a server component

## Transition Behavior

- 7 seconds per image (visible time)
- 1 second crossfade overlap
- Fully passive — no hover pause, no navigation dots, no arrows

## What Does Not Change

- Hero section layout, overlay gradients, text, CTA button
- Bottom fade gradient
- All other page sections
