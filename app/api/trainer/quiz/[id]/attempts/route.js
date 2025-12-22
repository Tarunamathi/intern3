import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    const quizId = parseInt(params.id);

    if (isNaN(quizId)) {
      return NextResponse.json({ error: 'Invalid quiz ID' }, { status: 400 });
    }

    // Verify the quiz exists and get creator info
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: { id: true, createdBy: true }
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Fetch all attempts for this quiz
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        quizId: quizId
      },
      include: {
        trainee: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        attemptedAt: 'desc'
      }
    });

    // Format the response
    const formattedAttempts = attempts.map(attempt => ({
      id: attempt.id,
      quizId: attempt.quizId,
      traineeId: attempt.traineeId,
      traineeName: attempt.traineeName || `${attempt.trainee.firstName} ${attempt.trainee.lastName}`,
      traineeEmail: attempt.traineeEmail,
      studentName: attempt.traineeName || `${attempt.trainee.firstName} ${attempt.trainee.lastName}`,
      studentEmail: attempt.traineeEmail,
      attemptNumber: attempt.attemptCount,
      attemptCount: attempt.attemptCount,
      score: attempt.score,
      totalMarks: attempt.totalMarks,
      status: attempt.status,
      lastScore: attempt.score,
      answers: attempt.answers,
      submittedAt: attempt.attemptedAt,
      attemptedAt: attempt.attemptedAt
    }));

    return NextResponse.json(formattedAttempts);
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz attempts' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}