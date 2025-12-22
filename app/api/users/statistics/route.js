import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request) {
  try {
    // Get user statistics with login info
    const users = await prisma.user.findMany({
      select: {
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Helper function to format date with time
    const formatDateTime = (date) => {
      if (!date) return '-';
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    };

    // Transform to expected format
    const userStats = users.map(user => ({
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A',
      email: user.email || 'N/A',
      role: user.role || 'N/A',
      createdAt: formatDateTime(user.createdAt),
      updatedAt: formatDateTime(user.updatedAt)
    }));

    return NextResponse.json(userStats);
  } catch (error) {
    console.error('GET /api/users/statistics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}