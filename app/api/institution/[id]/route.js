import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const institution = await prisma.institution.findUnique({
      where: { id: parseInt(id) },
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
      }
    });

    if (!institution) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    return NextResponse.json(institution);
  } catch (error) {
    console.error('GET /api/institution/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch institution' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, address, email, contactNumber, status } = body;

    const institution = await prisma.institution.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(address !== undefined && { address: address || null }),
        ...(email !== undefined && { email: email || null }),
        ...(contactNumber !== undefined && { contactNumber: contactNumber || null }),
        ...(status && { status })
      },
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
      }
    });

    return NextResponse.json(institution);
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }
    console.error('PUT /api/institution/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update institution' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await prisma.institution.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Institution deleted' });
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }
    console.error('DELETE /api/institution/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete institution' }, { status: 500 });
  }
}
