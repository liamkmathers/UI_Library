import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';

// Simple test without physics to see if the issue is with the basic setup
function SimpleTest() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <Box position={[0, 0, 0]} args={[2, 2, 2]}>
        <meshStandardMaterial color="hotpink" />
      </Box>
    </>
  );
}

export default function RapierPhysicsPlaygroundTest() {
  return (
    <div className="relative w-full h-screen">
      <Canvas
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        camera={{ position: [5, 5, 5], fov: 60 }}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <SimpleTest />
          <OrbitControls />
        </Suspense>
      </Canvas>
      
      <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded-lg">
        <h3>Simple Test - No Physics</h3>
        <p>You should see a pink cube</p>
      </div>
    </div>
  );
} 