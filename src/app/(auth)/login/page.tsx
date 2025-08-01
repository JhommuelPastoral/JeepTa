"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useState } from "react";
import isEmail from "validator/lib/isEmail";
import { LoginPayload } from "../interfaces";
import { useMutation } from "@tanstack/react-query";
import { login, googleLogin, sendOTP } from "../api";
import { useRouter } from "next/navigation";
import { LoaderCircle } from 'lucide-react';
import {auth, signInWithPopup, provider} from "@/lib/firebase"

export default function LogIn() {

  const [loginForm, setLoginForm] = useState<LoginPayload>({
    email: "",
    password: "",
  });
  const router = useRouter();
  const [isEmailValid, setIsEmailValid] = useState(false);
  
  // Mutations

  const {mutate: sendOTPMutate, isPending:otpPending} = useMutation({
    mutationFn: sendOTP,
    onSuccess: () => {
      localStorage.setItem('emailForOtp', loginForm.email);
      localStorage.setItem('lastResend', Date.now().toString());
      router.push(`/otp`);  
    }
  });

  const {mutate: loginMutate, isPending:loginPending, isError:loginError} = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if(data.isVerified) router.push(`/dashboard`);
      sendOTPMutate({to: loginForm.email});
    }
  });

  const {mutate: googleLoginMutate, isPending:googleLoginPending, isError:googleLoginError} = useMutation({
    mutationFn: googleLogin,
    onSuccess: (data) => {
      if(data.isVerified) router.push(`/dashboard`);
      sendOTPMutate({to: loginForm.email});    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!loginForm.email || !loginForm.password) return;
    loginMutate({email: loginForm.email, password: loginForm.password});
  };

  const handleGoogleLogin = async() => {
    try {
      const res = await signInWithPopup(auth, provider);
      if(!res) return;
      const email = res.user.email;
      if(!email) return;
      setLoginForm((prev) => ({ ...prev, email }));
      googleLoginMutate({email});
    } catch (error) {
      console.log(error);
    }
  }

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({ ...prev, email: e.target.value }));
    setIsEmailValid(isEmail(e.target.value));
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({ ...prev, password: e.target.value }));
  };





  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen gap-3 px-2">
      <Image src={"/logo.png"} alt="logo" width={150} height={150} quality={100} className="object-cover" priority></Image>

      <form className="flex flex-col w-full gap-3 font-poppins" onSubmit={handleSubmit}>
        <div>
          <h4 className="text-xl font-medium tracking-tighter text-center scroll-m-20">
            Login to your Account
          </h4>
          <p className="text-sm leading-relaxed text-center text-gray-500">
            Welcome back! Please login to continue.
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="email" className="text-sm">Email:</Label>
          <Input className="w-full text-sm placeholder:text-sm " id="email" type="email" placeholder="yourname@example.com" onChange={onChangeEmail} value={loginForm.email}></Input>
          <p className={`text-sm text-red-400 tracking-tighter ${isEmailValid || Boolean(!loginForm.email) ? "hidden" : "block"}`}>Invalid Email Address</p>
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="password" className="text-sm">Password:</Label>
          <Input className="w-full text-sm placeholder:text-sm" id="password" type="password" placeholder="********" onChange={onChangePassword} value={loginForm.password}></Input>
          <div className="flex items-end justify-end">
            <Link href={'/reset-password'} className="text-sm underline transition-colors duration-300 underline-offset-4 hover:text-blue-400 ">Forgot Password?</Link>
          </div>
        </div>
        <Button className="cursor-pointer duration-300 transition-all active:scale-95 w-[95%] mx-auto hover:w-full" disabled={loginPending || googleLoginPending || otpPending}>{loginPending || googleLoginPending || otpPending ?  <div className="flex items-center justify-center gap-2"> <LoaderCircle className="animate-spin"/> <span>Signing In...</span></div> : "Sign In"}</Button>
        <p className={`${loginError || googleLoginError ? "block" : "hidden"} text-center text-sm text-red-400 tracking-tighter leading-4`}>Account does not exist. <span><Link href={'/login'} className="text-sm text-black underline transition-colors duration-300 underline-offset-4 hover:text-blue-400"> Sign up?</Link></span></p>
        <div className="flex items-center w-full gap-3 text-sm ">
          <Separator className="flex-1" />
          <span>Or</span>
          <Separator className="flex-1 " />
        </div>
 
        <Button onClick={handleGoogleLogin} disabled={loginPending || googleLoginPending|| otpPending} variant="outline" className="flex items-center justify-center duration-300 transition-all cursor-pointer active:scale-95 w-[95%] mx-auto hover:w-full" type="button">
          <FcGoogle/>
          Google Sign In
        </Button>
        <div className="flex items-center justify-center w-full ">
          <Link href={'/register'} className="text-sm underline transition-colors duration-300 underline-offset-3 hover:text-blue-400">Don&apos;t have an account?</Link>
        </div>

      </form>


    </div>
  );
}