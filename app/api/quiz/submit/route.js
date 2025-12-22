import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { quizId, traineeEmail, traineeName, answers } = body;

    if (!quizId || !traineeEmail || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch quiz and validate
    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(quizId) },
      include: {
        courseRef: {
          include: {
            batches: {
              where: {
                students: {
                  some: {
                    studentEmail: traineeEmail
                  }
                }
              },
              select: { id: true }
            }
          }
        }
      }
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Check if trainee is enrolled in a batch for this course
    // Store batchId from quiz.questions.meta
    const batchIdFromQuiz = quiz.questions?.meta?.batchId;
    if (batchIdFromQuiz) {
      const enrollment = await prisma.studentBatch.findFirst({
        where: {
          studentEmail: traineeEmail,
          batchId: parseInt(batchIdFromQuiz)
        }
      });

      if (!enrollment) {
        return NextResponse.json(
          { error: 'You are not enrolled in the batch for this quiz' },
          { status: 403 }
        );
      }
    }

    const items = (quiz.questions && quiz.questions.items) || [];
    let score = 0;
    let totalMarks = 0;
    let hasManual = false;

    // answers expected: [{ questionIndex: 0, answer: '...' }, ...] or {0: 'A', 1: 'B'}
    const answerMap = Array.isArray(answers)
      ? answers.reduce((acc, a) => { acc[a.questionIndex] = a.answer; return acc; }, {})
      : answers;

    for (let i = 0; i < items.length; i++) {
      const q = items[i];
      const qMarks = parseInt(q.marks || 0, 10) || 0;
      totalMarks += qMarks;
      const given = answerMap[i];

      if (q.type === 'multiple-choice' || q.type === 'true-false') {
        if (given != null && String(given).trim() === String(q.correctAnswer).trim()) {
          score += qMarks;
        }
      } else if (q.type === 'short-answer') {
        // short answer requires manual grading
        hasManual = true;
      }
    }

    // Determine attempt count
    const previous = await prisma.quizAttempt.findMany({ where: { quizId: parseInt(quizId), traineeEmail } });
    const attemptCount = (previous?.length || 0) + 1;

    const status = hasManual ? 'Pending Review' : (score >= quiz.passingMarks ? 'Passed' : 'Failed');

    const created = await prisma.quizAttempt.create({
      data: {
        quizId: parseInt(quizId),
        traineeId: null,
        traineeName: traineeName || '',
        traineeEmail,
        attemptCount,
        score,
        totalMarks: totalMarks || quiz.totalMarks,
        status,
        answers: answers
      }
    });

    // If the attempt is passed and batchId is available, auto-create attendance record
    try {
      if (status === 'Passed' && batchIdFromQuiz) {
        const attendanceDate = new Date();
        // normalize to date only (midnight) to match unique constraint behavior
        attendanceDate.setHours(0,0,0,0);

        try {
          await prisma.attendanceRecord.create({
            data: {
              studentEmail: traineeEmail,
              batchId: Number(batchIdFromQuiz),
              date: attendanceDate,
              status: 'Present',
              remark: 'Auto-generated after passing quiz',
              createdAt: new Date(),
            }
          });

          // increment StudentBatch.attendance counter
          await prisma.studentBatch.updateMany({
            where: { studentEmail: traineeEmail, batchId: Number(batchIdFromQuiz) },
            data: { attendance: { increment: 1 } }
          });
        } catch (attErr) {
          // Ignore duplicate record error, log others
          if (attErr && attErr.code === 'P2002') {
            // already recorded for this date, skip
          } else {
            console.error('Error auto-creating attendance after quiz pass:', attErr);
          }
        }
      }
    } catch (err) {
      console.error('Auto-attendance logic error:', err);
    }

    return NextResponse.json({ attempt: created });
  } catch (error) {
    console.error('Error submitting quiz attempt:', error);
    return NextResponse.json({ error: 'Failed to submit attempt' }, { status: 500 });
  }
}
