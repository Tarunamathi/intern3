import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request) {
  try {
    const emailHeader = request.headers.get('x-user-email');
    if (!emailHeader) {
      return NextResponse.json({ error: 'Email header required' }, { status: 401 });
    }
    // Find user by email (don't assume role casing or presence of emailVerified field)
    const user = await prisma.user.findUnique({
      where: { email: emailHeader },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Ensure the user is an admin (case-insensitive)
    if (!user.role || user.role.toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    return NextResponse.json({
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.email,
      role: user.role,
      emailVerified: false,
      registeredOn: user.createdAt instanceof Date ? user.createdAt.toISOString() : String(user.createdAt),
    });
  } catch (error) {
    console.error('GET /api/admin/me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}