import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Ensure dist directory exists
if (!existsSync('dist')) {
  mkdirSync('dist');
}

// Copy extension files to dist
const filesToCopy = [
  { src: 'public/manifest.json', dest: 'dist/manifest.json' },
  { src: 'public/content.js', dest: 'dist/content.js' },
  { src: 'public/background.js', dest: 'dist/background.js' },
  { src: 'public/128x128.png', dest: 'dist/128x128.png' }
];

filesToCopy.forEach(({ src, dest }) => {
  try {
    copyFileSync(src, dest);
  } catch {
  }
});
