import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get('createdBy');
    const userRole = searchParams.get('userRole');

    if (!createdBy) {
      return NextResponse.json({ error: 'createdBy is required' }, { status: 400 });
    }

    // Fetch quizzes with attempt counts
    const quizzes = await prisma.quiz.findMany({
      where: {
        createdBy: createdBy
      },
      include: {
        attempts: {
          select: {
            id: true,
            traineeName: true,
            traineeEmail: true,
            score: true,
            status: true,
            attemptCount: true,
            attemptedAt: true
          }
        },
        _count: {
          select: {
            attempts: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format the response to match the expected structure
    const formattedQuizzes = quizzes.map(quiz => ({
      id: quiz.id,
      title: quiz.title,
      course: quiz.course,
      courseId: quiz.courseId,
      duration: quiz.duration,
      totalMarks: quiz.totalMarks,
      passingMarks: quiz.passingMarks,
      totalQuestions: quiz.totalQuestions,
      questions: quiz.questions,
      createdBy: quiz.createdBy,
      createdAt: quiz.createdAt,
      attemptCount: quiz._count.attempts
    }));

    return NextResponse.json(formattedQuizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}