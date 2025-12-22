import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// single PrismaClient instance in development
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET(request) {
  try {
    const email = request.headers.get('x-user-email');
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized - x-user-email header required' }, { status: 401 });
    }

    // Find batches assigned to this trainer and include related course + modules/materials and enrolled students
    const batches = await prisma.batch.findMany({
      where: { trainerEmail: email },
      include: {
        course: {
          include: {
            modules: {
              include: {
                materials: true,
              },
            },
          },
        },
        students: {
          include: {
            student: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    // Map batches -> course-like objects expected by trainer UI
    const courses = batches.map((batch) => {
      const course = batch.course || {};

      // Flatten module materials into a simple materials array the UI expects
      const materials = [];
      if (course.modules && Array.isArray(course.modules)) {
        course.modules.forEach((mod) => {
          if (mod.materials && Array.isArray(mod.materials)) {
            mod.materials.forEach((m) => {
              materials.push({
                id: m.id,
                name: m.title,
                fileUrl: m.fileUrl,
                mimeType: m.mimeType || null,
                uploadedAt: m.uploadedAt,
              });
            });
          }
        });
      }

      const trainees = (batch.students || []).map((sb) => {
        const s = sb.student || {};
        return {
          name: `${s.firstName || ''} ${s.lastName || ''}`.trim(),
          email: s.email,
          classesAttended: sb.attendance || 0,
          totalClasses: 0,
          attendancePercentage: sb.attendance || 0,
        };
      });

      return {
        // Use batch id here so trainer sees each assigned batch as an item
        id: batch.id,
        title: course.name || batch.courseName || batch.batchName,
        courseCode: batch.batchCode || `COURSE-${course.id || 'NA'}`,
        totalTrainees: batch.enrolledStudents || batch.totalStudents || 0,
        startDate: batch.startDate,
        endDate: batch.endDate,
        description: course.description || '',
        materials,
        trainees,
        liveClassLinks: batch.liveClassLinks || [],
        // keep original references for possible client needs
        batchId: batch.id,
        courseId: course.id || batch.courseId,
      };
    });

    return NextResponse.json({ courses }, { status: 200 });
  } catch (error) {
    console.error('Error in trainer/my-courses:', error);
    return NextResponse.json({ error: 'Failed to fetch trainer courses', details: error.message }, { status: 500 });
  } finally {
    // do not disconnect global prisma in serverless envs; keep as no-op here
  }
}
