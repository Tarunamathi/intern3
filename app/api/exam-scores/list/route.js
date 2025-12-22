// app/api/exam-scores/list/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const traineeEmail = url.searchParams.get('traineeEmail');
    const createdBy = url.searchParams.get('createdBy');
    const batchId = url.searchParams.get('batchId');

    const where = {};
    if (traineeEmail) where.traineeEmail = traineeEmail;
    if (createdBy) where.createdBy = createdBy;
    if (batchId) where.batchId = Number(batchId);

    const scores = await prisma.examScore.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(scores);
  } catch (err) {
    console.error('GET /api/exam-scores/list error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
