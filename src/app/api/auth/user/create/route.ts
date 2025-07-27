import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 });
  }

  const user = await prisma.user.create({
    data: {
      id: uuidv4(),
      email,
      password,
    },
  });

  return NextResponse.json({ success: true, user });
}
