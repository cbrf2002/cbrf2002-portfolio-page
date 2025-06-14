/**
 * Image optimization and utility functions
 */

// Common image breakpoints for responsive images
export const IMAGE_BREAKPOINTS = [
  320, 640, 768, 1024, 1280, 1536, 1920,
] as const;

// Image quality presets
export const IMAGE_QUALITY = {
  low: 50,
  medium: 75,
  high: 85,
  maximum: 95,
} as const;

// Common aspect ratios
export const ASPECT_RATIOS = {
  square: 1,
  portrait: 4 / 3,
  landscape: 3 / 4,
  widescreen: 16 / 9,
  ultrawide: 21 / 9,
} as const;

/**
 * Generate responsive image sizes attribute
 */
export function generateSizes(breakpoints: { [key: string]: string }): string {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) =>
      breakpoint === 'default' ? size : `(max-width: ${breakpoint}) ${size}`
    )
    .join(', ');
}

/**
 * Common responsive sizes for different use cases
 */
export const RESPONSIVE_SIZES = {
  // Full width images
  fullWidth: generateSizes({
    '640px': '100vw',
    '768px': '100vw',
    '1024px': '100vw',
    default: '100vw',
  }),

  // Hero images (typically large)
  hero: generateSizes({
    '640px': '100vw',
    '768px': '80vw',
    '1024px': '70vw',
    default: '60vw',
  }),

  // Card/thumbnail images
  card: generateSizes({
    '640px': '50vw',
    '768px': '33vw',
    '1024px': '25vw',
    default: '20vw',
  }),

  // Gallery images
  gallery: generateSizes({
    '640px': '100vw',
    '768px': '50vw',
    '1024px': '33vw',
    default: '25vw',
  }),

  // Mobile showcase (custom for your component)
  mobileShowcase: generateSizes({
    '480px': '240px',
    '640px': '256px',
    '768px': '288px',
    '1024px': '320px',
    '1280px': '352px',
    default: '384px',
  }),
};

/**
 * Check if an image URL is external
 */
export function isExternalImage(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://');
}

/**
 * Check if an image is a data URL
 */
export function isDataUrl(src: string): boolean {
  return src.startsWith('data:');
}

/**
 * Get file extension from image path
 */
export function getImageExtension(src: string): string | null {
  if (isDataUrl(src) || isExternalImage(src)) {
    return null;
  }

  const match = src.match(/\.([^.?]+)(?:\?|$)/);
  return match ? match[1].toLowerCase() : null;
}

/**
 * Check if browser supports WebP
 */
export function supportsWebP(): Promise<boolean> {
  return new Promise(resolve => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

/**
 * Check if browser supports AVIF
 */
export function supportsAVIF(): Promise<boolean> {
  return new Promise(resolve => {
    const avif = new Image();
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2);
    };
    avif.src =
      'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUEAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
}

/**
 * Get optimal image format based on browser support
 */
export async function getOptimalFormat(): Promise<'avif' | 'webp' | 'jpg'> {
  if (await supportsAVIF()) return 'avif';
  if (await supportsWebP()) return 'webp';
  return 'jpg';
}

/**
 * Preload critical images
 */
export function preloadImage(src: string, as: 'image' = 'image'): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = src;
  document.head.appendChild(link);
}

/**
 * Lazy load image with intersection observer
 */
export function lazyLoadImage(
  img: HTMLImageElement,
  src: string,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          img.src = src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: '50px',
      ...options,
    }
  );

  observer.observe(img);
  return observer;
}
