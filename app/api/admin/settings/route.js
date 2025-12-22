import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/admin/settings
 * Returns the current admin profile (best-effort). If you have auth/session,
 * replace the fallback logic with session-based user lookup.
 */
export async function GET() {
  try {
    // Fallback: return the first user with role 'admin'
    const admin = await prisma.user.findFirst({
      where: { role: "admin" },
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

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(admin, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching admin settings (root):", error);
    return NextResponse.json({ error: "Failed to fetch admin settings" }, { status: 500 });
  }
}

