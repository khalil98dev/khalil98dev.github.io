import { AnimatePresence, LayoutGroup, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from './Icon';
import { Magnetic } from './MotionPrimitives';
import { useTheme } from '@/hooks/useTheme';

const links = [
  { id: 'overview', to: '/', label: 'Overview', hash: '' },
  { id: 'skills', to: '/#skills', label: 'Skills', hash: '#skills' },
  { id: 'experience', to: '/#experience', label: 'Experience', hash: '#experience' },
  { id: 'projects', to: '/#projects', label: 'Work', hash: '#projects' },
  { id: 'certifications', to: '/certifications', label: 'Certifications', hash: '' },
  { id: 'contact', to: '/#contact', label: 'Contact', hash: '#contact' },
];

export function Nav() {
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const { theme, toggle } = useTheme();
  const location = useLocation();

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 12));
  useEffect(() => setOpen(false), [location.pathname, location.hash]);

  // Spy on home page sections so the floating pill glides automatically on scroll
  useEffect(() => {
    if (location.pathname.startsWith('/certifications')) {
      setActiveSection('certifications');
      return;
    }
    const sectionIds = ['skills', 'experience', 'projects', 'certifications', 'contact'];
    const onScroll = () => {
      if (window.scrollY < 260) {
        setActiveSection('overview');
        return;
      }
      const mid = window.scrollY + window.innerHeight * 0.35;
      let current = 'overview';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= mid) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  const activePillId = hovered ?? activeSection;

  return (
    <motion.header
      className={`nav ${scrolled || open ? 'nav--solid' : ''}`}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="nav__inner container">
        <Link to="/" className="nav__brand" aria-label="Home">
          <motion.span className="nav__avatar" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}>
            <img src="/content/profile/profile-sm.webp" alt="Khalil Bachir" />
            <span className="nav__avatar-dot" aria-hidden="true" />
          </motion.span>
          <span className="nav__name">Khalil Bachir</span>
        </Link>

        <LayoutGroup id="primary-nav">
          <nav className="nav__links" aria-label="Primary" onMouseLeave={() => setHovered(null)}>
            {links.map((l) => {
              const isActive = activeSection === l.id;
              const showPill = activePillId === l.id;
              return (
                <Link
                  key={l.id}
                  to={l.to}
                  className={`nav__link ${isActive ? 'is-active' : ''}`}
                  onMouseEnter={() => setHovered(l.id)}
                >
                  {showPill && (
                    <motion.span
                      layoutId="nav-pill"
                      className="nav__pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="nav__link-text">{l.label}</span>
                </Link>
              );
            })}
          </nav>
        </LayoutGroup>

        <div className="nav__actions">
          <motion.button
            className="icon-btn"
            onClick={toggle}
            aria-label="Toggle color theme"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.25 }}
                style={{ display: 'grid' }}
              >
                <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
              </motion.span>
            </AnimatePresence>
          </motion.button>
          <Magnetic strength={0.22}>
            <a className="btn btn--primary btn--sm nav__cta" href="mailto:khalilbachir98@outlook.com">
              Hire me
            </a>
          </Magnetic>
          <button className="icon-btn nav__burger" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
            <Icon name={open ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="nav__mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {links.map((l, i) => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ delay: 0.04 * i }}
              >
                <Link to={l.to} className="nav__mobile-link">
                  {l.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
      <motion.div className="nav__scroll-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
    </motion.header>
  );
}
