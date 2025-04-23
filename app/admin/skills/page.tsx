"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Code,
  Edit,
  Trash2,
  Plus,
  AlertCircle,
  Search,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Define Skill type
interface Skill {
  id: string;
  name: string;
  level: number;
  image: string;
  createdAt: string;
}

const SkillsPage = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const router = useRouter();

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/skills");

      if (!response.ok) {
        throw new Error("Failed to fetch skills");
      }

      const data = await response.json();
      setSkills(data);
    } catch (err) {
      setError("Error loading skills. Please try again.");
      console.error("Error fetching skills:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) {
      return;
    }

    try {
      const response = await fetch(`/api/skills?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete skill");
      }

      setSkills(skills.filter((skill) => skill.id !== id));
    } catch (error) {
      console.error("Error deleting skill:", error);
      alert("Failed to delete skill. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Skills</h1>
          <p className="text-gray-400">
            Manage your technical skills and expertise levels
          </p>
        </div>
        <Link href="/admin/skills/new">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={18} />
            Add New Skill
          </motion.button>
        </Link>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full py-2 px-4 bg-[#1e1e2a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {error && (
        <div className="bg-red-500/20 text-red-300 p-4 rounded-lg flex items-center gap-2 mb-6">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="bg-white/5 rounded-lg border border-white/10 p-8 text-center">
          <Code className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">
            No skills found
          </h3>
          <p className="text-gray-400 mb-6">
            {searchQuery
              ? "No skills match your search. Try a different query."
              : "Get started by adding your first skill."}
          </p>
          {!searchQuery && (
            <Link href="/admin/skills/new">
              <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2">
                <Plus size={18} />
                Add New Skill
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredSkills.map((skill) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 rounded-lg border border-white/10 p-5 flex flex-col md:flex-row md:items-center gap-4 relative"
            >
              {/* Skill image */}
              <div className="h-16 w-16 rounded-lg bg-white/10 overflow-hidden">
                {skill.image ? (
                  <Image
                    src={skill.image}
                    alt={skill.name || "Skill Image"}
                    className="h-full w-full object-cover"
                    width={64} // You can adjust the width and height as necessary
                    height={64} // Adjust the height as necessary
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-500">
                    <ImageIcon size={24} />
                  </div>
                )}
              </div>

              {/* Skill details */}
              <div className="flex-1">
                <h3 className="text-xl font-medium text-white">{skill.name}</h3>
                <div className="mt-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-teal-300">Proficiency</span>
                    <span className="text-sm text-gray-400">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-2 bg-[#121217] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-400"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 md:self-center">
                <Link href={`/admin/skills/edit/${skill.id}`}>
                  <button className="p-2 rounded-lg hover:bg-white/10 text-teal-400 transition-colors">
                    <Edit size={18} />
                  </button>
                </Link>
                <button
                  onClick={() => handleDeleteSkill(skill.id)}
                  className="p-2 rounded-lg hover:bg-white/10 text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Delete confirmation */}
              {deleteConfirm === skill.id && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-10">
                  <div className="bg-[#1e1e2a] p-6 rounded-lg max-w-sm">
                    <h4 className="text-lg font-medium text-white mb-2">
                      Delete Skill?
                    </h4>
                    <p className="text-gray-400 mb-4">
                      Are you sure you want to delete &quot;{skill.name}&quot;?
                      This action cannot be undone.
                    </p>

                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsPage;
