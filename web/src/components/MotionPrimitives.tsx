import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from 'framer-motion';
import { useRef, type MouseEvent, type ReactNode } from 'react';
import { ease } from './Reveal';

/**
 * Interactive 3D tilt + cursor-following radial spotlight card.
 * Inspired by Apple tvOS / visionOS glass hover physics.
 */
export function TiltCard({
  children,
  className = '',
  intensity = 6,
  spotlight = true,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
  spotlight?: boolean;
} & Omit<HTMLMotionProps<'div'>, 'children'>) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const hovered = useMotionValue(0);

  const springConfig = { stiffness: 260, damping: 24, mass: 0.6 };
  const sx = useSpring(px, springConfig);
  const sy = useSpring(py, springConfig);
  const glowOpacity = useSpring(hovered, { stiffness: 220, damping: 26 });

  const rotateX = useTransform(sy, [0, 1], [intensity, -intensity]);
  const rotateY = useTransform(sx, [0, 1], [-intensity, intensity]);
  const spotlightBg = useMotionTemplate`radial-gradient(420px circle at ${mouseX}px ${mouseY}px, var(--spotlight-color, rgba(0, 113, 227, 0.13)), transparent 75%)`;

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
    px.set(Math.min(1, Math.max(0, x / rect.width)));
    py.set(Math.min(1, Math.max(0, y / rect.height)));
    hovered.set(1);
  }

  function handleLeave() {
    px.set(0.5);
    py.set(0.5);
    hovered.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.35, ease }}
      {...rest}
    >
      {spotlight && (
        <motion.span
          className="tilt-card__spotlight"
          aria-hidden="true"
          style={{ background: spotlightBg, opacity: glowOpacity }}
        />
      )}
      {children}
    </motion.div>
  );
}

/**
 * Magnetic wrapper that gently pulls buttons/links toward the pointer.
 */
export function Magnetic({
  children,
  strength = 0.28,
  className = '',
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  function onMove(e: MouseEvent<HTMLSpanElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      className={`magnetic ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy, display: 'inline-flex' }}
    >
      {children}
    </motion.span>
  );
}

/**
 * Apple-style staggered word-by-word blur-in reveal on scroll.
 */
export function TextReveal({
  text,
  className = '',
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(' ');
  return (
    <motion.span
      className={`text-reveal ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.035, delayChildren: delay } },
      }}
    >
      {words.map((word, idx) => (
        <motion.span
          key={`${word}-${idx}`}
          className="text-reveal__word"
          variants={{
            hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
            show: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.65, ease },
            },
          }}
        >
          {word}{' '}
        </motion.span>
      ))}
    </motion.span>
  );
}
