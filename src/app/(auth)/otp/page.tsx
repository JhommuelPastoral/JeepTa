"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { useState } from "react";
import axios from "axios";

export default function OtpPage() {
  const [otpCode, setOtpCode] = useState<string>("");

  const onResendOTP = async () => {
    // generate 6 OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const email = "pastoraljhommuel@gmail.com"
    await axios.post("/api/auth/send-otp", {to:email, otpCode:otp});
  }
  
  const onSubmitOTP = () => {
    console.log('otpCode');
  }
  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen gap-2 px-2 font-poppins">
      <Image src={"/logo.png"} alt="logo" width={150} height={150} quality={100} className="object-cover" priority></Image>
      <div >
        <h4 className="text-xl font-medium tracking-tighter text-center scroll-m-20">
          Verify Your Email Address
        </h4>
        <p className="text-sm leading-5 tracking-tighter text-center text-gray-500">
          Please enter the verification code sent to your email to sign up to get started with JeepTa
        </p>
      </div>
      <InputOTP maxLength={6} className="w-full" pattern={REGEXP_ONLY_DIGITS_AND_CHARS} onChange={setOtpCode}>
        <InputOTPGroup className="flex flex-1 w-full gap-2 ">
          <InputOTPSlot index={0} className="h-12 text-lg border border-black w-11" />
          <InputOTPSlot index={1} className="h-12 text-lg border border-black w-11"/>
          <InputOTPSlot index={2} className="h-12 text-lg border border-black w-11"/>
        </InputOTPGroup>
        <InputOTPSeparator/>
        <InputOTPGroup className="flex flex-1 w-full gap-2 ">
          <InputOTPSlot index={3} className="h-12 text-lg border border-black w-11"/>
          <InputOTPSlot index={4} className="h-12 text-lg border border-black w-11"/>
          <InputOTPSlot index={5} className="h-12 text-lg border border-black w-11"/>
        </InputOTPGroup>
      </InputOTP>
      <div className="flex items-center justify-center w-full">
        <p className="text-sm leading-5 tracking-tighter text-center text-gray-500">
          Didn&apos;t receive the code?
        </p>
        <Button variant="link" className="underline cursor-pointer hover:text-blue-400" onClick={onResendOTP}> Resend</Button>
      </div>
      <Button className="cursor-pointer duration-300 transition-all active:scale-95 w-[95%] mx-auto hover:w-full" onClick={onSubmitOTP}>Verify Account</Button>


    </div>
  );
}