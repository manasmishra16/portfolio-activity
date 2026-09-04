"use client";

import React, { useMemo } from "react";
import * as THREE from "three";

// Generate a procedural concrete texture with grit, micro-pores and rough color shifts
function createConcreteTextures() {
  if (typeof document === "undefined") {
    return { map: null, bumpMap: null, roughnessMap: null };
  }

  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { map: null, bumpMap: null, roughnessMap: null };

  // Base raw concrete tone - lighter stone grey to match reference photo
  ctx.fillStyle = "#747882";
  ctx.fillRect(0, 0, size, size);

  // Micro-pores and aggregate speckles
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Noise variation
    const noise = (Math.random() - 0.5) * 55;
    // Concrete color ~ 115, 120, 130
    const r = Math.min(255, Math.max(0, 118 + noise));
    const g = Math.min(255, Math.max(0, 122 + noise));
    const b = Math.min(255, Math.max(0, 130 + noise));

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);

  // Add darker cement aggregate blotches and chips
  for (let j = 0; j < 180; j++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = Math.random() * 9 + 1;
    const alpha = Math.random() * 0.28;
    ctx.fillStyle = `rgba(35, 38, 44, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Create Three textures
  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(1.5, 1.5);

  const bumpMap = new THREE.CanvasTexture(canvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(1.5, 1.5);

  return { map, bumpMap };
}

interface CinderBlockProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  color?: string;
  wireframe?: boolean;
}

export const CinderBlock: React.FC<CinderBlockProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = "#8c909a",
  wireframe = false,
}) => {
  // Construct genuine double-hollow concrete cinder block geometry
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const w = 1.9; // length
    const h = 0.95; // height

    // Outer rectangle centered
    shape.moveTo(-w / 2, -h / 2);
    shape.lineTo(w / 2, -h / 2);
    shape.lineTo(w / 2, h / 2);
    shape.lineTo(-w / 2, h / 2);
    shape.closePath();

    // Chamber 1 (left hole)
    const hole1 = new THREE.Path();
    const hw = 0.65;
    const hh = 0.65;
    const offset = 0.48;

    hole1.moveTo(-offset - hw / 2, -hh / 2);
    hole1.lineTo(-offset + hw / 2, -hh / 2);
    hole1.lineTo(-offset + hw / 2, hh / 2);
    hole1.lineTo(-offset - hw / 2, hh / 2);
    hole1.closePath();
    shape.holes.push(hole1);

    // Chamber 2 (right hole)
    const hole2 = new THREE.Path();
    hole2.moveTo(offset - hw / 2, -hh / 2);
    hole2.lineTo(offset + hw / 2, -hh / 2);
    hole2.lineTo(offset + hw / 2, hh / 2);
    hole2.lineTo(offset - hw / 2, hh / 2);
    hole2.closePath();
    shape.holes.push(hole2);

    const extrudeSettings = {
      depth: 0.95, // depth
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.03,
      bevelThickness: 0.03,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Center geometry so rotation happens naturally around its pivot
    geom.center();
    return geom;
  }, []);

  const { map, bumpMap } = useMemo(() => createConcreteTextures(), []);

  return (
    <mesh
      geometry={geometry}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        map={map || undefined}
        bumpMap={bumpMap || undefined}
        bumpScale={0.035}
        roughness={0.92}
        metalness={0.06}
        wireframe={wireframe}
      />
    </mesh>
  );
};
