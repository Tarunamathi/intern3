import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request) {
  try {
    const batches = await prisma.batch.findMany({
      select: {
        id: true,
        batchName: true,
        batchCode: true,
        courseName: true,
        startDate: true,
        endDate: true,
        status: true
      },
      orderBy: { startDate: 'desc' }
    });

    return NextResponse.json(batches);
  } catch (error) {
    console.error('GET /api/batches/list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch batches' },
      { status: 500 }
    );
  }
}