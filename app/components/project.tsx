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
  level?: number;
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
      className="relative w-full min-h-screen bg-gradient-to-br from-[#2e2e38] via-[#1f1f29] to-[#121217] text-white py-24 px-[15%] md:px-8 lg:px-16 overflow-hidden"
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
              {/* Enhanced Project Media Section - MADE SMALLER */}
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                {/* Background Glow Effect - Enhanced */}
                {activeProject === project.id && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-tr from-teal-400 to-cyan-300 opacity-20 blur-3xl -z-10"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                )}

                {/* Project Image Container with Triangle Clip Path */}
                <motion.div
                  className="relative w-full h-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  {/* Main Image - Full Size */}
                  <div className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl">
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover object-center"
                      initial={{ scale: 1.1 }}
                      animate={{
                        scale: activeProject === project.id ? 1.05 : 1.0,
                      }}
                      transition={{ duration: 0.8 }}
                    />
                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121217]/80 via-[#121217]/30 to-transparent" />
                  </div>

                  {/* Triangle Overlay with Glow Effects */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Inner Decorative Triangle */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center scale-75"
                      initial={{ opacity: 0, rotate: 180 }}
                      animate={{
                        opacity: 0.15,
                        rotate: activeProject === project.id ? 185 : 180,
                      }}
                      transition={{ duration: 1.5 }}
                    >
                      <Triangle
                        size="lg"
                        color="none"
                        borderColor="#FFFFFF"
                        borderWidth={2}
                        textColor="#FFFFFF"
                      />
                    </motion.div>
                  </div>

                  {/* REPLACED DECORATIVE RECTANGLES WITH TRIANGLES */}
                  {/* Bottom-right triangle */}
                  <motion.div
                    className="absolute -bottom-4 -right-4"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.8 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <div
                      className="w-16 h-16 opacity-80"
                      style={{
                        clipPath: "polygon(100% 0, 0% 100%, 100% 100%)",
                        background:
                          "linear-gradient(to right top, #7BE3E1, #4FACFE)",
                      }}
                    />
                  </motion.div>

                  {/* Top-left triangle */}
                  <motion.div
                    className="absolute -top-3 -left-3"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.7 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <div
                      className="w-8 h-8 opacity-70"
                      style={{
                        clipPath: "polygon(0 0, 0 100%, 100% 0)",
                        backgroundColor: "#7BE3E1",
                      }}
                    />
                  </motion.div>
                </motion.div>

                {/* Level indicator - Enhanced */}
                {project.level && (
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className={`absolute ${
                      index % 2 === 0
                        ? "right-0 translate-x-1/2"
                        : "left-0 -translate-x-1/2"
                    } top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-30`}
                  >
                    <div className="flex flex-col items-center transform rotate-90">
                      <span className="text-teal-300 text-sm font-medium tracking-wider whitespace-nowrap mb-2 uppercase">
                        Complexity
                      </span>
                      <div className="h-3 w-32 bg-[#1A1A22] rounded-full overflow-hidden shadow-lg shadow-cyan-900/20">
                        <motion.div
                          className="h-full bg-gradient-to-r from-teal-400 to-cyan-300"
                          initial={{ width: 0 }}
                          animate={{ width: `${project.level}%` }}
                          transition={{
                            duration: 1.5,
                            delay: 0.8,
                          }}
                        >
                          <motion.div
                            className="absolute top-0 right-0 h-full w-6 bg-white/70"
                            animate={{
                              opacity: [0.7, 0, 0.7],
                              x: [0, -100, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "loop",
                              ease: "easeInOut",
                            }}
                          />
                        </motion.div>
                      </div>
                    </div>
                    <motion.span
                      className="text-white text-sm font-medium bg-[#1A1A22] px-2 py-1 rounded-md shadow-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      {project.level}%
                    </motion.span>
                  </motion.div>
                )}
              </div>

              {/* Description Section - Enhanced */}
              <motion.div
                className="flex flex-col gap-6 max-w-xl text-gray-300"
                initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
                  {project.title}
                </h2>

                {/* Content Divider */}
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1 bg-teal-400 rounded-full" />
                  <div className="w-3 h-3 bg-cyan-300 rounded-full" />
                </div>

                <p className="text-lg leading-relaxed">{project.description}</p>

                {/* Tech Stack Tags - Enhanced */}
                {project.techStack && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.techStack.map((tech, i) => (
                      <motion.span
                        key={i}
                        className="px-4 py-1.5 bg-gradient-to-r from-[#2D2D35] to-[#393941] rounded-full text-teal-300 text-sm font-medium shadow-md"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "#393941",
                        }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                )}

                {/* Project Links - Enhanced */}
                <div className="flex flex-wrap gap-4 mt-6">
                  <motion.button
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 hover:from-teal-300 hover:to-cyan-200 text-black font-semibold transition duration-300 shadow-lg shadow-cyan-900/20"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 25px -5px rgba(123, 227, 225, 0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <span>Live Demo</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </motion.button>
                  <motion.button
                    className="px-6 py-3 rounded-full bg-transparent border-2 border-teal-400 hover:bg-teal-400/10 text-teal-300 font-semibold transition duration-300"
                    whileHover={{ scale: 1.05, borderColor: "#7BE3E1" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <a
                      href={`https://github.com/yourusername/${project.title
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <span>GitHub Code</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                  </motion.button>
                </div>

                {/* Created Date */}
                <p className="text-sm text-gray-500 mt-4 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
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
