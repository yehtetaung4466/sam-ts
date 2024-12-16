import { zip } from 'zip-a-folder';
import path from 'path';
import fs from 'fs';

const sharedDir = path.join(process.cwd(), 'dist', 'layers', 'shared');
const sharedZip = path.join(process.cwd(), 'dist', 'zip-shared', 'shared.zip');

// Ensure the zip-shared directory exists
if (!fs.existsSync(path.dirname(sharedZip))) {
  fs.mkdirSync(path.dirname(sharedZip), { recursive: true });
}

// Zip the shared directory into shared.zip
(async () => {
  try {
    // Zip the contents of the shared directory into the shared.zip file
    await zip(sharedDir, sharedZip);
    console.log(`Packaged shared layer to ${sharedZip}`);
  } catch (err) {
    console.error('Error packaging shared layer:', err);
    process.exit(1);
  }
})();
