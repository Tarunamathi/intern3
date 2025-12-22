import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(req, { params }) {
  try {
    const batchId = params.id;
    if (!batchId) {
      return NextResponse.json({ error: 'Batch ID is required' }, { status: 400 });
    }

    const students = await prisma.studentBatch.findMany({
      where: { 
        batchId: Number(batchId) 
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { enrolledDate: 'asc' }
    });

    return NextResponse.json({
      students: students.filter(sb => sb.student) // only return enrolled students that exist
    });
  } catch (error) {
    console.error('Error fetching batch students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students', details: error.message },
      { status: 500 }
    );
  }
}