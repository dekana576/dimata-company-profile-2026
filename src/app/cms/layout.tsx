"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { 
  Image, 
  LogOut, 
  Home, 
  Menu, 
  X, 
  Calendar, 
  DollarSign, 
  FolderGit2, 
  Briefcase, 
  ChevronDown,
  User, // <-- TAMBAHAN: Import icon User untuk menu About
  FileText,
} from "lucide-react";

interface User {
  id: number;
  email: string;
  name: string;
}

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" forcedTheme="light">
      <CmsLayoutContent>{children}</CmsLayoutContent>
    </ThemeProvider>
  );
}

function CmsLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);
  const [careerOpen, setCareerOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/cms/login") {
      setChecking(false);
      return;
    }

    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setChecking(false);
      })
      .catch(() => {
        // Token expired or invalid — destroy and redirect
        router.push("/cms/login");
      });
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Continue even if API fails
    }
    setUser(null);
    router.push("/cms/login");
  };

  if (pathname === "/cms/login") {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // --- TAMBAHAN: Menu About dimasukkan ke dalam navItems ---
  const navItems = [
    { href: "/cms", label: "Dashboard", icon: Home },
    { href: "/cms/about", label: "About", icon: User }, // <-- Menu baru untuk mengelola foto founder
    { href: "/cms/gallery", label: "Gallery", icon: Image },
    { href: "/cms/events", label: "Events", icon: Calendar },
    { href: "/cms/project", label: "Projects", icon: FolderGit2 },
    { href: "/cms/pricing", label: "Pricing", icon: DollarSign },
  ];

  const careerSubItems = [
    { href: "/cms/career/departments", label: "Departments" },
    { href: "/cms/career/jobs", label: "Jobs" },
  ];

  const blogSubItems = [
    { href: "/cms/blog", label: "All Posts" },
    { href: "/cms/blog/categories", label: "Categories" },
  ];

  const isCareerActive = pathname.startsWith("/cms/career");
  const isBlogActive = pathname.startsWith("/cms/blog");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-white p-2 shadow-md lg:hidden"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-gray-900 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-gray-800">
            <Link href="/cms" className="text-xl font-bold text-white">
              Dimata CMS
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}

            {/* Career Menu */}
            <div>
              <button
                onClick={() => setCareerOpen(!careerOpen)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isCareerActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Briefcase className="h-5 w-5" />
                Career
                <ChevronDown
                  className={`ml-auto h-4 w-4 transition-transform ${
                    careerOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {careerOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {careerSubItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Blog Menu */}
            <div>
              <button
                onClick={() => setBlogOpen(!blogOpen)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isBlogActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <FileText className="h-5 w-5" />
                Blog
                <ChevronDown
                  className={`ml-auto h-4 w-4 transition-transform ${
                    blogOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {blogOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {blogSubItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* User section */}
          <div className="border-t border-gray-800 p-4">
            {user && (
              <div className="mb-3 text-sm text-gray-400">
                Logged in as <span className="text-white">{user.email}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto lg:ml-64">
        <div className="p-6 pt-16 lg:pt-6 text-gray-900">{children}</div>
      </main>
    </div>
  );
}