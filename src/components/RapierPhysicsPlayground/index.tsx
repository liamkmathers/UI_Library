import React, { Suspense, useState, useRef, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';

// Physics imports - now active with @react-three/rapier v1.5.0
import { Physics, RigidBody, CuboidCollider, RapierRigidBody } from '@react-three/rapier';

interface PhysicsCardProps {
  position: [number, number, number];
  text: string;
  color: string;
  onClick?: () => void;
}

// Physics-enabled UI Card component
const PhysicsUICard: React.FC<PhysicsCardProps> = ({ position, text, color, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const rigidBodyRef = useRef<RapierRigidBody>(null);

  const handleClick = useCallback(() => {
    if (rigidBodyRef.current) {
      // Apply random impulse force when clicked
      const impulse = {
        x: (Math.random() - 0.5) * 20,
        y: Math.random() * 15 + 5,
        z: (Math.random() - 0.5) * 20,
      };
      rigidBodyRef.current.applyImpulse(impulse, true);
      
      // Apply some torque for spinning
      const torque = {
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10,
        z: (Math.random() - 0.5) * 10,
      };
      rigidBodyRef.current.applyTorqueImpulse(torque, true);
    }
    onClick?.();
  }, [onClick]);

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      colliders="cuboid"
      restitution={0.8}
      friction={0.4}
      mass={1}
      type="dynamic"
    >
      <Box
        args={[2, 1.2, 0.1]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={hovered ? '#ff6b6b' : color} 
          transparent 
          opacity={0.9}
        />
      </Box>
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </RigidBody>
  );
};



// Physics-enabled scene
const PhysicsScene: React.FC<{ 
  debug: boolean; 
  gravity: number;
  paused: boolean;
}> = ({ debug, gravity, paused }) => {
  const [cards] = useState(() => [
    { id: 1, text: 'React', color: '#61dafb', position: [-3, 8, 0] as [number, number, number] },
    { id: 2, text: 'Three.js', color: '#000000', position: [0, 10, 0] as [number, number, number] },
    { id: 3, text: 'Rapier', color: '#ff6b35', position: [3, 12, 0] as [number, number, number] },
    { id: 4, text: 'Physics', color: '#4facfe', position: [-2, 14, 2] as [number, number, number] },
    { id: 5, text: 'WebGL', color: '#43e97b', position: [2, 16, -2] as [number, number, number] },
  ]);

  const handleCardClick = useCallback((cardId: number) => {
    console.log(`Card ${cardId} physics impulse applied!`);
  }, []);

  // Performance optimizations: decoupled physics step
  const physicsProps = useMemo(() => ({
    gravity: [0, gravity, 0] as [number, number, number],
    timeStep: 1/60, // Fixed timestep for consistency
    paused,
    debug,
    // Performance settings
    numSolverIterations: 4,
    numAdditionalFrictionIterations: 4,
    numInternalPgsIterations: 1,
  }), [gravity, paused, debug]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#4facfe" intensity={0.5} />

      {/* Physics World */}
      <Physics {...physicsProps}>
        {/* Ground plane */}
        <RigidBody type="fixed" colliders="cuboid" restitution={0.5} friction={0.8}>
          <Box position={[0, -5, 0]} args={[20, 1, 20]}>
            <meshStandardMaterial color="#4a5568" />
          </Box>
        </RigidBody>
        
        {/* Physics walls */}
        <RigidBody type="fixed" colliders="cuboid">
          <Box position={[-11, 0, 0]} args={[1, 20, 20]} visible={false} />
        </RigidBody>
        <RigidBody type="fixed" colliders="cuboid">
          <Box position={[11, 0, 0]} args={[1, 20, 20]} visible={false} />
        </RigidBody>
        <RigidBody type="fixed" colliders="cuboid">
          <Box position={[0, 0, -11]} args={[20, 20, 1]} visible={false} />
        </RigidBody>
        <RigidBody type="fixed" colliders="cuboid">
          <Box position={[0, 0, 11]} args={[20, 20, 1]} visible={false} />
        </RigidBody>
        
        {/* UI Cards with physics */}
        {cards.map((card) => (
          <PhysicsUICard
            key={card.id}
            position={card.position}
            text={card.text}
            color={card.color}
            onClick={() => handleCardClick(card.id)}
          />
        ))}

        {/* Add some physics obstacles for fun */}
        <RigidBody position={[0, 2, 0]} colliders="ball" restitution={0.9}>
          <Sphere args={[0.5]}>
            <meshStandardMaterial color="#ff6b6b" wireframe />
          </Sphere>
        </RigidBody>
      </Physics>

      {/* Debug info */}
      {debug && (
        <Text
          position={[-8, 8, 0]}
          fontSize={0.5}
          color="#00ff00"
          anchorX="left"
        >
          DEBUG MODE - PHYSICS ACTIVE
          {'\n'}Gravity: {gravity}
          {'\n'}Cards: {cards.length}
          {'\n'}Paused: {paused ? 'YES' : 'NO'}
          {'\n'}Click cards to throw them!
        </Text>
      )}
    </>
  );
};

// Enhanced control panel with physics controls
interface ControlPanelProps {
  debug: boolean;
  onDebugToggle: () => void;
  gravity: number;
  onGravityChange: (value: number) => void;
  paused: boolean;
  onPausedToggle: () => void;
  onResetScene: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  debug, 
  onDebugToggle, 
  gravity, 
  onGravityChange,
  paused,
  onPausedToggle,
  onResetScene
}) => {
  return (
    <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded-lg backdrop-blur-sm">
      <h3 className="text-lg font-bold mb-3">🚀 Physics Controls</h3>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={onDebugToggle}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              debug 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            Debug: {debug ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={onPausedToggle}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              paused 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {paused ? '▶️ Play' : '⏸️ Pause'}
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <label className="text-sm">Gravity:</label>
          <input
            type="range"
            min="-20"
            max="0"
            step="0.5"
            value={gravity}
            onChange={(e) => onGravityChange(Number(e.target.value))}
            className="w-20"
          />
          <span className="text-sm w-8">{gravity}</span>
        </div>

        <button
          onClick={onResetScene}
          className="w-full px-3 py-1 rounded text-sm font-medium bg-orange-600 hover:bg-orange-700 transition-colors"
        >
          🔄 Reset Scene
        </button>

        <div className="text-xs text-gray-400 mt-4">
          <p>• <strong>Click cards</strong> to launch them</p>
          <p>• <strong>Drag</strong> to orbit camera</p>
          <p>• <strong>Scroll</strong> to zoom</p>
          <p>• <strong>Debug mode</strong> shows colliders</p>
        </div>
      </div>
    </div>
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
      renderOrder={1000}
      material-depthTest={false}
    >
      Loading Physics...
    </Text>
  </>
);

// Main physics playground component
export default function RapierPhysicsPlayground() {
  const [debug, setDebug] = useState(false);
  const [gravity, setGravity] = useState(-9.81);
  const [paused, setPaused] = useState(false);
  const [key, setKey] = useState(0); // For resetting scene
  const [error, setError] = useState<string | null>(null);

  const canvasStyle = useMemo(() => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  }), []);

  const handleResetScene = useCallback(() => {
    setKey(prev => prev + 1); // Force re-render to reset physics
  }, []);

  // Error boundary-like error handling
  const handleError = useCallback((error: Error) => {
    console.error('Physics playground error:', error);
    setError(error.message);
  }, []);

  if (error) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center bg-red-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-red-600 mb-4">Physics Engine Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <Canvas
        key={key}
        style={canvasStyle}
        camera={{ position: [8, 8, 8], fov: 60 }}
        shadows

      >
        <Suspense fallback={<PhysicsLoader />}>
          <PhysicsScene 
            debug={debug} 
            gravity={gravity}
            paused={paused}
          />
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={30}
          />
        </Suspense>
      </Canvas>

      <ControlPanel
        debug={debug}
        onDebugToggle={() => setDebug(!debug)}
        gravity={gravity}
        onGravityChange={setGravity}
        paused={paused}
        onPausedToggle={() => setPaused(!paused)}
        onResetScene={handleResetScene}
      />

      {/* Status indicator */}
      <div className="absolute bottom-4 right-4 bg-green-600/80 text-white px-3 py-2 rounded-lg text-sm">
        ✅ Physics Active - Rapier Engaged!
      </div>
    </div>
  );
} 