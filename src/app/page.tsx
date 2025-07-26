'use client'
import Image from "next/image";
import { motion } from "motion/react"
import { Button } from "@/components/ui/button";
import {MoveRight} from "lucide-react"
import Link from "next/link";

export default function Home() {
  return (
    // Mobile View
    <motion.div className="flex flex-col items-center justify-center h-screen px-2 md:hidden max-w-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "linear" }}
    >
      
      <Image src={"/logo.png"} alt="logo" width={180} height={180} quality={100}></Image>
      <p className="text-sm leading-5 tracking-tight text-center font-poppins">JeepTa helps you find the best jeepney routes in Davao and beyond. Know exactly how to get from point A to B.</p>

      <footer className="absolute w-full px-4 bottom-6">
        <Link href={'/login'}>
          <Button 
            className="flex items-center justify-center w-full transition-all duration-150 cursor-pointer group font-poppins hover:scale-105 active:scale-95">
              Get Started 
              <MoveRight className="transition-transform duration-150 group-hover:scale-120 group-hover:translate-x-2"/>
          </Button>
        </Link>
      </footer>
    </motion.div>
 
  );
}
