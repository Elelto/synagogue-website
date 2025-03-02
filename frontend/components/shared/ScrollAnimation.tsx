'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

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
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const directions = {
    up: { y: 100, x: 0, opacity: 0 },
    down: { y: -100, x: 0, opacity: 0 },
    left: { x: 100, y: 0, opacity: 0 },
    right: { x: -100, y: 0, opacity: 0 }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={directions[direction]}
      animate={{
        x: isInView ? 0 : directions[direction].x,
        y: isInView ? 0 : directions[direction].y,
        opacity: isInView ? 1 : 0,
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
