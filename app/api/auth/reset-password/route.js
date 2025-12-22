import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const body = await req.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json({ message: 'Token and new password are required' }, { status: 400 });
    }

    if (!prisma.passwordResetToken) {
      console.error('Prisma client does not have model `passwordResetToken`. Did you run prisma migrate?');
      return NextResponse.json({ message: 'Server not configured for password resets. Run prisma migrate dev to add required table.' }, { status: 500 });
    }

    const prt = await prisma.passwordResetToken.findUnique({ where: { token } });

    if (!prt || prt.used || prt.expiresAt < new Date()) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
    }

    // Hash the new password and update user
    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email: prt.userEmail },
      data: { password: hashed }
    });

    // mark token used
    await prisma.passwordResetToken.update({ where: { id: prt.id }, data: { used: true } });

    return NextResponse.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
  }
}
