# Hero Slideshow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static hero background image with an auto-cycling crossfade slideshow of 4 images.

**Architecture:** A new `HeroSlideshow` client component stacks all 4 images absolutely and uses CSS `transition-opacity` to crossfade between them on a `setInterval`. The home page (`page.tsx`) stays a server component — it just swaps the single `<Image>` for `<HeroSlideshow>`.

**Tech Stack:** Next.js 14, React 18, Tailwind CSS, TypeScript

---

### Task 1: Create `HeroSlideshow` component

**Files:**
- Create: `src/components/HeroSlideshow.tsx`

- [ ] **Step 1: Create the file with this exact content**

```tsx
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface HeroImage {
  src: string;
  alt: string;
}

interface HeroSlideshowProps {
  images: HeroImage[];
}

export default function HeroSlideshow({ images }: HeroSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      {images.map((image, index) => (
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          fill
          className={`object-cover object-center transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
          priority={index === 0}
          sizes="100vw"
        />
      ))}
    </>
  );
}
```

- [ ] **Step 2: Verify the file was created**

Check that `src/components/HeroSlideshow.tsx` exists and has no TypeScript errors by running:
```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroSlideshow.tsx
git commit -m "feat: add HeroSlideshow crossfade component"
```

---

### Task 2: Wire `HeroSlideshow` into the home page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace the `HERO_IMAGE` constant with a `HERO_IMAGES` array**

Find this at the top of `page.tsx`:
```ts
const HERO_IMAGE =
  'https://w4n.08a.mytemp.website/wp-content/uploads/2025/07/calm-woman-by-lake.webp';
```

Replace it with:
```ts
const HERO_IMAGES = [
  {
    src: 'https://w4n.08a.mytemp.website/wp-content/uploads/2024/04/hero-banner-04-min.webp',
    alt: 'A woman sitting peacefully by a calm lake',
  },
  {
    src: 'https://w4n.08a.mytemp.website/wp-content/uploads/2024/04/hero-banner-02-min.webp',
    alt: 'A woman finding strength and clarity',
  },
  {
    src: 'https://w4n.08a.mytemp.website/wp-content/uploads/2024/04/hero-banner-01-min.webp',
    alt: 'A woman stepping into her healing journey',
  },
  {
    src: 'https://w4n.08a.mytemp.website/wp-content/uploads/2024/04/hero-banner-03-min.webp',
    alt: 'A woman embracing hope and connection',
  },
];
```

- [ ] **Step 2: Add the `HeroSlideshow` import**

At the top of `page.tsx`, add alongside the other component imports:
```ts
import HeroSlideshow from '@/components/HeroSlideshow';
```

- [ ] **Step 3: Replace the static `<Image>` with `<HeroSlideshow>`**

Find this block inside the hero `<section>`:
```tsx
<Image
  src={HERO_IMAGE}
  alt="A woman sitting peacefully by a calm lake"
  fill
  className="object-cover object-center"
  priority
  sizes="100vw"
/>
```

Replace it with:
```tsx
<HeroSlideshow images={HERO_IMAGES} />
```

- [ ] **Step 4: Verify no TypeScript errors**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 5: Smoke test in the browser**

Run `npm run dev` and open `http://localhost:3000`. Confirm:
- The hero shows an image immediately on load
- After ~7 seconds, it crossfades to the next image
- It cycles through all 4 images and loops back to the first

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: wire hero slideshow into home page"
```
