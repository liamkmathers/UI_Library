import { Canvas, useLoader } from '@react-three/fiber';
import { Float, Html, OrbitControls } from '@react-three/drei';
import { Suspense, useMemo, useRef, useState } from 'react';
import { TextureLoader } from 'three';
import { PHOTOS } from './photos';
import useMagnetism from './useMagnetism';
import InfoCard from './InfoCard';

function PolaroidPhoto({ src, position, onClick, onMeshRef }: { 
  src: string; 
  position: [number, number, number]; 
  onClick: () => void;
  onMeshRef: (mesh: any) => void;
}) {
  const texture = useLoader(TextureLoader, src);
  
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={1.5}>
      <mesh
        ref={onMeshRef}
        position={position}
        onClick={onClick}
        castShadow
        receiveShadow
      >
        {/* Polaroid frame */}
        <boxGeometry args={[1.8, 2.4, 0.1]} />
        <meshStandardMaterial color="#f8f8f8" />
        
        {/* Photo */}
        <mesh position={[0, 0.2, 0.051]}>
          <planeGeometry args={[1.6, 1.6]} />
          <meshBasicMaterial map={texture as any} />
        </mesh>
      </mesh>
    </Float>
  );
}

function Scene() {
  const [pinned, setPinned] = useState<number | null>(null);
  const meshes = useRef<any[]>([]);

  const positions = useMemo(() =>
    PHOTOS.map((_, i) => [
      (i % 10) * 2.5 - 11.25,   // x grid: 10 columns
      Math.floor(i / 10) * -2.8 + 4.2, // y grid: 4 rows
      0,
    ] as [number, number, number]),
  []);

  // Collect mesh refs for magnetism
  const handleMeshRef = (mesh: any, index: number) => {
    if (mesh) {
      meshes.current[index] = mesh;
    }
  };

  // Apply magnetism effect
  useMagnetism(meshes.current);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <pointLight position={[-5, -5, 5]} intensity={0.3} />

      {PHOTOS.map((photo, i) => (
        <PolaroidPhoto
          key={i}
          src={photo.src}
          position={positions[i]}
          onClick={() => setPinned(i)}
          onMeshRef={(mesh) => handleMeshRef(mesh, i)}
        />
      ))}

      {/* Manual orbit controls */}
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        minDistance={8}
        maxDistance={25}
        maxPolarAngle={Math.PI / 2}
      />

      {/* Pinned card overlay */}
      {pinned !== null && (
        <Html
          center
          className="pointer-events-auto"
          zIndexRange={[100, 0]}
        >
          <InfoCard photo={PHOTOS[pinned]} onClose={() => setPinned(null)} />
        </Html>
      )}
    </>
  );
}

export default function MagneticPolaroidWall() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Canvas
        shadows
        camera={{ position: [0, 0, 20], fov: 45 }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
} 