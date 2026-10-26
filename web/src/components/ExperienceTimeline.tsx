import { motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef, type MouseEvent } from 'react';
import { ease } from './Reveal';
import type { Experience } from '@/types';

/**
 * Scroll-driven "magical" experience timeline.
 * - A glowing gradient beam fills as you scroll, led by a luminous comet head.
 * - Each milestone ignites (ring burst + glow) the moment the beam reaches it.
 * - Content glides in with blur-to-sharp, bullets cascade in sequence.
 * - Project cards carry a cursor-following spotlight and a gradient edge on hover.
 */
export function ExperienceTimeline({ items }: { items: Experience[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.5 });
  const cometTop = useTransform(progress, [0, 1], ['0%', '100%']);
  const cometOpacity = useTransform(progress, [0, 0.02, 0.98, 1], [0, 1, 1, 0.6]);

  return (
    <ol className="timeline" ref={ref}>
      <div className="timeline__track" aria-hidden="true">
        <motion.span className="timeline__beam" style={{ scaleY: progress }} />
        <motion.span className="timeline__comet" style={{ top: cometTop, opacity: cometOpacity }} />
      </div>
      {items.map((e, i) => (
        <TimelineItem key={e.id} exp={e} index={i} />
      ))}
    </ol>
  );
}

function TimelineItem({ exp, index }: { exp: Experience; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  // "Reached" once the item's top crosses ~60% of the viewport — in sync with the beam.
  const reached = useInView(ref, { once: true, margin: '0px 0px -40% 0px' });

  return (
    <li ref={ref} className={`timeline__item ${reached ? 'is-reached' : ''}`}>
      <div className="timeline__rail">
        <span className={`timeline__dot ${exp.current ? 'is-live' : ''}`}>
          <span className="timeline__dot-core" />
          {reached && <span className="timeline__dot-burst" />}
        </span>
      </div>

      <motion.div
        className="timeline__content"
        initial={{ opacity: 0, x: 36, filter: 'blur(10px)' }}
        animate={reached ? { opacity: 1, x: 0, filter: 'blur(0px)' } : undefined}
        transition={{ duration: 0.9, ease, delay: 0.05 }}
      >
        <div className="timeline__head">
          <div>
            <motion.div
              className="timeline__index"
              initial={{ opacity: 0, y: 6 }}
              animate={reached ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, ease, delay: 0.1 }}
            >
              {String(index + 1).padStart(2, '0')}
            </motion.div>
            <h3 className="h3">{exp.role}</h3>
            <div className="timeline__company">{exp.company}</div>
          </div>
          <span className={`pill ${exp.current ? 'pill--live' : ''}`}>
            {exp.current && <span className="live-dot" />} {exp.period}
          </span>
        </div>

        {exp.projects.map((p, pi) => (
          <SpotlightCard key={p.name} delay={0.2 + pi * 0.12} reached={reached}>
            <div className="timeline__project-name">{p.name}</div>
            <ul className="bullets">
              {p.points.map((pt, bi) => (
                <motion.li
                  key={pt}
                  initial={{ opacity: 0, x: 14 }}
                  animate={reached ? { opacity: 1, x: 0 } : undefined}
                  transition={{ duration: 0.55, ease, delay: 0.35 + pi * 0.12 + bi * 0.07 }}
                >
                  {pt}
                </motion.li>
              ))}
            </ul>
          </SpotlightCard>
        ))}
      </motion.div>
    </li>
  );
}

function SpotlightCard({ children, delay, reached }: { children: React.ReactNode; delay: number; reached: boolean }) {
  function onMove(e: MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  }
  return (
    <motion.div
      className="timeline__project"
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      animate={reached ? { opacity: 1, y: 0, scale: 1 } : undefined}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.7, ease, delay }}
    >
      <span className="timeline__spot" aria-hidden="true" />
      <div className="timeline__project-body">{children}</div>
    </motion.div>
  );
}
