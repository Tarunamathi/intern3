import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

/**
 * POST - Record session time spent by trainee
 * Body: { batchId, minutesSpent }
 * Returns: { success, dailyMinutesSpent, requiredMinutes, status } 
 *   status = 'present' | 'absent' (if day ends and time not met)
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { batchId, minutesSpent = 0 } = body;
    const email = request.headers.get('x-user-email');

    if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!batchId) return NextResponse.json({ error: 'batchId required' }, { status: 400 });

    const bId = Number(batchId);
    if (!Number.isInteger(bId)) return NextResponse.json({ error: 'Invalid batchId' }, { status: 400 });

    const mins = Number(minutesSpent) || 0;

    // Get batch to calculate required time
    const batch = await prisma.batch.findUnique({
      where: { id: bId },
      include: { trainer: true }
    });

    if (!batch) return NextResponse.json({ error: 'Batch not found' }, { status: 404 });

    // Calculate required minutes per day from batch schedule
    // Parse timeSlot: "09:00-05:00" or similar
    const requiredMinutesPerDay = calculateRequiredMinutes(batch.timeSlot);

    // Get or create today's session time log
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let log = await prisma.sessionTimeLog.findUnique({
      where: {
        studentEmail_batchId_date: {
          studentEmail: email,
          batchId: bId,
          date: today
        }
      }
    });

    if (log) {
      log = await prisma.sessionTimeLog.update({
        where: { id: log.id },
        data: { minutesSpent: { increment: mins } }
      });
    } else {
      log = await prisma.sessionTimeLog.create({
        data: {
          studentEmail: email,
          batchId: bId,
          date: today,
          minutesSpent: mins
        }
      });
    }

    // Update StudentBatch daily time
    const sb = await prisma.studentBatch.update({
      where: {
        studentEmail_batchId: {
          studentEmail: email,
          batchId: bId
        }
      },
      data: {
        dailyTimeSpentMin: log.minutesSpent,
        lastSessionDate: today
      }
    });

    // Determine status: if time >= required, present; else absent (only mark at end of day if configured)
    let status = log.minutesSpent >= requiredMinutesPerDay ? 'present' : 'absent';

    // Optionally create/update attendance record if time requirement is met or day has ended
    // For now, just return the current status
    const isTimesMet = log.minutesSpent >= requiredMinutesPerDay;

    return NextResponse.json({
      success: true,
      dailyMinutesSpent: log.minutesSpent,
      requiredMinutes: requiredMinutesPerDay,
      status: isTimesMet ? 'present' : 'absent',
      trainer: batch.trainer ? `${batch.trainer.firstName} ${batch.trainer.lastName}` : batch.trainerEmail,
      batchName: batch.batchName
    });
  } catch (err) {
    console.error('Error recording session time', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET - Fetch today's session time for trainee and batch
 * Query: ?batchId=123
 */
export async function GET(request) {
  try {
    const email = request.headers.get('x-user-email');
    const url = new URL(request.url);
    const qBatch = url.searchParams.get('batchId');

    if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!qBatch) return NextResponse.json({ error: 'batchId query required' }, { status: 400 });

    const bId = Number(qBatch);
    if (!Number.isInteger(bId)) return NextResponse.json({ error: 'Invalid batchId' }, { status: 400 });

    const batch = await prisma.batch.findUnique({
      where: { id: bId },
      include: { trainer: true }
    });

    if (!batch) return NextResponse.json({ error: 'Batch not found' }, { status: 404 });

    const requiredMinutesPerDay = calculateRequiredMinutes(batch.timeSlot);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const log = await prisma.sessionTimeLog.findUnique({
      where: {
        studentEmail_batchId_date: {
          studentEmail: email,
          batchId: bId,
          date: today
        }
      }
    });

    const dailySpent = log?.minutesSpent || 0;
    const isTimesMet = dailySpent >= requiredMinutesPerDay;

    return NextResponse.json({
      dailyMinutesSpent: dailySpent,
      requiredMinutes: requiredMinutesPerDay,
      status: isTimesMet ? 'present' : 'absent',
      trainer: batch.trainer ? `${batch.trainer.firstName} ${batch.trainer.lastName}` : batch.trainerEmail,
      batchName: batch.batchName
    });
  } catch (err) {
    console.error('Error fetching session time', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Helper: Calculate required minutes from timeSlot string
 * e.g., "09:00-05:00" => 8 hours = 480 minutes
 * If not parseable, default to 60 minutes
 */
function calculateRequiredMinutes(timeSlot) {
  if (!timeSlot) return 60; // default 1 hour

  try {
    const [start, end] = timeSlot.split('-').map(t => t.trim());
    if (!start || !end) return 60;

    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);

    if (isNaN(startH) || isNaN(endH)) return 60;

    let minutes = (endH - startH) * 60 + (endM || 0) - (startM || 0);
    if (minutes < 0) minutes += 24 * 60; // wrap around midnight

    return Math.max(60, minutes); // minimum 1 hour
  } catch (e) {
    return 60;
  }
}
