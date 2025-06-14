const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const IMAGE_PATHS = [
  'public/images/mobiledev/mainScreens/juanfile/jf-dash-light.png',
  'public/images/mobiledev/mainScreens/juanfile/jf-dash-dark.png',
];

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...');

  for (const imagePath of IMAGE_PATHS) {
    try {
      const fullPath = path.join(__dirname, imagePath);
      const { dir, name } = path.parse(fullPath);

      // Check if original file exists
      await fs.access(fullPath);

      // Generate optimized PNG (original format)
      const optimizedPngPath = path.join(dir, `${name}-optimized.png`);
      await sharp(fullPath)
        .png({
          quality: 85,
          compressionLevel: 9,
          progressive: true,
        })
        .toFile(optimizedPngPath);

      // Generate WebP version for modern browsers
      const webpPath = path.join(dir, `${name}.webp`);
      await sharp(fullPath)
        .webp({
          quality: 85,
          effort: 6,
        })
        .toFile(webpPath);

      // Generate AVIF version for even better compression
      const avifPath = path.join(dir, `${name}.avif`);
      await sharp(fullPath)
        .avif({
          quality: 85,
          effort: 6,
        })
        .toFile(avifPath);

      console.log(`✅ Optimized: ${imagePath}`);
    } catch (error) {
      console.error(`❌ Error optimizing ${imagePath}:`, error.message);
    }
  }

  console.log('🎉 Image optimization complete!');
}

if (require.main === module) {
  optimizeImages().catch(console.error);
}

module.exports = { optimizeImages };
