"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { verifyOTP, sendOTP } from "../api";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const RESEND_TIMEOUT = 300;
export default function OtpPage() {
  const router = useRouter();
  const [otpCode, setOtpCode] = useState<string>("");
  const [hasResentOtp, setHasResentOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0); // countdown in seconds
  const searchParam = useSearchParams();
  const email = searchParam.get('email') || "";
  const timer = useRef<NodeJS.Timeout>(null);
  
  useEffect(() => {
    const lastResend = localStorage.getItem("lastResend");

    if (lastResend) {
      const elapsed = Math.floor((Date.now() - parseInt(lastResend)) / 1000);
      const remaining = RESEND_TIMEOUT - elapsed;

      if (remaining > 0) {
        setResendCooldown(remaining);
        setHasResentOtp(true);

        // Start timer immediately
        timer.current = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer.current!);
              timer.current = null;
              setHasResentOtp(false);
              localStorage.removeItem("lastResend");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setResendCooldown(0);
        setHasResentOtp(false);
        localStorage.removeItem("lastResend");
      }
    } else {
      // no previous resend, allow immediate resend
      setHasResentOtp(false);
      setResendCooldown(0);
    }

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    };
  }, [hasResentOtp]);




  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const onResendOTP = async () => {
    setHasResentOtp(true);
    localStorage.setItem('lastResend', Date.now().toString());
    setResendCooldown(RESEND_TIMEOUT);
    sendOtpMutate({ to: email });
  };

  const { mutate: sendOtpMutate } = useMutation({
    mutationFn: sendOTP,
  });

  const { mutate: verifyOtpMutate } = useMutation({
    mutationFn: verifyOTP,
    onSuccess: () => {
      router.push(`/dashboard`);
    },
  });

  const onSubmitOTP = () => {
    verifyOtpMutate({ email, otpCode });
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen gap-2 px-2 font-poppins">
      <Image
        src={"/logo.png"}
        alt="logo"
        width={150}
        height={150}
        quality={100}
        className="object-cover"
        priority
      />
      <div>
        <h4 className="text-xl font-medium tracking-tighter text-center scroll-m-20">
          Verify Your Email Address
        </h4>
        <p className="text-sm leading-5 tracking-tighter text-center text-gray-500">
          Please enter the verification code sent to{" "}
          <span className="font-semibold underline underline-offset-4">
            {email}
          </span>{" "}
          to sign up to get started with JeepTa
        </p>
      </div>

      <InputOTP
        maxLength={6}
        className="w-full"
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        onChange={setOtpCode}
      >
        <InputOTPGroup className="flex flex-1 w-full gap-2 ">
          <InputOTPSlot index={0} className="h-12 text-lg border border-black w-11" />
          <InputOTPSlot index={1} className="h-12 text-lg border border-black w-11" />
          <InputOTPSlot index={2} className="h-12 text-lg border border-black w-11" />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup className="flex flex-1 w-full gap-2 ">
          <InputOTPSlot index={3} className="h-12 text-lg border border-black w-11" />
          <InputOTPSlot index={4} className="h-12 text-lg border border-black w-11" />
          <InputOTPSlot index={5} className="h-12 text-lg border border-black w-11" />
        </InputOTPGroup>
      </InputOTP>

      <div className="flex items-center justify-center w-full">
        <p className="text-sm leading-5 tracking-tighter text-center text-gray-500">
          Didn&apos;t receive the code?
        </p>
        <Button
          variant="link"
          className="underline cursor-pointer hover:text-blue-400"
          disabled={hasResentOtp}
          onClick={onResendOTP}
        >
          {hasResentOtp ? `Resend in ${formatTime(resendCooldown)}` : "Resend"}
        </Button>
      </div>

      <Button
        className="cursor-pointer duration-300 transition-all active:scale-95 w-[95%] mx-auto hover:w-full"
        onClick={onSubmitOTP}
      >
        Verify Account
      </Button>
    </div>
  );
}
