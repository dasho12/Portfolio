"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, AlertCircle, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface Skill {
  id: string;
  name: string;
  level: number;
  image: string;
}

export default function EditSkillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    level: number;
    image: string;
  }>({
    name: "",
    level: 0,
    image: "",
  });

  // Fetch skill data
  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const response = await fetch(`/api/skills?id=${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch skill");
        }
        const data = await response.json();
        setSkill(data);
        setFormData({
          name: data.name || "",
          level: data.level || 0,
          image: data.image || "",
        });
      } catch (err) {
        setError("Error loading skill. Please try again.");
        console.error("Error fetching skill:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkill();
  }, [resolvedParams.id]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`/api/skills?id=${resolvedParams.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update skill");
      }

      router.push("/admin/skills");
    } catch (err) {
      setError("Error updating skill. Please try again.");
      console.error("Error updating skill:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="bg-red-500/20 text-red-300 p-4 rounded-lg flex items-center gap-2">
        <AlertCircle size={20} />
        <p>Skill not found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white flex items-center gap-2 mb-4"
        >
          <ArrowLeft size={18} />
          Back to Skills
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">Edit Skill</h1>
        <p className="text-gray-400">Update your skill details here</p>
      </div>

      {error && (
        <div className="bg-red-500/20 text-red-300 p-4 rounded-lg flex items-center gap-2 mb-6">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Skill Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full py-2 px-4 bg-[#1e1e2a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="level"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Proficiency Level (1-100)
          </label>
          <input
            type="number"
            id="level"
            min="1"
            max="100"
            value={formData.level}
            onChange={(e) =>
              setFormData({ ...formData, level: parseInt(e.target.value) })
            }
            className="w-full py-2 px-4 bg-[#1e1e2a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Image URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ImageIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              id="image"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="pl-10 w-full py-2 px-4 bg-[#1e1e2a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          {formData.image && (
            <div className="mt-2">
              <Image
                src={formData.image}
                alt="Skill preview"
                width={64}
                height={64}
                className="rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Save size={18} />
            Save Changes
          </motion.button>
        </div>
      </form>
    </div>
  );
}
