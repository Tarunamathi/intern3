import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// GET - Fetch live class links for batches a trainee is enrolled in
export async function GET(request) {
  try {
    const email = request.headers.get('x-user-email');
    if (!email) {
      return NextResponse.json(
        { error: 'Unauthorized - x-user-email header required' },
        { status: 401 }
      );
    }

    // Find all batches this trainee is enrolled in
    const enrollments = await prisma.studentBatch.findMany({
      where: { studentEmail: email },
      include: {
        batch: {
          include: {
            course: {
              select: { name: true, id: true }
            }
          }
        }
      }
    });

    if (!enrollments || enrollments.length === 0) {
      return NextResponse.json(
        { liveClasses: [] },
        { status: 200 }
      );
    }

    // Aggregate live class links from all enrolled batches
    const liveClasses = enrollments
      .filter((e) => e.batch && e.batch.liveClassLinks && e.batch.liveClassLinks.length > 0)
      .flatMap((e) =>
        (e.batch.liveClassLinks || []).map((link) => ({
          ...link,
          batchId: e.batch.id,
          batchName: e.batch.batchName,
          courseName: e.batch.course?.name || 'Course',
          traineeEmail: email,
        }))
      );

    return NextResponse.json(
      {
        liveClasses,
        totalClasses: liveClasses.length,
        batches: enrollments.map((e) => ({
          batchId: e.batch.id,
          batchName: e.batch.batchName,
          courseName: e.batch.course?.name || 'Course',
          classCount: (e.batch.liveClassLinks || []).length,
        }))
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching trainee live classes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch live classes', details: error.message },
      { status: 500 }
    );
  }
}
