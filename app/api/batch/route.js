import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET(request) {
  try {
    const batches = await prisma.batch.findMany({
      include: {
        course: true,
        trainer: true,
        students: {
          include: {
            student: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(batches);
  } catch (error) {
    console.error('GET /api/batch error:', error);
    return NextResponse.json({ error: 'Failed to fetch batches' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      batchName,
      batchCode,
      courseId,
      courseName,
      trainerEmail,
      coordinatorEmail,
      startDate,
      endDate,
      institutionName,
      schedule,
      timeSlot,
      totalStudents,
      status,
      traineeEmails
    } = body;

    if (!batchName || !courseId || !trainerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate required dates (schema requires startDate/endDate)
    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'startDate and endDate are required' }, { status: 400 });
    }

    // Ensure schedule is stored as a string (schema expects String)
    const scheduleValue = typeof schedule === 'string' ? schedule : JSON.stringify(schedule || '');

    // Determine timeSlot value: prefer explicit `timeSlot`, else derive from schedule object, else empty string
    let timeSlotValue = '';
    if (typeof timeSlot === 'string' && timeSlot.trim() !== '') {
      timeSlotValue = timeSlot.trim();
    } else if (schedule && typeof schedule === 'object') {
      const sh = schedule.startHour || '';
      const sm = schedule.startMinute || '';
      const eh = schedule.endHour || '';
      const em = schedule.endMinute || '';
      if (sh || sm || eh || em) {
        timeSlotValue = `${sh}:${sm}-${eh}:${em}`;
      }
    }

    let batch;
    try {
      batch = await prisma.batch.create({
        data: {
          batchName,
          batchCode,
          courseId: parseInt(courseId),
          courseName,
          trainerEmail,
          // `coordinatorEmail` is not a field on the Batch model; ignore if provided by client
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          location: institutionName || '',
          schedule: scheduleValue,
          timeSlot: timeSlotValue,
          totalStudents: parseInt(totalStudents) || 0,
          status: status || 'Upcoming'
        }
      });
    } catch (dbErr) {
      console.error('prisma.batch.create failed:', dbErr?.code || '', dbErr?.meta || '', dbErr?.message || dbErr);
      // Return detailed error in dev to make debugging easier
      return NextResponse.json({ error: 'Failed to create batch', code: dbErr?.code, meta: dbErr?.meta, message: dbErr?.message }, { status: 500 });
    }

    // Enroll trainees if provided
    if (traineeEmails && traineeEmails.length > 0) {
      await Promise.all(
        traineeEmails.map(email =>
          prisma.studentBatch.create({
            data: {
              studentEmail: email,
              batchId: batch.id
            }
          }).catch(err => {
            // Handle duplicate enrollment silently
            if (err.code !== 'P2002') throw err;
          })
        )
      );
    }

    return NextResponse.json(batch, { status: 201 });
  } catch (error) {
    console.error('POST /api/batch error:', error?.message || error, error?.stack || '');
    return NextResponse.json({ error: 'Failed to create batch', details: error?.message || String(error) }, { status: 500 });
  }
}
