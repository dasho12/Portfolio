import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // authOptions-ийг импортлоорой

const prisma = new PrismaClient();

// PUT update skill (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions); // authOptions-ийг ашиглах

  // Check if user is authenticated
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const { name, level } = await req.json();

    // Validate required fields
    if (!name || !level) {
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

    const updatedSkill = await prisma.skill.update({
      where: {
        id,
      },
      data: {
        name,
        level,
      },
    });

    return NextResponse.json(updatedSkill);
  } catch (error) {
    console.error("Error updating skill:", error); // Алдааг хадгалж, лог хийх
    return NextResponse.json(
      { error: "Failed to update skill" },
      { status: 500 }
    );
  }
}

// DELETE skill (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions); // authOptions-ийг ашиглах

  // Check if user is authenticated
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;

    await prisma.skill.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Error deleting skill:", error); // Алдааг хадгалж, лог хийх
    return NextResponse.json(
      { error: "Failed to delete skill" },
      { status: 500 }
    );
  }
}
