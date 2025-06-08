"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="
        relative p-2 rounded-full 
        bg-brand-black/10 dark:bg-brand-white/10
        hover:bg-brand-black/20 dark:hover:bg-brand-white/20
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-brand-black/50 dark:focus:ring-brand-white/50
      "
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <div className="relative w-6 h-6 overflow-hidden">
        {/* Sun Icon */}
        <svg
          className={`
            absolute inset-0 w-6 h-6 text-brand-black dark:text-brand-white
            transition-transform duration-300 ease-in-out
            ${theme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"}
          `}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>

        {/* Moon Icon */}
        <svg
          className={`
            absolute inset-0 w-6 h-6 text-brand-black dark:text-brand-white
            transition-transform duration-300 ease-in-out
            ${theme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"}
          `}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>
    </button>
  );
}
