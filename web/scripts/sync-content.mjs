/**
 * Content sync — transforms the raw scraped dataset in ../data, ../certificates
 * and ../courses into web-ready assets.
 *
 *   - Copies certificate PNG/PDF and course covers into public/content/
 *   - Writes a trimmed, typed-friendly JSON to src/content/generated/formations.json
 *
 * When a backend exists, this same shape can be served from an API endpoint
 * (see src/services/api.ts) and this script becomes a seeding tool.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.resolve(__dirname, '..');
const ROOT = path.resolve(WEB, '..');
const SRC_DATA = path.join(ROOT, 'data', 'courses.json');
const OUT_JSON = path.join(WEB, 'src', 'content', 'generated', 'formations.json');
const PUBLIC_CONTENT = path.join(WEB, 'public', 'content');

// Sync profile photo if present in ../Prophile
const PROFILE_DIR = path.join(ROOT, 'Prophile');
if (fs.existsSync(PROFILE_DIR)) {
  const files = fs.readdirSync(PROFILE_DIR).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
  if (files[0]) {
    copyIfNewer(path.join(PROFILE_DIR, files[0]), path.join(PUBLIC_CONTENT, 'profile', 'profile.png'));
  }
}

if (!fs.existsSync(SRC_DATA)) {
  console.warn(`[sync] ${SRC_DATA} not found — skipping (using existing generated content).`);
  process.exit(0);
}

const courses = JSON.parse(fs.readFileSync(SRC_DATA, 'utf8'));

function copyIfNewer(from, to) {
  if (!fs.existsSync(from)) return false;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (fs.existsSync(to) && fs.statSync(to).mtimeMs >= fs.statSync(from).mtimeMs) return true;
  fs.copyFileSync(from, to);
  return true;
}

/** Split "🔹 a🔹 b✅ c" style marketing text into clean bullet items. */
function bullets(text = '') {
  return text
    .split(/🔹|✅|❌|\n/u)
    .map((s) => s.replace(/^[\s•\-–]+/, '').trim())
    .filter((s) => s.length > 3 && !/^(by the end of this course|upon successful completion|after completing this course)/i.test(s))
    .filter((s) => !/^[📌🔐🧠]/u.test(s));
}

const ARABIC = /[\u0600-\u06FF]/u;
const stripLead = (s = '') => s.replace(/^[^\p{L}\p{N}]+/u, '').replace(/\s+/g, ' ').trim();

function firstParagraph(text = '') {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  // Skip roadmap enumerations ("1️⃣ ..."), bullet run-ons and non-English lines
  const clean = lines.filter(
    (l) => !/[0-9]\uFE0F?\u20E3/u.test(l) && !/:$/.test(l) && !l.includes('🔹') && !ARABIC.test(l),
  );
  return clean.slice(0, 2).map(stripLead).join(' ');
}

function pickTagline(introText = '', fallback = '') {
  const lines = introText.split('\n').map(stripLead).filter(Boolean);
  // The 2nd heading line of each course page is usually the English subtitle
  const candidates = lines.filter((l) => !ARABIC.test(l) && l.length >= 25 && !/^this is not/i.test(l));
  const preferred = candidates.find((l, i) => i > 0) ?? candidates[0];
  return preferred || stripLead(fallback);
}

const CATEGORIES = [
  { id: 'backend', label: 'Backend & Architecture' },
  { id: 'data', label: 'Databases & SQL' },
  { id: 'cs', label: 'Algorithms & CS' },
  { id: 'languages', label: 'C#, C++ & OOP' },
  { id: 'web', label: 'Web & Tools' },
];

// Ordered rules — first match wins.
const RULES = [
  ['backend', /restful|api|jwt|windows services|solid|entity framework|ado\.net|dvld/i],
  ['data', /database|sql/i],
  ['cs', /algorithm|problem|data structures|programming foundations|^\d+ - foundations/i],
  ['languages', /c#|c\+\+|oop/i],
  ['web', /html|css|javascript|typescript|git/i],
];

function categorize(title) {
  return (RULES.find(([, re]) => re.test(title)) ?? ['cs'])[0];
}

const formations = courses.map((c) => {
  const s = c.summary?.sections ?? {};
  const tagline = pickTagline(s.intro, c.shortDescription);
  const coverExt = path.extname(c.localCoverImagePath || '.jpg');
  const cover = `/content/courses/${c.slug}${coverExt}`;
  copyIfNewer(path.join(ROOT, c.localCoverImagePath), path.join(PUBLIC_CONTENT, 'courses', `${c.slug}${coverExt}`));

  let certificate = null;
  if (c.hasCertificate && c.certificate) {
    const img = `/content/certificates/${c.slug}.png`;
    const pdf = `/content/certificates/${c.slug}.pdf`;
    copyIfNewer(path.join(ROOT, c.certificate.localImagePath), path.join(PUBLIC_CONTENT, 'certificates', `${c.slug}.png`));
    copyIfNewer(path.join(ROOT, c.certificate.localPdfPath), path.join(PUBLIC_CONTENT, 'certificates', `${c.slug}.pdf`));
    const hasThumb = copyIfNewer(
      path.join(ROOT, 'certificates', 'thumbs', `${c.slug}.webp`),
      path.join(PUBLIC_CONTENT, 'certificates', 'thumbs', `${c.slug}.webp`),
    );
    certificate = {
      serialNumber: c.certificate.serialNumber,
      issuedDate: c.certificate.issuedDate,
      image: img,
      thumb: hasThumb ? `/content/certificates/thumbs/${c.slug}.webp` : img,
      pdf,
      verifyUrl: c.certificate.certificateUrl,
    };
  }

  return {
    id: String(c.id),
    slug: c.slug,
    number: c.courseNumber ?? null,
    title: c.cleanTitle,
    fullTitle: c.title,
    tagline,
    shortDescription: stripLead(c.shortDescription),
    about: firstParagraph(s.about) || tagline,
    skills: bullets(s.whatYouWillLearn || s.coreTopics).filter((b) => !ARABIC.test(b)).slice(0, 10),
    verified: bullets(s.certificationOutcomes || s.certificateDetails).filter((b) => !ARABIC.test(b)).slice(0, 6),
    category: categorize(c.title),
    provider: c.provider || 'ProgrammingAdvices',
    instructor: c.instructor,
    progress: c.progressPercent ?? 0,
    sections: c.curriculum?.totalSections ?? 0,
    lectures: c.curriculum?.totalLectures ?? 0,
    curriculum: (c.curriculum?.sections ?? []).map((sec) => ({ title: sec.title, lectures: sec.lectures.length })),
    cover,
    courseUrl: c.salesPageUrl,
    certificate,
  };
});

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.writeFileSync(
  OUT_JSON,
  JSON.stringify({ categories: CATEGORIES.map(({ id, label }) => ({ id, label })), formations }, null, 2),
);
console.log(`[sync] ${formations.length} formations (${formations.filter((f) => f.certificate).length} certified) → src/content/generated/formations.json`);
