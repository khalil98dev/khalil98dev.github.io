import { motion, useMotionValue, useSpring, useVelocity } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Authentic Apple Liquid Glass Cursor.
 * Matches the user-provided geometric arrow with real-time backdrop blur,
 * specular beveled rim reflections, internal glass gleam, and fluid visionOS trailing momentum.
 */
export function AppleCursor() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [hoverType, setHoverType] = useState<'link' | 'card' | 'input' | null>(null);

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Ultra-crisp main cursor spring (buttery glide with zero perceptible lag)
  const cursorX = useSpring(mouseX, { stiffness: 950, damping: 52, mass: 0.15 });
  const cursorY = useSpring(mouseY, { stiffness: 950, damping: 52, mass: 0.15 });

  // Smooth fluid trailing glass aura (visionOS momentum physics)
  const auraX = useSpring(mouseX, { stiffness: 280, damping: 28, mass: 0.35 });
  const auraY = useSpring(mouseY, { stiffness: 280, damping: 28, mass: 0.35 });

  // Velocity-based dynamic tilt
  const velX = useVelocity(mouseX);
  const tilt = useSpring(0, { stiffness: 350, damping: 28 });

  useEffect(() => {
    // Only enable custom cursor for fine pointers (mouse/trackpad), not touch
    const isFine = window.matchMedia('(pointer: fine)').matches;
    if (!isFine) return;

    setMounted(true);
    document.body.classList.add('has-apple-cursor');

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);

      // Subtle dynamic tilt based on horizontal speed (clamped to [-7, 7] deg)
      const vx = velX.get();
      const targetTilt = Math.max(-7, Math.min(7, vx * 0.005));
      tilt.set(targetTilt);

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, select, .btn, .card, .stat, .bento__card, .project, .formation-card, .marquee__item, .chip, .segmented__btn, .contact-dock__badge',
      );

      if (interactive) {
        setHovered(true);
        if (target.closest('input, textarea')) {
          setHoverType('input');
        } else if (target.closest('.card, .bento__card, .project, .formation-card')) {
          setHoverType('card');
        } else {
          setHoverType('link');
        }
      } else {
        setHovered(false);
        setHoverType(null);
      }
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);
    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.body.classList.remove('has-apple-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, visible, velX, tilt]);

  if (!mounted) return null;

  return (
    <div className="apple-cursor-portal" aria-hidden="true">
      {/* SVG ClipPath for real-time backdrop refraction */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="apple-glass-cursor-clip">
            <path d="M 2.5 2.5 L 2.5 25.5 L 9.8 19.2 L 20.2 18.5 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Trailing Liquid Glass Aura (Fluid VisionOS Momentum Disk) */}
      <motion.div
        className={`apple-cursor__aura ${hovered ? 'is-hovered' : ''} ${hoverType ? `is-${hoverType}` : ''}`}
        style={{
          x: auraX,
          y: auraY,
          opacity: visible ? 1 : 0,
        }}
        animate={{
          scale: clicked ? 0.75 : hovered ? 1.55 : 1,
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      />

      {/* Main Apple Liquid Glass Pointer (User-Selected Geometry) */}
      <motion.div
        className={`apple-cursor__pointer ${hovered ? 'is-hovered' : ''}`}
        style={{
          x: cursorX,
          y: cursorY,
          rotate: tilt,
          opacity: visible ? 1 : 0,
        }}
        animate={{
          scale: clicked ? 0.88 : hovered ? 1.12 : 1,
        }}
        transition={{ type: 'spring', stiffness: 600, damping: 30 }}
      >
        <div className="apple-glass-wrapper">
          {/* Glass Refraction Layer (blurs & saturates content underneath) */}
          <div className="apple-glass-backdrop" />

          {/* SVG Glass Shader with Specular Rim & Internal Prism Gleam */}
          <svg
            width="25"
            height="29"
            viewBox="0 0 24 28"
            fill="none"
            className="apple-glass-svg"
          >
            <defs>
              {/* Obsidian Smoked Glass Gradient */}
              <linearGradient id="apple-glass-body" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e1e24" stopOpacity="0.78" />
                <stop offset="48%" stopColor="#121218" stopOpacity="0.86" />
                <stop offset="100%" stopColor="#08080c" stopOpacity="0.94" />
              </linearGradient>

              {/* Specular Light Rim (Apple Beveled Edge) */}
              <linearGradient id="apple-glass-rim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#ffffff" stopOpacity="0.75" />
                <stop offset="70%" stopColor="rgba(255, 255, 255, 0.35)" />
                <stop offset="100%" stopColor="rgba(0, 0, 0, 0.45)" />
              </linearGradient>

              {/* Internal Glass Gleam (Refractive highlight) */}
              <linearGradient id="apple-glass-gleam" x1="0%" y1="0%" x2="70%" y2="70%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Main Liquid Glass Body */}
            <path
              d="M 2.5 2.5 L 2.5 25.5 L 9.8 19.2 L 20.2 18.5 Z"
              fill="url(#apple-glass-body)"
              stroke="url(#apple-glass-rim)"
              strokeWidth="1.35"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Internal Glass Prism Gleam */}
            <path
              d="M 3.8 4.5 L 3.8 22.8 L 9.4 18 L 17.5 17.5"
              stroke="url(#apple-glass-gleam)"
              strokeWidth="0.8"
              fill="none"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
