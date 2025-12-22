import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function POST(request) {
  try {
    const email = request.headers.get('x-user-email');
    if (!email) return NextResponse.json({ error: 'Unauthorized - x-user-email header required' }, { status: 401 });

    const body = await request.json();
    const { currentPassword, newPassword } = body;
    if (!currentPassword || !newPassword) return NextResponse.json({ error: 'currentPassword and newPassword required' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // ensure trainer role
    if ((user.role || '').toLowerCase() !== 'trainer') return NextResponse.json({ error: 'Access denied' }, { status: 403 });

    const match = await bcrypt.compare(currentPassword, user.password || '');
    if (!match) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });

    if (newPassword.length < 8) return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { email }, data: { password: hashed } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error changing trainer password:', error);
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
  }
}
