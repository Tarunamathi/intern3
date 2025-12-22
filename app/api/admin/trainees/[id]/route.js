import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// DELETE trainee
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Check if trainee exists
    const trainee = await prisma.user.findFirst({
      where: {
        id: parseInt(id),
        role: 'trainee',
      },
    });

    if (!trainee) {
      return NextResponse.json(
        { success: false, error: 'Trainee not found' },
        { status: 404 }
      );
    }

    // Delete trainee
    await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Trainee deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting trainee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete trainee' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Update trainee
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { firstName, lastName, username, email, phone, location, password } = body;

    // Check if trainee exists
    const existingTrainee = await prisma.user.findFirst({
      where: {
        id: parseInt(id),
        role: 'trainee',
      },
    });

    if (!existingTrainee) {
      return NextResponse.json(
        { success: false, error: 'Trainee not found' },
        { status: 404 }
      );
    }

    // Check if email or username is already taken by another user
    if (email !== existingTrainee.email || username !== existingTrainee.username) {
      const duplicateUser = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: parseInt(id) } },
            {
              OR: [
                { email },
                { username },
              ],
            },
          ],
        },
      });

      if (duplicateUser) {
        return NextResponse.json(
          { success: false, error: 'Email or username already taken' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData = {
      firstName,
      lastName,
      username,
      email,
      phone: phone || null,
      location: location || null,
    };

    // Only update password if provided
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update trainee
    const trainee = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: updateData,
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

    return NextResponse.json({ success: true, trainee });
  } catch (error) {
    console.error('Error updating trainee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update trainee' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET single trainee
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const trainee = await prisma.user.findFirst({
      where: {
        id: parseInt(id),
        role: 'trainee',
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
        updatedAt: true,
      },
    });

    if (!trainee) {
      return NextResponse.json(
        { success: false, error: 'Trainee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, trainee });
  } catch (error) {
    console.error('Error fetching trainee:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trainee' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}