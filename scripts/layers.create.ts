import fs from 'fs';
import path from 'path';
import * as config from '../config/template.json'
const layers = config.layers;
const projectRoot = process.cwd();
const layersSourceDir = path.join(projectRoot, 'dist', 'layers'); // Source directory for layers

// Ensure the target directory exists
function ensureDirExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

// Move or copy files from one directory to another
function copyFiles(sourceDir: string, targetDir: string) {
  const items = fs.readdirSync(sourceDir);

  items.forEach((item) => {
    const sourcePath = path.join(sourceDir, item);
    const targetPath = path.join(targetDir, item);

    const stats = fs.statSync(sourcePath);
    if (stats.isDirectory()) {
      ensureDirExists(targetPath);
      copyFiles(sourcePath, targetPath); // Recursive copy for subdirectories
    } else {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Copied: ${sourcePath} -> ${targetPath}`);
    }
  });
}

// Remove a directory and its contents
function removeDir(dir: string) {
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const currentPath = path.join(dir, item);

    const stats = fs.statSync(currentPath);
    if (stats.isDirectory()) {
      removeDir(currentPath); // Recursive delete for subdirectories
    } else {
      fs.unlinkSync(currentPath);
    }
  });

  fs.rmdirSync(dir);
  console.log(`Removed directory: ${dir}`);
}

// Main function to orchestrate the script
export function createLayers() {
  if (!fs.existsSync(layersSourceDir)) {
    console.error(`Source directory does not exist: ${layersSourceDir}`);
    process.exit(1);
  }

  layers.forEach((layer) => {
    const layerSourceDir = path.join(layersSourceDir, layer);

    // Check if the layer directory exists in the source directory
    if (fs.existsSync(layerSourceDir) && fs.statSync(layerSourceDir).isDirectory()) {
      // Create the target directory as layer-shared/shared
      const layerTargetDir = path.join(projectRoot, `dist/layer-${layer}`, layer);
      ensureDirExists(layerTargetDir);
      
      // Copy the contents of the source directory into the new layer directory
      copyFiles(layerSourceDir, layerTargetDir);

      console.log(`Copied ${layer} from ${layerSourceDir} to ${layerTargetDir}`);
    } else {
      console.warn(`Source directory for ${layer} does not exist, skipping.`);
    }
  });

  // Optionally, clean up the empty source directory
  removeDir(layersSourceDir);

  console.log(`Moved files and created layers under dist/`);
}

