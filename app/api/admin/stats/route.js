import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request) {
  try {
    // Get aggregate counts
    const [userStats, courseStats, batchStats] = await Promise.all([
      // User counts by role
      prisma.user.groupBy({
        by: ['role'],
        _count: { id: true }
      }),
      // Course counts
      prisma.course.count(),
      // Batch stats
      prisma.batch.aggregate({
        _count: {
          id: true
        },
        _sum: {
          enrolledStudents: true
        }
      })
    ]);

    // Transform role counts into a map
    const roleCounts = {};
    userStats.forEach(stat => {
      roleCounts[stat.role.toLowerCase()] = stat._count.id;
    });

    return NextResponse.json({
      users: {
        total: Object.values(roleCounts).reduce((a, b) => a + b, 0),
        trainers: roleCounts.trainer || 0,
        trainees: roleCounts.trainee || 0,
        admins: roleCounts.admin || 0,
        coordinators: roleCounts.coordinator || 0
      },
      courses: {
        total: courseStats
      },
      batches: {
        total: batchStats._count.id || 0,
        enrolledStudents: batchStats._sum.enrolledStudents || 0
      }
    });
  } catch (error) {
    console.error('GET /api/admin/stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}