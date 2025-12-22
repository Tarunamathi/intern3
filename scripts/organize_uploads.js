import { promises as fs } from 'fs';
import path from 'path';

async function moveFile(src, dest) {
  try {
    await fs.rename(src, dest);
    console.log(`Moved: ${src} -> ${dest}`);
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.log(`Skipping non-existent file: ${src}`);
    } else {
      throw e;
    }
  }
}

async function ensureDir(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function main() {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  const coursesDir = path.join(uploadsDir, 'courses');
  const libraryDir = path.join(uploadsDir, 'library');

  // Ensure directories exist
  await Promise.all([
    ensureDir(coursesDir),
    ensureDir(libraryDir)
  ]);

  // Get all files in uploads dir
  const files = await fs.readdir(uploadsDir);

  for (const file of files) {
    const filePath = path.join(uploadsDir, file);
    const stat = await fs.stat(filePath);

    if (!stat.isFile()) continue; // Skip directories

    // Move timestamped PDFs to courses folder
    if (/^\d{13}-[a-z0-9]+\.pdf$/i.test(file)) {
      await moveFile(filePath, path.join(coursesDir, file));
    }
  }

  console.log('Cleanup complete!');
}

main().catch(console.error);