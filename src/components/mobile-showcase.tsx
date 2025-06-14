'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence, Transition } from 'framer-motion';
import customImageLoader from '@/lib/image-loader'; // Import the custom loader

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

const transition: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 25,
};

const AUTO_ROTATE_INTERVAL = 5000; // 5 seconds
const POST_DRAG_RESUME_DELAY = 7000; // 7 seconds

export default function MobileShowcase() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const advanceSlide = useCallback(() => {
    setActiveIndex(prevIndex =>
      prevIndex === showcaseImagesData.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  const startAutoRotate = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(advanceSlide, AUTO_ROTATE_INTERVAL);
  }, [advanceSlide]);

  const stopAutoRotate = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }, []);

  const resetAndResumeAutoRotate = useCallback(() => {
    stopAutoRotate();
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      startAutoRotate();
    }, POST_DRAG_RESUME_DELAY);
  }, [startAutoRotate, stopAutoRotate]);

  useEffect(() => {
    if (mounted) {
      startAutoRotate();
    }
    return () => {
      stopAutoRotate();
    };
  }, [mounted, startAutoRotate, stopAutoRotate]);

  const handleDragEndAction = (newIndex: number) => {
    setActiveIndex(newIndex);
    resetAndResumeAutoRotate();
  };

  return (
    <div className="relative mt-8 mb-12 w-full select-none sm:mt-12 sm:mb-16 md:mb-20">
      <div className="xs:h-[540px] xs:max-w-md relative mx-auto h-[500px] w-full max-w-sm sm:h-[600px] sm:max-w-lg md:h-[650px] md:max-w-xl lg:h-[700px] lg:max-w-2xl xl:h-[750px] xl:max-w-3xl">
        {/* Invisible drag area overlay */}
        <motion.div
          className="absolute inset-0 z-30 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          onDragStart={stopAutoRotate} // Pause rotation on drag start
          onDragEnd={(event, info) => {
            const threshold = 50;
            let newIndex = activeIndex;
            if (info.offset.x > threshold) {
              newIndex =
                activeIndex === 0
                  ? showcaseImagesData.length - 1
                  : activeIndex - 1;
            } else if (info.offset.x < -threshold) {
              newIndex =
                activeIndex === showcaseImagesData.length - 1
                  ? 0
                  : activeIndex + 1;
            }
            // Only update and reset timer if index actually changed
            if (newIndex !== activeIndex) {
              handleDragEndAction(newIndex);
            } else {
              // If no change, just resume auto-rotation after a short delay
              resetAndResumeAutoRotate();
            }
          }}
          style={
            {
              x: 0, // Always keep the drag area centered
              // Make it invisible but still draggable.
              // Using a very small opacity instead of 0 to ensure it's interactable on all browsers.
              opacity: 0.001,
            } as React.CSSProperties
          }
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
              let paddingTopClass = 'pt-8 xs:pt-10 sm:pt-12 md:pt-14'; // Adjusted padding

              if (offset === 0) {
                // Center image
                scale = 1.1;
                opacity = 1;
                zIndex = 20;
                paddingTopClass = 'pt-0';
              } else if (offset === 1) {
                // Image to the right
                scale = 0.8;
                rotateY = -25;
                translateX = 45;
                opacity = 0.6;
                zIndex = 10;
              } else if (offset === showcaseImagesData.length - 1) {
                // Image to the left
                scale = 0.8;
                rotateY = 25;
                translateX = -45;
                opacity = 0.6;
                zIndex = 10;
              } else {
                // Hidden images
                scale = 0.6;
                opacity = 0;
                zIndex = 0;
                translateX = offset < showcaseImagesData.length / 2 ? 80 : -80;
              }

              return (
                <motion.div
                  key={img.name}
                  className={`absolute ${paddingTopClass} xs:h-[440px] xs:w-64 h-[400px] w-60 sm:h-[500px] sm:w-72 md:h-[540px] md:w-80 lg:h-[580px] lg:w-[352px] xl:h-[620px] xl:w-96`} // Adjusted dimensions
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
                  style={
                    {
                      pointerEvents: 'none', // Prevent interference with drag area
                    } as React.CSSProperties
                  }
                >
                  {' '}
                  <Image
                    loader={customImageLoader} // Add the loader prop here
                    src={currentSrc}
                    alt={img.alt}
                    width={img.baseWidth}
                    height={img.baseHeight}
                    draggable={false}
                    onContextMenu={e => e.preventDefault()}
                    className="h-full w-full rounded-lg object-contain object-top sm:rounded-xl md:rounded-2xl"
                    priority={offset === 0}
                    sizes="(max-width: 480px) 240px, (max-width: 640px) 256px, (max-width: 768px) 288px, (max-width: 1024px) 320px, (max-width: 1280px) 352px, 384px" // Adjusted sizes
                    quality={85}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Buttons removed */}
    </div>
  );
}
