import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, name, password } = await req.json();

    // Хэрэглэгчийн оруулсан мэдээлэл дутуу эсэхийг шалгах
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Бүх талбарыг бөглөнө үү" },
        { status: 400 }
      );
    }

    // Хэрэглэгч аль хэдийн бүртгэлтэй эсэхийг шалгах
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Энд имэйл аль хэдийн бүртгэгдсэн байна" },
        { status: 400 }
      );
    }

    // Нууц үгийг хэшлэх
    const hashedPassword = await bcrypt.hash(password, 10);

    // Шинэ хэрэглэгчийг өгөгдлийн санд хадгалах
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "Хэрэглэгч амжилттай бүртгэгдлээ",
        user: { id: user.id, email: user.email, name: user.name },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Бүртгэл амжилтгүй боллоо" },
      { status: 500 }
    );
  }
}
