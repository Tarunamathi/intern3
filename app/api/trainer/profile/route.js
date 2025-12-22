// app/api/trainer/profile/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Ensure a single PrismaClient instance in development
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function GET(req) {
  try {
    // 1️⃣ Get user email from header
    const email = req.headers.get("x-user-email");
    if (!email) {
      return NextResponse.json(
        { message: "Unauthorized - No user email provided" },
        { status: 401 }
      );
    }

    // 2️⃣ Fetch only required fields from DB
    const trainer = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        role: true,
        profilePicture: true,
        phone: true,
        location: true,
        specialization: true,
        certifications: true,
        createdAt: true
      }
    });

    if (!trainer) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 3️⃣ Ensure the user is a trainer
    if (trainer.role.toLowerCase() !== "trainer") {
      return NextResponse.json(
        { message: "Access denied - Not a trainer account" },
        { status: 403 }
      );
    }

    // 4️⃣ Build the profile response
    // 4️⃣ Aggregate trainer statistics from related tables
    // Fetch batches assigned to this trainer
    const batches = await prisma.batch.findMany({
      where: { trainerEmail: email }
    });

    const batchIds = batches.map((b) => b.id);

    // totalCourses: platform-wide count of all available courses
    const totalCourses = await prisma.course.count();

    // myCourses: number of batches assigned to this trainer (assigned/managed courses)
    const myCourses = batches.length;

    // totalStudents: sum of enrolledStudents on batches (fallback to studentBatch count if needed)
    let totalStudents = 0;
    if (batches.length > 0) {
      totalStudents = batches.reduce((sum, b) => sum + (b.enrolledStudents || 0), 0);
    }

    // activeBatches: number of batches currently marked 'Ongoing' (case-insensitive)
    const activeBatches = batches.filter((b) => (b.status || '').toLowerCase() === 'ongoing').length;

    // completionRate: average progress across assigned batches, expressed as a percentage string
    let completionRate = '0%';
    if (batches.length > 0) {
      const totalProgress = batches.reduce((sum, b) => sum + (b.progress || 0), 0);
      const avg = Math.round(totalProgress / batches.length);
      completionRate = `${avg}%`;
    }

    // 5️⃣ Build and return the profile response including aggregated stats
    const profileData = {
      id: trainer.id,
      name: `${trainer.firstName || ''} ${trainer.lastName || ''}`.trim(),
      firstName: trainer.firstName,
      lastName: trainer.lastName,
      email: trainer.email,
      username: trainer.username,
      role: trainer.role,
      profilePicture:
        trainer.profilePicture ||
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      phone: trainer.phone || null,
      location: trainer.location || null,
      joinDate: trainer.createdAt
        ? new Date(trainer.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
          })
        : null,
      specialization: trainer.specialization || null,
      certifications: trainer.certifications || [],
      totalCourses,
      myCourses,
      totalStudents,
      activeBatches,
      completionRate
    };

    return NextResponse.json(profileData, { status: 200 });
  } catch (error) {
    console.error("Trainer profile fetch error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

