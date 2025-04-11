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
    `cursor-pointer hover:underline ${
      active === id ? "text-cyan-300" : "text-white"
    }`;

  return (
    <div className="w-full py-4 pt-6 z-50">
      <div className="max-w-5xl text-[18px] mx-auto flex justify-between items-center text-sm font-medium relative">
        {/* Зүүн тал */}
        <div className="flex gap-[70px]">
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

        {/* Гол гурвалжин */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Triangle
            size="sm"
            color="none"
            borderColor="white"
            borderWidth={3}
            rotate={180}
          />
        </div>

        {/* Баруун тал */}
        <div className="flex gap-[70px]">
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
