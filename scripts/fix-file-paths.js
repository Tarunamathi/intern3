const { default: prisma } = require('../lib/prisma');
const path = require('path');
const { access } = require('fs/promises');
const fsp = require('fs').promises;
const fs = require('fs');

function normalizePath(filePath) {
  if (!filePath || typeof filePath !== 'string') return filePath;

  try {
    // Remove any leading dots or path traversal
    let normalized = filePath
      .replace(/\\/g, '/') // Convert Windows backslashes to forward slashes first
      .replace(/^(\.\.(\/|\\|$))+/, '')
      .replace(/^public\//i, ''); // Remove public/ prefix if it exists
    
    // Ensure it starts with /uploads/
    if (!normalized.startsWith('/uploads/')) {
      normalized = '/uploads/' + normalized.replace(/^uploads\//i, '');
    }
    
    return normalized;
  } catch (e) {
    console.error('Error normalizing path:', filePath, e);
    return filePath;
  }
}

async function fileExists(filePath) {
  try {
    const physicalPath = path.join(process.cwd(), 'public', filePath.replace(/^\/uploads\//, ''));
    await access(physicalPath);
    return true;
  } catch {
    return false;
  }
}

function sanitizeBase(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_+/g, '_');
}

async function renameUploadsCourses() {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'courses');
  try {
    const files = await fsp.readdir(uploadsDir);
    const mapping = {}; // oldUrl -> newUrl

    for (const file of files) {
      if (!file || file.startsWith('.')) continue;

      const ext = path.extname(file);
      const base = path.basename(file, ext);

      // If already has a timestamp prefix like 176..._, consider it ok but still sanitize
      const hasTimestamp = /^\d+_/.test(file);
      const baseToSanitize = hasTimestamp ? base.replace(/^\d+_/, '') : base;
      const sanitized = sanitizeBase(baseToSanitize);

      let newName;
      if (hasTimestamp) {
        // Keep the existing timestamp if present but ensure sanitized
        const timestamp = base.split('_')[0];
        newName = `${timestamp}_${sanitized}${ext}`;
      } else {
        newName = `${Date.now()}_${sanitized}${ext}`;
      }

      // Ensure unique
      let candidate = newName;
      let i = 0;
      while (true) {
        try {
          await fsp.access(path.join(uploadsDir, candidate));
          // exists, make a new candidate
          i += 1;
          const suffix = `_${i}`;
          candidate = newName.replace(ext, `${suffix}${ext}`);
        } catch (e) {
          // doesn't exist
          newName = candidate;
          break;
        }
      }

      if (newName !== file) {
        const oldPath = path.join(uploadsDir, file);
        const newPath = path.join(uploadsDir, newName);
        try {
          await fsp.rename(oldPath, newPath);
          const oldUrl = `/uploads/courses/${file}`;
          const newUrl = `/uploads/courses/${newName}`;
          mapping[oldUrl] = newUrl;
          console.log(`Renamed: ${oldUrl} -> ${newUrl}`);
        } catch (err) {
          console.error('Failed to rename', oldPath, newPath, err);
        }
      }
    }

    return mapping;
  } catch (err) {
    console.error('Error scanning uploads/courses:', err);
    return {};
  }
}

async function main() {
  console.log('Starting file path normalization...');
  // First, rename files physically and get mapping of old->new URLs
  const renameMapping = await renameUploadsCourses();
  console.log('Rename mapping count:', Object.keys(renameMapping).length);
  
  // Fix TraineeDocument paths
  const docs = await prisma.traineeDocument.findMany();
  console.log(`Found ${docs.length} trainee documents to process`);
  
  for (const doc of docs) {
    if (!doc.fileUrl) continue;

    // Prefer mapping substitution first
    let newPath = doc.fileUrl;
    if (renameMapping[doc.fileUrl]) {
      newPath = renameMapping[doc.fileUrl];
    } else {
      // fall back to normalization
      newPath = normalizePath(doc.fileUrl);
    }

    if (newPath !== doc.fileUrl) {
      const exists = await fileExists(newPath);
      console.log(`Document ${doc.id}:`, { old: doc.fileUrl, new: newPath, exists });

      if (exists) {
        await prisma.traineeDocument.update({ where: { id: doc.id }, data: { fileUrl: newPath } });
      } else {
        console.warn(`Warning: File not found for document ${doc.id}: ${newPath}`);
      }
    }
  }

  // Fix Course materials
  const courses = await prisma.course.findMany();
  console.log(`Found ${courses.length} courses to process`);
  
  for (const course of courses) {
    if (!course.materials || !Array.isArray(course.materials)) continue;

    let changed = false;
    const updatedMaterials = course.materials.map(material => {
      if (typeof material !== 'string') return material;

      try {
        // Try parsing as JSON first (module objects)
        const parsed = JSON.parse(material);
        if (parsed && typeof parsed.fileUrl === 'string') {
          const candidate = renameMapping[parsed.fileUrl] || normalizePath(parsed.fileUrl);
          if (candidate !== parsed.fileUrl) {
            changed = true;
            return JSON.stringify({ ...parsed, fileUrl: candidate });
          }
        }
        return material;
      } catch {
        // Not JSON, treat as direct path string
        const candidate = renameMapping[material] || normalizePath(material);
        if (candidate !== material) {
          changed = true;
          return candidate;
        }
        return material;
      }
    });

    if (changed) {
      console.log(`Updating course ${course.id} materials:`, {
        before: course.materials,
        after: updatedMaterials
      });

      await prisma.course.update({
        where: { id: course.id },
        data: { materials: updatedMaterials }
      });
    }
  }

  console.log('File path normalization complete!');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });