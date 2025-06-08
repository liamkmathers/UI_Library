export interface Page {
  path: string;
  label: string;
  color: string;
}

export const PAGES: Page[] = [
  { path: '/',          label: 'Home',     color: '#14b8a6' },
  { path: '/features',  label: 'Features', color: '#6366f1' },
  { path: '/pricing',   label: 'Pricing',  color: '#f59e0b' },
  { path: '/about',     label: 'About',    color: '#ef4444' },
]; 