import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';

// Simple physics test
function SimplePhysicsTest() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <Physics gravity={[0, -9.81, 0]}>
        {/* Ground */}
        <RigidBody type="fixed">
          <Box position={[0, -2, 0]} args={[10, 0.5, 10]}>
            <meshStandardMaterial color="gray" />
          </Box>
        </RigidBody>
        
        {/* Falling box */}
        <RigidBody>
          <Box position={[0, 5, 0]} args={[1, 1, 1]}>
            <meshStandardMaterial color="hotpink" />
          </Box>
        </RigidBody>
      </Physics>
    </>
  );
}

export default function SimplePhysicsPlayground() {
  return (
    <div className="relative w-full h-screen">
      <Canvas
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        camera={{ position: [5, 5, 5], fov: 60 }}
      >
        <Suspense fallback={null}>
          <SimplePhysicsTest />
          <OrbitControls />
        </Suspense>
      </Canvas>
      
      <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded-lg">
        <h3>Simple Physics Test</h3>
        <p>You should see a pink cube falling onto a gray platform</p>
      </div>
    </div>
  );
} 