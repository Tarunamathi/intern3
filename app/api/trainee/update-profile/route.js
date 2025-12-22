import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { firstName, lastName, profilePicture } = body;

    if (!firstName) {
      return NextResponse.json(
        { message: "First name is required" },
        { status: 400 }
      );
    }

    // ✅ Temporary: hardcode user ID
    const userId = 1; // replace with real auth later

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        firstName,
        lastName: lastName || "",
        profilePicture,
      },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (err) {
    console.error("Update profile error:", err);
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
