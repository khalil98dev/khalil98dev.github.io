import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useData } from '@/services/DataProvider';
import { Page } from '@/components/Page';
import { Reveal, ease } from '@/components/Reveal';
import { Icon } from '@/components/Icon';
import { FormationCard } from '@/components/FormationCard';
import { CertificateViewer } from '@/components/CertificateViewer';
import { Counter } from '@/components/Counter';
import { TiltCard } from '@/components/MotionPrimitives';
import type { Formation } from '@/types';

type Status = 'all' | 'certified' | 'progress';
type Sort = 'roadmap' | 'recent';

export default function Certifications() {
  const { formations } = useData();
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState<Status>('all');
  const [sort, setSort] = useState<Sort>('roadmap');
  const [query, setQuery] = useState('');
  const [preview, setPreview] = useState<Formation | null>(null);

  const all = formations?.formations ?? [];
  const categories = [{ id: 'all', label: 'All' }, ...(formations?.categories ?? [])];
  const catLabel = (id: string) => formations?.categories.find((c) => c.id === id)?.label;

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = all.filter((f) => {
      if (category !== 'all' && f.category !== category) return false;
      if (status === 'certified' && !f.certificate) return false;
      if (status === 'progress' && f.certificate) return false;
      if (q && !`${f.title} ${f.shortDescription} ${f.skills.join(' ')}`.toLowerCase().includes(q)) return false;
      return true;
    });
    if (sort === 'recent') {
      return [...filtered].sort((a, b) => (b.certificate?.issuedDate ?? '0').localeCompare(a.certificate?.issuedDate ?? '0'));
    }
    return filtered;
  }, [all, category, status, sort, query]);

  const certifiedCount = all.filter((f) => f.certificate).length;
  const totalLectures = all.filter((f) => f.certificate).reduce((n, f) => n + f.lectures, 0);

  return (
    <Page>
      <section className="page-hero">
        <div className="container">
          <Reveal>
            <div className="eyebrow">Certifications & Formations</div>
            <h1 className="display">
              Always learning.
              <br />
              <span className="text-gradient">Verified at every step.</span>
            </h1>
            <p className="lead">
              Every course completed along a structured software-engineering roadmap — each with an official, verifiable certificate.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="stats stats--compact">
            <TiltCard intensity={5} className="stat">
              <div className="stat__value">
                <Counter value={String(certifiedCount)} />
              </div>
              <div className="stat__label">Certificates earned</div>
            </TiltCard>
            <TiltCard intensity={5} className="stat">
              <div className="stat__value">
                <Counter value={`${totalLectures}+`} />
              </div>
              <div className="stat__label">Lessons completed</div>
            </TiltCard>
            <TiltCard intensity={5} className="stat">
              <div className="stat__value">
                <Counter value={String(all.length - certifiedCount)} />
              </div>
              <div className="stat__label">In progress</div>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      <section className="section section--flush">
        <div className="container">
          <div className="toolbar">
            <LayoutGroup id="cats">
              <div className="segmented" role="tablist" aria-label="Category">
                {categories.map((c) => (
                  <button key={c.id} role="tab" aria-selected={category === c.id} className={`segmented__btn ${category === c.id ? 'is-active' : ''}`} onClick={() => setCategory(c.id)}>
                    {category === c.id && <motion.span layoutId="seg-pill" className="segmented__pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                    <span className="segmented__label">{c.label}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>

            <div className="toolbar__row">
              <label className="search">
                <Icon name="search" size={18} />
                <input type="search" placeholder="Search courses or skills…" value={query} onChange={(e) => setQuery(e.target.value)} />
              </label>
              <select className="select" value={status} onChange={(e) => setStatus(e.target.value as Status)} aria-label="Status">
                <option value="all">All statuses</option>
                <option value="certified">Certified</option>
                <option value="progress">In progress</option>
              </select>
              <select className="select" value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort">
                <option value="roadmap">Roadmap order</option>
                <option value="recent">Most recent</option>
              </select>
            </div>
          </div>

          <motion.p className="small muted results" key={list.length} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease }}>
            {list.length} {list.length === 1 ? 'course' : 'courses'}
          </motion.p>

          <motion.div layout className="grid-cards">
            <AnimatePresence mode="popLayout">
              {list.map((f) => (
                <FormationCard key={f.id} formation={f} categoryLabel={catLabel(f.category)} onPreview={setPreview} />
              ))}
            </AnimatePresence>
          </motion.div>

          {!list.length && (
            <div className="empty">
              <Icon name="search" size={28} />
              <p>No courses match your filters.</p>
            </div>
          )}
        </div>
      </section>

      <CertificateViewer formation={preview} onClose={() => setPreview(null)} />
    </Page>
  );
}
