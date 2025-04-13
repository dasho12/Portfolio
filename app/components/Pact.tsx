"use client";
import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface Skill {
  id: string;
  name: string;
  level: number;
  image?: string;
}

const SkillsSection = () => {
  const { scrollYProgress } = useScroll();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

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
        setError("Error loading skills");
        console.error("Error fetching skills:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const headerY = useTransform(scrollYProgress, [0, 0.2], [100, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const skillsY = useTransform(scrollYProgress, [0.1, 0.3], [100, 0]);
  const skillsOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const bgParallax = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const categories = [
    { id: "all", name: "All Skills" },
    { id: "frontend", name: "Frontend" },
    { id: "backend", name: "Backend" },
    { id: "other", name: "Other" },
  ];

  const getFilteredSkills = () => {
    if (activeCategory === "all") return skills;

    return skills.filter((skill) => {
      if (
        activeCategory === "frontend" &&
        ["React", "HTML", "CSS", "JavaScript", "Next.js", "Vue"].some((tech) =>
          skill.name.includes(tech)
        )
      ) {
        return true;
      }
      if (
        activeCategory === "backend" &&
        ["Node", "Express", "MongoDB", "SQL", "Python", "Django", "PHP"].some(
          (tech) => skill.name.includes(tech)
        )
      ) {
        return true;
      }
      if (
        activeCategory === "other" &&
        ![
          "React",
          "HTML",
          "CSS",
          "JavaScript",
          "Next.js",
          "Vue",
          "Node",
          "Express",
          "MongoDB",
          "SQL",
          "Python",
          "Django",
          "PHP",
        ].some((tech) => skill.name.includes(tech))
      ) {
        return true;
      }
      return false;
    });
  };

  const displayedSkills = getFilteredSkills().sort((a, b) => b.level - a.level);

  return (
    <div className="w-full min-h-screen px-[12%] relative bg-gradient-to-b from-[#121218] to-[#1a1a24] overflow-hidden py-32">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <motion.div
          className="absolute w-full h-full  opacity-5"
          style={{ y: bgParallax }}
        />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 right-10 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-20"
          style={{ y: headerY, opacity: headerOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block"
          >
            <h2 className="inline-block text-6xl font-bold bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400 text-transparent bg-clip-text">
              My Expertise
            </h2>
          </motion.div>

          <motion.p
            className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            I&apos;ve cultivated a diverse set of skills throughout my journey
            as a developer. Here&apos;s an overview of my technical expertise
            and proficiency levels.
          </motion.p>
        </motion.div>

        <motion.div
          className="flex justify-center mb-16 flex-wrap gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-teal-500 to-cyan-400 text-white shadow-lg shadow-teal-500/20"
                  : "bg-[#1e1e2a] text-gray-300 hover:bg-[#26262f]"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="relative w-20 h-20">
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-teal-400 border-r-transparent border-b-teal-400/30 border-l-transparent animate-spin"></div>
              <div className="absolute top-2 left-2 w-16 h-16 rounded-full border-4 border-t-transparent border-r-cyan-400 border-b-transparent border-l-cyan-400/30 animate-spin"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-6 rounded-xl text-center">
            <p>{error}</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            style={{ y: skillsY, opacity: skillsOpacity }}
          >
            {displayedSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="relative"
                onMouseEnter={() => setHoveredSkill(skill.id)}
                onMouseLeave={() => setHoveredSkill(null)}
              >
                <motion.div
                  className="relative overflow-hidden rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10 p-6 h-full transition-all duration-300"
                  whileHover={{
                    y: -8,
                    boxShadow: "0 20px 40px -15px rgba(0, 206, 201, 0.2)",
                    borderColor: "rgba(0, 206, 201, 0.3)",
                  }}
                >
                  <div className="flex items-center mb-5">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/20 backdrop-blur-xl border border-white/10 flex items-center justify-center mr-4 overflow-hidden">
                      {skill.image ? (
                        <Image
                          src={skill.image}
                          alt={skill.name || "Skill Image"}
                          width={28}
                          height={28}
                          className="object-contain"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-teal-400 to-cyan-300"></div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {skill.name}
                    </h3>
                  </div>

                  <div className="mt-2">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300 text-sm font-medium">
                        Proficiency
                      </span>
                      <span className="text-teal-400 font-semibold">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-3 bg-[#1e1e2a] rounded-full overflow-hidden relative">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 relative"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{
                          duration: 1,
                          delay: 0.3 * index,
                          ease: "easeOut",
                        }}
                      >
                        {hoveredSkill === skill.id && (
                          <motion.div
                            className="absolute top-0 right-0 h-full w-8 bg-white/30"
                            animate={{
                              x: [-5, -100, -5],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              repeatType: "loop",
                            }}
                          />
                        )}
                      </motion.div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        skill.level >= 90
                          ? "bg-teal-500/20 text-teal-300"
                          : skill.level >= 70
                          ? "bg-blue-500/20 text-blue-300"
                          : skill.level >= 50
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-gray-500/20 text-gray-300"
                      }`}
                    >
                      {skill.level >= 90
                        ? "Expert"
                        : skill.level >= 70
                        ? "Advanced"
                        : skill.level >= 50
                        ? "Intermediate"
                        : "Beginner"}
                    </div>
                  </div>

                  <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-r from-teal-500/5 to-cyan-500/5 blur-xl"></div>

                  {hoveredSkill === skill.id && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-cyan-500/5 rounded-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          className="text-center mt-24 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-medium text-white mb-4">
            Looking for specific expertise?
          </h3>
          <p className="text-gray-400 mb-8">
            I&apos;m constantly expanding my skill set and adapting to new
            technologies. If you don&apos;t see a skill you&apos;re looking for,
            feel free to ask!
          </p>
          <motion.a
            href="#contact"
            className="inline-block px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-medium rounded-full shadow-lg shadow-teal-500/20"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 15px 30px -10px rgba(0, 206, 201, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            Contact Me
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};

export default SkillsSection;
