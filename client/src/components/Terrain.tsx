import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function Terrain() {
  const grassTexture = useTexture("/textures/grass.png");
  
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(10, 10);

  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial map={grassTexture} />
    </mesh>
  );
}
