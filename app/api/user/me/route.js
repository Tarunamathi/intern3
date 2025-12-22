import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request) {
  try {
    const email = request.headers.get('x-user-email');
    if (!email) {
      return NextResponse.json({ error: 'Unauthorized - x-user-email header required' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        role: true,
        phone: true,
        location: true,
        profilePicture: true,
        specialization: true,
        certifications: true,
        bio: true,
        yearsOfExperience: true,
        totalCourses: true,
        totalStudents: true,
        activeBatches: true,
        completionRate: true,
        createdAt: true,
        updatedAt: true,
      }
    });

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // return wrapped object for backward compatibility with client expecting { user }
  return NextResponse.json({ user });
  } catch (err) {
    console.error('GET /api/user/me error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
