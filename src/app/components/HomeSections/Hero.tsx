import React from 'react';
import HeroSearchV1 from './HeroSearchV1';
import HeroSearchV2 from './HeroSearchV2';
import HeroSearchOld from './HeroSearch-Old'
import { motion, AnimatePresence } from 'framer-motion';

export default function Hero() {
  return (
    <div>
      <div className='flex flex-col items-center'>
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
      </h1 >
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
      <HeroSearchV1 />
      <HeroSearchV1 />
      <div>
        <HeroSearchOld />
      </div>
    </div>
  );
}