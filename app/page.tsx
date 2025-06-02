"use client";
import React, { useMemo, useEffect, useState } from "react";
import Triangle from "./components/Triangle";
import Image from "next/image";
import Pact from "./components/Pact";
import Project from "./components/project";
import About from "./components/about";
import Contact from "./components/contact";
import { motion } from "framer-motion";

// Precompute particle configurations to ensure consistency
const generateParticleConfigs = (count: number) => {
  return [...Array(count)].map(() => ({
    initial: {
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      opacity: 0.3,
    },
    animate: {
      x: [
        `${Math.random() * 100}%`,
        `${Math.random() * 100}%`,
        `${Math.random() * 100}%`,
      ],
      y: [
        `${Math.random() * 100}%`,
        `${Math.random() * 100}%`,
        `${Math.random() * 100}%`,
      ],
      opacity: [0.3, 0.8, 0.3],
    },
  }));
};

const Page = () => {
  const [mounted, setMounted] = useState(false);
  const particleConfigs = useMemo(() => generateParticleConfigs(20), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="scroll-smooth">
      {/* 🟦 Hero Section */}
      <div
        id="top"
        className="min-h-screen w-full flex flex-col bg-cover bg-center items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/1.png')",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 z-[1]"></div>

        {/* Animated particles - Only render on client side */}
        {mounted && (
          <div className="absolute inset-0 z-[2]">
            {particleConfigs.map((config, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-teal-300 rounded-full opacity-70"
                initial={config.initial}
                animate={config.animate}
                transition={{
                  duration: 10 + Math.random() * 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>
        )}

        {/* 📝 PORTFOLIO text with animation */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.4, y: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute text-white text-[8vw] md:text-[11vw] font-semibold z-[5] text-center px-4"
          style={{ letterSpacing: "6px" }}
        >
          PORTFOLIO
        </motion.h1>

        {/* 📷 Background image */}
        <motion.div
          className="absolute bottom-0 z-[6] w-full flex justify-center"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 0.8 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          <Image
            src="/images/oohh.png"
            alt="Background Image Behind Triangle"
            width={500}
            height={700}
            className="object-contain h-[400px] md:h-[600px] w-auto"
            priority
          />
        </motion.div>

        {/* 🔺 Triangle with animation */}
        <motion.div
          className="z-10 mt-10 px-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Triangle
            size="lg"
            color="none"
            text="DASHZEWEG"
            textColor="white"
            borderColor="#7BE3E1"
            borderWidth={8}
          />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 md:bottom-20 z-20 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span className="text-white/80 text-xs md:text-sm mb-2">
            SCROLL DOWN
          </span>
          <motion.div
            className="w-5 h-8 md:w-6 md:h-10 border-2 border-white/50 rounded-full flex justify-center p-1"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-2 bg-teal-400 rounded-full"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>

        {/* 🔹 Bottom line with animation */}
        <motion.div
          className="z-10 absolute bottom-0 w-full p-2 md:p-3 bg-[#3C3F46]/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <motion.div
            className="w-[90%] md:w-[70%] h-[2px] mx-[5%] md:mx-[15%] bg-[#7BE3E1]"
            initial={{ width: "0%", marginLeft: "50%" }}
            animate={{ width: "90%", marginLeft: "5%" }}
            transition={{ duration: 1.5, delay: 1 }}
          />
        </motion.div>
      </div>

      {/* 🟨 Other Sections */}
      <Pact />
      <div id="projects">
        <Project />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="contact">
        <Contact />
      </div>
    </div>
  );
};

export default Page;
