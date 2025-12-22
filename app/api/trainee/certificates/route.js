// app/api/trainee/certificates/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request) {
  try {
    const emailHeader = request.headers.get('x-user-email');
    const url = new URL(request.url);
    const q = url.searchParams.get('traineeEmail');
    const traineeEmail = emailHeader || q;

    if (!traineeEmail) return NextResponse.json({ error: 'traineeEmail required in x-user-email header or query' }, { status: 400 });

    const certs = await prisma.certificate.findMany({
      where: { traineeEmail },
      orderBy: { completionDate: 'desc' },
    });

    // Normalize/format certificates for client (match /api/certificates/list shape)
    const formatted = certs.map(c => ({
      certificateId: c.certificateId,
      id: c.certificateId,
      traineeName: c.traineeName,
      traineeEmail: c.traineeEmail,
      course: c.course,
      template: c.templateId ?? null,
      templateId: c.templateId ?? null,
      grade: c.grade,
      issuedDate: c.completionDate ? new Date(c.completionDate).toISOString().split('T')[0] : (c.issuedDate ? new Date(c.issuedDate).toISOString().split('T')[0] : ''),
      status: c.status
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error('GET /api/trainee/certificates error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
