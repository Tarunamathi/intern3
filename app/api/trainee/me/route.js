import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request) {
  try {
    // prefer x-user-email header otherwise allow ?email= query param
    const emailHeader = request.headers.get('x-user-email');
    const url = new URL(request.url);
    const q = url.searchParams.get('email');
    const email = emailHeader || q;

    if (!email) {
      // fallback to id=1 for development convenience
      const user = await prisma.user.findUnique({
        where: { id: 1 },
        select: { id: true, firstName: true, lastName: true, email: true, profilePicture: true, phone: true, role: true },
      });

      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
      return NextResponse.json({ user });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, firstName: true, lastName: true, email: true, profilePicture: true, phone: true, role: true },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ user });
  } catch (err) {
    console.error('Fetch user error:', err);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
