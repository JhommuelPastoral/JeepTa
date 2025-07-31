import { NextResponse } from "next/server";
import crypto from "crypto";
import hashPassword from "@/app/_utils/hashPassword";
import prisma from "@/lib/prisma";

function generateRandomPassword(): string {
  let randomPassword = crypto.randomBytes(10).toString("hex");
  return randomPassword;
}
export async function POST(req: Request) {
  try {
    const {email} = await req.json();
    if(!email) return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    const password = generateRandomPassword();
    const hashedPassword = await hashPassword(password);
    await prisma.user.create({
      data:{
        email,
        password: hashedPassword
      }
    })
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error creating OTP:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}