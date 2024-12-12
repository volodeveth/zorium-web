'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface SectionTransitionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const SectionTransition = ({ 
  children, 
  delay = 0,
  className = '' 
}: SectionTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          delay,
          ease: [0.61, 1, 0.88, 1],
        },
      }}
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const SectionTransitionList = ({
  children,
  stagger = 0.1,
  className = '',
}: {
  children: React.ReactNode;
  stagger?: number;
  className?: string;
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className={className}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};