import React, { Suspense, useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Text } from '@react-three/drei';
import { Physics, RigidBody, RapierRigidBody } from '@react-three/rapier';

// Small cube component
interface CubeProps {
  position: [number, number, number];
  color: string;
}

const SmallCube: React.FC<CubeProps> = ({ position, color }) => {
  const [hovered, setHovered] = useState(false);
  const rigidBodyRef = useRef<RapierRigidBody>(null);

  const handleClick = useCallback(() => {
    if (rigidBodyRef.current) {
      // Apply random impulse force when clicked
      const impulse = {
        x: (Math.random() - 0.5) * 10,
        y: Math.random() * 8 + 3,
        z: (Math.random() - 0.5) * 10,
      };
      rigidBodyRef.current.applyImpulse(impulse, true);
    }
  }, []);

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      colliders="cuboid"
      restitution={0.6}
      friction={0.5}
      mass={0.1}
      type="dynamic"
    >
      <Box
        args={[0.2, 0.2, 0.2]} // Small cubes
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={hovered ? '#ffffff' : color} 
          transparent 
          opacity={0.8}
        />
      </Box>
    </RigidBody>
  );
};

// Physics scene with container and cubes
const CubeDropScene: React.FC<{ 
  debug: boolean; 
  gravity: number;
  paused: boolean;
  cubeCount: number;
}> = ({ debug, gravity, paused, cubeCount }) => {
  
  // Generate cubes that drop one at a time in a vertical line
  const cubes = useMemo(() => {
    return Array.from({ length: cubeCount }, (_, i) => ({
      id: i,
      position: [
        0,                           // All cubes drop at center X
        12 + i * 0.5,               // Staggered vertically - each cube higher than the last
        0                           // All cubes drop at center Z
      ] as [number, number, number],
      color: i % 2 === 0 ? '#000000' : '#ffffff' // Alternating black and white
    }));
  }, [cubeCount]);

  const physicsProps = useMemo(() => ({
    gravity: [0, gravity, 0] as [number, number, number],
    timeStep: 1/60,
    paused,
    debug,
    numSolverIterations: 8, // Higher for stability with many objects
    numAdditionalFrictionIterations: 4,
    numInternalPgsIterations: 1,
  }), [gravity, paused, debug]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 15, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 10, -5]} color="#4facfe" intensity={0.3} />

      {/* Physics World */}
      <Physics {...physicsProps}>
        {/* Container walls - very small opening (3x cube area = ~0.6x0.6) */}
        {/* Solid bottom floor */}
        <RigidBody type="fixed" colliders="cuboid" restitution={0.1} friction={0.9}>
          <Box position={[0, -1, 0]} args={[0.7, 0.2, 0.7]}>
            <meshStandardMaterial color="#2d3748" />
          </Box>
        </RigidBody>
        
        {/* Left wall */}
        <RigidBody type="fixed" colliders="cuboid">
          <Box position={[-0.35, 4, 0]} args={[0.1, 10, 0.7]}>
            <meshStandardMaterial color="#4a5568" transparent opacity={0.05} />
          </Box>
        </RigidBody>
        
        {/* Right wall */}
        <RigidBody type="fixed" colliders="cuboid">
          <Box position={[0.35, 4, 0]} args={[0.1, 10, 0.7]}>
            <meshStandardMaterial color="#4a5568" transparent opacity={0.05} />
          </Box>
        </RigidBody>
        
        {/* Back wall */}
        <RigidBody type="fixed" colliders="cuboid">
          <Box position={[0, 4, -0.35]} args={[0.7, 10, 0.1]}>
            <meshStandardMaterial color="#4a5568" transparent opacity={0.05} />
          </Box>
        </RigidBody>
        
        {/* Front wall */}
        <RigidBody type="fixed" colliders="cuboid">
          <Box position={[0, 4, 0.35]} args={[0.7, 10, 0.1]}>
            <meshStandardMaterial color="#4a5568" transparent opacity={0.02} />
          </Box>
        </RigidBody>
        
        {/* Drop the cubes */}
        {cubes.map((cube) => (
          <SmallCube
            key={cube.id}
            position={cube.position}
            color={cube.color}
          />
        ))}
      </Physics>

      {/* Debug info */}
      {debug && (
        <Text
          position={[-2, 8, 1]}
          fontSize={0.25}
          color="#00ff00"
          anchorX="left"
        >
          DEBUG MODE - VERTICAL CUBE DROP
          {'\n'}Gravity: {gravity}
          {'\n'}Cubes: {cubeCount}
          {'\n'}Container: 0.7x0.7 units
          {'\n'}Cube size: 0.2x0.2x0.2
          {'\n'}Paused: {paused ? 'YES' : 'NO'}
          {'\n'}Click cubes to throw them!
        </Text>
      )}
    </>
  );
};



// Loading component
const PhysicsLoader = () => (
  <>
    <ambientLight intensity={0.5} />
    <Text
      position={[0, 0, 0]}
      fontSize={0.5}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      Loading Cube Drop...
    </Text>
  </>
);

// Main component
export default function CubeDropSimulation() {
  const [debug] = useState(false);
  const gravity = -1; // Fixed gravity
  const [paused] = useState(false);
  const cubeCount = 200; // Fixed cube count
  const [key, setKey] = useState(0);

  const handleResetScene = useCallback(() => {
    setKey(prev => prev + 1);
  }, []);

  // Auto-reset every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleResetScene();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [handleResetScene]);

  return (
    <div className="relative w-full h-screen bg-black flex">
      {/* Left side - Homepage content */}
      <div className="flex-1 flex flex-col justify-center px-12 lg:px-20">
        <div className="max-w-2xl">
          {/* Main heading */}
          <h1 className="text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Physics
            <br />
            <span className="text-gray-400">Meets</span>
            <br />
            Design
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Watch precision engineering in action. Every cube finds its place 
            in perfect harmony, demonstrating the beauty of controlled chaos.
          </p>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors">
              Explore Physics
            </button>
            <button className="px-8 py-4 border border-gray-600 text-white font-semibold rounded-lg hover:border-gray-400 transition-colors">
              Learn More
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white">200</div>
              <div className="text-sm text-gray-400">Active Cubes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">1</div>
              <div className="text-sm text-gray-400">Gravity Force</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">∞</div>
              <div className="text-sm text-gray-400">Possibilities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Cube tower */}
      <div className="w-1/2 lg:w-2/5 relative">
        <Canvas
          key={key}
          style={{ background: 'transparent' }}
          camera={{ position: [2, 8, 3], fov: 50 }}
          shadows
        >
          <Suspense fallback={<PhysicsLoader />}>
            <CubeDropScene 
              debug={debug} 
              gravity={gravity}
              paused={paused}
              cubeCount={cubeCount}
            />
            <OrbitControls 
              enablePan={false}
              enableZoom={true}
              enableRotate={true}
              minDistance={1.5}
              maxDistance={12}
              target={[0, 4, 0]}
              autoRotate={true}
              autoRotateSpeed={0.5}
            />
          </Suspense>
        </Canvas>

        

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/20 pointer-events-none" />
      </div>
    </div>
  );
} 