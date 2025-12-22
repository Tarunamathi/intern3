import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, course, duration, totalMarks, passingMarks, questions, createdBy, courseId } = body;

    // Validate required fields
    if (!title || !course || !duration || !totalMarks || !passingMarks || !questions || !createdBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create quiz in database
    const quiz = await prisma.quiz.create({
      data: {
        title,
        course,
        courseId: courseId || null,
        duration,
        totalMarks: parseInt(totalMarks),
        passingMarks: parseInt(passingMarks),
        questions: questions, // JSON field
        totalQuestions: questions.length,
        createdBy
      }
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}