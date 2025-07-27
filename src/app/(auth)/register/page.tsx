"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useState } from "react";
import {isEmail, isStrongPassword} from "validator";
import {RegisterPayload, formValidityType} from "../interfaces";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "../api";
export default  function Register() {

  const [loginForm, setLoginForm] = useState<RegisterPayload>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formValidity, setFormValidity] = useState<formValidityType>({
    email: false,
    password: false,
    confirmPassword: false
  });

  const {mutate: createUserMutate} = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      console.log("success");
    }

  })


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!loginForm.email || !loginForm.password || !loginForm.confirmPassword) return;
    if(!formValidity.email || !formValidity.password || !formValidity.confirmPassword) return;
    createUserMutate({email: loginForm.email, password: loginForm.password});
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({ ...prev, email: e.target.value }));
    if (isEmail(e.target.value)) {
      setFormValidity((prev) => ({...prev, email: true}));
    }else{
      setFormValidity((prev) => ({...prev, password: true}));
    }
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({ ...prev, password: e.target.value }));

    if (isStrongPassword(e.target.value, {minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0})) {
      setFormValidity((prev) => ({...prev, password: true}));
    }else{
      setFormValidity((prev) => ({...prev, password: false}));
    }
  };
  
  const onChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({ ...prev, confirmPassword: e.target.value }));
    if(loginForm.password === e.target.value) {
      setFormValidity((prev) => ({...prev, confirmPassword: true}));
    }else{
      setFormValidity((prev) => ({...prev, confirmPassword: false}));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen gap-3 px-2">
      <Image src={"/logo.png"} alt="logo" width={150} height={150} quality={100} className="object-cover" priority></Image>
      <form className="flex flex-col w-full gap-3 font-poppins" onSubmit={handleSubmit}>
        <div >
          <h4 className="text-xl font-medium tracking-tighter text-center scroll-m-20">
            Create your Account
          </h4>
          <p className="text-sm leading-relaxed text-center text-gray-500">
            Sign up to get started with JeepTa
          </p>

        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="email" className="text-sm">Email:</Label>
          <Input className="w-full text-sm placeholder:text-sm " id="email" type="email" placeholder="JohnDoe@gmail.com" onChange={onChangeEmail} value={loginForm.email}></Input>
          <p className={`text-sm text-red-400 tracking-tighter ${formValidity.email || Boolean(!loginForm.email) ? "hidden" : "block"}`}>Invalid Email Address</p>
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="password" className="text-sm">Password:</Label>
          <Input className="w-full text-sm placeholder:text-sm" id="password" type="password" placeholder="********" onChange={onChangePassword} value={loginForm.password}></Input>
          <p className={`text-sm  text-red-400 tracking-tighter leading-4 ${formValidity.password || Boolean(!loginForm.password) ? "hidden" : "block"}`}>  Password must be at least 6 characters and include uppercase, lowercase, and a number.</p>
    
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm">Confirm Password:</Label>
          <Input className="w-full text-sm placeholder:text-sm" id="confirmPassword" type="password" placeholder="********" onChange={onChangeConfirmPassword} value={loginForm.confirmPassword}></Input>
          <p className={`text-sm text-red-400 tracking-tighter leading-4 ${formValidity.confirmPassword || Boolean(!loginForm.confirmPassword) ? "hidden" : "block"}`}> Password does not match</p>

        </div>
        <Button className="cursor-pointer duration-300 transition-all active:scale-95 w-[95%] mx-auto hover:w-full">Create Account</Button>
        <div className="flex items-center w-full gap-3 text-sm ">
          <Separator className="flex-1" />
          <span>Or</span>
          <Separator className="flex-1 " />
        </div>
 
        <Button variant="outline" className="flex items-center justify-center duration-300 transition-all cursor-pointer active:scale-95 w-[95%] mx-auto hover:w-full" type="button">
          <FcGoogle/>
          Google Sign Up
        </Button>
        <div className="flex items-center justify-center w-full ">
          <Link href={'/login'} className="text-sm underline transition-colors duration-300 underline-offset-3 hover:text-blue-400">Already have an account?</Link>
        </div>

      </form>


    </div>
  );
}