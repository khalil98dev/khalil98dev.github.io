import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'framer-motion';
import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { FloatingContactBadge } from '@/components/ContactWidget';
import { AppleCursor } from '@/components/AppleCursor';
import { SmoothScrollProvider, useLenis } from '@/components/SmoothScroll';
import { useData } from '@/services/DataProvider';
import Home from '@/pages/Home';

const Certifications = lazy(() => import('@/pages/Certifications'));
const FormationDetail = lazy(() => import('@/pages/FormationDetail'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function ScrollManager() {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => {
        const dest = document.querySelector(hash);
        if (dest) {
          if (lenis) {
            lenis.scrollTo(dest as HTMLElement, { offset: -76, duration: 1.25 });
          } else {
            dest.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 120);
      return () => clearTimeout(t);
    }
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [pathname, hash, lenis]);

  return null;
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return <motion.div className="scroll-progress" style={{ scaleX }} />;
}

export default function App() {
  const location = useLocation();
  const { loading, error } = useData();

  return (
    <SmoothScrollProvider>
      <MotionConfig reducedMotion="user">
        <AppleCursor />
        <ScrollProgress />
        <Nav />
        <ScrollManager />
        {error && <div className="container error">Couldn’t load content: {error.message}</div>}
        {!loading && (
          <Suspense fallback={<div className="page-loading" />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/certifications" element={<Certifications />} />
                <Route path="/certifications/:slug" element={<FormationDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        )}
        <FloatingContactBadge />
        <Footer />
      </MotionConfig>
    </SmoothScrollProvider>
  );
}
