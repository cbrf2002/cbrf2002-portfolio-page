'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navigation from './navigation';
import InteractiveBackground from './interactive-background';
import CustomCursor from './custom-cursor';

// Define the order of pages for swipe navigation
const swipeNavPages = ['/', '/works', '/skills', '/resume', '/about'];

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: {
      offset: { x: number; y: number };
      velocity: { x: number; y: number };
    }
  ) => {
    const threshold = 75; // Increased threshold for page swipe
    const currentPathIndex = swipeNavPages.indexOf(pathname || '');

    if (currentPathIndex === -1) return; // Current path not in swipeable list

    let newIndex = currentPathIndex;
    if (info.offset.x > threshold && info.velocity.x > 200) {
      // Swipe Right
      newIndex = Math.max(0, currentPathIndex - 1);
    } else if (info.offset.x < -threshold && info.velocity.x < -200) {
      // Swipe Left
      newIndex = Math.min(swipeNavPages.length - 1, currentPathIndex + 1);
    }

    if (newIndex !== currentPathIndex) {
      router.push(swipeNavPages[newIndex]);
    }
  };

  return (
    <>
      <InteractiveBackground />
      <motion.main
        className="relative z-10 min-w-[280px]"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1} // Allow some elastic bounce
        onDragEnd={handleDragEnd}
        style={{ touchAction: 'pan-y' } as React.CSSProperties}
      >
        {children}
      </motion.main>
      <Navigation />
      <CustomCursor />
    </>
  );
}
