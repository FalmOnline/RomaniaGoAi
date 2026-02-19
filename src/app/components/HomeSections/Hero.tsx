"use client";

import React from "react";
// import HeroSearchV1 from "./HeroSearchV1";
import HeroSearchV2 from "./HeroSearchV2";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <div>
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="font-extrabold tracking-tight leading-[0.9] text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="text-black">Your next </span>
            <span className="bg-romaniago-gradient bg-clip-text text-transparent gradient-text">
              Romanian
            </span>
            <br className="hidden sm:block" />
            <span className="text-black">adventure starts here</span>
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-10 text-base md:text-xl text-black/70 max-w-2xl mx-auto leading-relaxed text-center"
        >
          Find hidden gems, plan trips, and get inspired. <br />
          Explore destinations, events, and experiences tailored for you.
        </motion.p>
      </div>
      {/* <HeroSearchV1 /> */}
      <HeroSearchV2 />
      <Image
        className="absolute top-0 -z-10 left-48"
        src="/images/romburi-traditionale-romanesti.svg"
        width={200}
        height={787}
        alt="romburi traditionale romanesti"
      />
      <div className="absolute top-36 -z-50 right-4">
        <Image
          className=""
          src="/images/cerc.svg"
          width={500}
          height={500}
          alt="romburi traditionale romanesti"
        />
         <div className="absolute top-10 right-0 w-[500px] flex flex-col items-center">
           <Image
            className=""
            src="/images/traditional-house.png"
            width={143}
            height={154}
            alt="traditional romanian house"
                   />
            <Image
            className="relative right-44 -mt-4"
            src="/images/path.svg"
            width={358}
            height={362}
            alt="path"
                   />
         </div>
      </div>
    </div>
  );
}
