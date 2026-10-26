import { useMotionPreference } from '../lib/use-motion-preference';
import { useState, type ReactNode } from 'react';
import { motion } from 'motion/react';

/** Authored Motion wrapper. Content remains visible before observation/hydration. */
export interface AnimatedContentProps {
  children: ReactNode;
  className?: string;
  distance?: number;
  duration?: number;
}
export default function AnimatedContent({ children, className, distance = 8, duration = 0.5 }: AnimatedContentProps) {
  const reduced = useMotionPreference();
  const [entered, setEntered] = useState(false);
  return <motion.div className={className} initial={false}
    animate={{ y: reduced || entered ? 0 : Math.min(12, Math.max(0, distance)) }}
    onViewportEnter={() => setEntered(true)} viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: reduced ? 0 : Math.min(0.7, Math.max(0, duration)), ease: [0.25, 0.46, 0.45, 0.94] }}>
    {children}
  </motion.div>;
}
