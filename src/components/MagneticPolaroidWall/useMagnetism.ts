import { useEffect, useRef } from 'react';
import { Vector2 } from 'three';
import { useThree, useFrame } from '@react-three/fiber';

export default function useMagnetism(meshes: THREE.Mesh[]) {
  const { camera } = useThree();
  const mousePos = useRef(new Vector2());
  
  useEffect(() => {
    function onMove(e: PointerEvent) {
      mousePos.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    }

    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame(() => {
    if (!meshes.length) return;
    
    meshes.forEach((mesh) => {
      if (!mesh) return;
      
      // Project mesh to NDC space
      const v = mesh.position.clone();
      v.project(camera as any);
      const d = mousePos.current.distanceTo(new Vector2(v.x, v.y)); // 0–~2
      const strength = Math.max(0, 1 - d * 0.8); // inverse falloff
      
      // Smoothly animate position and rotation
      const targetZ = strength * 0.8;
      const targetRotX = -strength * 0.15;
      const targetRotY = strength * 0.15;
      
      mesh.position.z += (targetZ - mesh.position.z) * 0.1;
      mesh.rotation.x += (targetRotX - mesh.rotation.x) * 0.1;
      mesh.rotation.y += (targetRotY - mesh.rotation.y) * 0.1;
    });
  });
} 