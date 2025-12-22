import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// single PrismaClient instance in development
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function POST(request) {
  try {
    const email = request.headers.get('x-user-email');
    if (!email) return NextResponse.json({ error: 'Unauthorized - x-user-email header required' }, { status: 401 });

    const body = await request.json();

    // allowed fields to update
    const {
      firstName,
      lastName,
      phone,
      address,
      city,
      state,
      country,
      profilePicture,
      yearsOfExperience,
      bio,
      specialization
    } = body;

    // find user and ensure role is trainer
    const existing = await prisma.user.findUnique({ where: { email } });
    if (!existing) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if ((existing.role || '').toLowerCase() !== 'trainer') {
      return NextResponse.json({ error: 'Access denied - not a trainer' }, { status: 403 });
    }

    const updateData = {};
    if (typeof firstName !== 'undefined') updateData.firstName = firstName;
    if (typeof lastName !== 'undefined') updateData.lastName = lastName;
    if (typeof phone !== 'undefined') updateData.phone = phone;
    if (typeof profilePicture !== 'undefined') updateData.profilePicture = profilePicture;
    if (typeof yearsOfExperience !== 'undefined') updateData.yearsOfExperience = yearsOfExperience;
    if (typeof bio !== 'undefined') updateData.bio = bio;
    if (typeof specialization !== 'undefined') updateData.specialization = specialization;
    // address fields — combine into location or keep as separate fields if model has them
    if (typeof address !== 'undefined') updateData.location = address;
    if (typeof city !== 'undefined' && city) updateData.location = `${updateData.location ? updateData.location + ', ' : ''}${city}`;
    if (typeof state !== 'undefined' && state) updateData.location = `${updateData.location ? updateData.location + ', ' : ''}${state}`;
    if (typeof country !== 'undefined' && country) updateData.location = `${updateData.location ? updateData.location + ', ' : ''}${country}`;

    // perform update
    const updated = await prisma.user.update({ where: { email }, data: updateData, select: { id: true, firstName: true, lastName: true, email: true, phone: true, profilePicture: true, specialization: true, yearsOfExperience: true, bio: true, location: true } });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('Error updating trainer profile:', error);
    return NextResponse.json({ error: 'Failed to update profile', details: error.message }, { status: 500 });
  }
}
