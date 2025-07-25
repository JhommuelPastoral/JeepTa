'use client'
import Image from "next/image";
import { motion } from "motion/react"
import { Button } from "@/components/ui/button";
import {MoveRight} from "lucide-react"
import Link from "next/link";

export default function Home() {
  return (
    // Mobile View
    <motion.div className="md:hidden px-2 flex flex-col items-center justify-center max-w-screen h-screen bg-[rgb(244, 244, 244)] "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease:[0.67, 0.1, 0.83, 0.67] }}
    
    >
      
      <Image src={"/logo.png"} alt="logo" width={180} height={180} quality={100}></Image>
      <p className="text-sm leading-4 tracking-tight text-center font-poppins">JeepTa helps you find the best jeepney routes in Davao and beyond. Know exactly how to get from point A to B.</p>

      <footer className="absolute w-full px-2 bottom-10">
        <Link href={'/login'}>
          <Button 
            className="flex items-center justify-center w-full transition-all duration-150 cursor-pointer group font-poppins hover:scale-103 active:scale-98">
              Get Started 
              <MoveRight className="group-hover:scale-120"/>
          </Button>
        </Link>
      </footer>
    </motion.div>
 
  );
}
