'use client';

import { useEffect, useState, useRef } from 'react';

const BASE_SIZE = 24; // Corresponds to w-6
const CLICKED_SIZE = 32; // Corresponds to w-8
const SIZE_EASING_FACTOR = 0.2; // Easing for size change

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [scale, setScale] = useState(1);
  const [animatedSize, setAnimatedSize] = useState(BASE_SIZE);

  const animationFrameId = useRef<number | null>(null);
  const prevSmoothPosForScaleCalc = useRef({ x: 0, y: 0 });
  const smoothPositionRef = useRef({ x: 0, y: 0 }); // Use ref for smoothPosition inside animation
  const animatedSizeRef = useRef(BASE_SIZE); // Use ref for animatedSize inside animation

  const positionEasingFactor = 0.15;

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', updateMousePosition);
    // Initialize smoothPositionRef and animatedSizeRef with initial state values
    // This ensures the animation loop starts with the correct values if they differ from default
    smoothPositionRef.current = smoothPosition;
    animatedSizeRef.current = animatedSize;

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
    };
  }, []); // Removed smoothPosition and animatedSize from here as they are not needed for this effect.

  useEffect(() => {
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Animation loop for smooth cursor movement and size change
  useEffect(() => {
    // Update refs when state changes, so the animation loop uses the latest state.
    smoothPositionRef.current = smoothPosition;
    animatedSizeRef.current = animatedSize;
  }, [smoothPosition, animatedSize]);

  useEffect(() => {
    const animateCursor = () => {
      const targetSizeVal = isClicking ? CLICKED_SIZE : BASE_SIZE;

      // Use refs for current values within the animation loop
      const currentSmoothX = smoothPositionRef.current.x;
      const currentSmoothY = smoothPositionRef.current.y;
      const currentAnimatedSize = animatedSizeRef.current;

      const dX_pos = mousePosition.x - currentSmoothX;
      const dY_pos = mousePosition.y - currentSmoothY;
      const dS_size = targetSizeVal - currentAnimatedSize;

      const isPosAtTarget = Math.abs(dX_pos) < 0.1 && Math.abs(dY_pos) < 0.1;
      const isSizeAtTarget = Math.abs(dS_size) < 0.1;

      if (isPosAtTarget && isSizeAtTarget) {
        // Ensure final state values are set if not already exact
        if (
          currentSmoothX !== mousePosition.x ||
          currentSmoothY !== mousePosition.y
        ) {
          setSmoothPosition({ x: mousePosition.x, y: mousePosition.y });
        }
        if (currentAnimatedSize !== targetSizeVal) {
          setAnimatedSize(targetSizeVal);
        }
        animationFrameId.current = null;
        return;
      }

      prevSmoothPosForScaleCalc.current = {
        x: currentSmoothX,
        y: currentSmoothY,
      };

      let nextSmoothX = currentSmoothX;
      let nextSmoothY = currentSmoothY;
      let nextAnimatedSize = currentAnimatedSize;

      if (!isPosAtTarget) {
        nextSmoothX = currentSmoothX + dX_pos * positionEasingFactor;
        nextSmoothY = currentSmoothY + dY_pos * positionEasingFactor;
        setSmoothPosition({ x: nextSmoothX, y: nextSmoothY });
      } else if (
        currentSmoothX !== mousePosition.x ||
        currentSmoothY !== mousePosition.y
      ) {
        setSmoothPosition({ x: mousePosition.x, y: mousePosition.y });
      }

      if (!isSizeAtTarget) {
        nextAnimatedSize = currentAnimatedSize + dS_size * SIZE_EASING_FACTOR;
        setAnimatedSize(nextAnimatedSize);
      } else if (currentAnimatedSize !== targetSizeVal) {
        setAnimatedSize(targetSizeVal);
      }

      animationFrameId.current = requestAnimationFrame(animateCursor);
    };

    // Start the animation loop if it's not already running
    // and mouse has moved or clicking state changed.
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    animationFrameId.current = requestAnimationFrame(animateCursor);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [mousePosition, isClicking, positionEasingFactor]); // Removed smoothPosition and animatedSize

  // Effect to calculate speed and update scale for the wobble effect
  useEffect(() => {
    // Calculate speed based on the change in smoothPosition
    const dX = smoothPosition.x - prevSmoothPosForScaleCalc.current.x;
    const dY = smoothPosition.y - prevSmoothPosForScaleCalc.current.y;
    const speed = Math.sqrt(dX * dX + dY * dY);

    // Adjust scale based on speed.
    // Squeezes up to 8%. Higher speed divisor means less sensitivity.
    const targetScale = 1 - Math.min(speed / 200, 0.08);
    setScale(targetScale);
  }, [smoothPosition]); // This effect runs when smoothPosition changes

  const transformStyle = `translate(-50%, -50%) scale(${scale})`;

  return (
    <div
      className={`bg-brand-black dark:bg-brand-white transition-property: transform, background-color, border-color; /* Specify transitions */ transition-duration: 150ms; transition-timing-function: ease-out; border-brand-white dark:border-brand-black pointer-events-none fixed z-[9999] rounded-full border-2`}
      style={{
        left: smoothPosition.x,
        top: smoothPosition.y,
        width: `${animatedSize}px`, // Apply animated size
        height: `${animatedSize}px`, // Apply animated size
        transform: transformStyle,
      }}
    />
  );
}
