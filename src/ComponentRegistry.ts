import React from 'react';

type DemoMod = { default: React.FC };
type Meta = { title: string; description?: string };

const demos = import.meta.glob<DemoMod>('./components/**/demo.tsx', { eager: true });
const metas = import.meta.glob<Meta>('./components/**/meta.json', { eager: true });

export const registry = Object.entries(demos).map(([path, mod]) => {
  const metaPath = path.replace(/demo\.tsx$/, 'meta.json');
  const meta = (metas[metaPath] as any)?.default ?? {};
  return { 
    id: path.replace(/^\.\/components\//, '').replace(/\/demo\.tsx$/, ''), 
    Component: mod.default, 
    ...meta 
  };
}); 