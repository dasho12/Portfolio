"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Folder,
  Edit,
  Trash2,
  Plus,
  ExternalLink,
  Search,
  AlertCircle,
} from "lucide-react";

// Define Project type
interface Project {
  id: string;
  title: string;
  image: string;
  description: string;
  link: string;
  createdAt: string;
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/projects");

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError("Error loading projects. Please try again.");
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects based on search query
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle project deletion
  const handleDeleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      // Refresh projects list
      fetchProjects();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting project:", error);
      setError("Failed to delete project. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-400">Manage your portfolio projects here</p>
        </div>
        <Link href="/admin/projects/new">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={18} />
            Add New Project
          </motion.button>
        </Link>
      </div>

      {/* Search bar */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search projects..."
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
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white/5 rounded-lg border border-white/10 p-8 text-center">
          <Folder className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">
            No projects found
          </h3>
          <p className="text-gray-400 mb-6">
            {searchQuery
              ? "No projects match your search. Try a different query."
              : "Get started by adding your first project."}
          </p>
          {!searchQuery && (
            <Link href="/admin/projects/new">
              <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2">
                <Plus size={18} />
                Add New Project
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 rounded-lg border border-white/10 p-5 flex flex-col md:flex-row md:items-center gap-4"
            >
              {/* Project thumbnail */}
              <div
                className="h-20 w-20 rounded-lg bg-cover bg-center border border-white/10"
                style={{ backgroundImage: `url('${project.image}')` }}
              />

              {/* Project details */}
              <div className="flex-1">
                <h3 className="text-xl font-medium text-white">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-1">
                  {project.description}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-teal-400 hover:text-teal-300 inline-flex items-center gap-1"
                  >
                    <ExternalLink size={14} />
                    View Live
                  </a>
                  <span className="text-sm text-gray-500">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 md:self-center">
                <Link href={`/admin/projects/edit/${project.id}`}>
                  <button className="p-2 rounded-lg hover:bg-white/10 text-teal-400 transition-colors">
                    <Edit size={18} />
                  </button>
                </Link>
                <button
                  onClick={() => setDeleteConfirm(project.id)}
                  className="p-2 rounded-lg hover:bg-white/10 text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Delete confirmation */}
              {deleteConfirm === project.id && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-10">
                  <div className="bg-[#1e1e2a] p-6 rounded-lg max-w-sm">
                    <h4 className="text-lg font-medium text-white mb-2">
                      Delete Project?
                    </h4>
                    <p className="text-gray-400 mb-4">
                      Are you sure you want to delete &quot;{project.title}
                      &quot;? This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
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

export default ProjectsPage;
