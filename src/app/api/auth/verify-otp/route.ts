import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, otpCode } = await req.json();
    if(!email || !otpCode) return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });

    const otp = await prisma.otp.findFirst({where:{email, code:otpCode}})
    if(!otp) return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });

    await prisma.user.update({where:{email}, data:{isVerified:true}})
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating OTP:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    
  }

}
