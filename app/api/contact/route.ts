import { NextRequest, NextResponse } from "next/server";
import pkg from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// GET all contact requests (admin only)
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contact requests:", error); // Алдааг хадгалж, лог хийх
    return NextResponse.json(
      { error: "Failed to fetch contact requests" },
      { status: 500 }
    );
  }
}

// POST new contact request (public)
export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        message,
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("Error submitting contact request:", error); // Алдааг хадгалж, лог хийх
    return NextResponse.json(
      { error: "Failed to submit contact request" },
      { status: 500 }
    );
  }
}
