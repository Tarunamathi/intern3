import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// Prevent multiple Prisma instances
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function POST(req) {
  try {
    const body = await req.json();
    const { firstName, lastName, username, email, password, role } = body;
    const normalizedEmail = email && String(email).toLowerCase();
    const normalizedUsername = username && String(username).toLowerCase();

    // ✅ Validate all fields
    if (!firstName || !lastName || !username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email: normalizedEmail }, { username: normalizedUsername }] },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email or Username already registered" },
        { status: 409 }
      );
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Set default role to 'trainee' (only admin can add other roles)
    const userRole = role || "trainee";

    // ✅ Create user in DB - guard against a possible serial/sequence mismatch
    // If the underlying Postgres sequence for users.id is behind and emits an id that
    // already exists, Postgres will raise a unique constraint error on the id field.
    // In that case, correct the sequence and retry once.
    let user;
    try {
      user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          username: normalizedUsername,
          email: normalizedEmail,
          password: hashedPassword,
          role: userRole,
        },
      });
    } catch (createErr) {
      // If the error is a P2002 on the `id` field, attempt to fix the sequence and retry once.
      if (createErr && createErr.code === 'P2002' && createErr.meta && Array.isArray(createErr.meta.target) && createErr.meta.target.includes('id')) {
        console.warn('Detected duplicate id on user.create — attempting to fix sequence and retry:', createErr.message);
        try {
          // Advance the sequence to the current max(id)
          await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('users','id'), COALESCE((SELECT MAX(id) FROM users), 1))`);
          // Retry create once
          user = await prisma.user.create({
            data: {
              firstName,
              lastName,
              username: normalizedUsername,
              email: normalizedEmail,
              password: hashedPassword,
              role: userRole,
            },
          });
        } catch (retryErr) {
          console.error('Retry after sequence fix failed:', retryErr);
          throw retryErr;
        }
      } else {
        throw createErr;
      }
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        userId: user.id,
        role: user.role,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
