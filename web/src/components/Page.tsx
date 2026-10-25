import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { ease } from './Reveal';

/** Route-level enter/exit transition with Apple-style blur-fade & lift. */
export function Page({ children }: { children: ReactNode }) {
  return (
    <motion.main
      className="page-transition"
      initial={{ opacity: 0, y: 18, filter: 'blur(8px)', scale: 0.992 }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
      exit={{ opacity: 0, y: -12, filter: 'blur(6px)', scale: 0.995 }}
      transition={{ duration: 0.55, ease }}
    >
      {children}
    </motion.main>
  );
}
