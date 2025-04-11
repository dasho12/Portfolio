"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Define the Skill type to match your API response
interface Skill {
  id: string;
  name: string;
  level: number;
}

const About = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("/api/skills");

        if (!response.ok) {
          throw new Error("Failed to fetch skills");
        }

        const data = await response.json();
        setSkills(data);
      } catch (err) {
        setError("Error loading skills. Please try again later.");
        console.error("Error fetching skills:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return (
    <div className="bg-[#0f0f14] text-white py-24 px-4" id="about">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Зураг */}
        <motion.div
          className="w-[280px] h-[280px] relative rounded-full overflow-hidden border-4 border-teal-400 shadow-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Image
            src="/images/avatar.png" // өөрийн зургаар солиорой
            alt="Profile"
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Текст */}
        <motion.div
          className="text-left max-w-xl"
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4 text-teal-400">About Me</h2>
          <p className="text-gray-300 text-lg leading-7 mb-4">
            Hello! I'm a passionate front-end developer with a love for creating
            modern, clean, and responsive user interfaces.
          </p>
          <p className="text-gray-400 text-base leading-7">
            My goal is to build user-friendly, high-performance web and mobile
            experiences that leave a lasting impression. I enjoy learning new
            technologies, collaborating with creative teams, and solving
            real-world problems through design and code.
          </p>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3 text-teal-400">
              My Skills
            </h3>

            {loading ? (
              <div className="flex gap-2">
                <div className="bg-[#1e1e2a] px-4 py-2 rounded-full text-sm text-gray-500 animate-pulse">
                  Loading...
                </div>
              </div>
            ) : error ? (
              <p className="text-red-400 text-sm">{error}</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <div key={skill.id} className="relative">
                    <span className="bg-[#1e1e2a] px-4 py-2 rounded-full text-sm text-teal-300 inline-block">
                      {skill.name}
                    </span>
                    {/* Optional: Show skill level as tooltip or small indicator */}
                    <div className="absolute -bottom-1 left-0 w-full">
                      <div
                        className="h-[3px] bg-teal-400 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}

                {skills.length === 0 && (
                  <p className="text-gray-400 text-sm">No skills found</p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
