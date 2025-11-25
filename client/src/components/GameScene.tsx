import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Terrain } from "./Terrain";
import { BuildingModel } from "./BuildingModel";
import { useSettlement } from "@/lib/stores/useSettlement";
import * as THREE from "three";

function Lights({ timeOfDay }: { timeOfDay: number }) {
  const sunRef = useRef<THREE.DirectionalLight>(null);
  
  useFrame(() => {
    if (sunRef.current) {
      const angle = timeOfDay * Math.PI * 2;
      const radius = 20;
      sunRef.current.position.x = Math.cos(angle) * radius;
      sunRef.current.position.y = Math.sin(angle) * radius + 10;
      sunRef.current.position.z = Math.sin(angle) * radius;
      
      const intensity = Math.max(0.3, Math.sin(angle));
      sunRef.current.intensity = intensity;
      
      const dayColor = new THREE.Color("#ffffff");
      const sunsetColor = new THREE.Color("#ff9966");
      const nightColor = new THREE.Color("#4444ff");
      
      if (timeOfDay < 0.25 || timeOfDay > 0.75) {
        sunRef.current.color.copy(nightColor);
      } else if (timeOfDay < 0.3 || timeOfDay > 0.7) {
        sunRef.current.color.copy(sunsetColor);
      } else {
        sunRef.current.color.copy(dayColor);
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        ref={sunRef}
        castShadow
        position={[10, 20, 10]}
        intensity={1}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
    </>
  );
}

function SkyBackground({ timeOfDay }: { timeOfDay: number }) {
  const { scene } = useThree();
  
  useFrame(() => {
    const dayColor = new THREE.Color("#87CEEB");
    const sunsetColor = new THREE.Color("#FF6B35");
    const nightColor = new THREE.Color("#191970");
    
    let color: THREE.Color;
    
    if (timeOfDay < 0.25 || timeOfDay > 0.75) {
      color = nightColor;
    } else if (timeOfDay < 0.3) {
      const t = (timeOfDay - 0.25) / 0.05;
      color = new THREE.Color().lerpColors(nightColor, sunsetColor, t);
    } else if (timeOfDay < 0.5) {
      const t = (timeOfDay - 0.3) / 0.2;
      color = new THREE.Color().lerpColors(sunsetColor, dayColor, t);
    } else if (timeOfDay < 0.7) {
      color = dayColor;
    } else {
      const t = (timeOfDay - 0.7) / 0.05;
      color = new THREE.Color().lerpColors(dayColor, sunsetColor, t);
    }
    
    scene.background = color;
  });
  
  return null;
}

function BuildingPlacer() {
  const { camera, raycaster, pointer, scene } = useThree();
  const [previewPosition, setPreviewPosition] = useState<[number, number, number] | null>(null);
  const { selectedBuildingType, placeBuilding, canAffordBuilding } = useSettlement();
  const planeRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0;
    scene.add(plane);
    planeRef.current = plane;

    return () => {
      scene.remove(plane);
    };
  }, [scene]);

  useFrame(() => {
    if (!selectedBuildingType || !planeRef.current) {
      setPreviewPosition(null);
      return;
    }

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(planeRef.current);

    if (intersects.length > 0) {
      const point = intersects[0].point;
      const snappedX = Math.round(point.x / 2) * 2;
      const snappedZ = Math.round(point.z / 2) * 2;
      
      if (Math.abs(snappedX) < 40 && Math.abs(snappedZ) < 40) {
        setPreviewPosition([snappedX, 0, snappedZ]);
      } else {
        setPreviewPosition(null);
      }
    } else {
      setPreviewPosition(null);
    }
  });

  useEffect(() => {
    const handleClick = () => {
      if (selectedBuildingType && previewPosition && canAffordBuilding(selectedBuildingType)) {
        placeBuilding(selectedBuildingType, previewPosition);
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [selectedBuildingType, previewPosition, placeBuilding, canAffordBuilding]);

  if (!selectedBuildingType || !previewPosition) return null;

  return (
    <BuildingModel
      type={selectedBuildingType}
      position={previewPosition}
      isPreview
    />
  );
}

export function GameScene() {
  const { buildings, timeOfDay, updateTime, generateResources } = useSettlement();

  useFrame((state, delta) => {
    updateTime(delta * 0.02);
    generateResources();
  });

  return (
    <>
      <SkyBackground timeOfDay={timeOfDay} />
      <Lights timeOfDay={timeOfDay} />
      <Terrain />
      
      {buildings.map((building) => (
        <BuildingModel
          key={building.id}
          type={building.type}
          position={building.position}
        />
      ))}
      
      <BuildingPlacer />
    </>
  );
}
