// app/admin/projects/new/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, ArrowLeft, Image, AlertCircle } from "lucide-react";
import Link from "next/link";

const NewProjectPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
    link: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create project");
      }

      router.push("/admin/projects");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link
            href="/admin/projects"
            className="text-gray-400 hover:text-teal-400 inline-flex items-center gap-1 mb-3"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>
          <h1 className="text-3xl font-bold text-white">Add New Project</h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 text-red-300 p-4 rounded-lg flex items-center gap-2 mb-6">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white/5 rounded-xl border border-white/10 p-6"
      >
        <div className="space-y-6">
          {/* Project Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Project Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full py-2 px-4 bg-[#1e1e2a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter project title"
            />
          </div>

          {/* Project Image URL */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Image URL
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                className="flex-1 py-2 px-4 bg-[#1e1e2a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter image URL"
              />
              {formData.image && (
                <div className="relative h-10 w-10 rounded overflow-hidden">
                  <Image
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${formData.image}')` }}
                  />
                </div>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Provide a URL to your project image. Recommended size: 400x400px.
            </p>
          </div>

          {/* Project Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Project Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full py-2 px-4 bg-[#1e1e2a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Write a short description of your project"
            />
          </div>

          {/* Project Link */}
          <div>
            <label
              htmlFor="link"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Project Link
            </label>
            <input
              type="url"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              required
              className="w-full py-2 px-4 bg-[#1e1e2a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="https://your-project-link.com"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              type="submit"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Project"}
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewProjectPage;
