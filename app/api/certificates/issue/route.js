import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      traineeName,
      traineeEmail,
      course,
      templateId,
      grade,
      completionDate,
      issuedBy
    } = body;

    if (!traineeName || !traineeEmail || !course || !templateId || !completionDate || !issuedBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // create a simple unique certificate id (can be replaced with a better generator)
    const certificateId = `CERT${Date.now().toString().slice(-8)}`;

    const created = await prisma.certificate.create({
      data: {
        certificateId,
        traineeName,
        traineeEmail,
        course,
        templateId: Number(templateId),
        grade: grade || '',
        completionDate: new Date(completionDate),
        issuedBy,
        issuedDate: new Date(),
        status: 'Issued'
      }
    });

    return NextResponse.json(created);
  } catch (error) {
    console.error('Error issuing certificate:', error);
    return NextResponse.json({ error: 'Failed to issue certificate' }, { status: 500 });
  }
}
