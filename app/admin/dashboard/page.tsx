// app/admin/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Folder, Code, MessageSquare, ArrowUpRight } from "lucide-react";
import Link from "next/link";

// Define types
interface DashboardStats {
  projectCount: number;
  skillCount: number;
  messageCount: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    projectCount: 0,
    skillCount: 0,
    messageCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Fetch projects
        const projectsRes = await fetch("/api/projects");
        const projects = await projectsRes.json();

        // Fetch skills
        const skillsRes = await fetch("/api/skills");
        const skills = await skillsRes.json();

        // Fetch messages
        const messagesRes = await fetch("/api/contact");
        const messages = await messagesRes.json();

        setStats({
          projectCount: Array.isArray(projects) ? projects.length : 0,
          skillCount: Array.isArray(skills) ? skills.length : 0,
          messageCount: Array.isArray(messages) ? messages.length : 0,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Stat cards data
  const statCards = [
    {
      title: "Projects",
      value: stats.projectCount,
      icon: <Folder className="h-6 w-6 text-teal-400" />,
      href: "/admin/projects",
      color: "from-teal-500/20 to-blue-500/20",
    },
    {
      title: "Skills",
      value: stats.skillCount,
      icon: <Code className="h-6 w-6 text-purple-400" />,
      href: "/admin/skills",
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      title: "Messages",
      value: stats.messageCount,
      icon: <MessageSquare className="h-6 w-6 text-orange-400" />,
      href: "/admin/messages",
      color: "from-orange-500/20 to-red-500/20",
    },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Welcome to your portfolio admin panel. Manage your projects, skills,
          and messages.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${card.color} p-6 border border-white/10`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 mb-1">{card.title}</p>
                <h3 className="text-3xl font-bold text-white">
                  {loading ? (
                    <div className="h-8 w-12 rounded-md bg-white/20 animate-pulse" />
                  ) : (
                    card.value
                  )}
                </h3>
              </div>
              <div className="p-2 rounded-lg bg-white/10">{card.icon}</div>
            </div>
            <Link
              href={card.href}
              className="mt-4 inline-flex items-center text-sm text-teal-400 hover:text-teal-300 transition-colors"
            >
              Manage
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 rounded-xl border border-white/10 p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-3 p-4 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 transition-colors"
          >
            <Folder className="h-5 w-5 text-teal-400" />
            <span className="text-teal-300">Add New Project</span>
          </Link>
          <Link
            href="/admin/skills/new"
            className="flex items-center gap-3 p-4 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-colors"
          >
            <Code className="h-5 w-5 text-purple-400" />
            <span className="text-purple-300">Add New Skill</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
