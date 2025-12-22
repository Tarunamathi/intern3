import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
  try {
    // Extract ID from params
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid notice ID" },
        { status: 400 }
      );
    }

    // Check if notice exists
    const existingNotice = await prisma.notice.findUnique({
      where: { id },
    });

    if (!existingNotice) {
      return NextResponse.json(
        { success: false, error: "Notice not found" },
        { status: 404 }
      );
    }

    // Delete the notice
    await prisma.notice.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Notice deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting notice:", error);
    return NextResponse.json(
      { success: false, error: "Server error while deleting notice" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

