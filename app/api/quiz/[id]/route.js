import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid quiz id' }, { status: 400 });

    const quiz = await prisma.quiz.findUnique({ where: { id } });
    if (!quiz) return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });

    const formatted = {
      id: quiz.id,
      title: quiz.title,
      course: quiz.course,
      courseId: quiz.courseId,
      duration: quiz.duration,
      totalMarks: quiz.totalMarks,
      passingMarks: quiz.passingMarks,
      questions: quiz.questions?.items || [],
      meta: quiz.questions?.meta || {},
      totalQuestions: quiz.totalQuestions,
      createdBy: quiz.createdBy
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching quiz by id:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz' }, { status: 500 });
  }
}
