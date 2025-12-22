import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'library');
    await fs.promises.mkdir(uploadsDir, { recursive: true });

    // Ensure filename is safe
    const safeName = String(file.name).replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = path.join(uploadsDir, `${Date.now()}_${safeName}`);

    await fs.promises.writeFile(filePath, buffer);

    // Build a URL relative to the Next.js public folder
    const publicUrl = `/uploads/library/${path.basename(filePath)}`;

    return NextResponse.json({ fileName: file.name, fileUrl: publicUrl }, { status: 201 });
  } catch (error) {
    console.error('Upload error', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
