import GlowButton from './index';

export default function GlowButtonDemo() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="text-center space-y-12">
        <GlowButton 
          onClick={() => alert('You hovered and clicked!')}
          className="text-2xl px-16 py-6"
        >
          Hover on me
        </GlowButton>
        
        <div className="space-y-4">
          <p className="text-white/70 text-lg">
            Hover to see the glow and shimmer effects
          </p>
          <p className="text-white/50 text-sm">
            Features: scale animation, outer glow, shimmer sweep, and gradient backgrounds
          </p>
        </div>
      </div>
    </div>
  );
} 