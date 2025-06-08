import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { registry } from './ComponentRegistry';
import Sidebar from './Sidebar';

export default function App() {
  if (registry.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-900 text-zinc-200">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Welcome to Flashy UI Lab</h1>
          <p className="text-zinc-400 mb-6">
            No components found. Add your first component to get started!
          </p>
          <div className="text-left bg-zinc-800 p-4 rounded-lg text-sm">
            <div className="text-zinc-300 mb-2">Quick start:</div>
            <code className="text-purple-400">
              mkdir -p src/components/MyComponent<br />
              # Add index.tsx, demo.tsx, meta.json
            </code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-zinc-950">
        <Sidebar items={registry} />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to={`/${registry[0].id}`} replace />} />
            {registry.map(({ id, Component }) => (
              <Route 
                key={id} 
                path={`/${id}`} 
                element={
                  <div className="min-h-full">
                    <Component />
                  </div>
                } 
              />
            ))}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
} 