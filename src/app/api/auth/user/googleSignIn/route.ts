import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {email} = await req.json();
    if(!email) return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { email } });
    if(!user) return NextResponse.json({ success: false}, { status: 400 });
    const isVerified = user.isVerified
    return NextResponse.json({ success: true, isVerified }, {status:200});

  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
