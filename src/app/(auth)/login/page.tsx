"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useState } from "react";
import isEmail from "validator/lib/isEmail";
import { LoginPayload } from "../interfaces";
export default function LogIn() {

  const [loginForm, setLoginForm] = useState<LoginPayload>({
    email: "",
    password: "",
  });
  const [isEmailValid, setIsEmailValid] = useState(false);


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!loginForm.email || !loginForm.password) return;
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({ ...prev, email: e.target.value }));
    if (isEmail(e.target.value)) {
      setIsEmailValid(true);
    }else{
      setIsEmailValid(false);
    }
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
          <Input className="w-full text-sm placeholder:text-sm " id="email" type="email" placeholder="JohnDoe@gmail.com" onChange={onChangeEmail} value={loginForm.email}></Input>
          <p className={`text-sm text-red-400 tracking-tighter ${isEmailValid || Boolean(!loginForm.email) ? "hidden" : "block"}`}>Invalid Email Address</p>
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="password" className="text-sm">Password:</Label>
          <Input className="w-full text-sm placeholder:text-sm" id="password" type="password" placeholder="********" onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))} value={loginForm.password}></Input>
          <div className="flex items-end justify-end">
            <Link href={'/reset-password'} className="text-sm underline transition-colors duration-300 underline-offset-3 hover:text-blue-400 ">Forgot Password?</Link>
          </div>
        </div>
        <Button className="cursor-pointer duration-300 transition-all active:scale-95 w-[95%] mx-auto hover:w-full">Sign In</Button>
        <div className="flex items-center w-full gap-3 text-sm ">
          <Separator className="flex-1" />
          <span>Or</span>
          <Separator className="flex-1 " />
        </div>
 
        <Button variant="outline" className="flex items-center justify-center duration-300 transition-all cursor-pointer active:scale-95 w-[95%] mx-auto hover:w-full" type="button">
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