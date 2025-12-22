import { NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    // `params` may be a Promise-like in some Next runtimes — await it first
    const resolvedParams = await params;
    const idFromParams = resolvedParams?.id;
    let id = idFromParams;

    // Fallback: parse id from URL path if params not provided
    if (!id) {
      try {
        const url = new URL(request.url);
        const parts = url.pathname.split('/').filter(Boolean);
        const coursesIndex = parts.indexOf('courses');
        if (coursesIndex >= 0 && parts.length > coursesIndex + 1) {
          id = parts[coursesIndex + 1];
        }
      } catch (e) {
        // ignore
      }
    }

    const courseId = Number(id);

    if (!courseId) {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Get all batches for this course with enrolled students and their details
    const batches = await prisma.batch.findMany({
      where: { courseId },
      include: {
        students: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                email: true,
                phone: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    });

    // Sum up all enrolled students across batches
    const totalEnrolled = batches.reduce((sum, batch) => sum + (batch.students?.length || 0), 0);

    // Build a flattened students array (aggregated across batches)
    const students = batches.flatMap((batch) => (batch.students || []).map((sb) => ({
      studentId: sb.student?.id || null,
      email: sb.student?.email || sb.studentEmail,
      username: sb.student?.username || null,
      name: sb.student
        ? `${sb.student.firstName || ''} ${sb.student.lastName || ''}`.trim() || 'N/A'
        : (sb.studentEmail || 'N/A'),
      firstName: sb.student?.firstName || null,
      lastName: sb.student?.lastName || null,
      phone: sb.student?.phone || null,
      profilePicture: sb.student?.profilePicture || null,
      enrollmentDate: sb.enrolledDate ? new Date(sb.enrolledDate).toISOString() : null,
      status: sb.status,
      batchId: batch.id,
      batchName: batch.batchName,
      batchCode: batch.batchCode,
    })));

    return NextResponse.json(
      {
        courseId,
        enrolledStudents: totalEnrolled,
        students,
        batches: batches.map((batch) => ({
          batchId: batch.id,
          batchName: batch.batchName,
          batchCode: batch.batchCode,
          enrolled: batch.students?.length || 0,
          enrolledStudents: batch.students?.map((sb) => ({
            studentId: sb.student?.id || null,
            email: sb.student?.email || sb.studentEmail,
            username: sb.student?.username || null,
            name: sb.student
              ? `${sb.student.firstName || ''} ${sb.student.lastName || ''}`.trim() || 'N/A'
              : 'N/A',
            firstName: sb.student?.firstName || null,
            lastName: sb.student?.lastName || null,
            phone: sb.student?.phone || null,
            profilePicture: sb.student?.profilePicture || null,
            enrolledDate: sb.enrolledDate ? new Date(sb.enrolledDate).toISOString() : null,
            status: sb.status,
          })) || [],
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching course enrollments', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollments', details: error.message },
      { status: 500 }
    );
  }
}
