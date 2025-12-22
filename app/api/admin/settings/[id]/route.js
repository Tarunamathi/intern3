import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * ✅ GET - Fetch admin settings/profile by ID
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const admin = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        location: true,
        bio: true,
        profilePicture: true,
        specialization: true,
        yearsOfExperience: true,
      },
    });

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(admin, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching admin settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin settings" },
      { status: 500 }
    );
  }
}

/**
 * ✅ PUT - Update admin settings/profile by ID
 */
export async function PUT(request, { params }) {
  try {
    // Robust id extraction: prefer params, fallback to parsing the request URL
    let id = params && params.id;
    if (!id) {
      try {
        const url = new URL(request.url);
        // e.g. /api/admin/settings/123 -> last pathname segment
        const segs = url.pathname.split('/').filter(Boolean);
        id = segs[segs.length - 1];
      } catch (e) {
        // ignore
      }
    }

    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return NextResponse.json({ error: "Invalid id parameter" }, { status: 400 });
    }

    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      location,
      bio,
      profilePicture,
      specialization,
      yearsOfExperience,
    } = body;

    // Ensure there's something to update
    const updateData = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(location && { location }),
      ...(bio && { bio }),
      ...(profilePicture && { profilePicture }),
      ...(specialization && { specialization }),
      ...(yearsOfExperience && { yearsOfExperience }),
    };

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No update fields provided" }, { status: 400 });
    }

    const updatedAdmin = await prisma.user.update({
      where: { id: parsedId },
      data: {
        ...updateData,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        location: true,
        bio: true,
        profilePicture: true,
        specialization: true,
        yearsOfExperience: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedAdmin, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating admin settings:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to update admin settings" },
      { status: 500 }
    );
  }
}

