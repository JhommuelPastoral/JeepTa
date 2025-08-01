import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import comparePassword from "@/app/_utils/comparePassword";

export async function POST(req: Request) {
  try {
    const {email, password } = await req.json();
    if(!email || !password) return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { email } });
    if(!user) return NextResponse.json({ success: false}, { status: 400 });
    const isMatch = await comparePassword(password, user.password);
    if(!isMatch) return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 400 });
    return NextResponse.json({ success: true, isVerified: user.isVerified },{status:200});
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }

}