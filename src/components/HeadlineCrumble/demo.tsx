import HeadlineCrumble from './index';

export default function HeadlineCrumbleDemo() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="text-center space-y-12">
        <HeadlineCrumble text="Hover Me!" />
        <div className="space-y-4">
          <p className="text-white/70 text-lg">
            Hover over individual letters to make them slam down
          </p>
          <p className="text-white/50 text-sm">
            Letters take 5 seconds to fall and reset. Hoverable letters glow red.
          </p>
        </div>
      </div>
    </div>
  );
} 