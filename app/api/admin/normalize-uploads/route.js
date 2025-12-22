import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import prisma from '../../../../lib/prisma';

// Dev-only endpoint to normalize stored file references to actual files on disk.
// Usage: POST /api/admin/normalize-uploads with header x-admin-secret: <secret>
// Protect with ADMIN_NORMALIZE_SECRET env var when available.
export async function POST(req) {
  try {
    const secret = req.headers.get('x-admin-secret');
    const expected = process.env.ADMIN_NORMALIZE_SECRET || 'local-normalize-secret';
    if (secret !== expected && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'courses');
    if (!fs.existsSync(uploadsDir)) {
      return NextResponse.json({ error: 'Uploads directory not found' }, { status: 400 });
    }

    const files = fs.readdirSync(uploadsDir);

    const normalizeFilename = (orig) => {
      if (!orig) return null;
      try { if (orig.startsWith('/uploads/') || orig.startsWith('http')) return orig; } catch(e){}
      const requested = orig;
      const decoded = (() => { try { return decodeURIComponent(requested); } catch (e) { return requested; } })();
      const ext = path.extname(requested).toLowerCase();
      const base = path.basename(requested, ext).replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

      // exact
      let found = files.find((f) => f === requested || f === decoded);
      if (!found) {
        found = files.find((f) => {
          const lf = f.toLowerCase();
          if (lf === requested.toLowerCase() || lf === decoded.toLowerCase()) return true;
          if (ext && lf.endsWith(ext)) {
            if (base && lf.includes(base)) return true;
            const compactReq = requested.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (compactReq && lf.replace(/[^a-z0-9]/g, '').includes(compactReq)) return true;
          }
          return false;
        });
      }

      if (found) return `/uploads/courses/${found}`;
      return `/uploads/courses/${encodeURIComponent(requested)}`;
    };

    const report = {
      coursesUpdated: 0,
      coursesChecked: 0,
      traineeDocsUpdated: 0,
      traineeDocsChecked: 0,
      details: []
    };

    // Normalize courses
    const allCourses = await prisma.course.findMany();
    for (const c of allCourses) {
      report.coursesChecked++;
      const mats = Array.isArray(c.materials) ? c.materials : [];
      const newMats = mats.map((m) => {
        if (!m) return m;
        // material may be stored as JSON string
        if (typeof m === 'string') {
          try {
            const parsed = JSON.parse(m);
            if (parsed && parsed.fileUrl) return normalizeFilename(parsed.fileUrl);
          } catch (e) {
            // not json
          }
          return normalizeFilename(m);
        }
        return m;
      });

      // compare
      const different = JSON.stringify(newMats) !== JSON.stringify(mats);
      if (different) {
        await prisma.course.update({ where: { id: c.id }, data: { materials: newMats } });
        report.coursesUpdated++;
        report.details.push({ courseId: c.id, old: mats, new: newMats });
      }
    }

    // Normalize trainee documents
    const docs = await prisma.traineeDocument.findMany();
    for (const d of docs) {
      report.traineeDocsChecked++;
      if (!d.fileUrl) continue;
      const resolved = normalizeFilename(d.fileUrl);
      if (resolved !== d.fileUrl) {
        await prisma.traineeDocument.update({ where: { id: d.id }, data: { fileUrl: resolved } });
        report.traineeDocsUpdated++;
        report.details.push({ traineeDocId: d.id, old: d.fileUrl, new: resolved });
      }
    }

    return NextResponse.json(report);
  } catch (err) {
    console.error('normalize uploads error', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
