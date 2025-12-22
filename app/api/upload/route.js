import { NextResponse } from 'next/server';
import { writeFile, mkdir, access } from 'fs/promises';
import path from 'path';

// ✅ Generic file upload endpoint
// Supports multiple folders: courses, library, etc.
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'courses'; // default to courses

    // Validation
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size (optional - adjust as needed)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 50MB' },
        { status: 400 }
      );
    }

    // Allowed file types (optional - adjust as needed)
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `File type ${file.type} not allowed` },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate safe filename
    const originalName = file.name;
    const timestamp = Date.now();
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension)
      .replace(/[^a-zA-Z0-9._-]/g, '_'); // Sanitize filename
    const fileName = `${timestamp}_${baseName}${extension}`;

    // Sanitize folder name (only allow alphanumeric and hyphens)
    const safeFolder = folder.replace(/[^a-zA-Z0-9-]/g, '_').toLowerCase();

    // Validate folder name (security check)
    const allowedFolders = ['courses', 'library', 'profiles', 'documents'];
    if (!allowedFolders.includes(safeFolder)) {
      return NextResponse.json(
        { error: `Folder "${folder}" is not allowed` },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', safeFolder);
    await mkdir(uploadDir, { recursive: true });
    
    // Save file to disk
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    
    // Verify file was written successfully
    try {
      await access(filePath);
    } catch (e) {
      console.error('❌ File verification failed:', filePath, e);
      throw new Error('Failed to write file to disk');
    }

    // Generate public URL (relative to /public directory)
    const fileUrl = `/uploads/${safeFolder}/${fileName}`;
    
    console.log('✅ File uploaded successfully:', {
      originalName,
      fileName,
      fileUrl,
      size: file.size,
      type: file.type,
      folder: safeFolder,
    });

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileUrl: fileUrl, // alias for compatibility
      fileName: originalName,
      savedFileName: fileName,
      fileSize: file.size,
      fileType: file.type,
      folder: safeFolder,
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Upload error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// ✅ Handle OPTIONS for CORS (if needed)
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// ✅ Optional: GET to check upload endpoint status
export async function GET(request) {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/upload',
    supportedFolders: ['courses', 'library', 'profiles', 'documents'],
    maxFileSize: '50MB',
    allowedFileTypes: [
      'PDF',
      'Word (DOC, DOCX)',
      'PowerPoint (PPT, PPTX)',
      'Excel (XLS, XLSX)',
      'Text',
      'Images (JPEG, PNG, GIF)',
      'Video (MP4)',
    ],
  });
}