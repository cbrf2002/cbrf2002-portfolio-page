interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function customImageLoader({
  src,
  width,
  quality = 75,
}: ImageLoaderProps): string {
  // Ensure quality is within valid range
  const validQuality = Math.max(1, Math.min(100, quality));

  // Handle absolute URLs (external images)
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // Handle data URLs
  if (src.startsWith('data:')) {
    return src;
  }

  // Handle local images - ensure they start with /
  const normalizedSrc = src.startsWith('/') ? src : `/${src}`;

  const params = new URLSearchParams();

  // Add width parameter for responsive images
  params.set('w', width.toString());

  // Add quality parameter
  params.set('q', validQuality.toString());

  // Add format preference (browsers will ignore if not supported)
  params.set('f', 'webp');

  return `${normalizedSrc}?${params.toString()}`;
}

// Helper function to generate srcSet for responsive images
export function generateSrcSet(
  src: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1536],
  quality: number = 75
): string {
  return widths
    .map(width => {
      const url = customImageLoader({ src, width, quality });
      return `${url} ${width}w`;
    })
    .join(', ');
}

// Helper function to get optimized image props
export function getOptimizedImageProps(
  src: string,
  alt: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    priority?: boolean;
    sizes?: string;
  } = {}
) {
  const {
    width = 800,
    height,
    quality = 85,
    priority = false,
    sizes = '100vw',
  } = options;

  return {
    src,
    alt,
    width,
    height,
    quality,
    priority,
    sizes,
    loader: customImageLoader,
    placeholder: 'blur' as const,
    blurDataURL: generateBlurDataURL(width, height || Math.round(width * 0.75)),
  };
}

// Generate a simple blur placeholder
function generateBlurDataURL(width: number, height: number): string {
  // Create a minimal SVG blur placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)" />
    </svg>
  `;

  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

// Image format detection utility
export function getImageFormat(src: string): string {
  const extension = src.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'jpeg';
    case 'png':
      return 'png';
    case 'webp':
      return 'webp';
    case 'avif':
      return 'avif';
    case 'gif':
      return 'gif';
    case 'svg':
      return 'svg+xml';
    default:
      return 'jpeg'; // Default fallback
  }
}

// Image dimensions calculator
export function calculateImageDimensions(
  originalWidth: number,
  originalHeight: number,
  targetWidth: number,
  targetHeight?: number
): { width: number; height: number } {
  if (targetHeight) {
    return { width: targetWidth, height: targetHeight };
  }

  const aspectRatio = originalHeight / originalWidth;
  return {
    width: targetWidth,
    height: Math.round(targetWidth * aspectRatio),
  };
}
