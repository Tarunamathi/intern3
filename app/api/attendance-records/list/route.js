import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get('batchId');
    const date = searchParams.get('date');

    const where = {};
    if (batchId) where.batchId = Number(batchId);
    if (date) where.date = new Date(date);

    const records = await prisma.attendanceRecord.findMany({ where, orderBy: { date: 'desc' } });
    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}
