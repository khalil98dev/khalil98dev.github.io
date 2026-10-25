import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useEffect, useState, type FormEvent } from 'react';
import { Icon } from './Icon';
import { Magnetic, TiltCard } from './MotionPrimitives';
import { ease } from './Reveal';

const EMAIL = 'khalilbachir98@outlook.com';
const PHONE_RAW = '+213771278844';
const PHONE_DISPLAY = '+213 771 27 88 44';
const WHATSAPP_NUM = '213771278844';

const SUBJECT_PRESETS = [
  { label: 'Backend .NET Project', subject: 'Project Inquiry — Backend .NET / ASP.NET Core' },
  { label: 'Freelance Collaboration', subject: 'Freelance Collaboration Opportunity' },
  { label: 'Full-Time Role', subject: 'Backend .NET Developer Opportunity' },
  { label: 'General Inquiry', subject: 'Hello Khalil — Quick Question' },
];

/**
 * Interactive Email (Subject + Body) & Phone (+213771278844) composer.
 * Can be rendered inside the #contact section or inside the fixed right-side drawer.
 */
export function ContactComposer({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = useState<'email' | 'phone'>('email');
  const [subject, setSubject] = useState(SUBJECT_PRESETS[0].subject);
  const [body, setBody] = useState(
    'Hi Khalil,\n\nI came across your portfolio and would love to discuss a project with you.\n\nBest regards,',
  );
  const [copied, setCopied] = useState<'email' | 'phone' | null>(null);

  function copyText(text: string, kind: 'email' | 'phone') {
    navigator.clipboard?.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(null), 2000);
  }

  function handleSendEmail(e: FormEvent) {
    e.preventDefault();
    const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(subject.trim() || 'Hello Khalil')}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  }

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(
    subject ? `*${subject}*\n\n${body}` : body,
  )}`;

  return (
    <div className={`composer ${compact ? 'composer--compact' : ''}`}>
      <div className="composer__top">
        <LayoutGroup id={compact ? 'dock-mode' : 'section-mode'}>
          <div className="composer__tabs" role="tablist" aria-label="Contact method">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'email'}
              className={`composer__tab ${mode === 'email' ? 'is-active' : ''}`}
              onClick={() => setMode('email')}
            >
              {mode === 'email' && (
                <motion.span
                  layoutId={compact ? 'dock-tab-pill' : 'sec-tab-pill'}
                  className="composer__tab-pill"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="composer__tab-label">
                <Icon name="mail" size={15} /> Email Message
              </span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'phone'}
              className={`composer__tab ${mode === 'phone' ? 'is-active' : ''}`}
              onClick={() => setMode('phone')}
            >
              {mode === 'phone' && (
                <motion.span
                  layoutId={compact ? 'dock-tab-pill' : 'sec-tab-pill'}
                  className="composer__tab-pill"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="composer__tab-label">
                <Icon name="phone" size={15} /> Phone / WhatsApp
              </span>
            </button>
          </div>
        </LayoutGroup>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {mode === 'email' ? (
          <motion.form
            key="email"
            className="composer__form"
            onSubmit={handleSendEmail}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.3, ease }}
          >
            <div className="composer__presets" aria-label="Quick subject templates">
              {SUBJECT_PRESETS.map((p) => (
                <button
                  type="button"
                  key={p.label}
                  className={`composer__preset ${subject === p.subject ? 'is-selected' : ''}`}
                  onClick={() => setSubject(p.subject)}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <label className="composer__field">
              <span className="composer__label">Subject</span>
              <input
                type="text"
                className="composer__input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject of your message…"
                required
              />
            </label>

            <label className="composer__field">
              <span className="composer__label">Message Body</span>
              <textarea
                className="composer__textarea"
                rows={compact ? 4 : 5}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message here…"
                required
              />
            </label>

            <div className="composer__footer">
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => copyText(EMAIL, 'email')}
              >
                <Icon name={copied === 'email' ? 'check' : 'copy'} size={15} />
                {copied === 'email' ? 'Copied email!' : EMAIL}
              </button>
              <div className="composer__submit-group">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn--whatsapp btn--sm"
                  title="Send this message via WhatsApp"
                >
                  <Icon name="whatsapp" size={16} /> WhatsApp
                </a>
                <button type="submit" className="btn btn--primary btn--sm">
                  <Icon name="send" size={15} /> Send Email
                </button>
              </div>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="phone"
            className="composer__phone-panel"
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.3, ease }}
          >
            <div className="composer__phone-card">
              <div className="composer__phone-ring">
                <Icon name="phone" size={24} />
              </div>
              <div className="composer__phone-info">
                <span className="eyebrow">Direct Line · Algeria (GMT+1)</span>
                <a href={`tel:${PHONE_RAW}`} className="composer__phone-number">
                  {PHONE_DISPLAY}
                </a>
                <span className="small muted">Available for calls, WhatsApp & business inquiries</span>
              </div>
            </div>

            <div className="composer__phone-actions">
              <a href={`tel:${PHONE_RAW}`} className="btn btn--primary">
                <Icon name="phone" size={17} /> Call {PHONE_DISPLAY}
              </a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn btn--whatsapp">
                <Icon name="whatsapp" size={18} /> Chat on WhatsApp
              </a>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => copyText(PHONE_RAW, 'phone')}
              >
                <Icon name={copied === 'phone' ? 'check' : 'copy'} size={16} />
                {copied === 'phone' ? 'Number Copied!' : 'Copy Number'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Fixed right-side floating contact badge with Apple Dynamic-Island style morphing drawer.
 */
export function FloatingContactBadge() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="contact-dock" aria-live="polite">
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="contact-dock__backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="contact-dock__drawer"
              role="dialog"
              aria-label="Quick Contact"
              initial={{ opacity: 0, y: 28, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 24, scale: 0.92, filter: 'blur(8px)' }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            >
              <div className="contact-dock__header">
                <div className="contact-dock__person">
                  <div className="contact-dock__avatar">
                    <img src="/content/profile/profile-sm.webp" alt="Khalil Bachir" />
                    <span className="contact-dock__status" />
                  </div>
                  <div>
                    <div className="contact-dock__name">Khalil Bachir</div>
                    <div className="contact-dock__sub">
                      <a href={`tel:${PHONE_RAW}`}>{PHONE_DISPLAY}</a> · Replies fast
                    </div>
                  </div>
                </div>
                <motion.button
                  type="button"
                  className="icon-btn"
                  onClick={() => setOpen(false)}
                  aria-label="Close contact panel"
                  whileHover={{ rotate: 90, scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <Icon name="close" size={18} />
                </motion.button>
              </div>

              <ContactComposer compact />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Fixed Right-Side Badge Trigger */}
      <div className="contact-dock__rail">
        <Magnetic strength={0.22}>
          <motion.a
            href={`tel:${PHONE_RAW}`}
            className="contact-dock__quick-phone"
            title={`Call ${PHONE_DISPLAY}`}
            whileHover={{ scale: 1.06, x: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="contact-dock__phone-pulse">
              <Icon name="phone" size={15} />
            </span>
            <span className="contact-dock__phone-text">{PHONE_DISPLAY}</span>
          </motion.a>
        </Magnetic>

        <Magnetic strength={0.25}>
          <motion.button
            type="button"
            className={`contact-dock__badge ${open ? 'is-open' : ''}`}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Open quick contact composer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <span className="contact-dock__glow" aria-hidden="true" />
            <span className="contact-dock__badge-avatar">
              <img src="/content/profile/profile-sm.webp" alt="" />
              <span className="live-dot contact-dock__dot" />
            </span>
            <span className="contact-dock__badge-copy">
              <span className="contact-dock__badge-title">Let's Talk</span>
              <span className="contact-dock__badge-meta">Email · +213 771 27 88 44</span>
            </span>
            <span className="contact-dock__badge-icon">
              <Icon name={open ? 'close' : 'send'} size={16} />
            </span>
          </motion.button>
        </Magnetic>
      </div>
    </div>
  );
}

/**
 * Full-width interactive Contact card for the #contact section on Home.
 */
export function ContactSectionCard() {
  return (
    <TiltCard intensity={2.5} spotlight className="contact-card">
      <ContactComposer />
    </TiltCard>
  );
}
