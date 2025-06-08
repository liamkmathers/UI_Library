import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Text } from '@react-three/drei';
import { useRef } from 'react';
import { Page } from '../../routes';

export default function Block({ page, onSelect, position, setFocus }: {
  page: Page;
  onSelect: () => void;
  position: [number, number, number];
  setFocus: (obj: any) => void;
}) {
  const apiRef = useRef<any>(null);
  const meshRef = useRef<any>(null);

  return (
    <RigidBody
      ref={apiRef}
      colliders={false}
      type="dynamic"
      friction={4}        // high → stop quickly
      restitution={0.2}   // little bounce, feels soft
      linearDamping={1.5} // slows drift
      angularDamping={1.2}
      position={position}
      onCollisionEnter={({ other }) => {
        // When block hits ground for first time, freeze it (perf)
        if (other.rigidBodyObject?.name === 'ground') {
          // convert to fixed after 2s so user can still nudge
          setTimeout(() => {
            if (apiRef.current?.isSleeping()) {
              apiRef.current?.setBodyType('fixed');
            }
          }, 2000);
        }
      }}
    >
      <CuboidCollider args={[1, 0.5, 1]} />
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          if (meshRef.current) {
            setFocus(meshRef.current);
            onSelect();
          }
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color={page.color} />
        <Text
          fontSize={0.35}
          anchorY="middle"
          outlineColor="#ffffff"
          outlineWidth={0.015}
          position={[0, 0, 1.1]}
        >
          {page.label}
        </Text>
      </mesh>
    </RigidBody>
  );
} 