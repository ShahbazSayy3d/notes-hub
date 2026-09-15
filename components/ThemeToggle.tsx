"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
      localStorage.setItem("theme", "dark");
    }
  }, []);

  function toggleTheme() {
    const newTheme = !isDark;

    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="
          flex h-10 w-10 items-center justify-center
          rounded-xl
          border border-slate-200
          bg-white
          text-slate-600
          dark:border-white/10
          dark:bg-white/[0.04]
          dark:text-slate-300
        "
      >
        <Moon size={18} />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={
        isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      title={
        isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      className="
        group relative flex h-10 w-10
        items-center justify-center
        overflow-hidden rounded-xl
        border border-slate-200
        bg-white
        text-slate-600
        shadow-sm
        transition-all duration-300
        hover:-translate-y-0.5
        hover:border-blue-300
        hover:text-blue-600
        hover:shadow-[0_0_25px_rgba(37,99,235,0.15)]
        dark:border-white/10
        dark:bg-white/[0.04]
        dark:text-slate-300
        dark:hover:border-blue-400/40
        dark:hover:text-blue-400
        dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]
      "
    >
      <span
        className="
          absolute inset-0 rounded-xl
          bg-blue-500/0
          transition-all duration-500
          group-hover:bg-blue-500/10
        "
      />

      <span className="relative z-10 transition-transform duration-300 group-hover:rotate-12">
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </span>
    </button>
  );
}