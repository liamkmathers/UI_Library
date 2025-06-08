import { useEffect, useRef } from 'react';
import { createFluidSimulation } from './fluid';
import cfg from './config';

interface Props {
  abs?: boolean;
}

export default function FluidInkCursor({ abs = true }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (ref.current) {
      const dispose = createFluidSimulation(ref.current, cfg);
      return () => dispose();
    }
  }, []);

  return (
    <canvas
      ref={ref}
      className={abs ? 'fixed inset-0 z-0' : 'w-full h-full'}
    />
  );
} 