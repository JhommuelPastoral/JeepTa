import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { to } = await request.json();
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    if(!to) return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });

    const existing = await prisma.otp.findUnique({ where: { email: to } });
    if (existing) {
      return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 });
    }

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });
  
    await transporter.sendMail({
      from: `"JeepTa Verification" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your One-Time Password (OTP) for JeepTa",
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #1e40af; text-align: center;">🔐 Email Verification</h2>
          <p style="font-size: 16px; color: #333;">Hello,</p>
          <p style="font-size: 16px; color: #333;">
            Thank you for signing up with <strong>JeepTa</strong>! To complete your registration, please use the following verification code:
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="display: inline-block; padding: 12px 24px; font-size: 24px; font-weight: bold; color: #fff; background-color: #1e40af; border-radius: 6px;">
              ${otpCode}
            </span>
          </div>
          <p style="font-size: 14px; color: #555;">
            This code will expire in 5 minutes. If you didn’t request this, please ignore this email.
          </p>
          <p style="font-size: 14px; color: #999; margin-top: 32px; text-align: center;">
            &copy; ${new Date().getFullYear()} JeepTa. All rights reserved.
          </p>
        </div>
      `,
    });
    await prisma.otp.create({ data: { email: to, code: otpCode, expiresAt} });
    return NextResponse.json({ success: true, message: "Email sent successfully" }, { status: 200 });
    
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 });
  }


}
