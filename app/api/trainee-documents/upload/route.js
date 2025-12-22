import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const body = await req.json();
      const { title, fileUrl, batchId, courseId, studentEmail, mimeType } = body;

    // derive uploader from header (preferred) or fallback to uploadedBy in body
    const headerEmail = req.headers.get('x-user-email');
    const uploaderEmail = headerEmail || (body.uploadedBy || null);

      if (!title || !fileUrl || !uploaderEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // fetch user to determine role
    const user = await prisma.user.findUnique({ where: { email: uploaderEmail } });
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Authorization checks:
    // - If batchId provided: allow if uploader is trainer for the batch OR uploader is the student (studentEmail) OR uploader is enrolled in that batch
    // - If only courseId provided: allow if uploader is a trainer who has a batch for that course OR uploader is a trainee enrolled in any batch of that course and studentEmail matches
    if (batchId) {
      const batch = await prisma.batch.findUnique({ where: { id: Number(batchId) } });
      if (!batch) return NextResponse.json({ error: 'Batch not found' }, { status: 404 });

      const isTrainerForBatch = user.role === 'trainer' && batch.trainerEmail === uploaderEmail;
      const isStudentUploadingSelf = user.role === 'trainee' && (studentEmail === uploaderEmail);
      const isEnrolled = await prisma.studentBatch.findUnique({ where: { studentEmail_batchId: { studentEmail: uploaderEmail, batchId: Number(batchId) } } });

      if (!isTrainerForBatch && !isStudentUploadingSelf && !isEnrolled) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    } else if (courseId) {
      // check trainer has any batch for course OR trainee is enrolled in a batch of that course
      if (user.role === 'trainer') {
        const trainerHasCourse = await prisma.batch.findFirst({ where: { courseId: Number(courseId), trainerEmail: uploaderEmail } });
        if (!trainerHasCourse) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      } else if (user.role === 'trainee') {
        // require studentEmail to match uploaderEmail
        if (studentEmail !== uploaderEmail) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        const enrolled = await prisma.studentBatch.findFirst({ where: { studentEmail: uploaderEmail, batch: { courseId: Number(courseId) } }, include: { batch: true } });
        if (!enrolled) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      } else {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    } else {
      // no batchId or courseId: allow only if uploader is uploading own document (studentEmail === uploader)
      if (user.role === 'trainee') {
        if (studentEmail !== uploaderEmail) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      } else {
        // trainers without context are allowed to upload (e.g., library resources) but we require courseId or batchId for now
        return NextResponse.json({ error: 'batchId or courseId required' }, { status: 400 });
      }
    }

    // create DB record
    const doc = await prisma.traineeDocument.create({
      data: {
        title: title.trim(),
        fileUrl,
        batchId: batchId ? Number(batchId) : null,
        courseId: courseId ? Number(courseId) : null,
        studentEmail: studentEmail || null,
        mimeType: mimeType || null,
        uploadedBy: uploaderEmail.trim(),
      }
    });

    return NextResponse.json(doc);
  } catch (error) {
    console.error('Error uploading trainee document:', error);
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 });
  }
}