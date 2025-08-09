"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";
import { useEffect, useState} from "react";
import {isStrongPassword} from "validator";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../api";
import { useRouter } from "next/navigation";
import { LoaderCircle } from 'lucide-react';
export default  function Register() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loginForm, setLoginForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [formValidity, setFormValidity] = useState({
    password: false,
    confirmPassword: false
  });
  
  useEffect(()=>{
    const storageData = localStorage.getItem('verifiedPasswordResetOtp');
    if(!storageData){
      router.push('/login');
      return;
    }
    const data = JSON.parse(storageData);
    const expired : boolean = data.expireAt < Date.now();
    const id = data.id;
    setUserId(id);
    if(expired){
      localStorage.removeItem('verifiedPasswordResetOtp');
      router.push('/login');
    };
  },[isSubmitted])

  const {mutate: resetPasswordMutate, isPending:resetPasswordPending} = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      localStorage.removeItem('verifiedPasswordResetOtp');
      router.push('/dashboard');
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted((prev) => !prev);
    if(!loginForm.password || !loginForm.confirmPassword) return;
    if(!formValidity.password || !formValidity.confirmPassword) return;
    resetPasswordMutate({id: userId, password: loginForm.password});
  };

  // Input Handlers
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
            Reset New Password
          </h4>
          <p className="text-sm leading-relaxed text-center text-gray-500">
            Set a new password to regain access to your account.
          </p>

        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="password" className="text-sm">New Password:</Label>
          <Input className="w-full text-sm placeholder:text-sm" id="password" type="password" placeholder="********" onChange={onChangePassword} value={loginForm.password}></Input>
          <p className={`text-sm  text-red-400 tracking-tighter leading-4 ${formValidity.password || Boolean(!loginForm.password) ? "hidden" : "block"}`}>  Password must be at least 6 characters and include uppercase, lowercase, and a number.</p>
        </div>
        
        <div className="flex flex-col space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm">Confirm Password:</Label>
          <Input className="w-full text-sm placeholder:text-sm" id="confirmPassword" type="password" placeholder="********" onChange={onChangeConfirmPassword} value={loginForm.confirmPassword}></Input>
          <p className={`text-sm text-red-400 tracking-tighter leading-4 ${formValidity.confirmPassword || Boolean(!loginForm.confirmPassword) ? "hidden" : "block"}`}> Password does not match</p>
        </div>
        <Button 
          className={`cursor-pointer duration-300 transition-all active:scale-95 w-[95%] mx-auto hover:w-full`} 
          disabled={resetPasswordPending}>
            {resetPasswordPending ? 
            <div className="flex items-center justify-center gap-2"> 
              <LoaderCircle className="animate-spin"/> 
              <span>Creating Account..</span>
            </div> 
            : "Reset Password"}
        </Button>


      </form>
    
    </div>
  );
}