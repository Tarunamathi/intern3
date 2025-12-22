// app/api/trainee/enrollments/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// POST - Enroll trainee in a course
export async function POST(request) {
  try {
    const body = await request.json();
    const { courseId, batchId } = body;
    const email = request.headers.get('x-user-email');

    if (!email) {
      return NextResponse.json(
        { error: "Unauthorized - Email not provided" },
        { status: 401 }
      );
    }

    // Validate courseId
    const cId = Number(courseId);
    if (!Number.isInteger(cId) || cId <= 0) {
      return NextResponse.json(
        { error: "Invalid courseId" },
        { status: 400 }
      );
    }

    // Validate course exists
    const course = await prisma.course.findUnique({
      where: { id: cId },
      include: { batches: true }
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // If no batchId provided, find available batch (prefer one with capacity)
    let batch = null;
    if (!batchId) {
      // Treat missing totalStudents/enrolledStudents as available (defensive)
      batch = course.batches.find(b => {
        const hasNumbers = typeof b.enrolledStudents === 'number' && typeof b.totalStudents === 'number';
        return hasNumbers ? (b.enrolledStudents < b.totalStudents) : true;
      });

      // If none meet capacity criteria, fallback to first non-completed batch (best effort)
      if (!batch && course.batches && course.batches.length) {
        batch = course.batches.find(b => b.status !== 'Completed') || course.batches[0];
      }

      if (!batch) {
        return NextResponse.json(
          { error: "No batches available for this course" },
          { status: 400 }
        );
      }
    } else {
      const bId = Number(batchId);
      if (!Number.isInteger(bId) || bId <= 0) {
        return NextResponse.json(
          { error: "Invalid batchId" },
          { status: 400 }
        );
      }

      batch = await prisma.batch.findUnique({
        where: { id: bId }
      });

      if (!batch) {
        return NextResponse.json(
          { error: "Batch not found" },
          { status: 404 }
        );
      }

      // If batch capacity fields exist, enforce capacity; otherwise allow enrollment
      if (typeof batch.enrolledStudents === 'number' && typeof batch.totalStudents === 'number') {
        if (batch.enrolledStudents >= batch.totalStudents) {
          return NextResponse.json(
            { error: "Batch is full" },
            { status: 400 }
          );
        }
      }
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.studentBatch.findFirst({
      where: {
        studentEmail: email,
        batchId: batch.id
      }
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Already enrolled in this batch" },
        { status: 400 }
      );
    }

    // Create enrollment and increment counters atomically to avoid races
    const [enrollment] = await prisma.$transaction([
      prisma.studentBatch.create({
        data: {
          studentEmail: email,
          batchId: batch.id,
          status: "Active"
        }
      }),
      prisma.batch.update({
        where: { id: batch.id },
        data: { enrolledStudents: { increment: 1 } }
      }),
      prisma.course.update({
        where: { id: cId },
        data: { enrolledStudents: { increment: 1 } }
      })
    ]);

    return NextResponse.json(
      { 
        success: true, 
        message: "Successfully enrolled", 
        enrollment 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { error: "Server error during enrollment" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const emailHeader = request.headers.get('x-user-email');
    const url = new URL(request.url);
    const q = url.searchParams.get('traineeEmail');
    const traineeEmail = emailHeader || q;

    if (!traineeEmail) return NextResponse.json({ error: 'traineeEmail required in x-user-email header or query' }, { status: 400 });

    // Find student batch entries and include batch & course info
    const studentBatches = await prisma.studentBatch.findMany({
      where: { studentEmail: traineeEmail },
      include: {
        batch: {
          include: {
            trainer: true,
          }
        },
      },
      orderBy: { enrolledDate: 'desc' },
    });

    // map to useful shape
    const enrollments = studentBatches.map(sb => ({
      id: sb.id,
      batchId: sb.batchId,
      enrolledDate: sb.enrolledDate,
      status: sb.status,
      attendance: sb.attendance,
      batch: sb.batch ? {
        id: sb.batch.id,
        batchCode: sb.batch.batchCode,
        batchName: sb.batch.batchName,
        courseId: sb.batch.courseId,
        startDate: sb.batch.startDate,
        endDate: sb.batch.endDate,
        status: sb.batch.status,
        enrolledStudents: sb.batch.enrolledStudents,
        trainerEmail: sb.batch.trainerEmail,
        trainer: sb.batch.trainer ? { firstName: sb.batch.trainer.firstName, lastName: sb.batch.trainer.lastName, email: sb.batch.trainer.email } : null,
      } : null
    }));

    return NextResponse.json(enrollments);
  } catch (err) {
    console.error('GET /api/trainee/enrollments error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
