import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(request) {
  try {

    const body = await request.json();
    const { email, status } = body;

    if (!email || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const coordinator = await prisma.user.update({
      where: { email },
      data: { status },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true
      }
    });

    return NextResponse.json({
      name: `${coordinator.firstName} ${coordinator.lastName}`.trim(),
      email: coordinator.email,
      access: coordinator.role,
      status: coordinator.status
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Coordinator not found' }, { status: 404 });
    }
    console.error('POST /api/coordinator/approve error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
