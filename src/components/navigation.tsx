'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ThemeToggle from './theme-toggle';
import Logo from './logo';
import HamburgerIcon from './hamburger-icon';
import Glassmorphism from './glassmorphism';

// Import sphere color palette from interactive background
const sphereColorPalette = [
  '0,100,244', // 0064F4 - Blue
  '167,201,87', // A7C957 - Green
  '239,83,72', // EF5348 - Red
  '244,162,97', // F4A261 - Sandy Brown/Orange
  '42,157,143', // 2A9D8F - Persian Green/Teal
  '231,111,81', // E76F51 - Burnt Sienna/Coral
  '255,202,58', // FFCA3A - Maize Crayola/Yellow
  '138,201,38', // 8AC926 - Lime Green
  '106,76,147', // 6A4C93 - Royal Purple
  '25,130,196', // 1982C4 - Blue Crayola
];

type NavItem = {
  href: string;
  label: string;
  subItems?: { href: string; label: string }[];
};

const navItems: NavItem[] = [
  {
    href: '/works',
    label: 'works',
  },
  { href: '/skills', label: 'skills' },
  { href: '/resume', label: 'resume' },
  { href: '/about', label: 'about' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSubMenu, setOpenMobileSubMenu] = useState<string | null>(
    null
  );
  const [isCompactLayout, setIsCompactLayout] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Function to get active color for current page
  const getActiveColor = (href: string) => {
    const index = navItems.findIndex(item => item.href === href);
    const rgbColor = sphereColorPalette[index % sphereColorPalette.length];
    // Convert RGB string to hex
    const [r, g, b] = rgbColor.split(',').map(Number);
    return (
      r.toString(16).padStart(2, '0') +
      g.toString(16).padStart(2, '0') +
      b.toString(16).padStart(2, '0')
    );
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenMobileSubMenu(null);
  };

  // Check for overflow and switch layout
  useEffect(() => {
    const checkOverflow = () => {
      if (navRef.current) {
        const container = navRef.current;
        const isOverflowing = container.scrollWidth > container.clientWidth;
        setIsCompactLayout(isOverflowing);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Handle click outside for dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  // Handle click outside for mobile menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
        setOpenMobileSubMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="fixed top-4 left-1/2 z-40 w-full max-w-[900px] -translate-x-1/2 transform px-4 select-none">
      <Glassmorphism className="rounded-[45.5px]">
        <div className="px-12 py-3" ref={navRef}>
          {/* Dynamic Layout - Full when space allows, Compact when overflow */}
          {!isCompactLayout ? (
            /* Full Layout */
            <div className="flex h-[60px] items-center">
              {/* Left: Logo */}
              <div className="flex-shrink-0">
                <Link
                  href="/"
                  className="block transition-opacity hover:opacity-70"
                >
                  <div className="flex h-[60px] items-center">
                    <Logo size="md" minSize="sm" maxSize="lg" />
                  </div>
                </Link>
              </div>

              {/* Navigation Items - Next to Logo */}
              <div className="ml-1 flex items-center space-x-1">
                {navItems.map(({ href, label, subItems }) => {
                  const isActive = pathname.startsWith(href);

                  return (
                    <div
                      key={href}
                      className="relative"
                      ref={subItems ? dropdownRef : null}
                      onMouseEnter={() => {
                        if (subItems) setOpenDropdown(href);
                        setHoveredItem(href);
                      }}
                      onMouseLeave={e => {
                        // Only close if we're not moving to the dropdown
                        const relatedTarget = e.relatedTarget as HTMLElement;
                        if (
                          !relatedTarget ||
                          !e.currentTarget.contains(relatedTarget)
                        ) {
                          if (subItems) setOpenDropdown(null);
                          setHoveredItem(null);
                        }
                      }}
                    >
                      <AnimatePresence>
                        {(isActive || hoveredItem === href) && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 rounded-md"
                          >
                            <Glassmorphism
                              className="rounded-md"
                              backgroundColor={{
                                color: isActive
                                  ? getActiveColor(href)
                                  : 'FFFFFF',
                                opacity: isActive ? 15 : 8,
                              }}
                              intensity={isActive ? 90 : 60}
                              frost={6}
                            >
                              <div />
                            </Glassmorphism>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <button
                        onClick={() =>
                          subItems &&
                          setOpenDropdown(openDropdown === href ? null : href)
                        }
                        className={`relative z-10 rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 ${
                          isActive
                            ? 'text-brand-black dark:text-brand-white'
                            : 'text-brand-black/60 dark:text-brand-white/60'
                        }`}
                      >
                        {label}
                      </button>

                      <AnimatePresence>
                        {subItems && openDropdown === href && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 z-20 mt-2 w-32"
                            onMouseEnter={() => {
                              // Keep dropdown open when hovering over it
                              setOpenDropdown(href);
                            }}
                            onMouseLeave={() => {
                              // Close dropdown when leaving
                              setOpenDropdown(null);
                            }}
                          >
                            <Glassmorphism className="rounded-md">
                              <div className="flex flex-col items-center justify-center p-2">
                                {subItems.map(subItem => (
                                  <Link
                                    key={subItem.href}
                                    href={subItem.href}
                                    className={`block w-full rounded-md px-4 py-2 text-center text-sm transition-colors ${
                                      pathname === subItem.href
                                        ? 'text-brand-black dark:text-brand-white'
                                        : 'text-brand-black/60 dark:text-brand-white/60 hover:bg-black/5 dark:hover:bg-white/5'
                                    }`}
                                    onClick={() => setOpenDropdown(null)}
                                  >
                                    {subItem.label}
                                  </Link>
                                ))}
                              </div>
                            </Glassmorphism>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Right: Theme Toggle */}
              <div className="ml-auto flex-shrink-0">
                <div style={{ width: '32px', height: '32px' }}>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          ) : (
            /* Compact Layout */
            <div className="flex h-[60px] items-center justify-between">
              {/* Left: Hamburger */}
              <div className="flex-shrink-0">
                <button
                  onClick={toggleMobileMenu}
                  aria-label="Open menu"
                  className="text-brand-black dark:text-brand-white p-1"
                  aria-expanded={isMobileMenuOpen}
                  style={{ width: '32px', height: '32px' }}
                >
                  <HamburgerIcon
                    isOpen={isMobileMenuOpen}
                    className="h-full w-full"
                  />
                </button>
              </div>

              {/* Center: Logo */}
              <div className="flex-shrink-0">
                <Link
                  href="/"
                  className="block transition-opacity hover:opacity-70"
                  onClick={() => isMobileMenuOpen && toggleMobileMenu()}
                >
                  <div className="flex h-[60px] items-center">
                    <Logo size="md" minSize="sm" maxSize="lg" />
                  </div>
                </Link>
              </div>

              {/* Right: Theme Toggle */}
              <div className="flex-shrink-0">
                <div style={{ width: '32px', height: '32px' }}>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          )}
        </div>
      </Glassmorphism>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-4 left-1/2 z-50 w-full max-w-[900px] -translate-x-1/2 transform px-4"
            ref={mobileMenuRef}
          >
            <Glassmorphism className="rounded-[45.5px]">
              <div className="px-12 py-3">
                <div className="mb-4 flex justify-end">
                  <button
                    onClick={toggleMobileMenu}
                    aria-label="Close menu"
                    className="text-brand-black dark:text-brand-white p-2"
                    style={{ width: '40px', height: '40px' }}
                  >
                    <HamburgerIcon isOpen={true} className="h-full w-full" />
                  </button>
                </div>

                <div className="flex flex-col items-center space-y-2 pb-4">
                  {navItems.map(({ href, label, subItems }) =>
                    subItems ? (
                      <div key={href} className="w-full text-center">
                        <button
                          onClick={() =>
                            setOpenMobileSubMenu(
                              openMobileSubMenu === href ? null : href
                            )
                          }
                          className={`w-full px-4 py-3 text-xl font-semibold transition-colors duration-300 ${
                            pathname.startsWith(href)
                              ? 'text-brand-black dark:text-brand-white'
                              : 'text-brand-black/70 hover:text-brand-black dark:text-brand-white/70 dark:hover:text-brand-white'
                          }`}
                        >
                          {label}
                        </button>
                        <AnimatePresence>
                          {openMobileSubMenu === href && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="flex flex-col items-center space-y-2 pt-2">
                                {subItems.map(subItem => (
                                  <Link
                                    key={subItem.href}
                                    href={subItem.href}
                                    onClick={toggleMobileMenu}
                                    className={`px-4 py-2 text-lg font-medium transition-colors duration-300 ${
                                      pathname === subItem.href
                                        ? 'text-brand-black dark:text-brand-white'
                                        : 'text-brand-black/60 hover:text-brand-black dark:text-brand-white/60 dark:hover:text-brand-white'
                                    }`}
                                  >
                                    {subItem.label}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        key={href}
                        href={href}
                        onClick={toggleMobileMenu}
                        className={`px-4 py-3 text-xl font-semibold transition-colors duration-300 ${
                          pathname === href
                            ? 'text-brand-black dark:text-brand-white'
                            : 'text-brand-black/70 hover:text-brand-black dark:text-brand-white/70 dark:hover:text-brand-white'
                        }`}
                      >
                        {label}
                      </Link>
                    )
                  )}
                </div>
              </div>
            </Glassmorphism>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
