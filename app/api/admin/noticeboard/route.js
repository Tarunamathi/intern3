import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// ======================================
// 🔹 GET: Fetch all notices based on role
// ======================================
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userEmail = request.headers.get("x-user-email");
    const role = url.searchParams.get("role"); // 'admin' | 'trainer' | 'trainee'

    console.log('GET /api/admin/noticeboard called', { role, userEmail });

    let notices = [];

    // 🧑‍🏫 Trainer → Notices marked for trainers
    if (role === "trainer") {
      notices = await prisma.notice.findMany({
        where: {
          recipientTrainers: true,
          OR: [
            { validUntil: null },
            { validUntil: { gt: new Date() } }
          ]
        },
        include: {
          creator: { select: { firstName: true, lastName: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }
    // 🎓 Trainee → Notices marked for trainees
    else if (role === "trainee") {
      notices = await prisma.notice.findMany({
        where: {
          recipientTrainees: true,
          OR: [
            { validUntil: null },
            { validUntil: { gt: new Date() } }
          ]
        },
        include: {
          creator: { select: { firstName: true, lastName: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }
    // 🧑‍💼 Admin → All notices
    else {
      notices = await prisma.notice.findMany({
        where: {
          OR: [
            { recipientAdmins: true },
            { recipientTrainers: true },
            { recipientTrainees: true }
          ]
        },
        include: {
          creator: { select: { firstName: true, lastName: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    // Ensure compatibility with front-end that expects a `batches` array and `timeLimit`
    const safeNotices = notices.map(n => ({
      ...n,
      batches: n.batches || [],
      timeLimit: n.validUntil || null,
    }));

    return NextResponse.json({ success: true, notices: safeNotices });
  } catch (error) {
    console.error("GET /api/admin/noticeboard error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch notices", details: String(error?.stack || '') },
      { status: 500 }
    );
  }
}

// ======================================
// 🔹 POST: Create a new notice
// ======================================
export async function POST(request) {
  try {
    const userEmail = request.headers.get("x-user-email");
    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in again." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      priority,
      timeLimit, // will map to validUntil
      targetAudience, // array: ['admin','trainer','trainee']
      // batches were removed from Notice model; keep but ignore if provided
      batches,
      attachments,
    } = body;

    // 🧩 Validation
    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json(
        { success: false, error: "Title and description are required." },
        { status: 400 }
      );
    }

    if (!targetAudience?.length) {
      return NextResponse.json(
        { success: false, error: "Please select at least one recipient type." },
        { status: 400 }
      );
    }

    // Clean up attachment data if any
    const cleanAttachments = (attachments || []).map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: file.url || null,
    }));

    // Validate creator exists
    const creator = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true, firstName: true, lastName: true, email: true }
    });

    if (!creator) {
      return NextResponse.json(
        { success: false, error: "Invalid creator email." },
        { status: 400 }
      );
    }

    // Store batches in notice description for trainees
    let fullDescription = description.trim();
    if (targetAudience.includes('trainee') && batches?.length > 0) {
      const batchInfo = await prisma.batch.findMany({
        where: { id: { in: batches } },
        select: { batchName: true, batchCode: true }
      });
      
      if (batchInfo.length > 0) {
        const batchList = batchInfo.map(b => b.batchName || b.batchCode).join(', ');
        fullDescription += `\n\nTarget Batches: ${batchList}`;
      }
    }

    // 🛠️ Create notice with recipients
    const recipients = Array.isArray(targetAudience) ? targetAudience : [];
    const newNotice = await prisma.notice.create({
      data: {
        title: title.trim(),
        description: fullDescription,
        priority: priority || "medium",
        validUntil: timeLimit ? new Date(timeLimit) : null,
        recipientAdmins: recipients.includes('admin'),
        recipientTrainers: recipients.includes('trainer'),
        recipientTrainees: recipients.includes('trainee'),
        createdBy: userEmail,
        attachments: cleanAttachments,
      },
      include: {
        creator: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
    });

    // Attach empty batches array for frontend compatibility
  const out = { ...newNotice, batches: [], timeLimit: newNotice.validUntil || null };
    return NextResponse.json({ success: true, notice: out });
  } catch (error) {
      console.error("POST /api/admin/noticeboard error:", error);
      return NextResponse.json(
        { success: false, error: error?.message || "Failed to create notice.", details: String(error?.stack || '') },
        { status: 500 }
      );
  }
}
