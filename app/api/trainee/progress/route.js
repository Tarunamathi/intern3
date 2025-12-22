import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { courseId, increment = 0, moduleKey = null } = body;
    const email = request.headers.get('x-user-email');

    if (!email) return NextResponse.json({ error: 'Unauthorized - x-user-email header required' }, { status: 401 });
    if (!courseId) return NextResponse.json({ error: 'courseId required' }, { status: 400 });

    const cId = Number(courseId);
    if (!Number.isInteger(cId)) return NextResponse.json({ error: 'Invalid courseId' }, { status: 400 });

    // Find existing progress
    const existing = await prisma.traineeProgress.findFirst({ where: { studentEmail: email, courseId: cId } });

    const inc = Number(increment) || 0;
    if (existing) {
      const newProgress = Math.min(100, (existing.progress || 0) + inc);
      const updated = await prisma.traineeProgress.update({ where: { id: existing.id }, data: { progress: newProgress, lastSeenAt: new Date(), moduleKey } });
      return NextResponse.json({ success: true, progress: updated.progress });
    }

    // create new
    const created = await prisma.traineeProgress.create({ data: { studentEmail: email, courseId: cId, moduleKey: moduleKey || null, progress: Math.min(100, inc), lastSeenAt: new Date() } });
    return NextResponse.json({ success: true, progress: created.progress }, { status: 201 });
  } catch (err) {
    console.error('Error in trainee progress POST', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const email = request.headers.get('x-user-email');
    const url = new URL(request.url);
    const qCourse = url.searchParams.get('courseId');

    if (!email) return NextResponse.json({ error: 'Unauthorized - x-user-email header required' }, { status: 401 });
    if (!qCourse) return NextResponse.json({ error: 'courseId query required' }, { status: 400 });

    const courseId = Number(qCourse);
    if (!Number.isInteger(courseId)) return NextResponse.json({ error: 'Invalid courseId' }, { status: 400 });

    const progress = await prisma.traineeProgress.findFirst({ where: { studentEmail: email, courseId } });
    return NextResponse.json({ progress: progress ? progress.progress : 0 });
  } catch (err) {
    console.error('Error in trainee progress GET', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
