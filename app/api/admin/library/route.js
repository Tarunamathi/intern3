import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ GET - Fetch all library resources with optional filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where = {};

    if (category && category !== "All") {
      where.category = category;
    }

    if (status && status !== "All") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { fileName: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }

    const resources = await prisma.libraryResource.findMany({
      where,
      orderBy: { uploadDate: "desc" },
    });

    return NextResponse.json(resources, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching library resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

// ✅ POST - Create a new library resource
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, category, status, fileName, fileUrl } = body;

    if (!title || !category || !fileName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newResource = await prisma.libraryResource.create({
      data: {
        title,
        category,
        status: status || "Active",
        fileName,
        fileUrl: fileUrl || null,
        uploadDate: new Date(),
      },
    });

    return NextResponse.json(newResource, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating library resource:", error);
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    );
  }
}
