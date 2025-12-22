import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function PATCH(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const url = new URL(request.url);
    const queryEmail = url.searchParams.get('email');
    const headerEmail = request.headers.get('x-user-email');
    const email = headerEmail || body.email || queryEmail;

    if (!email) {
      console.debug('PATCH /api/user/update-profile missing email', {
        headerEmail,
        bodyHasEmail: Boolean(body && body.email),
        queryEmail
      });
      return NextResponse.json({ error: 'Unauthorized - provide email via x-user-email header, request body {"email":"..."}, or ?email= query param' }, { status: 401 });
    }

    // Whitelist updatable fields
    const allowed = [
      'firstName',
      'lastName',
      'username',
      'phone',
      'location',
      'profilePicture',
      'specialization',
      'certifications',
      'bio',
      'yearsOfExperience'
    ];

    const data = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        data[key] = body[key];
      }
    }

    // Normalize certifications to array if provided as comma-separated string
    if (data.certifications && !Array.isArray(data.certifications)) {
      data.certifications = String(data.certifications)
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    }

    const updated = await prisma.user.update({
      where: { email },
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        role: true,
        phone: true,
        location: true,
        profilePicture: true,
        specialization: true,
        certifications: true,
        bio: true,
        yearsOfExperience: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ user: updated }, { status: 200 });
  } catch (err) {
    console.error('PATCH /api/user/update-profile error', err);
    return NextResponse.json({ error: 'Failed to update profile', details: err?.message || String(err) }, { status: 500 });
  }
}
