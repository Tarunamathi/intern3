import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const batch = await prisma.batch.findUnique({
      where: { id: parseInt(id) },
      include: {
        course: true,
        trainer: true,
        students: {
          include: {
            student: true
          }
        }
      }
    });

    if (!batch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    return NextResponse.json(batch);
  } catch (error) {
    console.error('GET /api/batch/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch batch' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      batchName,
      courseId,
      courseName,
      trainerEmail,
      coordinatorEmail,
      startDate,
      endDate,
      institutionName,
      schedule,
      totalStudents,
      status,
      traineeEmails
    } = body;

    const batch = await prisma.batch.update({
      where: { id: parseInt(id) },
      data: {
        ...(batchName && { batchName }),
        ...(courseId && { courseId: parseInt(courseId) }),
        ...(courseName && { courseName }),
        ...(trainerEmail && { trainerEmail }),
        ...(coordinatorEmail !== undefined && { coordinatorEmail }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(institutionName !== undefined && { location: institutionName }),
        ...(schedule && { schedule }),
        ...(totalStudents && { totalStudents: parseInt(totalStudents) }),
        ...(status && { status })
      }
    });

    // Update trainees if provided
    if (traineeEmails) {
      // Remove existing enrollments
      await prisma.studentBatch.deleteMany({
        where: { batchId: parseInt(id) }
      });

      // Add new enrollments
      if (traineeEmails.length > 0) {
        await Promise.all(
          traineeEmails.map(email =>
            prisma.studentBatch.create({
              data: {
                studentEmail: email,
                batchId: parseInt(id)
              }
            })
          )
        );
      }
    }

    return NextResponse.json(batch);
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }
    console.error('PUT /api/batch/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update batch' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Delete associated student enrollments first
    await prisma.studentBatch.deleteMany({
      where: { batchId: parseInt(id) }
    });

    // Delete the batch
    await prisma.batch.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Batch deleted' });
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }
    console.error('DELETE /api/batch/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete batch' }, { status: 500 });
  }
}
