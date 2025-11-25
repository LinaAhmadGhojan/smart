import { useRef } from "react";
import { type BuildingType } from "@/lib/stores/useSettlement";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

interface BuildingModelProps {
  type: BuildingType;
  position: [number, number, number];
  onClick?: () => void;
  isPreview?: boolean;
}

export function BuildingModel({ type, position, onClick, isPreview = false }: BuildingModelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const woodTexture = useTexture("/textures/wood.jpg");

  const getBuildingGeometry = () => {
    switch (type) {
      case "home":
        return { width: 2, height: 2.5, depth: 2, color: "#8B4513" };
      case "farm":
        return { width: 3, height: 1.5, depth: 3, color: "#CD853F" };
      case "workshop":
        return { width: 2.5, height: 2, depth: 2.5, color: "#654321" };
      case "well":
        return { width: 1.5, height: 1, depth: 1.5, color: "#708090" };
      default:
        return { width: 2, height: 2, depth: 2, color: "#8B4513" };
    }
  };

  const { width, height, depth, color } = getBuildingGeometry();

  return (
    <group position={position}>
      {/* Base */}
      <mesh
        ref={meshRef}
        castShadow
        position={[0, height / 2, 0]}
        onClick={onClick}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={color}
          map={woodTexture}
          transparent={isPreview}
          opacity={isPreview ? 0.6 : 1}
        />
      </mesh>

      {/* Roof for homes and workshops */}
      {(type === "home" || type === "workshop") && (
        <mesh castShadow position={[0, height + 0.5, 0]}>
          <coneGeometry args={[width * 0.8, 1.2, 4]} />
          <meshStandardMaterial color="#4A2511" transparent={isPreview} opacity={isPreview ? 0.6 : 1} />
        </mesh>
      )}

      {/* Special features */}
      {type === "well" && (
        <>
          <mesh castShadow position={[0, height + 0.3, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.6, 8]} />
            <meshStandardMaterial color="#A9A9A9" transparent={isPreview} opacity={isPreview ? 0.6 : 1} />
          </mesh>
          <mesh castShadow position={[0, height + 0.8, 0]}>
            <boxGeometry args={[1.2, 0.1, 0.1]} />
            <meshStandardMaterial color="#654321" transparent={isPreview} opacity={isPreview ? 0.6 : 1} />
          </mesh>
        </>
      )}
    </group>
  );
}
