/* Domain types — shared between static content and a future backend API. */

export interface SocialLink {
  label: string;
  url: string;
  icon: 'linkedin' | 'github' | 'mail' | 'phone' | 'web';
}

export interface Profile {
  name: string;
  firstName: string;
  role: string;
  headline: string;
  location: string;
  email: string;
  phone: string;
  availability: string;
  avatar: string;
  avatarSm: string;
  summary: string[];
  links: SocialLink[];
  stats: { value: string; label: string }[];
}

export interface SkillGroup {
  id: string;
  title: string;
  icon: string;
  items: string[];
}

export interface ProgrammingLanguage {
  name: string;
  icon: string; // official logo (SVG) path
  category: string;
  role: string;
  description: string;
  accent: string;
  level: string;
  tag: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  current?: boolean;
  projects: { name: string; points: string[] }[];
}

export interface Project {
  id: string;
  name: string;
  subtitle: string;
  stack: string[];
  points: string[];
  url?: string;
  kind: 'freelance' | 'product' | 'personal';
  accent: string;
}

export interface Education {
  degree: string;
  school: string;
  period: string;
}

export interface Language {
  name: string;
  level: string;
  value: number; // 0..100 for the visual meter
}

export interface Category {
  id: string;
  label: string;
}

export interface Certificate {
  serialNumber: string;
  issuedDate: string;
  image: string;
  thumb: string;
  pdf: string;
  verifyUrl: string;
}

export interface Formation {
  id: string;
  slug: string;
  number: number | null;
  title: string;
  fullTitle: string;
  tagline: string;
  shortDescription: string;
  about: string;
  skills: string[];
  verified: string[];
  category: string;
  provider: string;
  instructor: string;
  progress: number;
  sections: number;
  lectures: number;
  curriculum: { title: string; lectures: number }[];
  cover: string;
  courseUrl: string;
  certificate: Certificate | null;
}

export interface FormationsPayload {
  categories: Category[];
  formations: Formation[];
}

export interface Training {
  provider: string;
  items: string[];
}
