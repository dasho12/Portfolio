import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

// GET all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST new project (admin only)
export async function POST(req: NextRequest) {
  const session = await getServerSession();

  // Check if user is authenticated
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, image, description, link } = await req.json();

    // Validate required fields
    if (!title || !image || !description || !link) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        image,
        description,
        link,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

// DELETE project (admin only)
export async function DELETE(req: NextRequest) {
  const session = await getServerSession();

  // Check if user is authenticated
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    await prisma.project.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}

// PATCH update project (admin only)
export async function PATCH(req: NextRequest) {
  const session = await getServerSession();

  // Check if user is authenticated
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const { title, image, description, link } = await req.json();

    // Validate required fields
    if (!title || !image || !description || !link) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const project = await prisma.project.update({
      where: {
        id: id,
      },
      data: {
        title,
        image,
        description,
        link,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}
