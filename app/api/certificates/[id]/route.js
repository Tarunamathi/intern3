import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    if (!id) return NextResponse.json({ error: 'Certificate id required' }, { status: 400 });

    const cert = await prisma.certificate.findUnique({ where: { certificateId: id } });
    if (!cert) return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });

    return NextResponse.json(cert);
  } catch (error) {
    console.error('Error fetching certificate:', error);
    return NextResponse.json({ error: 'Failed to fetch certificate' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!id) return NextResponse.json({ error: 'Certificate id required' }, { status: 400 });

    await prisma.certificate.delete({ where: { certificateId: id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    return NextResponse.json({ error: 'Failed to delete certificate' }, { status: 500 });
  }
}
