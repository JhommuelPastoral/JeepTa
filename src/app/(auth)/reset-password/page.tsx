"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { isEmail } from "validator";
import { useMutation } from "@tanstack/react-query";
import { sendOTP } from "../api";
import { useRouter } from "next/navigation";
import { LoaderCircle, Send , MoveLeft } from 'lucide-react';

export default function ResetPassword() {

  const [email, setEmail] = useState<string>('');
  const router = useRouter();
  const [isEmailValid, setIsEmailValid] = useState(false);
  
  // Mutations

  const {mutate: sendOTPMutate, isPending:otpPending} = useMutation({
    mutationFn: sendOTP,
    onSuccess: () => {
      localStorage.setItem('PasswordResetOtpEmail', email);
      localStorage.setItem('lastResendPasswordReset', Date.now().toString());
      router.push(`/reset-password-otp`);  
    }
  });
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!isEmailValid) return;   
    sendOTPMutate({to: email});
  };



  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsEmailValid(isEmail(e.target.value));
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-screen h-screen gap-3 px-2">
      <Image src={"/logo.png"} alt="logo" width={150} height={150} quality={100} className="object-cover" priority></Image>

      <form className="flex flex-col w-full gap-3 font-poppins" onSubmit={handleSubmit}>
        <div>
          <h4 className="text-xl font-medium tracking-tighter text-center scroll-m-20">
            Forgot Your Password?
          </h4>
          <p className="text-sm leading-relaxed text-center text-gray-500">
            Enter your registered email to receive an OTP for password reset.
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="email" className="text-sm">Email:</Label>
          <Input className="w-full text-sm placeholder:text-sm " id="email" type="email" placeholder="yourname@example.com" onChange={onChangeEmail} value={email}></Input>
          <p className={`text-sm text-red-400 tracking-tighter ${isEmailValid || Boolean(!email) ? "hidden" : "block"}`}>Invalid Email Address</p>
        </div>

        <Button 
          className="cursor-pointer duration-300 transition-all active:scale-95 w-[95%] mx-auto hover:w-full" 
          disabled={otpPending}>{otpPending ?  
            <div className="flex items-center justify-center gap-2"> 
              <LoaderCircle className="animate-spin"/> <span>Sending Code...</span>
            </div> 
          : <div className="flex items-center justify-center gap-2"> 
              <span>Send Code</span>
              <Send /> 
            </div>}
        </Button>
        {/* <p className={`${loginError || googleLoginError ? "block" : "hidden"} text-center text-sm text-red-400 tracking-tighter leading-4`}>Account does not exist. <span><Link href={'/login'} className="text-sm text-black underline transition-colors duration-300 underline-offset-4 hover:text-blue-400"> Sign up?</Link></span></p> */}
      </form>
      <div className="absolute flex w-full px-4 mx-auto bottom-6 ">
        <Button variant="outline" 
            className="font-poppins cursor-pointer duration-300 transition-all active:scale-95 w-[95%] mx-auto hover:w-full flex items-center gap-3 group"
            onClick={() => router.push('/login')}
          >
          <MoveLeft className="transition-transform duration-150 group-hover:scale-120 group-hover:-translate-x-2"/>
           Back to login
        </Button>
      </div>
    </div>
  );
}