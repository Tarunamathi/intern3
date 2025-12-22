import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

// GET - Fetch all trainers
export async function GET() {
  try {
    console.log('GET /api/admin/trainers called');
    
    const trainers = await prisma.user.findMany({
      where: { role: 'trainer' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        location: true,
        specialization: true,
        yearsOfExperience: true,
        bio: true,
        totalCourses: true,
        totalStudents: true,
        activeBatches: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('Found trainers:', trainers.length);
    return NextResponse.json({ success: true, trainers });
  } catch (error) {
    console.error('GET /api/admin/trainers error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch trainers' }, { status: 500 });
  }
}

// POST - Create new trainer
export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, phone, location, specialization, yearsOfExperience, bio } = body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate username from email
    const username = email.split('@')[0] + '_' + Date.now();

    // Create trainer
    const trainer = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        role: 'trainer',
        phone: phone || null,
        location: location || null,
        specialization: specialization || null,
        yearsOfExperience: yearsOfExperience || null,
        bio: bio || null
      }
    });

    return NextResponse.json({ success: true, trainer }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/trainers error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create trainer' }, { status: 500 });
  }
}