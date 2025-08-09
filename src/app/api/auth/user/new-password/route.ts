import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import hashPassword from "@/app/_utils/hashPassword";
export async function POST(req: Request) {
  try {
    const {id, password} = await req.json();
    if(!id) return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { id } });
    if(!user) return NextResponse.json({ success: false}, { status: 400 });
    const hashedPassword = await hashPassword(password);
    await prisma.user.update({where:{id}, data:{password:hashedPassword}})
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
  
}