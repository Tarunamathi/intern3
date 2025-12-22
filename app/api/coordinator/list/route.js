import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcrypt';

export async function GET(request) {
  try {
    // Get coordinators
    const coordinators = await prisma.user.findMany({
      where: { role: 'COORDINATOR' },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(coordinators.map(coordinator => ({
      name: `${coordinator.firstName} ${coordinator.lastName}`.trim(),
      email: coordinator.email,
      access: coordinator.role,
      status: coordinator.status
    })));
  } catch (error) {
    console.error('GET /api/coordinator/list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, status } = body;

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

    const coordinator = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
        role: 'COORDINATOR',
        status: status || 'Pending'
      },
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
    console.error('POST /api/coordinator/list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const result = await prisma.user.delete({
      where: { email },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        role: true
      }
    });

    return NextResponse.json({
      name: `${result.firstName} ${result.lastName}`.trim(),
      email: result.email,
      access: result.role
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Coordinator not found' }, { status: 404 });
    }
    console.error('DELETE /api/coordinator/list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
