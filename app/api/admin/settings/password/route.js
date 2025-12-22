import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * PUT /api/admin/settings/password
 * body: { adminId, oldPassword, newPassword }
 */
export async function PUT(request) {
  try {
    const body = await request.json();
    const { adminId, oldPassword, newPassword } = body;

    if (!adminId || !oldPassword || !newPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const admin = await prisma.user.findUnique({ where: { id: parseInt(adminId) } });
    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect old password" }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({ where: { id: admin.id }, data: { password: hashedPassword } });

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating password:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
