import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcrypt';

export async function GET(request) {
  try {
    // Get admins
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(admins.map(admin => ({
      name: `${admin.firstName} ${admin.lastName}`.trim(),
      email: admin.email,
      access: admin.role
    })));
  } catch (error) {
    console.error('GET /api/admin/list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, access } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Split name into firstName/lastName
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ');

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // ensure we provide a username (schema may require it)
    let username = email.split('@')[0];
    // if username already exists, append timestamp to make unique
    const existingByUsername = await prisma.user.findUnique({ where: { username } });
    if (existingByUsername) {
      username = `${username}_${Date.now().toString().slice(-5)}`;
    }

    // hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
        role: 'ADMIN'
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        role: true
      }
    });

    return NextResponse.json({
      name: `${admin.firstName} ${admin.lastName}`.trim(),
      email: admin.email,
      access: admin.role
    });
  } catch (error) {
    console.error('POST /api/admin/list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}