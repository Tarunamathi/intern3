import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET(request) {
  try {
    const institutions = await prisma.institution.findMany({
      include: {
        batches: {
          select: {
            id: true,
            batchCode: true,
            batchName: true,
            courseName: true,
            startDate: true,
            endDate: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(institutions);
  } catch (error) {
    console.error('GET /api/institution error:', error);
    return NextResponse.json({ error: 'Failed to fetch institutions' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, address, email, contactNumber, status } = body;

    if (!name) {
      return NextResponse.json({ error: 'Institution name is required' }, { status: 400 });
    }

    // Check if institution already exists by name
    const existing = await prisma.institution.findFirst({
      where: { name }
    });

    if (existing) {
      return NextResponse.json({ error: 'Institution with this name already exists' }, { status: 400 });
    }

    // Generate unique institution code
    const code = `INST-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const institution = await prisma.institution.create({
      data: {
        code,
        name,
        address: address || null,
        email: email || null,
        contactNumber: contactNumber || null,
        status: status || 'Active'
      },
      include: {
        batches: true
      }
    });

    return NextResponse.json(institution, { status: 201 });
  } catch (error) {
    console.error('POST /api/institution error:', error);
    return NextResponse.json({ error: 'Failed to create institution' }, { status: 500 });
  }
}
