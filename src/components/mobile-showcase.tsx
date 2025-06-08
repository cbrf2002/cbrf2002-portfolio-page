'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

const showcaseImagesData = [
  {
    name: 'Agrosphere',
    light: '/images/mobiledev/mainScreens/agrosphere/agrosphere-dash-light.png',
    dark: '/images/mobiledev/mainScreens/agrosphere/agrosphere-dash-dark.png',
    baseWidth: 360,
    baseHeight: 600,
    alt: 'Agrosphere app screenshot',
  },
  {
    name: 'Fundi',
    light: '/images/mobiledev/mainScreens/fundi/fundi-dash-light.png',
    dark: '/images/mobiledev/mainScreens/fundi/fundi-dash-dark.png',
    baseWidth: 360,
    baseHeight: 600,
    alt: 'Fundi app screenshot',
  },
  {
    name: 'JuanFile',
    light: '/images/mobiledev/mainScreens/juanfile/jf-dash-light.png',
    dark: '/images/mobiledev/mainScreens/juanfile/jf-dash-dark.png',
    baseWidth: 360,
    baseHeight: 600,
    alt: 'JuanFile app screenshot',
  },
];

const transition = {
  type: 'spring',
  stiffness: 100,
  damping: 25,
};

export default function MobileShowcase() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex(prevIndex =>
      prevIndex === 0 ? showcaseImagesData.length - 1 : prevIndex - 1
    );
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex(prevIndex =>
      prevIndex === showcaseImagesData.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  return (
    <div className="relative mt-8 mb-8 w-full select-none sm:mt-12">
      <div className="xs:h-[430px] relative mx-auto h-[400px] w-full max-w-xs sm:h-[480px] sm:max-w-sm md:h-[520px] md:max-w-md lg:max-w-lg xl:max-w-xl">
        {/* Invisible drag area overlay */}
        <motion.div
          className="absolute inset-0 z-30 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          onDragEnd={(event, info) => {
            const threshold = 50;
            if (info.offset.x > threshold) {
              handlePrev();
            } else if (info.offset.x < -threshold) {
              handleNext();
            }
          }}
          style={{
            x: 0, // Always keep the drag area centered
            opacity: 0, // Make it invisible but still draggable
          }}
        />

        {/* Static container for images */}
        <div className="absolute inset-0 flex items-center justify-center [perspective:1000px]">
          <AnimatePresence initial={false}>
            {showcaseImagesData.map((img, index) => {
              const currentSrc =
                !mounted || theme === 'light' ? img.light : img.dark;

              const offset =
                (index - activeIndex + showcaseImagesData.length) %
                showcaseImagesData.length;

              let scale = 1;
              let rotateY = 0;
              let translateX = 0;
              let opacity = 0;
              let zIndex = 0;
              let paddingTopClass = 'pt-5 xs:pt-6 sm:pt-8';

              if (offset === 0) {
                // Center image
                scale = 1.05;
                opacity = 1;
                zIndex = 20;
                paddingTopClass = 'pt-0';
              } else if (offset === 1) {
                // Image to the right
                scale = 0.85;
                rotateY = -30;
                translateX = 50;
                opacity = 0.7;
                zIndex = 10;
              } else if (offset === showcaseImagesData.length - 1) {
                // Image to the left
                scale = 0.85;
                rotateY = 30;
                translateX = -50;
                opacity = 0.7;
                zIndex = 10;
              } else {
                // Hidden images
                scale = 0.7;
                opacity = 0;
                zIndex = 0;
                translateX =
                  offset < showcaseImagesData.length / 2 ? 100 : -100;
              }

              return (
                <motion.div
                  key={img.name}
                  className={`absolute ${paddingTopClass} xs:w-52 xs:h-[350px] h-[320px] w-48 sm:h-[400px] sm:w-56 md:h-[430px] md:w-60`}
                  initial={{
                    scale: 0.5,
                    opacity: 0,
                    rotateY: translateX > 0 ? -45 : 45,
                    x: translateX > 0 ? '100%' : '-100%',
                  }}
                  animate={{
                    scale,
                    rotateY,
                    x: `${translateX}%`,
                    opacity,
                    zIndex,
                  }}
                  exit={{
                    scale: 0.5,
                    opacity: 0,
                    rotateY: translateX > 0 ? 45 : -45,
                    x: translateX > 0 ? '-100%' : '100%',
                  }}
                  transition={transition}
                  style={{
                    pointerEvents: 'none', // Prevent interference with drag area
                  }}
                >
                  <Image
                    src={currentSrc}
                    alt={img.alt}
                    width={img.baseWidth}
                    height={img.baseHeight}
                    draggable={false}
                    onContextMenu={e => e.preventDefault()}
                    className="h-full w-full rounded-lg object-contain object-top sm:rounded-xl md:rounded-2xl"
                    priority={offset === 0}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="bg-brand-white/10 dark:bg-brand-black/10 hover:bg-brand-white/20 dark:hover:bg-brand-black/20 absolute top-1/2 left-6 z-40 -translate-y-1/2 rounded-full p-2 backdrop-blur-sm sm:left-8 md:left-10"
        aria-label="Previous image"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />{' '}
          {/* Left arrow */}
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="bg-brand-white/10 dark:bg-brand-black/10 hover:bg-brand-white/20 dark:hover:bg-brand-black/20 absolute top-1/2 right-6 z-40 -translate-y-1/2 rounded-full p-2 backdrop-blur-sm sm:right-8 md:right-10"
        aria-label="Next image"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />{' '}
          {/* Right arrow */}
        </svg>
      </button>
    </div>
  );
}
