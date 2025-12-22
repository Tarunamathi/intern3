import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      batchId, traineeEmail, traineeName, examTitle, examType,
      courseId, totalMarks, obtainedMarks, examDate, document,
      remarks, createdBy
    } = body;

    // Validation
    if (!batchId || !traineeEmail || !traineeName || !examTitle || 
        !examType || totalMarks == null || obtainedMarks == null || 
        !examDate || !createdBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate creator
    const creatorUser = await prisma.user.findUnique({ 
      where: { email: createdBy } 
    });
    if (!creatorUser) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 400 });
    }

    // Validate batch and trainee enrollment
    const batch = await prisma.batch.findUnique({ 
      where: { id: Number(batchId) },
      include: {
        students: {
          where: { studentEmail: traineeEmail },
          include: { student: true }
        }
      }
    });
    if (!batch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 400 });
    }
    if (batch.students.length === 0) {
      return NextResponse.json({ error: 'Trainee is not enrolled in this batch' }, { status: 400 });
    }

    // Save document if provided
    let documentUrl = null;
    if (document && document.data) {
      try {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const matches = document.data.match(/^data:(.+);base64,(.+)$/);
        let base64Data = document.data;
        let ext = '';
        
        if (matches) {
          base64Data = matches[2];
          const mime = matches[1];
          const mimeExt = mime.split('/')[1];
          ext = mimeExt ? `.${mimeExt}` : path.extname(document.name || '') || '';
        } else {
          ext = path.extname(document.name || '') || '';
        }

        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
        const filePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
        documentUrl = `/uploads/${fileName}`;
      } catch (err) {
        console.error('Error saving document:', err);
      }
    }

    // Create exam score
    const created = await prisma.examScore.create({
      data: {
        batchId: Number(batchId),
        traineeEmail,
        traineeName,
        examTitle,
        examType,
        courseId: courseId ? Number(courseId) : null,
        totalMarks: Number(totalMarks),
        obtainedMarks: Number(obtainedMarks),
        examDate: new Date(examDate),
        document: documentUrl,
        remarks: remarks || null,
        createdBy,
      },
    });

    // Calculate percentage and status
    const percentage = ((Number(obtainedMarks) / Number(totalMarks)) * 100).toFixed(2);
    const isPassed = percentage >= 50;

    // Create notification for trainee
    try {
      const traineeUser = await prisma.user.findUnique({ 
        where: { email: traineeEmail } 
      });

      if (traineeUser) {
        await prisma.notification.create({
          data: {
            recipientEmail: traineeEmail,
            title: `Exam Score: ${examTitle}`,
            message: `Your exam score has been uploaded.\n\nExam: ${examTitle}\nType: ${examType}\nMarks: ${obtainedMarks}/${totalMarks} (${percentage}%)\nStatus: ${isPassed ? '✓ Passed' : '✗ Failed'}${remarks ? `\n\nRemarks: ${remarks}` : ''}`,
            type: 'exam_score',
            priority: isPassed ? 'medium' : 'high',
            isRead: false,
            metadata: JSON.stringify({
              examScoreId: created.id,
              examTitle,
              examType,
              totalMarks,
              obtainedMarks,
              percentage,
              isPassed,
              batchId,
              courseId
            })
          }
        });
      }
    } catch (notifErr) {
      console.error('Failed to create notification:', notifErr);
      // Don't fail the entire request
    }

    return NextResponse.json(created);
  } catch (err) {
    console.error('POST /api/exam-scores/create error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}