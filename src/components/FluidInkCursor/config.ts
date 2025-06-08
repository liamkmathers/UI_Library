import type { Config } from './fluid';

const cfg: Partial<Config> = {
  SIM_RESOLUTION: 128,      // 64–256; lower = faster
  DYE_RESOLUTION: 512,
  COLORS: [                 // RGBA (0–1)
    [0.11, 0.88, 0.76, 1],  // teal
    [0.39, 0.33, 1, 1],     // indigo
    [1, 0.6, 0.2, 1],       // orange
  ],
  SPLAT_RADIUS: 30,         // cursor size in pixels for 2D canvas
  FORCE_MULT: 6000,         // drag strength
  TRANSPARENT: true,        // draw over existing UI
  BACK_COLOR: [0, 0, 0, 0], // fully transparent background
};

export default cfg; 