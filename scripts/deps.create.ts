import path from 'path';
import json from '../package.json';
import fs from 'fs';
import { execSync } from 'child_process'; // Import execSync to run shell commands

const { devDependencies, jest, ...deps } = json; // Exclude devDependencies and any unwanted keys
const nodejsLayer = 'nodejs';
const projectRoot = process.cwd();
const layersSourceDir = path.join(projectRoot, 'dist', 'layers'); // Source directory for layers

export function createNodeLayer() {
    const layerTargetDir = path.join(projectRoot, `dist/layer-${nodejsLayer}`, nodejsLayer);
    fs.mkdirSync(layerTargetDir, { recursive: true });

    // Write a package.json file with only production dependencies
    fs.writeFileSync(path.join(layerTargetDir, 'package.json'), JSON.stringify({ dependencies: deps.dependencies }, null, 2));

    // Install only production dependencies in the layer's directory
    execSync('npm install --production', {
        cwd: layerTargetDir, // Run the command in the layer's directory
        stdio: 'inherit',   // Pipe output to the console
    });
}
