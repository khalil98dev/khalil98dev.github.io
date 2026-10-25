import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useData } from '@/services/DataProvider';
import { Page } from '@/components/Page';
import { Reveal, ease, item, stagger } from '@/components/Reveal';
import { Icon } from '@/components/Icon';
import { CertificateViewer } from '@/components/CertificateViewer';
import { TiltCard } from '@/components/MotionPrimitives';
import { formatDate } from '@/utils/format';
import NotFound from './NotFound';

export default function FormationDetail() {
  const { slug } = useParams();
  const { formations, loading } = useData();
  const [open, setOpen] = useState(false);

  const all = formations?.formations ?? [];
  const index = all.findIndex((f) => f.slug === slug);
  const f = all[index];
  const prev = index > 0 ? all[index - 1] : null;
  const next = index >= 0 && index < all.length - 1 ? all[index + 1] : null;
  const category = formations?.categories.find((c) => c.id === f?.category)?.label;
  const topSections = useMemo(() => (f ? f.curriculum.filter((s) => s.lectures > 0).slice(0, 12) : []), [f]);

  if (loading) return null;
  if (!f) return <NotFound />;

  const showTagline = f.tagline && !f.tagline.toLowerCase().includes(f.title.toLowerCase().slice(0, 12));

  return (
    <Page key={f.slug}>
      <section className="detail-hero">
        <div className="detail-hero__bg" style={{ backgroundImage: `url(${f.cover})` }} aria-hidden="true" />
        <div className="container">
          <Reveal>
            <Link to="/certifications" className="back-link">
              <Icon name="arrowLeft" size={16} /> All certifications
            </Link>
          </Reveal>
          <div className="detail-hero__grid">
            <Reveal>
              <div className="eyebrow">
                {f.number ? `Course ${String(f.number).padStart(2, '0')} · ` : ''}
                {category}
              </div>
              <h1 className="h1">{f.title}</h1>
              {showTagline && <p className="lead lead--strong">{f.tagline}</p>}
              <p className="lead">{f.about}</p>
              <div className="detail-hero__facts">
                <span>
                  <Icon name="book" size={16} /> {f.sections} sections · {f.lectures} lessons
                </span>
                <span>
                  <Icon name="award" size={16} /> {f.provider}
                </span>
                <span>
                  <Icon name="sparkle" size={16} /> {f.instructor}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              {f.certificate ? (
                <TiltCard intensity={5} spotlight={false}>
                  <button className="cert-frame" onClick={() => setOpen(true)}>
                    <img src={f.certificate.image} alt={`Certificate — ${f.title}`} />
                    <span className="cert-frame__hint">
                      <Icon name="search" size={14} /> Click to enlarge
                    </span>
                  </button>
                </TiltCard>
              ) : (
                <div className="cert-frame cert-frame--pending">
                  <img src={f.cover} alt="" />
                  <div className="cert-frame__overlay">
                    <Icon name="clock" size={28} />
                    <strong>In progress · {f.progress}%</strong>
                  </div>
                </div>
              )}
              {f.certificate && (
                <div className="cert-meta">
                  <div>
                    <div className="small muted">Issued</div>
                    <div className="cert-meta__v">{formatDate(f.certificate.issuedDate, { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  </div>
                  <div>
                    <div className="small muted">Serial No.</div>
                    <div className="cert-meta__v">
                      <code>{f.certificate.serialNumber}</code>
                    </div>
                  </div>
                  <div className="cert-meta__actions">
                    <a className="btn btn--ghost btn--sm" href={f.certificate.verifyUrl} target="_blank" rel="noreferrer">
                      Verify <Icon name="arrowUpRight" size={14} />
                    </a>
                    <a className="btn btn--primary btn--sm" href={f.certificate.pdf} download>
                      <Icon name="download" size={14} /> PDF
                    </a>
                  </div>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container detail-cols">
          {f.skills.length > 0 && (
            <div>
              <Reveal>
                <h2 className="h3">What I learned</h2>
              </Reveal>
              <motion.ul className="checklist checklist--cards" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
                {f.skills.map((s) => (
                  <motion.li key={s} variants={item}>
                    <Icon name="check" size={18} />
                    <span>{s}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          )}

          <div>
            {f.verified.length > 0 && (
              <Reveal className="panel">
                <h2 className="h4">
                  <Icon name="shield" size={18} /> Verified competencies
                </h2>
                <ul className="bullets bullets--sm">
                  {f.verified.map((v) => (
                    <li key={v}>{v}</li>
                  ))}
                </ul>
              </Reveal>
            )}

            {topSections.length > 0 && (
              <Reveal className="panel" delay={0.08}>
                <h2 className="h4">
                  <Icon name="book" size={18} /> Curriculum highlights
                </h2>
                <ol className="curriculum">
                  {topSections.map((s, i) => (
                    <motion.li key={`${s.title}-${i}`} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, ease, delay: i * 0.03 }}>
                      <span className="curriculum__title" dir="auto">
                        {s.title}
                      </span>
                      <span className="muted small">{s.lectures}</span>
                    </motion.li>
                  ))}
                </ol>
                {f.curriculum.length > topSections.length && <p className="small muted">+ {f.curriculum.length - topSections.length} more sections</p>}
                <a className="link-btn mt-sm" href={f.courseUrl} target="_blank" rel="noreferrer">
                  Course page <Icon name="arrowUpRight" size={14} />
                </a>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container pager">
          {prev ? (
            <Link to={`/certifications/${prev.slug}`} className="pager__link">
              <span className="small muted">
                <Icon name="arrowLeft" size={14} /> Previous
              </span>
              <span className="pager__title">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={`/certifications/${next.slug}`} className="pager__link pager__link--next">
              <span className="small muted">
                Next <Icon name="arrowRight" size={14} />
              </span>
              <span className="pager__title">{next.title}</span>
            </Link>
          )}
        </div>
      </section>

      <CertificateViewer formation={open ? f : null} onClose={() => setOpen(false)} />
    </Page>
  );
}
