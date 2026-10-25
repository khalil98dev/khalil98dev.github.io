import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

export const ease = [0.22, 1, 0.36, 1] as const; // Apple-like "ease-out-expo"

const variants: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease, delay },
  }),
};

/** Fades + lifts content into view once as it enters the viewport. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'header' | 'article';
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      custom={delay}
    >
      {children}
    </Comp>
  );
}

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

export const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};
