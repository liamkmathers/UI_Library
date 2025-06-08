import { useState } from 'react';
import ShaderMorphBackground from './index';

export default function ShaderMorphBackgroundDemo() {
  const [currentTheme, setCurrentTheme] = useState<'ocean' | 'sunset' | 'forest' | 'cosmic'>('ocean');

  const themes = [
    { name: 'Ocean', value: 'ocean' as const, description: 'Deep blue waves' },
    { name: 'Sunset', value: 'sunset' as const, description: 'Warm orange glow' },
    { name: 'Forest', value: 'forest' as const, description: 'Emerald green nature' },
    { name: 'Cosmic', value: 'cosmic' as const, description: 'Purple space vibes' },
  ];

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <ShaderMorphBackground colorTheme={currentTheme} />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Wave Background
          </h1>
          <p className="text-lg text-white/80 drop-shadow-md max-w-2xl mx-auto">
            Always-animated CSS background with flowing waves and particles. 
            Switch between different color themes.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="space-y-6">
            {/* Current Theme Display */}
            <div className="text-center">
              <label className="text-white font-medium block mb-2">Current Theme</label>
              <div className="text-2xl font-bold text-white">
                {themes.find(t => t.value === currentTheme)?.name}
              </div>
              <div className="text-sm text-white/60">
                {themes.find(t => t.value === currentTheme)?.description}
              </div>
            </div>

            {/* Theme Buttons */}
            <div className="space-y-3">
              <label className="text-white font-medium block">Color Themes</label>
              <div className="grid grid-cols-2 gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => setCurrentTheme(theme.value)}
                    className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm border ${
                      currentTheme === theme.value
                        ? 'bg-white/20 text-white border-white/40 shadow-lg'
                        : 'bg-white/10 hover:bg-white/15 text-white/80 border-white/20 hover:border-white/30'
                    }`}
                  >
                    <div className="font-semibold">{theme.name}</div>
                    <div className="text-xs opacity-75">{theme.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="text-sm text-white/60 space-y-1">
              <p>• Continuous wave animations and floating particles</p>
              <p>• Smooth theme transitions with unique color palettes</p>
              <p>• Hardware-accelerated CSS animations</p>
              <p>• No manual controls needed - always in motion!</p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
} 