// Resizes and recompresses the images in public/ that are served as-is (favicon,
// manifest icons, Open Graph image, logos). Safe to re-run: images are never
// enlarged, and a result is only kept when it is smaller than the original.
//
//   npm run optimize:images
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');

/** [source, output, max width, max height] — output may equal source. */
const JOBS = [
  // Favicon / app icons: manifest asks for 192 and 512, iOS for 180.
  ['icon1.png', 'icon1.png', 512, 512],
  ['icon1.png', 'icon-192.png', 192, 192],
  ['icon1.png', 'apple-touch-icon.png', 180, 180],
  // Logos are shown ~100px tall; keep enough for 2x screens and the 1000x500 Open Graph card.
  ['Main_Logo.png', 'Main_Logo.png', 1000, 500],
  ['Mainlogo_white.png', 'Mainlogo_white.png', 1000, 540],
];

const kb = (bytes) => `${(bytes / 1024).toFixed(1)}KB`;

async function run([source, output, width, height]) {
  const inputPath = path.join(publicDir, source);
  const outputPath = path.join(publicDir, output);
  const input = await fs.readFile(inputPath);
  const before = (await fs.stat(outputPath).catch(() => null))?.size ?? input.length;

  const result = await sharp(input)
    .resize(width, height, { fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 })
    .toBuffer();

  if (output === source && result.length >= input.length) {
    console.log(`${output}: already optimal (${kb(input.length)})`);
    return;
  }
  await fs.writeFile(outputPath, result);
  const { width: w, height: h } = await sharp(result).metadata();
  console.log(`${output}: ${kb(before)} -> ${kb(result.length)} (${w}x${h})`);
}

for (const job of JOBS) {
  await run(job);
}
