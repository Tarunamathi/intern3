import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    // Hardcoded user ID for now
    const userId = 1;

    if (!currentPassword || !newPassword) {
      return new Response(
        JSON.stringify({ success: false, message: "All fields are required" }),
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return new Response(JSON.stringify({ success: false, message: "User not found" }), {
        status: 404,
      });
    }

    const isCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isCorrect) {
      return new Response(JSON.stringify({ success: false, message: "Current password is incorrect" }), {
        status: 400,
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: Number(userId) },
      data: { password: hashedNewPassword },
    });

    return new Response(JSON.stringify({ success: true, message: "Password updated successfully" }), {
      status: 200,
    });
  } catch (err) {
    console.error("Change password error:", err);
    return new Response(JSON.stringify({ success: false, message: "Failed to update password" }), {
      status: 500,
    });
  }
}
