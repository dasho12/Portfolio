"use client";

import React, { useEffect, useState } from "react";
import Triangle from "./Triangle";
import { motion, useScroll, useTransform } from "framer-motion";

// Define Project type based on your schema
interface Project {
  id: string;
  title: string;
  image: string;
  description: string;
  link: string;
  level?: number; // Added level property
  techStack?: string[];
  createdAt: string;
}

const Projects = () => {
  const { scrollYProgress } = useScroll();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<string | null>(null);

  // Fetch projects data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();
        setProjects(data);
        if (data.length > 0) {
          setActiveProject(data[0].id);
        }
      } catch (err) {
        setError("Error loading projects. Please try again later.");
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Animation values based on scroll
  const backgroundTrianglesOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.3],
    [0, 0.25]
  );
  const backgroundRotation = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const yMove = useTransform(scrollYProgress, [0, 0.3], [50, 0]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const projectVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, type: "spring", stiffness: 50 },
    },
  };

  return (
    <div
      className="relative w-full  min-h-screen bg-gradient-to-br from-[#2e2e38] via-[#1f1f29] to-[#121217] text-white py-24 px-[15%] md:px-8 lg:px-16 overflow-hidden"
      id="projects"
    >
      {/* Animated background patterns */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ opacity: backgroundTrianglesOpacity }}
      >
        <motion.div
          className="absolute -top-20 -left-20 opacity-10"
          style={{ rotate: backgroundRotation }}
        >
          <Triangle
            size="xxl"
            color="none"
            borderColor="#7BE3E1"
            borderWidth={2}
          />
        </motion.div>
        <motion.div
          className="absolute top-1/3 -right-40 opacity-10"
          style={{ rotate: backgroundRotation }}
        >
          <Triangle
            size="xxl"
            color="none"
            borderColor="#7BE3E1"
            borderWidth={2}
          />
        </motion.div>
        <motion.div
          className="absolute -bottom-20 left-1/4 opacity-10"
          style={{ rotate: backgroundRotation }}
        >
          <Triangle
            size="xxl"
            color="none"
            borderColor="#7BE3E1"
            borderWidth={2}
          />
        </motion.div>
      </motion.div>

      {/* Glow Circle Background */}
      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-[#7BE3E1] opacity-20 rounded-full blur-[150px] z-0" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-[#7BE3E1] opacity-10 rounded-full blur-[200px] z-0" />

      {/* Title */}
      <motion.h1
        className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300 text-center mb-20 z-10 relative"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        PROJECTS
      </motion.h1>

      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <div className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-400 p-8 bg-white/5 rounded-xl max-w-3xl mx-auto">
          <p>{error}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center text-gray-400 p-8 bg-white/5 rounded-xl max-w-3xl mx-auto">
          <p>No projects found. Check back soon!</p>
        </div>
      ) : (
        <motion.div
          className="flex flex-col gap-32 z-10 relative max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ y: yMove }}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center gap-10 lg:gap-20`}
              variants={projectVariants}
              onMouseEnter={() => setActiveProject(project.id)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Triangle with Image */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, rotate: -10 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.2 + index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
              >
                {/* Glowing effect for active project */}
                {activeProject === project.id && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-teal-400 opacity-20 blur-3xl -z-10"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 0.3 }}
                    transition={{ duration: 0.5 }}
                  />
                )}

                <Triangle
                  size="lg"
                  imageUrl={project.image}
                  color="#5FB5B3"
                  borderColor="#7BE3E1"
                  borderWidth={activeProject === project.id ? 5 : 3}
                  textColor="#FFFFFF"
                />

                {/* Level indicator on the sides */}
                {project.level && (
                  <div
                    className={`absolute ${
                      index % 2 === 0
                        ? "right-0 translate-x-1/2"
                        : "left-0 -translate-x-1/2"
                    } top-1/2 -translate-y-1/2 flex flex-col items-center gap-3`}
                  >
                    <div className="flex flex-col items-center transform rotate-90">
                      <span className="text-teal-300 text-sm tracking-wider whitespace-nowrap mb-1">
                        COMPLEXITY
                      </span>
                      <div className="h-3 w-32 bg-[#2D2D35] rounded-full overflow-hidden shadow-inner">
                        <motion.div
                          className="h-full bg-gradient-to-r from-teal-400 to-cyan-300"
                          initial={{ width: 0 }}
                          animate={{ width: `${project.level}%` }}
                          transition={{
                            duration: 1.2,
                            delay: 0.5 + index * 0.2,
                          }}
                        >
                          <motion.div
                            className="absolute top-0 right-0 h-full w-4 bg-white opacity-70"
                            animate={{
                              opacity: [0.7, 0, 0.7],
                              x: [0, -100, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "loop",
                              ease: "easeInOut",
                              delay: index + 1,
                            }}
                          />
                        </motion.div>
                      </div>
                    </div>
                    <span className="text-white text-sm font-medium">
                      {project.level}%
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Description */}
              <motion.div
                className="flex flex-col gap-6 max-w-xl text-gray-300"
                initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
              >
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
                  {project.title}
                </h2>
                <p className="text-lg leading-relaxed">{project.description}</p>

                {/* Tech Stack Tags */}
                {project.techStack && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.techStack.map((tech, i) => (
                      <motion.span
                        key={i}
                        className="px-3 py-1 bg-[#393941] rounded-full text-teal-300 text-sm"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                )}

                {/* Project Links */}
                <div className="flex gap-6 mt-6">
                  <motion.button
                    className="w-fit px-6 py-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 hover:from-teal-300 hover:to-cyan-200 text-black font-medium transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live Demo
                    </a>
                  </motion.button>
                  <motion.button
                    className="w-fit px-6 py-2 rounded-full bg-transparent border border-teal-400 hover:bg-teal-400/10 text-teal-300 font-medium transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <a
                      href={`https://github.com/yourusername/${project.title
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub Code
                    </a>
                  </motion.button>
                </div>

                {/* Created Date */}
                <p className="text-sm text-gray-500 mt-4">
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Projects;
