import { useGLTF } from '@react-three/drei';
import { Mesh } from 'three';

export interface Part {
  name: string;
  node: Mesh;
}

export default function useParts(url: string) {
  const { nodes } = useGLTF(url) as any;
  
  return Object.entries(nodes)
    .filter(([_, obj]: [string, any]) => obj.type === 'Mesh')
    .map(([name, node]) => ({ 
      name, 
      node 
    } as Part));
}

// Preload the model
useGLTF.preload('/models/GearboxAssy.glb'); 