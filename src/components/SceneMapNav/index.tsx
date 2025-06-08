import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PAGES, Page } from '../../routes';
import Block from './Block';

export default function SceneMapNav() {
  const navigate = useNavigate();
  const [focus, setFocus] = useState<any>(null);
  const pages: Page[] = PAGES;

  return (
    <Canvas 
      shadows 
      camera={{ position: [0, 6, 14], fov: 45 }} 
      style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)' }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight 
        position={[5, 10, 5]} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <Suspense fallback={null}>
        <Physics gravity={[0, -9.81, 0]}>
          {/* Ground with proper collider */}
          <RigidBody type="fixed" name="ground">
            <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
              <planeGeometry args={[50, 50]} />
              <shadowMaterial transparent opacity={0.3} />
            </mesh>
          </RigidBody>

          {/* Invisible walls to keep blocks in bounds */}
          <RigidBody type="fixed" position={[-25, 25, 0]}>
            <mesh>
              <boxGeometry args={[1, 50, 50]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>
          </RigidBody>
          <RigidBody type="fixed" position={[25, 25, 0]}>
            <mesh>
              <boxGeometry args={[1, 50, 50]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>
          </RigidBody>
          <RigidBody type="fixed" position={[0, 25, -25]}>
            <mesh>
              <boxGeometry args={[50, 50, 1]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>
          </RigidBody>
          <RigidBody type="fixed" position={[0, 25, 25]}>
            <mesh>
              <boxGeometry args={[50, 50, 1]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>
          </RigidBody>

          {/* Blocks – scatter in grid */}
          {pages.map((p, i) => (
            <Block
              key={p.path}
              page={p}
              onSelect={() => navigate(p.path)}
              position={[i * 2.5 - 3, 5 + Math.random() * 2, Math.random() * 4 - 2]}
              setFocus={setFocus}
            />
          ))}
        </Physics>
        {/* Smooth camera follow */}
        {focus && <Follow focus={focus} />}
      </Suspense>
    </Canvas>
  );
}

function Follow({ focus }: { focus: any }) {
  const { camera } = useThree();
  
  useFrame(() => {
    const target = focus.position.clone();
    target.y += 2;
    
    const newPosition = target.clone();
    newPosition.y += 4;
    newPosition.z += 10;
    
    camera.position.lerp(newPosition, 0.05);
    camera.lookAt(target);
  });
  
  return null;
} 