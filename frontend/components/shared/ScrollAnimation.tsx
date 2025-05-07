'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface ScrollAnimationProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export function ScrollAnimation({ 
  children, 
  direction = 'up', 
  delay = 0,
  className = '' 
}: ScrollAnimationProps) {
  const ref = useRef(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(true);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const isInView = useInView(ref, { margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      setHasBeenVisible(true);
    }
  }, [isInView]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrollingDown(currentScrollY > lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const directions = {
    up: { y: 100, x: 0, opacity: 0 },
    down: { y: -100, x: 0, opacity: 0 },
    left: { x: 100, y: 0, opacity: 0 },
    right: { x: -100, y: 0, opacity: 0 }
  };

  const shouldAnimate = isInView || hasBeenVisible;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={directions[direction]}
      animate={{
        x: shouldAnimate ? 0 : directions[direction].x,
        y: shouldAnimate ? 0 : directions[direction].y,
        opacity: shouldAnimate ? 1 : 0,
      }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.17, 0.55, 0.55, 1]
      }}
    >
      {children}
    </motion.div>
  );
}
