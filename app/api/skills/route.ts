import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // 🔥 authOptions импорт

const prisma = new PrismaClient();

// GET all skills
export async function GET() {
  try {
    const skills = await prisma.skill.findMany();
    return NextResponse.json(skills);
  } catch (error) {
    console.error("GET /api/skills error:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}

// POST new skill (admin only)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions); // ✅ authOptions дамжуулсан

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, level, image } = await req.json();

    if (!name || !level || !image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate level (1-100)
    if (level < 1 || level > 100) {
      return NextResponse.json(
        { error: "Level must be between 1 and 100" },
        { status: 400 }
      );
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        level,
        image,
      },
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error("POST /api/skills error:", error); // Алдааг бүртгэх
    return NextResponse.json(
      { error: "Failed to create skill" },
      { status: 500 }
    );
  }
}
