import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// ✅ GET - Fetch all courses (with optional filtering for trainers)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    // Note: `Course` model does not have `createdBy` or `status` fields in Prisma schema.
    // Avoid adding those into the `where` filter to prevent Prisma errors.
    const where = {};

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
    console.log('📥 Received POST /api/admin/courses body:', JSON.stringify(body, null, 2));
    
    const {
      name,
      image,
      beneficiaries = [],
      category = 'General',
      topics = 1,
      duration = 'Not specified',
      price = '₹0',
      description = '',
      startDate,
      endDate,
      startTime,
      endTime,
      daysOfWeek = [],
      modules = [],
      createdBy,
    } = body;

    // Validation
    if (!name) {
      console.error('❌ Validation failed: missing name');
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    // Build nested modules create
    const modulesCreate = [];
    if (Array.isArray(modules) && modules.length > 0) {
      for (let i = 0; i < modules.length; i++) {
        const mod = modules[i] || {};
        const materialsCreate = [];

        // Handle materials from module
        if (Array.isArray(mod.materials) && mod.materials.length > 0) {
          for (const mat of mod.materials) {
            if (mat.fileUrl) {
              materialsCreate.push({
                title: mat.title || mat.fileName || 'Material',
                fileUrl: mat.fileUrl,
                mimeType: mat.mimeType || null,
              });
            }
          }
        }
        // Handle single fileUrl in module (legacy format)
        else if (mod.fileUrl) {
          materialsCreate.push({
            title: mod.title || 'Material',
            fileUrl: mod.fileUrl,
            mimeType: mod.mimeType || null,
          });
        }

        modulesCreate.push({
          title: mod.title || `Module ${i + 1}`,
          description: mod.description || null,
          order: mod.order || i + 1,
          materials: materialsCreate.length > 0 ? { create: materialsCreate } : undefined,
        });
      }
    }

    // Create course in database with nested modules
    const newCourse = await prisma.course.create({
      data: {
        name,
        image: image || null,
        beneficiaries: Array.isArray(beneficiaries) ? beneficiaries : [],
        category,
        topics: Number(topics) || 1,
        duration: String(duration),
        price: String(price),
        description: description || '',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        startTime: startTime || null,
        endTime: endTime || null,
        daysOfWeek: Array.isArray(daysOfWeek) ? daysOfWeek : [],
        enrolledStudents: 0,
        modules: modulesCreate.length > 0 ? { create: modulesCreate } : undefined,
      },
      include: {
        modules: {
          include: {
            materials: true,
          },
        },
      },
    });

    console.log('✅ Course created successfully:', newCourse.id);

    return NextResponse.json(newCourse, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating course:', error);
    console.error('Error details:', error.message, error.code, error.meta);
    return NextResponse.json(
      { error: 'Failed to create course', details: error.message },
      { status: 500 }
    );
  }
}