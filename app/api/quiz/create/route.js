import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, course, courseId, duration, totalMarks, passingMarks, questions, createdBy, batchId } = body;

    if (!title || !course || !duration || !totalMarks || !passingMarks || !questions || !createdBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // store batchId inside a small meta object inside the questions JSON so we don't require a schema migration
    const payloadQuestions = {
      meta: { batchId: batchId || null },
      items: questions
    };

    const quiz = await prisma.quiz.create({
      data: {
        title,
        course,
        courseId: courseId || null,
        duration: String(duration),
        totalMarks: parseInt(totalMarks, 10),
        passingMarks: parseInt(passingMarks, 10),
        questions: payloadQuestions,
        totalQuestions: questions.length,
        createdBy
      }
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error('Error creating quiz (public):', error);
    return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 });
  }
}
