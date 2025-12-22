import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

    await prisma.quiz.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json({ error: 'Failed to delete quiz' }, { status: 500 });
  }
}
