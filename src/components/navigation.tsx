'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ThemeToggle from './theme-toggle';
import Logo from './logo';
import HamburgerIcon from './hamburger-icon'; // Import the new icon

const navItems = [
  { href: '/works', label: 'works' },
  { href: '/skills', label: 'skills' },
  { href: '/resume', label: 'resume' },
  { href: '/about', label: 'about' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = ''; // Cleanup on component unmount
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="fixed top-0 right-0 left-0 z-40 select-none">
      <div className="container mx-auto px-6 py-4">
        <div className="relative flex h-12 items-center">
          {/* --- Mobile: Left --- */}
          {/* Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              aria-label="Open menu"
              className="text-brand-black dark:text-brand-white -ml-2 p-2"
              aria-expanded={isMobileMenuOpen}
            >
              <HamburgerIcon isOpen={isMobileMenuOpen} className="h-6 w-6" />
            </button>
          </div>

          {/* --- Desktop: Left --- */}
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:flex-1 md:items-center md:justify-start md:space-x-8">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative px-1 py-2 text-sm font-medium transition-all duration-300 ${
                  pathname === href
                    ? 'text-brand-black dark:text-brand-white'
                    : 'text-brand-black/60 dark:text-brand-white/60 hover:text-brand-black dark:hover:text-brand-white'
                } `}
              >
                {label}
                {pathname === href && (
                  <div className="bg-brand-black dark:bg-brand-white absolute right-0 -bottom-1 left-0 h-0.5" />
                )}
              </Link>
            ))}
          </div>

          {/* --- Center --- */}
          {/* Mobile Logo (Absolute Center) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden">
            <Link
              href="/"
              className="block"
              onClick={() => isMobileMenuOpen && toggleMobileMenu()}
            >
              <Logo size="sm" />
            </Link>
          </div>

          {/* Desktop Theme Toggle (Absolute Center) */}
          <div className="hidden md:absolute md:top-1/2 md:left-1/2 md:block md:-translate-x-1/2 md:-translate-y-1/2">
            <ThemeToggle />
          </div>

          {/* --- Right --- */}
          <div className="flex flex-1 items-center justify-end">
            {/* Mobile Theme Toggle */}
            <div className="md:hidden">
              <ThemeToggle />
            </div>
            {/* Desktop Logo */}
            <div className="hidden md:block">
              <Link href="/" className="transition-opacity hover:opacity-70">
                <Logo size="md" minSize="sm" maxSize="lg" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-brand-white/80 dark:bg-brand-black/80 fixed inset-0 z-50 p-6 backdrop-blur-[100px] md:hidden"
          >
            {/* Flex container to manage layout within the overlay */}
            <div className="flex h-full flex-col">
              <div className="flex justify-end">
                <button
                  onClick={toggleMobileMenu}
                  aria-label="Close menu"
                  className="text-brand-black dark:text-brand-white p-2"
                >
                  <HamburgerIcon isOpen={true} className="h-8 w-8" />
                </button>
              </div>
              {/* Scrollable container for navigation links */}
              <div className="mt-12 flex flex-grow flex-col items-center space-y-6 overflow-y-auto pb-6">
                {navItems.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={toggleMobileMenu}
                    className={`px-4 py-3 text-xl font-semibold transition-colors duration-300 ${
                      pathname === href
                        ? 'text-brand-black dark:text-brand-white'
                        : 'text-brand-black/70 hover:text-brand-black dark:text-brand-white/70 dark:hover:text-brand-white'
                    } `}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}