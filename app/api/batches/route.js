import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all batches
export async function GET() {
  try {
    const batches = await prisma.batch.findMany({
      include: {
        course: {
          select: {
            id: true,
            name: true,
            category: true,
            duration: true,
          },
        },
        trainer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            specialization: true,
          },
        },
        students: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`Fetched ${batches.length} batches from database`);

    return NextResponse.json({ 
      batches,
      count: batches.length
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching batches:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch batches',
        details: error.message,
        batches: []
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Create new batch
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      batchName,
      batchCode,
      courseId,
      courseName,
      trainerEmail,
      startDate,
      endDate,
      schedule,
      timeSlot,
      location,
      totalStudents,
      enrolledStudents,
      status,
      traineeEmails,
    } = body;

    console.log('Creating batch with data:', { batchName, courseId, trainerEmail, traineeCount: traineeEmails?.length });

    // Validate required fields
    if (!batchName || !batchCode || !courseId || !trainerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: batchName, batchCode, courseId, or trainerEmail' },
        { status: 400 }
      );
    }

    // Verify trainer exists
    const trainer = await prisma.user.findUnique({
      where: { email: trainerEmail },
    });

    if (!trainer) {
      return NextResponse.json(
        { error: `Trainer with email ${trainerEmail} not found` },
        { status: 404 }
      );
    }

    if (trainer.role !== 'trainer') {
      return NextResponse.json(
        { error: `User ${trainerEmail} is not a trainer` },
        { status: 400 }
      );
    }

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: `Course with ID ${courseId} not found` },
        { status: 404 }
      );
    }

    // Create batch with students
    const batch = await prisma.batch.create({
      data: {
        batchName,
        batchCode,
        courseId,
        courseName: courseName || course.name,
        trainerEmail,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        schedule: schedule || 'Mon-Fri',
        timeSlot: timeSlot || '9:00 AM - 5:00 PM',
        location: location || 'Online',
        totalStudents: totalStudents || traineeEmails?.length || 0,
        enrolledStudents: traineeEmails?.length || 0,
        status: status || 'Upcoming',
        progress: 0,
        students: {
          create: (traineeEmails || []).map((email) => ({
            studentEmail: email,
            status: 'Active',
            attendance: 0,
          })),
        },
      },
      include: {
        course: true,
        trainer: true,
        students: {
          include: {
            student: true,
          },
        },
      },
    });

    // Update trainer stats
    await prisma.user.update({
      where: { email: trainerEmail },
      data: {
        totalCourses: { increment: 1 },
        totalStudents: { increment: traineeEmails?.length || 0 },
        activeBatches: { increment: status === 'Active' ? 1 : 0 },
      },
    });

    console.log('Batch created successfully:', batch.id);

    return NextResponse.json(
      { message: 'Batch created successfully', batch },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error creating batch:', error);
    return NextResponse.json(
      { error: 'Failed to create batch', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}