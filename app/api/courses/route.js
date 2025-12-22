import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { writeFile, mkdir, access } from 'fs/promises';
import path from 'path';

// ✅ GET - Fetch all courses (with optional filtering for trainers)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get('createdBy');
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    // Build where clause
    const where = {};
    
    // If trainer, only show their courses
    if (createdBy && role === 'trainer') {
      where.createdBy = createdBy;
    }
    
    // Filter by status if provided
    if (status && status !== 'All') {
      where.status = status;
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        batches: {
          select: {
            id: true,
            batchName: true,
            batchCode: true,
            status: true,
            enrolledStudents: true,
          },
        },
        modules: {
          include: {
            materials: true,
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate statistics for each course
    const coursesWithStats = courses.map(course => {
      const totalBatches = course.batches?.length || 0;
      const totalStudents = course.batches?.reduce(
        (sum, batch) => sum + (batch.enrolledStudents || 0),
        0
      ) || 0;

      return {
        ...course,
        totalBatches,
        totalStudents,
        enrolledStudents: totalStudents,
      };
    });

    // Overall statistics
    const stats = {
      totalCourses: courses.length,
      totalStudents: coursesWithStats.reduce((sum, c) => sum + c.totalStudents, 0),
      totalBatches: coursesWithStats.reduce((sum, c) => sum + c.totalBatches, 0),
    };

    return NextResponse.json({
      courses: coursesWithStats,
      stats,
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses', details: error.message },
      { status: 500 }
    );
  }
}

// ✅ POST - Create a new course
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      duration,
      startDate,
      endDate,
      startTime,
      endTime,
      daysOfWeek,
      modules,
      beneficiaries,
      image,
      color,
      createdBy,
      createdByRole,
      status,
    } = body;

    // Validation
    if (!title || !duration || !createdBy) {
      return NextResponse.json(
        { error: 'Missing required fields: title, duration, createdBy' },
        { status: 400 }
      );
    }

    if (!modules || modules.length === 0) {
      return NextResponse.json(
        { error: 'At least one module is required' },
        { status: 400 }
      );
    }

    // Process modules - convert to JSON strings for storage
    const processedMaterials = modules.map(module => 
      JSON.stringify({
        title: module.title || 'Untitled Module',
        fileUrl: module.fileUrl || null,
        fileName: module.fileName || null,
      })
    );

    // Create course in database
    // If image is a data URL (client sent base64), save it to public/uploads/courses
    let imageUrl = image || null;
    if (image && typeof image === 'string' && image.startsWith('data:')) {
      try {
        const matches = image.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          const mime = matches[1];
          const b64 = matches[2];
          const buffer = Buffer.from(b64, 'base64');
          const ext = mime.split('/')[1] || 'png';
          const timestamp = Date.now();
          const fileName = `${timestamp}_course_image.${ext}`;
          const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'courses');
          await mkdir(uploadDir, { recursive: true });
          const filePath = path.join(uploadDir, fileName);
          await writeFile(filePath, buffer);
          // verify
          await access(filePath);
          imageUrl = `/uploads/courses/${fileName}`;
        }
      } catch (e) {
        console.warn('Could not save data-URL image for course:', e);
        imageUrl = null;
      }
    }

    const newCourse = await prisma.course.create({
      data: {
        name: title,
        title: title,
        image: imageUrl,
        duration,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        startTime: startTime || null,
        endTime: endTime || null,
        daysOfWeek: daysOfWeek || [],
        materials: processedMaterials,
        beneficiaries: beneficiaries || [],
        color: color || 'from-green-500 to-green-600',
        createdBy,
        createdByRole: createdByRole || 'admin',
        status: status || 'Active',
      },
    });

    console.log('✅ Course created successfully:', newCourse.id);

    return NextResponse.json(newCourse, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course', details: error.message },
      { status: 500 }
    );
  }
}