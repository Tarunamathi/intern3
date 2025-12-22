import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(req) {
  try {
    const body = await req.json();
    const { batchId, date, records, createdBy } = body;

    if (!batchId || !date || !Array.isArray(records)) {
      return NextResponse.json({ error: 'batchId, date and records are required' }, { status: 400 });
    }

    const attendanceDate = new Date(date);

    // Process records one-by-one so we can update student batch attendance counters when new records are created
    let inserted = 0;
    for (const r of records) {
      const studentEmail = r.studentEmail;
      const status = r.status || 'Present';
      const remark = r.remark || null;

      try {
        const created = await prisma.attendanceRecord.create({
          data: {
            studentEmail,
            batchId: Number(batchId),
            date: attendanceDate,
            status,
            remark,
            createdAt: new Date(),
          }
        });

        inserted += 1;

        // If present, increment the StudentBatch.attendance counter
        if (status.toLowerCase() === 'present') {
          await prisma.studentBatch.updateMany({
            where: { studentEmail, batchId: Number(batchId) },
            data: { attendance: { increment: 1 } }
          });
        }
      } catch (err) {
        // Ignore unique constraint errors (record already exists), log others
        if (err.code === 'P2002') {
          // duplicate record for (studentEmail,batchId,date) — skip
        } else {
          console.error('Error creating attendance record for', studentEmail, err);
        }
      }
    }

    return NextResponse.json({ success: true, inserted });
  } catch (error) {
    console.error('Error creating attendance records:', error);
    return NextResponse.json({ error: 'Failed to create attendance records' }, { status: 500 });
  }
}
