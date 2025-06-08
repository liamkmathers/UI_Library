import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Physics, RigidBody, RapierRigidBody, CuboidCollider } from '@react-three/rapier';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import type { MeshStandardMaterial } from 'three';
import useParts from './useParts';

function Scene() {
  const parts = useParts('/models/GearboxAssy.glb');
  const bodyRefs = useRef<Map<string, RapierRigidBody>>(new Map());
  const worldPaused = useRef(false);

  const launchAllParts = () => {
    bodyRefs.current.forEach((body) => {
      // Reset any existing motion
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      
      // Create random impulses for each part
      const randomX = (Math.random() - 0.5) * 3;
      const randomY = 8 + Math.random() * 4; // Random upward force between 8-12
      const randomZ = (Math.random() - 0.5) * 3;
      
      body.applyImpulse({ x: randomX, y: randomY, z: randomZ }, true);
      body.applyTorqueImpulse(
        { x: randomX * 0.5, y: Math.random() * 2, z: randomZ * 0.5 },
        true
      );
    });
  };

  return (
    <>
      <Environment preset="warehouse" />
      <ambientLight intensity={0.7} />
      <directionalLight 
        position={[5, 10, 5]} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
        intensity={1.5}
      />

      {/* Click detector plane */}
      <mesh
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={launchAllParts}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <Physics 
        gravity={[0, -9.81, 0]}
        timeStep={1/120}
      >
        {/* Ground */}
        <RigidBody type="fixed" friction={0.7} restitution={0}>
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#303030" />
          </mesh>
          <CuboidCollider args={[25, 0.1, 25]} position={[0, 0, 0]} />
        </RigidBody>

        {/* Parts */}
        {parts.map(({ name, node }, i) => {
          const material = node.material as MeshStandardMaterial;
          const baseColor = material.color.getHexString();
          return (
            <RigidBody
              key={name}
              ref={(body: RapierRigidBody) => {
                if (body) bodyRefs.current.set(name, body);
              }}
              colliders="hull"
              friction={1}
              restitution={0.2}
              angularDamping={0.8}
              linearDamping={0.5}
              position={[0, 10 + i * 0.5, 0]}
              rotation={[
                Math.random() * 0.2, 
                Math.random() * Math.PI * 2, 
                Math.random() * 0.2
              ]}
              scale={0.4}
              onCollisionEnter={() => {
                if (!worldPaused.current) {
                  setTimeout(() => {
                    const body = bodyRefs.current.get(name);
                    if (body?.isSleeping()) {
                      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
                      body.setAngvel({ x: 0, y: 0, z: 0 }, true);
                    }
                  }, 2000);
                }
              }}
            >
              <primitive 
                object={node.clone()} 
                castShadow 
                receiveShadow
                onClick={(e: ThreeEvent<MouseEvent>) => {
                  e.stopPropagation();
                  launchAllParts();
                }}
                onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                  e.stopPropagation();
                  document.body.style.cursor = 'pointer';
                }}
                onPointerOut={() => {
                  document.body.style.cursor = 'auto';
                }}
              >
                <meshStandardMaterial 
                  color={`#${baseColor}`}
                  roughness={material.roughness}
                  metalness={material.metalness}
                />
              </primitive>
            </RigidBody>
          );
        })}
      </Physics>

      <OrbitControls 
        enableDamping 
        dampingFactor={0.05} 
        minDistance={10}
        maxDistance={50}
      />
    </>
  );
}

export default function TeardownHero() {
  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [0, 15, 25], fov: 45 }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
} 