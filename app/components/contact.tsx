"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Facebook,
  Instagram,
  Github,
  ExternalLink,
} from "lucide-react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/profile.php?id=100026767176046",
      icon: <Facebook size={24} />,
      color: "#4267B2",
    },
    {
      name: "Instagram",
      url: "https://instagram.com/yourusername",
      icon: <Instagram size={24} />,
      color: "#E1306C",
    },
    {
      name: "GitHub",
      url: "https://github.com/yourusername",
      icon: <Github size={24} />,
      color: "#333",
    },
    {
      name: "Vercel",
      url: "https://vercel.com/yourusername",
      icon: <ExternalLink size={24} />,
      color: "#000000",
    },
    {
      name: "Gmail",
      url: "mailto:your.email@gmail.com",
      icon: <Mail size={24} />,
      color: "#D44638",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      // Success
      setSubmitStatus({
        success: true,
        message: "Message sent successfully! I'll get back to you soon.",
      });

      // Clear form after successful submission
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      // Error handling
      setSubmitStatus({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="relative bg-[#0f0f14] py-24 px-4 text-white" id="contact">
      <motion.div
        className="max-w-5xl mx-auto text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-5xl font-bold mb-6 text-teal-400">Get In Touch</h2>
        <p className="text-gray-400 mb-14 text-lg max-w-2xl mx-auto">
          I&apos;m always open to discussing new projects, creative ideas, or
          opportunities to be part of your vision. Let&apos;s build something
          amazing together!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-2xl shadow-xl grid grid-cols-1 gap-6 w-full mx-auto"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 bg-[#1e1e2a] px-4 py-3 rounded-xl">
              <User className="text-teal-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="bg-transparent outline-none text-white w-full placeholder-gray-400"
                required
              />
            </div>

            <div className="flex items-center gap-3 bg-[#1e1e2a] px-4 py-3 rounded-xl">
              <Mail className="text-teal-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                className="bg-transparent outline-none text-white w-full placeholder-gray-400"
                required
              />
            </div>

            <div className="flex items-start gap-3 bg-[#1e1e2a] px-4 py-3 rounded-xl">
              <MessageSquare className="text-teal-400 mt-1" />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Your Message"
                className="bg-transparent outline-none text-white w-full placeholder-gray-400 resize-none"
                required
              ></textarea>
            </div>

            {submitStatus && (
              <div
                className={`flex items-center gap-2 p-3 rounded-lg ${
                  submitStatus.success
                    ? "bg-green-500/20 text-green-300"
                    : "bg-red-500/20 text-red-300"
                }`}
              >
                {submitStatus.success ? (
                  <CheckCircle size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
                <p className="text-sm">{submitStatus.message}</p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting}
              className={`${
                isSubmitting ? "bg-teal-700" : "bg-teal-500 hover:bg-teal-600"
              } transition text-white py-3 rounded-xl font-semibold flex justify-center items-center`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Message 🚀"
              )}
            </motion.button>
          </motion.form>

          {/* Social Media Links */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="backdrop-blur-md bg-white/5 border border-white/10 p-4 rounded-xl transition-all hover:bg-white/10 group"
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  boxShadow: `0 10px 25px -5px ${link.color}40`,
                }}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300"
                    style={{
                      backgroundColor: `${link.color}30`,
                      boxShadow: `0 0 0 0 ${link.color}00`,
                    }}
                  >
                    <div className="text-white group-hover:text-teal-400 transition-colors duration-300">
                      {link.icon}
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-white">
                    {link.name}
                  </h3>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Background circle effects */}
      <div className="absolute w-72 h-72 bg-teal-500/10 rounded-full top-10 left-10 blur-3xl animate-pulse" />
      <div className="absolute w-48 h-48 bg-purple-500/10 rounded-full bottom-10 right-10 blur-2xl animate-pulse" />
      <div className="absolute w-64 h-64 bg-blue-500/10 rounded-full bottom-40 left-1/3 blur-3xl animate-pulse" />
    </div>
  );
};

export default Contact;
