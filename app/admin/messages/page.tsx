// app/admin/messages/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  User,
  Mail,
  Trash2,
  Calendar,
  Search,
  AlertCircle,
  Eye,
} from "lucide-react";

// Define Contact type
interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

const MessagesPage = () => {
  const [messages, setMessages] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewMessage, setViewMessage] = useState<Contact | null>(null);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/contact");

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError("Error loading messages. Please try again.");
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Filter messages based on search query
  const filteredMessages = messages.filter(
    (message) =>
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Delete message handler
  const handleDeleteMessage = async (id: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete message");
      }

      // Refresh messages list
      fetchMessages();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting message:", error);
      setError("Failed to delete message. Please try again.");
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
        <p className="text-gray-400">
          View and manage contact form submissions
        </p>
      </div>

      {/* Search bar */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search messages..."
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
      ) : filteredMessages.length === 0 ? (
        <div className="bg-white/5 rounded-lg border border-white/10 p-8 text-center">
          <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">
            No messages found
          </h3>
          <p className="text-gray-400">
            {searchQuery
              ? "No messages match your search. Try a different query."
              : "You don't have any contact form submissions yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 rounded-lg border border-white/10 p-5 relative"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Contact info */}
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-white flex items-center gap-2">
                    <User className="inline h-5 w-5 text-teal-400" />
                    {message.name}
                  </h3>

                  <p className="text-gray-400 mt-1 flex items-center gap-2">
                    <Mail className="inline h-4 w-4 text-teal-400" />
                    {message.email}
                  </p>

                  <p className="text-gray-400 mt-1 flex items-center gap-2">
                    <Calendar className="inline h-4 w-4 text-teal-400" />
                    {formatDate(message.createdAt)}
                  </p>

                  <div className="mt-3">
                    <p className="text-white line-clamp-2">{message.message}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMessage(message)}
                    className="p-2 rounded-lg hover:bg-white/10 text-teal-400 transition-colors"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(message.id)}
                    className="p-2 rounded-lg hover:bg-white/10 text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Delete confirmation */}
              {deleteConfirm === message.id && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-10">
                  <div className="bg-[#1e1e2a] p-6 rounded-lg max-w-sm">
                    <h4 className="text-lg font-medium text-white mb-2">
                      Delete Message?
                    </h4>
                    <p className="text-gray-400 mb-4">
                      Are you sure you want to delete this message from{" "}
                      {message.name}? This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
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

      {/* View Message Modal */}
      {viewMessage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1e1e2a] p-6 rounded-lg max-w-2xl w-full border border-white/10"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-white">Message Details</h3>
              <button
                onClick={() => setViewMessage(null)}
                className="p-1 rounded-full hover:bg-white/10 text-gray-400"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">From</p>
                <p className="text-lg text-white">{viewMessage.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-lg text-white">{viewMessage.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Date</p>
                <p className="text-lg text-white">
                  {formatDate(viewMessage.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Message</p>
                <div className="mt-2 p-4 bg-white/5 rounded-lg text-white">
                  {viewMessage.message.split("\n").map((line, i) => (
                    <p key={i} className="mb-2">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewMessage(null)}
                className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
