import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Formation } from '@/types';
import { Icon } from './Icon';
import { formatDate } from '@/utils/format';
import { ease } from './Reveal';
import { TiltCard } from './MotionPrimitives';

export function FormationCard({
  formation,
  categoryLabel,
  onPreview,
}: {
  formation: Formation;
  categoryLabel?: string;
  onPreview?: (f: Formation) => void;
}) {
  const certified = Boolean(formation.certificate);
  return (
    <TiltCard
      layout
      intensity={5}
      className="fcard"
      initial={{ opacity: 0, scale: 0.94, y: 22, filter: 'blur(6px)' }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.94, y: 12, filter: 'blur(4px)' }}
      transition={{ duration: 0.5, ease }}
    >
      <Link to={`/certifications/${formation.slug}`} className="fcard__link" aria-label={formation.title}>
        <div className="fcard__media">
          <img src={formation.cover} alt="" loading="lazy" />
          <div className="fcard__scrim" />
          {formation.number && <span className="fcard__num">{String(formation.number).padStart(2, '0')}</span>}
          {certified && (
            <span className="fcard__verified-pill" title="Verified Certificate">
              <Icon name="award" size={13} /> Certified
            </span>
          )}
        </div>
        <div className="fcard__body">
          <div className="fcard__eyebrow">
            {categoryLabel && <span>{categoryLabel}</span>}
            <span className="dot" />
            <span>{formation.lectures} lessons</span>
          </div>
          <h3 className="fcard__title">{formation.title}</h3>
          <p className="fcard__desc">{formation.shortDescription}</p>
        </div>
      </Link>
      <div className="fcard__footer">
        {certified ? (
          <>
            <span className="badge badge--ok">
              <Icon name="check" size={14} /> {formatDate(formation.certificate!.issuedDate)}
            </span>
            {onPreview && (
              <motion.button
                className="link-btn fcard__preview-btn"
                onClick={() => onPreview(formation)}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.96 }}
              >
                View certificate <Icon name="arrowRight" size={14} />
              </motion.button>
            )}
          </>
        ) : (
          <div className="progress" aria-label={`${formation.progress}% complete`}>
            <div className="progress__track">
              <motion.div
                className="progress__bar"
                initial={{ width: 0 }}
                whileInView={{ width: `${formation.progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease }}
              />
            </div>
            <span className="small muted">In progress · {formation.progress}%</span>
          </div>
        )}
      </div>
    </TiltCard>
  );
}
