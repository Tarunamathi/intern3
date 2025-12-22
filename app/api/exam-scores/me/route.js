// app/api/exam-scores/me/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request) {
  try {
    // prefer x-user-email header (used elsewhere) otherwise allow query param
    const emailHeader = request.headers.get('x-user-email');
    const url = new URL(request.url);
    const q = url.searchParams.get('traineeEmail');
    const traineeEmail = emailHeader || q;

    if (!traineeEmail) {
      return NextResponse.json({ error: 'traineeEmail required in x-user-email header or query' }, { status: 400 });
    }

    const scores = await prisma.examScore.findMany({
      where: { traineeEmail },
      orderBy: { examDate: 'desc' },
    });

    return NextResponse.json(scores);
  } catch (err) {
    console.error('GET /api/exam-scores/me error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
