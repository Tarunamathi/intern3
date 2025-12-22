import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// POST - Create/Update live class link for a batch
export async function POST(request) {
  try {
    const email = request.headers.get('x-user-email');
    if (!email) {
      return NextResponse.json(
        { error: 'Unauthorized - x-user-email header required' },
        { status: 401 }
      );
    }

    const { batchId, platform, link, title, description, scheduledTime } = await request.json();

    if (!batchId || !platform || !link) {
      return NextResponse.json(
        { error: 'batchId, platform, and link are required' },
        { status: 400 }
      );
    }

    // Verify trainer owns this batch
    const batch = await prisma.batch.findUnique({
      where: { id: Number(batchId) },
      select: { trainerEmail: true, id: true, liveClassLinks: true }
    });

    if (!batch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    if (batch.trainerEmail !== email) {
      return NextResponse.json(
        { error: 'Unauthorized - not the batch trainer' },
        { status: 403 }
      );
    }

    // Store/Update live class metadata in batch (using a JSON field or separate table in future)
    // For now, store in a liveClassLinks array in batch metadata
    // Append to existing liveClassLinks array safely
    const existing = batch.liveClassLinks || [];
    const newItem = {
      id: Date.now().toString(),
      platform,
      link,
      title: title || `${platform} Class`,
      description: description || '',
      scheduledTime: scheduledTime || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      createdBy: email
    };

    const updatedBatch = await prisma.batch.update({
      where: { id: Number(batchId) },
      data: { liveClassLinks: [...existing, newItem] },
      select: { liveClassLinks: true }
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Live class link added successfully',
        batch: updatedBatch
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding live class link:', error);
    return NextResponse.json(
      { error: 'Failed to add live class link', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Fetch live class links for a batch
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get('batchId');

    if (!batchId) {
      return NextResponse.json(
        { error: 'batchId query parameter required' },
        { status: 400 }
      );
    }

    const batch = await prisma.batch.findUnique({
      where: { id: Number(batchId) },
      select: {
        id: true,
        batchName: true,
        liveClassLinks: true,
        students: { select: { studentEmail: true } }
      }
    });

    if (!batch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        batchId: batch.id,
        batchName: batch.batchName,
        liveClassLinks: batch.liveClassLinks || [],
        totalStudents: batch.students?.length || 0
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching live class links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch live class links', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remove a live class link
export async function DELETE(request) {
  try {
    const email = request.headers.get('x-user-email');
    if (!email) {
      return NextResponse.json(
        { error: 'Unauthorized - x-user-email header required' },
        { status: 401 }
      );
    }

    const { batchId, linkId } = await request.json();

    if (!batchId || !linkId) {
      return NextResponse.json(
        { error: 'batchId and linkId are required' },
        { status: 400 }
      );
    }

    // Verify trainer owns this batch
    const batch = await prisma.batch.findUnique({
      where: { id: Number(batchId) },
      select: { trainerEmail: true, liveClassLinks: true }
    });

    if (!batch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    if (batch.trainerEmail !== email) {
      return NextResponse.json(
        { error: 'Unauthorized - not the batch trainer' },
        { status: 403 }
      );
    }

    // Remove the link from array
    const updatedLinks = (batch.liveClassLinks || []).filter((l) => l.id !== linkId);

    const updatedBatch = await prisma.batch.update({
      where: { id: Number(batchId) },
      data: { liveClassLinks: updatedLinks }
    });

    return NextResponse.json(
      { success: true, message: 'Live class link deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting live class link:', error);
    return NextResponse.json(
      { error: 'Failed to delete live class link', details: error.message },
      { status: 500 }
    );
  }
}
