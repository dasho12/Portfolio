import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

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

// DELETE skill (admin only)
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Skill ID is required" },
        { status: 400 }
      );
    }

    await prisma.skill.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/skills error:", error);
    return NextResponse.json(
      { error: "Failed to delete skill" },
      { status: 500 }
    );
  }
}

// PATCH update skill (admin only)
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Skill ID is required" },
        { status: 400 }
      );
    }

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

    const skill = await prisma.skill.update({
      where: {
        id: id,
      },
      data: {
        name,
        level,
        image,
      },
    });

    return NextResponse.json(skill);
  } catch (error) {
    console.error("PATCH /api/skills error:", error);
    return NextResponse.json(
      { error: "Failed to update skill" },
      { status: 500 }
    );
  }
}
