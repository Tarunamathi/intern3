import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userEmail = url.searchParams.get('userEmail');
    const userRole = url.searchParams.get('userRole');

    if (!userEmail || !userRole) {
      return NextResponse.json(
        { success: false, error: "Missing email or role" },
        { status: 400 }
      );
    }

    let notices;
    const currentDate = new Date();

    if (userRole.toLowerCase() === 'trainer') {
      // For trainers, get notices marked for trainers or created by them
      notices = await prisma.notice.findMany({
        where: {
          OR: [
            {
              recipientTrainers: true,
              OR: [
                { validUntil: null },
                { validUntil: { gt: currentDate } }
              ]
            },
            { createdBy: userEmail }
          ]
        },
        include: {
          creator: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else if (userRole.toLowerCase() === 'trainee') {
      // For trainees, get notices marked for trainees
      notices = await prisma.notice.findMany({
        where: {
          recipientTrainees: true,
          OR: [
            { validUntil: null },
            { validUntil: { gt: currentDate } }
          ]
        },
        include: {
          creator: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid role" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, notices });
  } catch (error) {
    console.error('GET /api/notices/list error:', error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notices" },
      { status: 500 }
    );
  }
}