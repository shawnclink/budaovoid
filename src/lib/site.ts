export const SITE = {
  name: 'buDaoVoid',
  tagline: 'Truth is perpendicular to time.',
  description:
    'buDaoVoid is an anonymous builder working on urban infrastructure, data tools, and systems for thinking. Selected work and writing.',
  url: 'https://budaovoid.is-a.dev',
  github: 'https://github.com/shawnclink',
  blog: 'https://shawnclink.github.io/',
  emailNote: 'Use the contact form; replies may take a while.',
};

export const NAV = [
  { href: '/work/', label: 'Work' },
  { href: '/writing/', label: 'Writing' },
  { href: '/about/', label: 'About' },
  { href: '/guestbook/', label: 'Guestbook' },
];

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);

export const formatISO = (date: Date) => date.toISOString().slice(0, 10);

export const yearOf = (date: Date) => date.getUTCFullYear();

export const sortByDateDesc = <T extends { data: { date: Date } }>(items: T[]) =>
  [...items].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
