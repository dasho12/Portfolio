import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

// PUT update project (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();

  // Check if user is authenticated
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const { title, image, description, link } = await req.json();

    // Validate required fields
    if (!title || !image || !description || !link) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedProject = await prisma.project.update({
      where: {
        id,
      },
      data: {
        title,
        image,
        description,
        link,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE project (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();

  // Check if user is authenticated
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;

    await prisma.project.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
