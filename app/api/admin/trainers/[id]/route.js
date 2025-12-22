import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import bcrypt from 'bcryptjs';

// PUT - Update trainer
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { firstName, lastName, password, phone, location, specialization, yearsOfExperience, bio } = body;

    // Check if trainer exists
    const trainer = await prisma.user.findUnique({
      where: { id: parseInt(id), role: 'trainer' }
    });

    if (!trainer) {
      return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData = {
      firstName,
      lastName,
      phone: phone || null,
      location: location || null,
      specialization: specialization || null,
      yearsOfExperience: yearsOfExperience || null,
      bio: bio || null
    };

    // Only update password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update trainer
    const updatedTrainer = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    return NextResponse.json({ success: true, trainer: updatedTrainer });
  } catch (error) {
    console.error('PUT /api/admin/trainers/[id] error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update trainer' }, { status: 500 });
  }
}

// DELETE - Delete trainer
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Check if trainer exists
    const trainer = await prisma.user.findUnique({
      where: { id: parseInt(id), role: 'trainer' }
    });

    if (!trainer) {
      return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
    }

    // Check if trainer has active batches or relations
    const activeBatches = await prisma.batch.count({
      where: { trainerEmail: trainer.email, status: 'Active' }
    });

    if (activeBatches > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete trainer with active batches. Please reassign batches first.' 
      }, { status: 400 });
    }

    // Delete trainer
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true, message: 'Trainer deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/admin/trainers/[id] error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete trainer' }, { status: 500 });
  }
}