import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { useMemo, useRef, useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '@/services/DataProvider';
import { Page } from '@/components/Page';
import { Reveal, ease, item, stagger } from '@/components/Reveal';
import { SectionHeader } from '@/components/SectionHeader';
import { Icon } from '@/components/Icon';
import { Counter } from '@/components/Counter';
import { FormationCard } from '@/components/FormationCard';
import { CertificateViewer } from '@/components/CertificateViewer';
import { ContactSectionCard } from '@/components/ContactWidget';
import { FloatingCodeStreams } from '@/components/FloatingCodeStreams';
import { Magnetic, TiltCard } from '@/components/MotionPrimitives';
import { ExperienceTimeline } from '@/components/ExperienceTimeline';
import type { Formation } from '@/types';

export default function Home() {
  const { resume, formations } = useData();
  const [preview, setPreview] = useState<Formation | null>(null);

  const certified = useMemo(
    () =>
      (formations?.formations ?? [])
        .filter((f) => f.certificate)
        .sort((a, b) => b.certificate!.issuedDate.localeCompare(a.certificate!.issuedDate)),
    [formations],
  );
  const catLabel = (id: string) => formations?.categories.find((c) => c.id === id)?.label;

  const [projectCategory, setProjectCategory] = useState<'all' | 'backend' | 'desktop'>('all');

  if (!resume) return null;
  const { profile, programmingLanguages = [], tools = [], skills, experience, projects = [], education, languages, training, foundation } = resume;

  const filteredProjects = projects.filter((p) => {
    if (projectCategory === 'all') return true;
    if (projectCategory === 'backend') {
      return p.stack.some((s) => /asp\.net|postgres|clean architecture|signalr|cloud/i.test(s));
    }
    if (projectCategory === 'desktop') {
      return p.stack.some((s) => /wpf|desktop|sql server/i.test(s));
    }
    return true;
  });

  return (
    <Page>
      <Hero
        name={profile.name}
        role={profile.role}
        headline={profile.headline}
        location={profile.location}
        availability={profile.availability}
        avatar={profile.avatar}
      />

      {/* Stats */}
      <section className="section section--tight">
        <motion.div className="container stats" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {profile.stats.map((s) => (
            <TiltCard key={s.label} className="stat" intensity={5} variants={item}>
              <div className="stat__value">
                <Counter value={s.value} />
              </div>
              <div className="stat__label">{s.label}</div>
            </TiltCard>
          ))}
        </motion.div>
      </section>

      {/* About */}
      <section className="section" id="about">
        <div className="container about">
          <SectionHeader eyebrow="About" title={<>Clean architecture.<br />Reliable systems.</>} />
          <div className="about__body">
            {profile.summary.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className={i === 0 ? 'lead lead--strong' : 'lead'}>{p}</p>
              </Reveal>
            ))}
            <Reveal delay={0.2}>
              <motion.ul className="checklist" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
                {foundation.map((f) => (
                  <motion.li key={f} variants={item} whileHover={{ x: 6 }} transition={{ duration: 0.25, ease }}>
                    <Icon name="check" size={18} />
                    <span>{f}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Skills & Programming Languages */}
      <section className="section section--alt" id="skills">
        <div className="container">
          <SectionHeader
            eyebrow="Toolkit"
            title={<>Languages &amp; <span className="text-gradient">technical skills.</span></>}
            lead="The languages I learned and use in production — from algorithms in C++ and enterprise backends in C#, to mobile with Dart and the modern web."
          />

          {/* Integrated languages strip — one surface, hairline dividers */}
          <motion.div
            className="lang-strip"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            {programmingLanguages.map((l, i) => (
              <motion.div
                key={l.name}
                className="lang-tile"
                variants={item}
                title={l.description}
                style={{ ['--lang-accent' as string]: l.accent }}
              >
                {i === 0 && <span className="lang-tile__badge">Primary</span>}
                <motion.img
                  className="lang-tile__logo"
                  src={l.icon}
                  alt={`${l.name} logo`}
                  width={40}
                  height={40}
                  loading="lazy"
                  whileHover={{ scale: 1.12, y: -2 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                />
                <span className="lang-tile__name">{l.name}</span>
                <span className="lang-tile__role">{l.category}</span>
                <span className="lang-tile__meta">{l.tag}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Tools strip */}
          {tools.length > 0 && (
            <div className="tools-section">
              <div className="tools-section__head">
                <div className="eyebrow">Databases, Runtimes &amp;amp; Tooling</div>
              </div>
              <motion.div
                className="lang-strip lang-strip--tools"
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
              >
                {tools.map((t) => (
                  <motion.div
                    key={t.name}
                    className="lang-tile lang-tile--tool"
                    variants={item}
                    style={{ ['--lang-accent' as string]: t.accent }}
                  >
                    <motion.img
                      className="lang-tile__logo"
                      src={t.icon}
                      alt={`\${t.name} logo`}
                      width={38}
                      height={38}
                      loading="lazy"
                      whileHover={{ scale: 1.14, y: -3 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                    />
                    <span className="lang-tile__name">{t.name}</span>
                    <span className="lang-tile__meta">{t.tag}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {/* Technical competencies bento grid */}
          <div className="mt-xl">
            <div className="section-head section-head--compact">
              <div className="eyebrow">Architecture &amp; Stacks</div>
              <h3 className="h3">Technical Competencies</h3>
            </div>
            <motion.div className="bento" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
              {skills.map((g, i) => (
                <TiltCard
                  key={g.id}
                  intensity={4}
                  className={`bento__card ${i === 0 ? 'bento__card--wide' : ''}`}
                  variants={item}
                >
                  <motion.div className="bento__icon" whileHover={{ scale: 1.12, rotate: -6 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <Icon name={g.icon} size={22} />
                  </motion.div>
                  <h3 className="h4">{g.title}</h3>
                  <motion.div
                    className="chips"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
                  >
                    {g.items.map((s) => (
                      <motion.span
                        key={s}
                        className="chip"
                        variants={{
                          hidden: { opacity: 0, scale: 0.88, y: 8 },
                          show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease } },
                        }}
                        whileHover={{ y: -2, scale: 1.04 }}
                      >
                        {s}
                      </motion.span>
                    ))}
                  </motion.div>
                </TiltCard>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="section" id="experience">
        <div className="container">
          <SectionHeader eyebrow="Experience" title="Where I've built" />
          <ExperienceTimeline items={experience} />
        </div>
      </section>

      {/* Projects */}
      <section className="section section--alt" id="projects">
        <div className="container">
          <SectionHeader eyebrow="Selected work" title="Projects & products" lead="Business systems delivered for clients — products are on the way." />

          {/* Project category filter tabs */}
          <div className="project-tabs" role="tablist" aria-label="Project filter">
            {[
              { id: 'all', label: 'All Projects', count: projects.length },
              { id: 'backend', label: 'ASP.NET Core & Cloud', count: projects.filter((p) => p.stack.some((s) => /asp\.net|postgres|clean architecture|signalr|cloud/i.test(s))).length },
              { id: 'desktop', label: 'Desktop & WPF', count: projects.filter((p) => p.stack.some((s) => /wpf|desktop|sql server/i.test(s))).length },
            ].map((cat) => {
              const active = projectCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`project-tab ${active ? 'is-active' : ''}`}
                  onClick={() => setProjectCategory(cat.id as any)}
                >
                  {active && (
                    <motion.span
                      layoutId="project-tab-pill"
                      className="project-tab__pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="project-tab__label">{cat.label}</span>
                  <span className="project-tab__count">{cat.count}</span>
                </button>
              );
            })}
          </div>

          <motion.div className="projects" layout variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((p) => (
                <TiltCard
                  key={p.id}
                  intensity={4}
                  className="project"
                  variants={item}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.35, ease }}
                  style={{ ['--accent' as string]: p.accent }}
                >
                  <div className="project__glow" />
                  <div className="project__top">
                    {p.url ? (
                      <span className="pill pill--live">
                        <span className="live-dot" /> Live Production
                      </span>
                    ) : (
                      <span className="pill pill--soft">{p.kind}</span>
                    )}
                    {p.url && (
                      <Magnetic strength={0.35}>
                        <a href={p.url} target="_blank" rel="noreferrer" className="icon-btn icon-btn--sm" aria-label={`Open ${p.name}`}>
                          <Icon name="arrowUpRight" size={16} />
                        </a>
                      </Magnetic>
                    )}
                  </div>
                  <h3 className="project__name">{p.name}</h3>
                  <p className="project__sub">{p.subtitle}</p>
                  <ul className="bullets bullets--sm">
                    {p.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                  <div className="chips chips--sm">
                    {p.stack.map((s) => (
                      <motion.span key={s} className="chip" whileHover={{ y: -2, scale: 1.04 }}>
                        {s}
                      </motion.span>
                    ))}
                  </div>
                </TiltCard>
              ))}
            </AnimatePresence>
            <motion.article className="project project--soon" layout variants={item} whileHover={{ scale: 1.01 }}>
              <motion.span
                animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Icon name="sparkle" size={28} />
              </motion.span>
              <h3 className="project__name">Products</h3>
              <p className="project__sub">New products and case studies are coming soon.</p>
            </motion.article>
          </motion.div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section" id="certifications">
        <div className="container">
          <SectionHeader
            eyebrow="Certifications"
            title={<>{certified.length} certificates.<br /><span className="text-gradient">One continuous roadmap.</span></>}
            lead="A structured path from computing foundations and algorithms to C#, databases, secure APIs and EF Core."
          />
        </div>
        <CertMarquee items={certified} onOpen={setPreview} />
        <div className="container">
          <div className="grid-cards">
            {certified.slice(0, 6).map((f) => (
              <FormationCard key={f.id} formation={f} categoryLabel={catLabel(f.category)} onPreview={setPreview} />
            ))}
          </div>
          <Reveal className="center mt-xl">
            <Magnetic>
              <Link to="/certifications" className="btn btn--primary">
                Explore all certifications <Icon name="arrowRight" size={18} />
              </Link>
            </Magnetic>
          </Reveal>

          <div className="training">
            {training.map((t, i) => (
              <Reveal key={t.provider} delay={i * 0.08} className="training__card">
                <div className="eyebrow">Training</div>
                <h3 className="h3">{t.provider}</h3>
                <ul className="bullets bullets--sm">
                  {t.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Education & languages */}
      <section className="section section--alt">
        <div className="container edu">
          <div>
            <SectionHeader eyebrow="Education" title="Background" />
            {education.map((e) => (
              <Reveal key={e.degree}>
                <TiltCard intensity={4} className="edu__card">
                  <Icon name="grad" size={26} />
                  <div>
                    <h3 className="h4">{e.degree}</h3>
                    <p className="muted">
                      {e.school} · {e.period}
                    </p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
          <div>
            <SectionHeader eyebrow="Spoken Languages" title="Communication" />
            <div className="langs">
              {languages.map((l) => (
                <Reveal key={l.name} className="lang">
                  <div className="lang__row">
                    <span className="lang__name">{l.name}</span>
                    <span className="muted small">{l.level}</span>
                  </div>
                  <div className="progress__track">
                    <motion.div
                      className="progress__bar"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${l.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease }}
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section contact" id="contact">
        <div className="container center">
          <Reveal>
            <div className="contact__avatar-wrap">
              <img src={profile.avatarSm} alt={profile.name} className="contact__avatar" loading="lazy" />
              <span className="contact__avatar-status" title="Available for projects" />
            </div>
            <div className="eyebrow">Contact</div>
            <h2 className="display">
              Let's build something
              <br />
              <span className="text-gradient">that lasts.</span>
            </h2>
            <p className="lead center-text">{profile.availability}. I usually reply within a day.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <ContactSectionCard />
          </Reveal>
          <Reveal delay={0.18} className="contact__links">
            {profile.links.map((l) => (
              <Magnetic key={l.label} strength={0.25}>
                <a href={l.url} target={l.url.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="contact__link">
                  <Icon name={l.icon} size={18} />
                  <span>{l.label}</span>
                </a>
              </Magnetic>
            ))}
          </Reveal>
        </div>
      </section>

      <CertificateViewer formation={preview} onClose={() => setPreview(null)} />
    </Page>
  );
}

/* ---------- Hero with Pointer + Scroll Parallax ---------- */

function Hero({
  name,
  role,
  headline,
  location,
  availability,
  avatar,
}: {
  name: string;
  role: string;
  headline: string;
  location: string;
  availability: string;
  avatar: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 90, damping: 24 });
  const smy = useSpring(my, { stiffness: 90, damping: 24 });
  const blobAX = useTransform(smx, [-0.5, 0.5], [-36, 36]);
  const blobAY = useTransform(smy, [-0.5, 0.5], [-28, 28]);
  const blobBX = useTransform(smx, [-0.5, 0.5], [42, -42]);
  const blobBY = useTransform(smy, [-0.5, 0.5], [32, -32]);
  const chipAX = useTransform(smx, [-0.5, 0.5], [-14, 14]);
  const chipAY = useTransform(smy, [-0.5, 0.5], [-10, 10]);
  const chipBX = useTransform(smx, [-0.5, 0.5], [16, -16]);
  const chipBY = useTransform(smy, [-0.5, 0.5], [12, -12]);

  const [copiedEmail, setCopiedEmail] = useState(false);
  function handleCopyEmail() {
    navigator.clipboard?.writeText('khalilbachir98@outlook.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  }

  const badge1X = useTransform(smx, [-0.5, 0.5], [-22, 22]);
  const badge1Y = useTransform(smy, [-0.5, 0.5], [-16, 16]);
  const badge2X = useTransform(smx, [-0.5, 0.5], [24, -24]);
  const badge2Y = useTransform(smy, [-0.5, 0.5], [-14, 14]);
  const badge3X = useTransform(smx, [-0.5, 0.5], [16, -16]);
  const badge3Y = useTransform(smy, [-0.5, 0.5], [18, -18]);

  const rotX = useTransform(smy, [-0.5, 0.5], [5, -5]);
  const rotY = useTransform(smx, [-0.5, 0.5], [-7, 7]);

  function onMove(e: MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  const words = name.split(' ');

  return (
    <section className="hero" ref={ref} onMouseMove={onMove}>
      <div className="hero__bg" aria-hidden="true">
        <motion.span className="blob blob--a" style={{ x: blobAX, y: blobAY }} />
        <motion.span className="blob blob--b" style={{ x: blobBX, y: blobBY }} />
        <span className="blob blob--c" />
        <div className="hero__grid" />
      </div>
      <FloatingCodeStreams />
      <motion.div className="container hero__split" style={{ y, opacity, scale }}>
        <div className="hero__copy">
          <div className="hero__top-row">
            <motion.div
              className="pill pill--live hero__pill"
              initial={{ opacity: 0, y: 12, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, ease, delay: 0.08 }}
            >
              <span className="live-dot" /> {availability}
            </motion.div>

            <motion.div
              className="hero__arabic-kicker"
              initial={{ opacity: 0, y: 12, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, ease, delay: 0.14 }}
              dir="rtl"
            >
              <span className="hero__arabic-sparkle">✦</span>
              <span className="hero__arabic-quote">خلّ إبداعك يتكلّم</span>
              <span className="hero__arabic-bar">/</span>
              <span className="hero__arabic-sub">هندسة برمجية متقنة</span>
            </motion.div>
          </div>

          <h1 className="hero__title">
            <span className="hero__name-line">
              {words.map((w, i) => (
                <motion.span
                  key={w}
                  className="hero__word"
                  initial={{ opacity: 0, y: 46, filter: 'blur(12px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.95, ease, delay: 0.18 + i * 0.12 }}
                >
                  {w}
                </motion.span>
              ))}
            </span>
            <motion.span
              className="hero__role text-gradient"
              initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.95, ease, delay: 0.46 }}
            >
              {role}.
            </motion.span>
          </h1>

          <motion.p
            className="hero__lead"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.68 }}
          >
            {headline} crafting secure APIs, clean architectures and business systems with C#, ASP.NET Core and PostgreSQL.
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.82 }}
          >
            <Magnetic>
              <a href="#projects" className="btn btn--primary btn--lg">
                See my work <Icon name="arrowRight" size={18} />
              </a>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                className={`btn btn--lg hero__copy-btn ${copiedEmail ? 'btn--copied' : 'btn--ghost'}`}
                onClick={handleCopyEmail}
                aria-label="Copy email address"
              >
                <Icon name={copiedEmail ? 'check' : 'copy'} size={18} />
                <span>{copiedEmail ? 'Email Copied!' : 'Copy Email'}</span>
              </button>
            </Magnetic>
            <Magnetic>
              <Link to="/certifications" className="btn btn--ghost btn--lg">
                <Icon name="award" size={18} /> Certifications
              </Link>
            </Magnetic>
          </motion.div>

          <motion.div
            className="hero__meta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.05 }}
          >
            <span>
              <Icon name="pin" size={16} /> {location}
            </span>
            <span>
              <Icon name="code" size={16} /> C# · C++ · Dart · TypeScript · JS · HTML · CSS
            </span>
          </motion.div>
        </div>

        <motion.div
          className="hero__portrait-canvas"
          initial={{ opacity: 0, scale: 0.94, y: 24, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, ease, delay: 0.22 }}
        >
          {/* Cosmic purple ambient rim glow matching 3D avatar */}
          <motion.div className="hero__portrait-aura" style={{ x: chipBX, y: chipBY }} aria-hidden="true" />
          <div className="hero__portrait-glow-purple" aria-hidden="true" />

          {/* Concentric ambient ripple rings (echoing the reference screenshot) */}
          <div className="hero__portrait-rings" aria-hidden="true">
            <span className="hero__ring hero__ring--1" />
            <span className="hero__ring hero__ring--2" />
            <span className="hero__ring hero__ring--3" />
          </div>

          {/* Floating 3D Avatar Figure with interactive tilt & gentle float */}
          <motion.figure
            className="hero__figure"
            style={{ x: chipAX, y: chipAY, rotateX: rotX, rotateY: rotY, transformPerspective: 900 }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img src={avatar} alt={name} className="hero__figure-img" fetchPriority="high" />
          </motion.figure>

          {/* Floating Interactive Tech Badges */}
          <motion.div
            className="hero__float-badge hero__float-badge--tl"
            style={{ x: badge1X, y: badge1Y }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          >
            <div className="hero__badge-head">
              <span className="hero__badge-dot hero__badge-dot--purple" />
              <span className="hero__badge-title">.NET 9 &amp; C#</span>
            </div>
            <span className="hero__badge-sub">Enterprise Backend</span>
          </motion.div>

          <motion.div
            className="hero__float-badge hero__float-badge--tr"
            style={{ x: badge2X, y: badge2Y }}
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <div className="hero__badge-head">
              <span className="hero__badge-dot hero__badge-dot--blue" />
              <span className="hero__badge-title">Clean Architecture</span>
            </div>
            <span className="hero__badge-sub">DDD &amp; CQRS</span>
          </motion.div>

          <motion.div
            className="hero__float-badge hero__float-badge--br"
            style={{ x: badge3X, y: badge3Y }}
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          >
            <div className="hero__badge-head">
              <span className="hero__badge-dot hero__badge-dot--green" />
              <span className="hero__badge-title">PostgreSQL &amp; EF Core</span>
            </div>
            <span className="hero__badge-sub">High-Throughput</span>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        className="hero__scroll"
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.35 }}
      >
        <span />
      </motion.a>
    </section>
  );
}

/* ---------- Certificates marquee ---------- */

function CertMarquee({ items, onOpen }: { items: Formation[]; onOpen: (f: Formation) => void }) {
  if (!items.length) return null;
  const loop = [...items, ...items];
  return (
    <div className="marquee" aria-label="Certificate gallery">
      <div className="marquee__track" style={{ ['--count' as string]: items.length }}>
        {loop.map((f, i) => (
          <motion.button
            key={`${f.id}-${i}`}
            className="marquee__item"
            onClick={() => onOpen(f)}
            tabIndex={i >= items.length ? -1 : 0}
            aria-label={`View ${f.title} certificate`}
            whileHover={{ y: -8, scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >
            <img src={f.certificate!.thumb} alt="" loading="lazy" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
