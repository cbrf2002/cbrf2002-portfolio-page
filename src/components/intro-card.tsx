'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import Glassmorphism from './glassmorphism';

export default function IntroCard() {
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: '/images/socials/linkedin.svg',
      iconDark: '/images/socials/linkedin-dark.svg',
      href: '#',
    },
    {
      name: 'GitHub',
      icon: '/images/socials/github.svg',
      iconDark: '/images/socials/github-dark.svg',
      href: '#',
    },
    {
      name: 'Facebook',
      icon: '/images/socials/facebook.svg',
      iconDark: '/images/socials/facebook-dark.svg',
      href: '#',
    },
    {
      name: 'Instagram',
      icon: '/images/socials/instagram.svg',
      iconDark: '/images/socials/instagram-dark.svg',
      href: '#',
    },
    {
      name: 'Email',
      icon: '/images/socials/email.svg',
      iconDark: '/images/socials/email-dark.svg',
      href: 'mailto:',
    },
  ];

  return (
    <Glassmorphism className="w-full rounded-[45.5px]">
      <div className="px-10 py-7.5">
        {/* Main Content Layout */}
        <div
          className={`flex ${isMobile ? 'flex-col items-center space-y-6' : 'flex-row items-center justify-between'}`}
        >
          {/* Text Content */}
          <div
            className={`flex flex-col ${isMobile ? 'text-center' : 'flex-1'}`}
          >
            <div className={`${isMobile ? 'space-y-6' : 'space-y-8'}`}>
              <h1 className="text-brand-black dark:text-brand-white font-inter text-4xl font-semibold">
                I&apos;m Charles
              </h1>
              <p className="text-brand-black dark:text-brand-white font-inter text-lg font-normal">
                A developer, photographer, and a 3d artist. I specialize in
                Full-Stack Mobile Application Development (Android/iOS), Web
                Development, and UI/UX Design.
              </p>
            </div>
          </div>

          {/* Profile Photo */}
          <div className={`${isMobile ? 'order-first' : 'ml-8'}`}>
            <Glassmorphism
              className="flex h-32 w-32 items-center justify-center rounded-full"
              frost={8}
            >
              <div className="h-28 w-28 overflow-hidden rounded-full">
                <Image
                  src="/images/profile/aprofile.jpg"
                  alt="Charles Profile"
                  width={112}
                  height={112}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            </Glassmorphism>
          </div>
        </div>

        {/* Connect Section */}
        <div
          className={`mt-8 flex ${isMobile ? 'flex-col items-center space-y-4' : 'flex-row items-center space-x-6'}`}
        >
          {/* Let's Connect Button */}
          <Glassmorphism
            className="rounded-full"
            backgroundColor={{
              color: '0064F4',
              opacity: 20,
            }}
          >
            <motion.button
              className="text-brand-black dark:text-brand-white font-inter px-6 py-3 font-medium"
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 1.1,
                opacity: 0.8,
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 17,
              }}
            >
              Let&apos;s Connect!
            </motion.button>
          </Glassmorphism>

          {/* Social Links */}
          <div className="flex space-x-4">
            {socialLinks.map(social => (
              <Glassmorphism
                key={social.name}
                className="flex h-12 w-12 items-center justify-center rounded-full"
                frost={8}
              >
                <motion.a
                  href={social.href}
                  className="flex h-8 w-8 items-center justify-center"
                  aria-label={social.name}
                  whileHover={{
                    scale: 1.1,
                  }}
                  whileTap={{
                    scale: 1.15,
                    opacity: 0.8,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 17,
                  }}
                >
                  {mounted && (
                    <Image
                      src={theme === 'dark' ? social.iconDark : social.icon}
                      alt={social.name}
                      width={32}
                      height={32}
                      className="h-full w-full"
                    />
                  )}
                </motion.a>
              </Glassmorphism>
            ))}
          </div>
        </div>
      </div>
    </Glassmorphism>
  );
}
