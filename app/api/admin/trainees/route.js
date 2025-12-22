import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// GET all trainees
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const trainees = await prisma.user.findMany({
      where: {
        role: 'trainee',
        OR: search ? [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { username: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
        ] : undefined,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        phone: true,
        location: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, trainees });
  } catch (error) {
    console.error('Error fetching trainees:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trainees' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Create new trainee
export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, username, email, password, phone, location } = body;

    // Validation
    if (!firstName || !lastName || !username || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email or username already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create trainee
    const trainee = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        role: 'trainee',
        phone: phone || null,
        location: location || null,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        phone: true,
        location: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, trainee }, { status: 201 });
  } catch (error) {
    console.error('Error creating trainee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create trainee' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}