import { NavLink } from 'react-router-dom';

interface SidebarItem {
  id: string;
  title?: string;
  description?: string;
}

interface SidebarProps {
  items: SidebarItem[];
}

export default function Sidebar({ items }: SidebarProps) {
  return (
    <aside className="w-64 bg-zinc-900 text-zinc-200 overflow-y-auto">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4 text-white">Flashy UI Lab</h1>
        <p className="text-sm text-zinc-400 mb-6">
          {items.length} component{items.length !== 1 ? 's' : ''}
        </p>
      </div>
      <nav>
        {items.map(({ id, title, description }) => (
          <NavLink
            key={id}
            to={`/${id}`}
            className={({ isActive }) =>
              `block px-4 py-3 hover:bg-zinc-800 transition-colors border-l-2 ${
                isActive 
                  ? 'bg-zinc-800 text-white border-purple-500' 
                  : 'border-transparent'
              }`
            }
          >
            <div className="font-medium">{title ?? id}</div>
            {description && (
              <div className="text-xs text-zinc-400 mt-1">{description}</div>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
} 