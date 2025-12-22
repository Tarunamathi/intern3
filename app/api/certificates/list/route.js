import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const issuedBy = searchParams.get('issuedBy');
    const traineeEmail = searchParams.get('traineeEmail');
    const userRole = searchParams.get('userRole');

    const where = {};
    if (userRole === 'trainer' && issuedBy) {
      where.issuedBy = issuedBy;
    } else if (userRole === 'trainee' && traineeEmail) {
      where.traineeEmail = traineeEmail;
    } else if (issuedBy) {
      // fallback: allow filtering by issuedBy
      where.issuedBy = issuedBy;
    } else if (traineeEmail) {
      where.traineeEmail = traineeEmail;
    } else {
      // if no filters provided, return empty list for safety
      return NextResponse.json([]);
    }

    const certificates = await prisma.certificate.findMany({
      where,
      orderBy: { issuedDate: 'desc' }
    });

    // format dates for the client
    const formatted = certificates.map(c => ({
      certificateId: c.certificateId,
      id: c.certificateId,
      traineeName: c.traineeName,
      traineeEmail: c.traineeEmail,
      course: c.course,
      templateId: c.templateId,
      grade: c.grade,
      issuedDate: c.completionDate ? new Date(c.completionDate).toISOString().split('T')[0] : (c.issuedDate ? new Date(c.issuedDate).toISOString().split('T')[0] : ''),
      status: c.status
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
  }
}
