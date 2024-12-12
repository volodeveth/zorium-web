import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedProps {
  children: React.ReactNode;
  type?: 'fade' | 'slide' | 'scale' | 'none';
  delay?: number;
  className?: string;
}

export const Animated = ({ 
  children, 
  type = 'fade', 
  delay = 0,
  className = '' 
}: AnimatedProps) => {
  const animations = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
    },
    none: {
      initial: {},
      animate: {},
      exit: {},
    },
  };

  return (
    <motion.div
      initial={animations[type].initial}
      animate={animations[type].animate}
      exit={animations[type].exit}
      transition={{ duration: 0.3, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedList = ({ 
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={className}>
      <AnimatePresence>
        {React.Children.map(children, (child, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            {child}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};