import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(request) {
  try {
    // Get the user email from headers for authentication
    const userEmail = request.headers.get('x-user-email');

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing user email' },
        { status: 401 }
      );
    }

    // Verify the user is an admin
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user || user.role.toLowerCase() !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Not an admin' },
        { status: 403 }
      );
    }

    // Fetch all the required statistics
    const [userStats, courses, batches] = await Promise.all([
      // Get user counts by role
      prisma.user.groupBy({
        by: ['role'],
        _count: true
      }),
      // Get course count and details
      prisma.course.findMany({
        include: {
          _count: {
            select: { batches: true }
          }
        }
      }),
      // Get batch count and enrollment details
      prisma.batch.findMany({
        include: {
          _count: {
            select: { students: true }
          }
        }
      })
    ]);

    // Process user stats
    const roleStats = {
      totalTrainers: 0,
      totalTrainees: 0,
      totalCoordinators: 0
    };

    userStats.forEach(stat => {
      const role = stat.role.toLowerCase();
      if (role === 'trainer') roleStats.totalTrainers = stat._count;
      if (role === 'trainee') roleStats.totalTrainees = stat._count;
      if (role === 'coordinator') roleStats.totalCoordinators = stat._count;
    });

    // Calculate total enrollments from batch students
    const totalEnrollments = batches.reduce((sum, batch) => sum + batch._count.students, 0);

    // Get top courses by batch count
    const courseInsights = courses
      .sort((a, b) => b._count.batches - a._count.batches)
      .slice(0, 2)
      .map(course => ({
        name: course.name,
        enrollments: course._count.batches
      }));

    // Prepare enrollment process data using actual enrollment numbers
    const enrollmentProcess1 = {
      registered: totalEnrollments,
      completed: Math.floor(totalEnrollments * 0.8) // Assuming 80% completion rate
    };

    const enrollmentProcess2 = {
      registered: totalEnrollments,
      active: Math.floor(totalEnrollments * 0.6), // Assuming 60% active
      completed: Math.floor(totalEnrollments * 0.4) // Assuming 40% completed
    };

    // Construct the response
    const dashboardData = {
      stats: {
        totalCourses: courses.length,
        totalTrainers: roleStats.totalTrainers,
        totalTrainees: roleStats.totalTrainees,
        totalBatches: batches.length,
        totalEnrollment: totalEnrollments
      },
      enrollmentProcess1,
      enrollmentProcess2,
      courseInsights
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}