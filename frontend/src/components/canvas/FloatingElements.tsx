"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FloatingElementsProps {
  wireframeOnly?: boolean;
  accentColor?: string;
}

/**
 * Minimal, refined atmospheric floating elements confined strictly to the
 * right-hand side of the 3D hero viewport to keep text on the left completely unobstructed.
 */
export const FloatingElements: React.FC<FloatingElementsProps> = ({
  wireframeOnly = false,
  accentColor = "#ff5a1f",
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const icosaRef = useRef<THREE.Mesh>(null);
  const cubeRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Minimal subtle background motes (only 20 particles, confined to right zone)
  const particleCount = 22;
  const particlePositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Confine X to right hemisphere (0.5 to 4.5)
      pos[i * 3] = 0.5 + Math.random() * 4.0;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = -1.5 - Math.random() * 3.5;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Gentle, subtle rotational drift for the single wireframe polyhedron
    if (icosaRef.current) {
      icosaRef.current.rotation.x += delta * 0.15;
      icosaRef.current.rotation.y += delta * 0.2;
      icosaRef.current.position.y = 1.4 + Math.sin(time * 0.7) * 0.08;
    }

    // Subtle floating drift for the single dark metallic block
    if (cubeRef.current) {
      cubeRef.current.rotation.x += delta * 0.12;
      cubeRef.current.rotation.z -= delta * 0.1;
      cubeRef.current.position.y = -1.3 + Math.cos(time * 0.6) * 0.06;
    }

    // Slow ambient rotation of particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. SINGLE DELICATE WIREFRAME ICOSAHEDRON (Top Right Accent) */}
      <mesh
        ref={icosaRef}
        position={[2.4, 1.4, -0.8]}
        scale={0.7}
      >
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          color={accentColor}
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* 2. SINGLE SLEEK ANODIZED METALLIC ACCENT CUBE (Bottom Right Accent) */}
      <mesh
        ref={cubeRef}
        position={[2.6, -1.3, -1.0]}
        scale={0.38}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#16181d"
          metalness={0.9}
          roughness={0.3}
          wireframe={wireframeOnly}
        />
      </mesh>

      {/* 3. MINIMAL ATMOSPHERIC MOTES (Soft, non-distracting) */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color={accentColor}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
