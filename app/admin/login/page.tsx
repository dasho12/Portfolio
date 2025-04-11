// app/admin/login/page.tsx
"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Lock, AlertCircle } from "lucide-react";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      // Redirect to admin dashboard on success
      router.push("/admin/dashboard");
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2e2e38] via-[#1f1f29] to-[#121217] px-4">
      {/* Background effects */}
      <div className="absolute w-[300px] h-[300px] bg-teal-500/10 rounded-full top-10 left-10 blur-3xl" />
      <div className="absolute w-[200px] h-[200px] bg-purple-500/10 rounded-full bottom-10 right-10 blur-2xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-3xl font-bold text-teal-400"
          >
            Admin Login
          </motion.h1>
          <p className="text-gray-400 mt-2">
            Enter your credentials to access the admin panel
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-300 p-3 rounded-lg flex items-center gap-2 mb-6">
            <AlertCircle size={18} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-3 bg-[#1e1e2a] px-4 py-3 rounded-xl">
            <User className="text-teal-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="bg-transparent outline-none text-white w-full placeholder-gray-400"
              required
            />
          </div>

          <div className="flex items-center gap-3 bg-[#1e1e2a] px-4 py-3 rounded-xl">
            <Lock className="text-teal-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="bg-transparent outline-none text-white w-full placeholder-gray-400"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
            className={`${
              isLoading ? "bg-teal-700" : "bg-teal-500 hover:bg-teal-600"
            } w-full transition text-white py-3 rounded-xl font-semibold flex justify-center items-center`}
          >
            {isLoading ? (
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
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
