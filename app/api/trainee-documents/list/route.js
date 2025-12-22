import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const batchId = searchParams.get('batchId');
    const uploadedByParam = searchParams.get('uploadedBy');

    // get requester
    const requester = req.headers.get('x-user-email');
    const user = requester ? await prisma.user.findUnique({ where: { email: requester } }) : null;

    console.log('[GET /api/trainee-documents/list]', { requester, userId: user?.id, courseId, batchId, uploadedByParam });

    // Build accessible document query based on requester role
    if (!user) {
      // if no user header, only allow query by uploadedBy param (public only uploader)
      if (!uploadedByParam) {
        console.log('[GET /api/trainee-documents/list] 401 - No user and no uploadedByParam');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const docs = await prisma.traineeDocument.findMany({ where: { uploadedBy: uploadedByParam }, orderBy: { createdAt: 'desc' } });
      return NextResponse.json(docs);
    }

    // If batchId provided: allow if trainer for batch or enrolled trainee or uploader
    if (batchId) {
      const batch = await prisma.batch.findUnique({ where: { id: Number(batchId) } });
      if (!batch) return NextResponse.json({ error: 'Batch not found' }, { status: 404 });

      const isTrainer = user.role === 'trainer' && batch.trainerEmail === user.email;
      const isEnrolled = await prisma.studentBatch.findUnique({ where: { studentEmail_batchId: { studentEmail: user.email, batchId: Number(batchId) } } });
      const isUploaderParam = uploadedByParam && uploadedByParam === user.email;

      if (!isTrainer && !isEnrolled && !isUploaderParam) {
        console.log('[GET /api/trainee-documents/list] 403 - Not trainer, enrolled, or uploader', { isTrainer, isEnrolled: !!isEnrolled, isUploaderParam });
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const docs = await prisma.traineeDocument.findMany({ where: { batchId: Number(batchId) }, orderBy: { createdAt: 'desc' } });
      return NextResponse.json(docs);
    }

    // If courseId provided: allow if trainer has any batch for that course or user enrolled in any batch of course or uploader
    if (courseId) {
      const trainerHas = user.role === 'trainer' ? await prisma.batch.findFirst({ where: { courseId: Number(courseId), trainerEmail: user.email } }) : null;
      const traineeEnrolled = await prisma.studentBatch.findFirst({ where: { studentEmail: user.email, batch: { courseId: Number(courseId) } }, include: { batch: true } });
      const isUploaderParam = uploadedByParam && uploadedByParam === user.email;

      console.log('[GET /api/trainee-documents/list] courseId check', { trainerHas: !!trainerHas, traineeEnrolled: !!traineeEnrolled, isUploaderParam });

      // Only allow access to documents if the requester is the trainer for the course,
      // is enrolled in any batch for the course, or is explicitly the uploader.
      // If none of those apply, return an empty list (the client will display limited
      // course info for non-enrolled users). Returning an empty list avoids 403 errors
      // in the UI while preserving confidentiality of documents.
      if (!trainerHas && !traineeEnrolled && !isUploaderParam) {
        console.log('[GET /api/trainee-documents/list] requester not enrolled/trainer/uploader - returning empty list');
        return NextResponse.json([]);
      }

      const docs = await prisma.traineeDocument.findMany({ where: { courseId: Number(courseId) }, orderBy: { createdAt: 'desc' } });
      return NextResponse.json(docs);
    }

    // No batchId/courseId: return documents accessible to the user
    if (user.role === 'trainer') {
      const batches = await prisma.batch.findMany({ where: { trainerEmail: user.email }, select: { id: true, courseId: true } });
      const batchIds = batches.map(b => b.id);
      const courseIds = [...new Set(batches.map(b => b.courseId))];

      const docs = await prisma.traineeDocument.findMany({
        where: {
          OR: [
            { uploadedBy: user.email },
            { batchId: { in: batchIds.length ? batchIds : [-1] } },
            { courseId: { in: courseIds.length ? courseIds : [-1] } }
          ]
        },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json(docs);
    }

    // trainee or other roles: show docs uploaded by them or docs for batches they're enrolled in or courses they're enrolled in
    const studentBatches = await prisma.studentBatch.findMany({ where: { studentEmail: user.email } });
    const studentBatchIds = studentBatches.map(sb => sb.batchId);
    const studentCourseIds = [];
    if (studentBatchIds.length) {
      const batches = await prisma.batch.findMany({ where: { id: { in: studentBatchIds } }, select: { courseId: true } });
      batches.forEach(b => { if (b.courseId) studentCourseIds.push(b.courseId); });
    }

    const docs = await prisma.traineeDocument.findMany({
      where: {
        OR: [
          { uploadedBy: user.email },
          { studentEmail: user.email },
          { batchId: { in: studentBatchIds.length ? studentBatchIds : [-1] } },
          { courseId: { in: studentCourseIds.length ? studentCourseIds : [-1] } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(docs);
  } catch (error) {
    console.error('Error fetching trainee documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}