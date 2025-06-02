"use client";
import React, { useState } from "react";
import Triangle from "./components/Triangle";

const scrollToSection = (id: string) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};

const Nav = () => {
  const [active, setActive] = useState("top");

  const handleClick = (id: string) => {
    setActive(id);
    scrollToSection(id);
  };

  const linkClass = (id: string) =>
    `cursor-pointer hover:underline text-xs sm:text-sm md:text-base ${
      active === id ? "text-cyan-300" : "text-white"
    }`;

  return (
    <div className="w-full py-2 sm:py-3 md:py-4 pt-4 sm:pt-5 md:pt-6 z-50">
      <div className="max-w-5xl mx-auto flex justify-between items-center font-medium relative px-4 sm:px-6 md:px-8">
        {/* Left side */}
        <div className="flex gap-4 sm:gap-8 md:gap-[70px]">
          <span onClick={() => handleClick("top")} className={linkClass("top")}>
            HOME
          </span>
          <span
            onClick={() => handleClick("about")}
            className={linkClass("about")}
          >
            ABOUT
          </span>
        </div>

        {/* Center triangle */}
        <div className="absolute left-1/2 transform -translate-x-1/2 scale-75 sm:scale-90 md:scale-100">
          <Triangle
            size="sm"
            color="none"
            borderColor="white"
            borderWidth={2}
            rotate={180}
          />
        </div>

        {/* Right side */}
        <div className="flex gap-4 sm:gap-8 md:gap-[70px]">
          <span
            onClick={() => handleClick("projects")}
            className={linkClass("projects")}
          >
            PROJECTS
          </span>
          <span
            onClick={() => handleClick("contact")}
            className={linkClass("contact")}
          >
            CONTACT
          </span>
        </div>
      </div>
    </div>
  );
};

export default Nav;
