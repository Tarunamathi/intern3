import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ GET - Fetch a single library resource by ID
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);

    const resource = await prisma.libraryResource.findUnique({
      where: { id },
    });

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    return NextResponse.json(resource, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching library resource:", error);
    return NextResponse.json(
      { error: "Failed to fetch resource" },
      { status: 500 }
    );
  }
}

// ✅ PUT - Update a library resource by ID
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { title, category, status, uploadDate, fileName, fileUrl } = body;

    const updatedResource = await prisma.libraryResource.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(category && { category }),
        ...(status && { status }),
        ...(uploadDate && { uploadDate: new Date(uploadDate) }),
        ...(fileName && { fileName }),
        ...(fileUrl !== undefined && { fileUrl }),
      },
    });

    return NextResponse.json(updatedResource, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating library resource:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 }
    );
  }
}

// ✅ DELETE - Delete a library resource by ID
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);

    await prisma.libraryResource.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Resource deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting library resource:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 }
    );
  }
}
