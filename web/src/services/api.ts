import type { FormationsPayload, Profile, ProgrammingLanguage, Project, SkillGroup, Experience, Education, Language, Training } from '@/types';

/**
 * Data access layer.
 *
 * Automatically resolves asset paths with Vite's BASE_URL so that
 * GitHub Pages subpaths (e.g. /PersonalSite/) and custom domains
 * load all avatars, images, thumbnails and certificate PDFs properly.
 */

export interface ResumePayload {
  profile: Profile;
  programmingLanguages: ProgrammingLanguage[];
  skills: SkillGroup[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  languages: Language[];
  training: Training[];
  foundation: string[];
}

export interface DataSource {
  getResume(): Promise<ResumePayload>;
  getFormations(): Promise<FormationsPayload>;
}

const basePrefix = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

function resolveAsset(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  if (url.startsWith('/')) {
    return basePrefix ? `${basePrefix}${url}` : url;
  }
  return basePrefix ? `${basePrefix}/${url}` : `/${url}`;
}

const StaticSource: DataSource = {
  async getResume() {
    const m = await import('@/content/profile');
    const p = m.profile;
    return {
      profile: {
        ...p,
        avatar: resolveAsset(p.avatar),
        avatarSm: resolveAsset(p.avatarSm),
      },
      programmingLanguages: m.programmingLanguages,
      skills: m.skills,
      experience: m.experience,
      projects: m.projects,
      education: m.education,
      languages: m.languages,
      training: m.training,
      foundation: m.foundation,
    };
  },
  async getFormations() {
    const m = await import('@/content/generated/formations.json');
    const data = m.default as FormationsPayload;
    return {
      ...data,
      formations: data.formations.map((f) => ({
        ...f,
        cover: resolveAsset(f.cover),
        certificate: f.certificate
          ? {
              ...f.certificate,
              thumb: resolveAsset(f.certificate.thumb),
              image: resolveAsset(f.certificate.image),
              pdf: resolveAsset(f.certificate.pdf),
            }
          : null,
      })),
    };
  },
};

function HttpSource(base: string): DataSource {
  const get = async <T>(path: string): Promise<T> => {
    const res = await fetch(`${base.replace(/\/$/, '')}${path}`, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
    return res.json() as Promise<T>;
  };
  return {
    getResume: () => get<ResumePayload>('/profile'),
    getFormations: () => get<FormationsPayload>('/formations'),
  };
}

const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
export const api: DataSource = apiUrl ? HttpSource(apiUrl) : StaticSource;
