import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import hashPassword from "@/app/_utils/hashPassword";


export async function POST(req: Request) {
  const { email, password } = await req.json();

  if(!email || !password) return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 });
  }


  const hashedPassword = await hashPassword(password);
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return NextResponse.json({ success: true});
}