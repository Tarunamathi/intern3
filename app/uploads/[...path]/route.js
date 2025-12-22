import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import prisma from '../../lib/prisma';

export async function GET(request, { params }) {
  try {
    // Await params resolution
    const resolvedParams = await Promise.resolve(params);
    
    if (!resolvedParams?.path || !Array.isArray(resolvedParams.path)) {
      return new NextResponse('Invalid path', { status: 400 });
    }

    // Get the requested file path (safe to use now that we've validated)
    const pathArray = resolvedParams.path;
    const filePath = pathArray.join('/');
    console.log('File requested:', filePath);

    // Normalize the path to remove any path traversal attempts
    const normalizedPath = path.normalize(filePath)
      .replace(/^(\.\.(\/|\\|$))+/, '')
      .replace(/\\/g, '/'); // Convert Windows backslashes to forward slashes
    const strippedPath = normalizedPath.replace(/^(uploads\/|public\/uploads\/)/i, '');
    
    // Construct the physical file path - ensure it's within uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const publicPath = path.join(uploadsDir, strippedPath);

    // Always store paths in the database as /uploads/{folder}/{filename}
    const databasePath = `/uploads/${strippedPath}`;

    // Verify the resolved path is still within uploads directory
    if (!publicPath.startsWith(uploadsDir)) {
      return new NextResponse('Invalid path', { status: 400 });
    }

    console.log('Looking for file at:', publicPath);

    try {
      // Check if file exists
      await fs.access(publicPath);

      // Read file and return it directly so any requester (admin/trainer/trainee) can access it
      const fileBuffer = await fs.readFile(publicPath);

      // Simple content-type mapping by extension
      const ext = path.extname(publicPath).toLowerCase();
      const mimeMap = {
        '.pdf': 'application/pdf',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav',
        '.txt': 'text/plain'
      };
      const contentType = mimeMap[ext] || 'application/octet-stream';

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          // Serve inline by default so the browser tries to display the file when possible.
          // The client can still offer a separate Download link that uses the `download` attribute.
          'Content-Disposition': 'inline'
        }
      });
    } catch (e) {
      // File doesn't exist - log details and check database
      console.log('File not found at:', publicPath);

      // Try a best-effort fuzzy lookup in the target uploads folder
      try {
        const strippedParts = strippedPath.split('/');
        const filenameRequested = strippedParts.pop();
        const folderPath = strippedParts.join('/'); // e.g. 'courses' or 'library/2025'
        const targetDir = path.join(uploadsDir, folderPath || '');

        // sanitize helper
        const sanitize = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const requestedKey = sanitize(decodeURIComponent(filenameRequested));

        let candidateFile = null;
        try {
          const dirFiles = await fs.readdir(targetDir);
          // Look for exact match first
          for (const f of dirFiles) {
            if (f === filenameRequested) {
              candidateFile = f;
              break;
            }
          }

          // If not exact, look for sanitized match (ignoring timestamps)
          if (!candidateFile) {
            for (const f of dirFiles) {
              const nameNoTs = f.replace(/^\d+_/, '');
              if (sanitize(nameNoTs).includes(requestedKey) || requestedKey.includes(sanitize(nameNoTs))) {
                candidateFile = f;
                break;
              }
            }
          }

          if (candidateFile) {
            const foundPath = path.join(targetDir, candidateFile);
            console.log('Fuzzy matched file:', candidateFile, '->', foundPath);
            const fileBuffer = await fs.readFile(foundPath);
            const ext = path.extname(foundPath).toLowerCase();
            const mimeMap = {
              '.pdf': 'application/pdf',
              '.png': 'image/png',
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.gif': 'image/gif',
              '.svg': 'image/svg+xml',
              '.mp4': 'video/mp4',
              '.webm': 'video/webm',
              '.mp3': 'audio/mpeg',
              '.wav': 'audio/wav',
              '.txt': 'text/plain'
            };
            const contentType = mimeMap[ext] || 'application/octet-stream';

            return new NextResponse(fileBuffer, {
              status: 200,
              headers: {
                'Content-Type': contentType,
                'Content-Disposition': 'inline'
              }
            });
          }
        } catch (dirErr) {
          // ignore and continue to DB checks
          console.log('Fuzzy lookup error or no directory:', dirErr.message || dirErr);
        }
      } catch (fuzzyErr) {
        console.log('Error during fuzzy lookup:', fuzzyErr);
      }

      // Only check for the canonical path format in the database
      const docs = await prisma.traineeDocument.findMany({
        where: {
          fileUrl: databasePath
        }
      });

      // For courses, we need to check the materials array for the database path
      const courses = await prisma.course.findMany({
        where: {
          materials: {
            hasSome: [databasePath]
          }
        },
        select: {
          id: true,
          name: true,
          materials: true,
          category: true
        }
      });

      console.log('Database references:', {
        traineeDocuments: docs.length > 0 ? docs.map(d => d.fileUrl) : 'none',
        courses: courses.length > 0 ? courses.map(c => ({
          id: c.id,
          name: c.name,
          category: c.category,
          materials: Array.isArray(c.materials) ? c.materials : []
        })) : 'none'
      });

      return new NextResponse('File not found', { status: 404 });
    }
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}