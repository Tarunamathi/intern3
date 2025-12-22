import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get('createdBy');

    const where = createdBy ? { createdBy } : {};

    const quizzes = await prisma.quiz.findMany({
      where,
      include: {
        _count: { select: { attempts: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = quizzes.map(q => ({
      id: q.id,
      title: q.title,
      course: q.course,
      courseId: q.courseId,
      duration: q.duration,
      totalMarks: q.totalMarks,
      passingMarks: q.passingMarks,
      questions: q.questions,
      totalQuestions: q.totalQuestions,
      createdBy: q.createdBy,
      createdAt: q.createdAt,
      attemptCount: q._count?.attempts || 0,
      batchId: q.questions?.meta?.batchId ?? null
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching public quizzes:', error);
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 });
  }
}
