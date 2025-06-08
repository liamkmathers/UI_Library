import FluidInkCursor from './index';

export default function FluidInkCursorDemo() {
  return (
    <div className="relative w-full h-[80vh] bg-black">
      <FluidInkCursor abs={false} />
      <h1 className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-white pointer-events-none z-10">
        Move your mouse!
      </h1>
    </div>
  );
} 