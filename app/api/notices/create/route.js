import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// POST /api/notices/create
// Accepts the payload created by the trainer UI and creates a notice in the DB.
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      priority,
      timeLimit,
      batches,
      attachments,
      createdBy,
    } = body;

    if (!createdBy) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Missing creator email.' }, { status: 401 });
    }

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json({ success: false, error: 'Title and description are required.' }, { status: 400 });
    }

    // Clean attachments
    const cleanAttachments = (attachments || []).map((f) => ({
      name: f.name,
      type: f.type || null,
      size: f.size || null,
      url: f.url || null,
    }));

    // Validate creator exists
    const creator = await prisma.user.findUnique({ where: { email: createdBy }, select: { id: true, email: true } });
    if (!creator) {
      return NextResponse.json({ success: false, error: 'Invalid creator email.' }, { status: 400 });
    }

    // Trainers usually post notices for trainees — append batch info to description for clarity
    let fullDescription = description.trim();
    if (Array.isArray(batches) && batches.length > 0) {
      try {
        const batchInfo = await prisma.batch.findMany({ where: { id: { in: batches } }, select: { batchName: true, batchCode: true } });
        if (batchInfo.length > 0) {
          const batchList = batchInfo.map(b => b.batchName || b.batchCode).join(', ');
          fullDescription += `\n\nTarget Batches: ${batchList}`;
        }
      } catch (err) {
        // ignore batch lookup errors but log for debugging
        console.error('Error fetching batches for notice create:', err);
      }
    }

    const newNotice = await prisma.notice.create({
      data: {
        title: title.trim(),
        description: fullDescription,
        priority: priority || 'medium',
        validUntil: timeLimit ? new Date(timeLimit) : null,
        // Trainer-created notices target trainees by default
        recipientAdmins: false,
        recipientTrainers: false,
        recipientTrainees: true,
        createdBy,
        attachments: cleanAttachments,
      },
    });

    const out = { ...newNotice, batches: [], timeLimit: newNotice.validUntil || null };
    return NextResponse.json({ success: true, notice: out });
  } catch (error) {
    console.error('POST /api/notices/create error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to create notice.', details: String(error?.stack || '') }, { status: 500 });
  }
}
