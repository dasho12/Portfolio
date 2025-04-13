// app/admin/layout.tsx
"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Folder,
  Code,
  MessageSquare,
  LogOut,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect to login if not authenticated (except for login page)
  React.useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [status, router, pathname]);

  // Show loading state while checking session
  if (status === "loading" && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1f1f29]">
        <Loader2 className="h-8 w-8 text-teal-400 animate-spin" />
      </div>
    );
  }

  // Don't show layout for login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Navigation items
  const navItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Projects",
      href: "/admin/projects",
      icon: <Folder size={20} />,
    },
    {
      label: "Skills",
      href: "/admin/skills",
      icon: <Code size={20} />,
    },
    {
      label: "Messages",
      href: "/admin/messages",
      icon: <MessageSquare size={20} />,
    },
  ];

  // Handle logout
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/admin/login");
  };

  return (
    <div className="flex h-screen min-h-screen bg-[#121217]">
      {/* Sidebar */}
      <div className="w-64 bg-[#1e1e2a] text-gray-300 flex flex-col border-r border-white/10">
        {/* Logo / Header */}
        <div className="p-4 border-b border-white/10">
          <Link href="/admin/dashboard">
            <h1 className="text-xl font-bold text-teal-400">Admin Panel</h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="py-6 flex-1">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors ${
                    pathname === item.href ? "bg-teal-500/20 text-teal-300" : ""
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User and Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="mb-4 px-4 py-2">
            <p className="text-sm text-gray-400">Logged in as</p>
            <p className="font-medium text-teal-400">{session?.user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-300 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
