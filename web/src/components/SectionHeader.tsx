import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

export function SectionHeader({ eyebrow, title, lead, align = 'left' }: { eyebrow: string; title: ReactNode; lead?: ReactNode; align?: 'left' | 'center' }) {
  return (
    <Reveal className={`section-head section-head--${align}`}>
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="h2">{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </Reveal>
  );
}
