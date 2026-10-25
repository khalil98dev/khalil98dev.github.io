import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import type { Formation } from '@/types';
import { Icon } from './Icon';
import { formatDate } from '@/utils/format';
import { TiltCard } from './MotionPrimitives';

/** Full-screen certificate lightbox with 3D interactive preview, download & verification links. */
export function CertificateViewer({ formation, onClose }: { formation: Formation | null; onClose: () => void }) {
  useEffect(() => {
    if (!formation) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [formation, onClose]);

  return (
    <AnimatePresence>
      {formation?.certificate && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Certificate — ${formation.title}`}
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(18px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
        >
          <motion.div
            className="lightbox__panel"
            initial={{ opacity: 0, y: 48, scale: 0.92, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 32, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              className="icon-btn lightbox__close"
              onClick={onClose}
              aria-label="Close"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.92 }}
            >
              <Icon name="close" />
            </motion.button>
            <TiltCard intensity={3} spotlight={false} className="lightbox__image">
              <img src={formation.certificate.image} alt={`Certificate of completion — ${formation.title}`} />
            </TiltCard>
            <motion.div
              className="lightbox__meta"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.4 }}
            >
              <div>
                <div className="eyebrow">{formation.provider}</div>
                <h3 className="lightbox__title">{formation.title}</h3>
                <p className="muted small">
                  Issued {formatDate(formation.certificate.issuedDate)} · Serial <code>{formation.certificate.serialNumber}</code>
                </p>
              </div>
              <div className="lightbox__actions">
                <a className="btn btn--ghost btn--sm" href={formation.certificate.verifyUrl} target="_blank" rel="noreferrer">
                  Verify <Icon name="arrowUpRight" size={16} />
                </a>
                <a className="btn btn--primary btn--sm" href={formation.certificate.pdf} download>
                  <Icon name="download" size={16} /> Download PDF
                </a>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
