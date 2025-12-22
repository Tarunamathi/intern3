#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

async function main() {
  const src = process.argv[2];
  const target = process.argv[3] || path.join(process.cwd(), 'public', 'uploads', 'courses');

  if (!src) {
    console.error('Usage: node scripts/sanitize_uploads.js <sourceDir> [targetDir]');
    process.exit(1);
  }

  try {
    await fs.mkdir(target, { recursive: true });
    const entries = await fs.readdir(src);
    for (const entry of entries) {
      const srcPath = path.join(src, entry);
      const stat = await fs.stat(srcPath);
      if (!stat.isFile()) continue;

      const ext = path.extname(entry);
      const base = path.basename(entry, ext).replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const ts = Date.now();
      const destName = `${ts}-${base}${ext}`;
      const destPath = path.join(target, destName);
      await fs.copyFile(srcPath, destPath);
      console.log(`Copied: ${entry} -> ${destName}`);
    }
    console.log('Done. Files copied to', target);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
