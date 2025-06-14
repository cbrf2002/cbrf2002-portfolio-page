'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import customImageLoader from '@/lib/image-loader'; // Import the custom loader

type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';

interface LogoProps {
  className?: string;
  size?: LogoSize;
  width?: number;
  height?: number;
  responsive?: boolean;
  minSize?: LogoSize;
  maxSize?: LogoSize;
}

const sizeClasses = {
  xs: 'w-12 h-6 sm:w-14 sm:h-7 md:w-16 md:h-8',
  sm: 'w-16 h-8 sm:w-20 sm:h-10 md:w-24 md:h-12',
  md: 'w-20 h-10 sm:w-24 sm:h-12 md:w-28 md:h-14 lg:w-32 lg:h-16',
  lg: 'w-24 h-12 sm:w-28 sm:h-14 md:w-32 md:h-16 lg:w-36 lg:h-18 xl:w-40 xl:h-20',
  xl: 'w-28 h-14 sm:w-32 sm:h-16 md:w-36 md:h-18 lg:w-40 lg:h-20 xl:w-44 xl:h-22',
  '2xl':
    'w-32 h-16 sm:w-36 sm:h-18 md:w-40 md:h-20 lg:w-44 lg:h-22 xl:w-48 xl:h-24',
};

const sizeDimensions = {
  xs: { width: 64, height: 24 },
  sm: { width: 80, height: 32 },
  md: { width: 120, height: 40 },
  lg: { width: 144, height: 48 },
  xl: { width: 160, height: 56 },
  '2xl': { width: 192, height: 64 },
};

const minMaxClasses = {
  xs: 'min-w-12 min-h-6',
  sm: 'min-w-16 min-h-8',
  md: 'min-w-20 min-h-10',
  lg: 'min-w-24 min-h-12',
  xl: 'min-w-28 min-h-14',
  '2xl': 'min-w-32 min-h-16',
};

const maxClasses = {
  xs: 'max-w-12 max-h-6',
  sm: 'max-w-16 max-h-8',
  md: 'max-w-20 max-h-10',
  lg: 'max-w-24 max-h-12',
  xl: 'max-w-28 max-h-14',
  '2xl': 'max-w-32 max-h-16',
};

export default function Logo({
  className = '',
  size = 'md',
  width,
  height,
  responsive = true,
  minSize,
  maxSize,
}: LogoProps) {
  const { resolvedTheme } = useTheme(); // Use resolvedTheme
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dimensions =
    size === 'custom' && width && height
      ? { width, height }
      : sizeDimensions[size as keyof typeof sizeDimensions] ||
        sizeDimensions.md;

  // Build classes based on configuration
  let classes = '';

  if (responsive && size !== 'custom') {
    classes += sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.md;
  }

  if (minSize && minSize !== 'custom') {
    classes += ` ${minMaxClasses[minSize as keyof typeof minMaxClasses]}`;
  }

  if (maxSize && maxSize !== 'custom') {
    classes += ` ${maxClasses[maxSize as keyof typeof maxClasses]}`;
  }

  const mobileConstraints = responsive
    ? 'min-w-12 min-h-6 max-w-48 max-h-24'
    : '';

  let currentLogoSrc = '/images/CBRF-dark.svg';
  if (mounted) {
    currentLogoSrc =
      resolvedTheme === 'light'
        ? '/images/CBRF-light.svg'
        : '/images/CBRF-dark.svg';
  }

  return (
    <div className={`relative ${classes} ${mobileConstraints} ${className}`}>
      <Image
        loader={customImageLoader}
        src={currentLogoSrc}
        alt="CBRF2002 Logo"
        width={dimensions.width}
        height={dimensions.height}
        priority
        className="h-full w-full object-contain transition-opacity duration-300"
      />
    </div>
  );
}
