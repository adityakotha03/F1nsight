import { removeBackground } from '@imgly/background-removal-node';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

async function processDir(dirRelativePath) {
  const dirPath = path.join(root, dirRelativePath);
  console.log(`\n--- Processing directory: ${dirRelativePath} ---`);
  
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const pngFiles = entries
      .filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.png'))
      .map(entry => entry.name);

    if (pngFiles.length === 0) {
      console.log('No PNG files found.');
      return;
    }

    console.log(`Found ${pngFiles.length} PNG files.`);

    for (const fileName of pngFiles) {
      const filePath = path.join(dirPath, fileName);
      console.log(`Processing ${fileName}...`);
      
      try {
        const startTime = Date.now();
        const fileBuffer = await fs.readFile(filePath);
        const blobInput = new Blob([fileBuffer], { type: 'image/png' });
        // removeBackground can take a local path, URL, or Blob/Buffer
        const blob = await removeBackground(blobInput);
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        await fs.writeFile(filePath, buffer);
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`  ✅ Success: ${fileName} (${duration}s)`);
      } catch (err) {
        console.error(`  ❌ Error processing ${fileName}:`, err.message);
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dirRelativePath}:`, err.message);
  }
}

async function run() {
  const dirs = [
    'public/images/2025/F2',
    'public/images/2026/F2'
  ];

  for (const dir of dirs) {
    await processDir(dir);
  }
  
  console.log('\nAll backgrounds processed!');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
