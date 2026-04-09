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
