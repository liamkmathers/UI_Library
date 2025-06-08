import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Environment } from '@react-three/drei';
import { Physics, RigidBody, RapierRigidBody } from '@react-three/rapier';
import { Suspense, useState, useRef } from 'react';
import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import type { MeshStandardMaterial } from 'three';
import useParts from './useParts';
import InfoCard from './InfoCard';

function Scene() {
  const parts = useParts('/models/GearboxAssy.glb');
  const [active, setActive] = useState<string | null>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const bodyRefs = useRef<Map<string, RapierRigidBody>>(new Map());
  const { camera } = useThree();
  const worldPaused = useRef(false);

  // Camera animation
  useFrame(() => {
    if (active && bodyRefs.current.has(active)) {
      const body = bodyRefs.current.get(active)!;
      const position = body.translation();
      
      // Very subtle zoom - just slightly closer than the main camera
      const target = new THREE.Vector3(position.x, position.y + 11, position.z + 11);
      camera.position.lerp(target, 0.05);
      camera.lookAt(position.x, position.y, position.z);
    }
  });

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

      <Physics 
        gravity={[0, -9.81, 0]}
        timeStep={1/120} // Slow-mo initially
      >
        {/* Ground */}
        <RigidBody type="fixed" friction={0.7}>
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#303030" />
          </mesh>
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
              friction={1.8}
              restitution={0.2}
              angularDamping={1}
              linearDamping={0.8}
              position={[0, 10 + i * 0.5, 0]} // Higher starting position
              rotation={[
                Math.random() * 0.2, 
                Math.random() * Math.PI * 2, 
                Math.random() * 0.2
              ]}
              scale={0.4} // Scale down the parts
              onCollisionEnter={() => {
                // After first impact, freeze this body for perf
                if (!worldPaused.current) {
                  setTimeout(() => {
                    const body = bodyRefs.current.get(name);
                    if (body?.isSleeping()) {
                      // Freeze the body by setting zero velocities
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
                  setActive(name);
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

      {/* Info overlay */}
      {active && bodyRefs.current.has(active) && (
        <Html
          position={bodyRefs.current.get(active)!.translation() as unknown as [number, number, number]}
          wrapperClass="pointer-events-auto"
          distanceFactor={15}
          center
          style={{
            transform: 'translateX(100px)' // Offset to the right of the part
          }}
        >
          <InfoCard 
            partName={active} 
            onClose={() => {
              setActive(null);
              // Reset camera to a better default view
              camera.position.set(0, 15, 25);
              camera.lookAt(0, 0, 0);
            }} 
          />
        </Html>
      )}

      {/* Controls */}
      <OrbitControls 
        enableDamping 
        dampingFactor={0.05} 
        enabled={!active}
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