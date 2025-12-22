import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const courseId = Number(id);
    if (!courseId) {
      return NextResponse.json({ error: 'Invalid course id' }, { status: 400 });
    }

    // Delete course (cascade deletes modules/materials per schema)
    await prisma.course.delete({ where: { id: courseId } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting course', error);
    return NextResponse.json({ error: 'Failed to delete course', details: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const courseId = Number(id);
    if (!courseId) return NextResponse.json({ error: 'Invalid course id' }, { status: 400 });

    const body = await request.json();
    const {
      name,
      category,
      topics,
      duration,
      price,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      daysOfWeek,
      modules = [],
    } = body;

    // Basic update fields
    const updateData = {};
    if (name) updateData.name = name;
    if (category) updateData.category = category;
    if (topics !== undefined) updateData.topics = Number(topics) || 1;
    if (duration !== undefined) updateData.duration = String(duration);
    if (price !== undefined) updateData.price = String(price);
    if (description !== undefined) updateData.description = description;
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
    if (startTime !== undefined) updateData.startTime = startTime || null;
    if (endTime !== undefined) updateData.endTime = endTime || null;
    if (daysOfWeek !== undefined) updateData.daysOfWeek = Array.isArray(daysOfWeek) ? daysOfWeek : [];

    // If modules provided, replace modules for the course (delete existing and create new)
    let result;
    if (Array.isArray(modules) && modules.length > 0) {
      // Build create payload for modules
      const modulesCreate = modules.map((mod, idx) => {
        const materialsCreate = [];
        if (Array.isArray(mod.materials) && mod.materials.length > 0) {
          for (const mat of mod.materials) {
            if (mat.fileUrl) {
              materialsCreate.push({ title: mat.title || mat.fileName || 'Material', fileUrl: mat.fileUrl, mimeType: mat.mimeType || null });
            }
          }
        } else if (mod.fileUrl) {
          materialsCreate.push({ title: mod.title || 'Material', fileUrl: mod.fileUrl, mimeType: mod.mimeType || null });
        }
        return {
          title: mod.title || `Module ${idx + 1}`,
          description: mod.description || null,
          order: mod.order || idx + 1,
          materials: materialsCreate.length > 0 ? { create: materialsCreate } : undefined,
        };
      });

      // Use transaction: delete old modules then update course to create new modules
      await prisma.$transaction([
        prisma.material.deleteMany({ where: { module: { courseId } } }),
        prisma.module.deleteMany({ where: { courseId } }),
      ]);

      // Update course fields and create modules
      result = await prisma.course.update({
        where: { id: courseId },
        data: {
          ...updateData,
          modules: { create: modulesCreate },
        },
        include: { modules: { include: { materials: true } }, batches: true },
      });
    } else {
      // Only update course fields
      result = await prisma.course.update({ where: { id: courseId }, data: updateData, include: { modules: { include: { materials: true } }, batches: true } });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error updating course', error);
    return NextResponse.json({ error: 'Failed to update course', details: error.message }, { status: 500 });
  }
}
