import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const role = url.searchParams.get('role');
    const where = role ? { role: { equals: role, mode: 'insensitive' } } : {};

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ users });
  } catch (err) {
    console.error('GET /api/users error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
