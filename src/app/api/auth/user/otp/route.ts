import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, otpCode } = await req.json();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    await prisma.otp.create({
      data: {
        email,
        code: otpCode,
        expiresAt,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating OTP:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
