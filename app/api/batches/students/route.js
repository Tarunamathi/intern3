import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get('batchId');
    if (!batchId) return NextResponse.json({ error: 'batchId required' }, { status: 400 });

    const students = await prisma.studentBatch.findMany({
      where: { batchId: Number(batchId) },
      include: { student: true },
      orderBy: { enrolledDate: 'asc' }
    });

    // Normalize shape for frontend: include student fields at top-level
    const payload = students.map((s) => ({
      studentEmail: s.studentEmail,
      firstName: s.student?.firstName || null,
      lastName: s.student?.lastName || null,
      email: s.student?.email || s.studentEmail,
      enrolledDate: s.enrolledDate,
      status: s.status
    }));

    return NextResponse.json(payload);
  } catch (error) {
    console.error('Error fetching batch students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}
