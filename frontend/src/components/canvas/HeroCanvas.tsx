"use client";

import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { LaptopModel } from "./LaptopModel";
import { CanvasLoader } from "./CanvasLoader";

interface HeroCanvasProps {
  onFocusScreen?: () => void;
  interactiveControls?: boolean;
}

// Controlled mouse parallax rig with gentle, organic breathing idle motion
function SceneParallaxRig({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Subtle breathing float
    const idleRotX = Math.sin(time * 0.7) * 0.006;
    const idleRotY = Math.cos(time * 0.5) * 0.008;

    target.current.x = THREE.MathUtils.lerp(target.current.x, -state.pointer.y * 0.018 + idleRotX, 0.04);
    target.current.y = THREE.MathUtils.lerp(target.current.y, state.pointer.x * 0.025 + idleRotY, 0.04);

    groupRef.current.rotation.x = target.current.x;
    groupRef.current.rotation.y = target.current.y;
  });

  return <group ref={groupRef}>{children}</group>;
}

// Architectural Slate Desk Plinth
function WorkstationPlinth() {
  return (
    <group position={[0, -0.48, 0]}>
      {/* Precision architectural pedestal */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[5.2, 0.38, 3.8]} />
        <meshStandardMaterial
          color="#14171f"
          roughness={0.82}
          metalness={0.18}
        />
      </mesh>
      {/* Subtle chamfer outline */}
      <lineSegments position={[0, 0, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(5.2, 0.38, 3.8)]} />
        <lineBasicMaterial color="#2c3345" transparent opacity={0.6} />
      </lineSegments>
    </group>
  );
}

// Dominant 3D Workstation Scene (Crisp, prominent, hero-centered)
function WorkstationScene({ onScreenClick }: { onScreenClick?: () => void }) {
  return (
    <group position={[1.35, -0.06, 0]}>
      {/* 1. Architectural Slate Plinth */}
      <WorkstationPlinth />

      {/* 2. Dominant Laptop: 1.22x scale for clear hero prominence */}
      <group position={[0, -0.22, 0]} rotation={[-0.03, -0.36, 0.01]} scale={1.22}>
        <LaptopModel accentColor="#ff5a1f" onScreenClick={onScreenClick} />
      </group>
    </group>
  );
}

// Studio Lighting tuned for brightness and crisp metallic highlights
function StudioLighting() {
  return (
    <>
      <ambientLight intensity={1.35} color="#1d2332" />

      {/* Primary Key Light */}
      <directionalLight
        position={[6, 8, 5]}
        intensity={3.2}
        color="#fff7f0"
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-bias={-0.0004}
      />

      {/* Cool Specular Rim Light for crisp edge highlights on space-gray chassis */}
      <directionalLight
        position={[-6, 6, -4]}
        intensity={2.6}
        color="#a5c8ff"
      />

      {/* Warm Orange Accent Light */}
      <pointLight
        position={[3.0, 0.3, 2.4]}
        intensity={2.8}
        distance={7.0}
        color="#ff5a1f"
      />

      {/* Soft Fill Light from Lower Left */}
      <pointLight
        position={[-3.0, 1.0, 3.0]}
        intensity={0.8}
        distance={6.0}
        color="#d0dbed"
      />
    </>
  );
}

// Static Fallback for Low-Power Devices & Mobile (Strictly isolated to right side on lg screens)
function MobileStaticFallback() {
  return (
    <div className="hidden lg:flex w-full h-full items-center justify-end pr-6 lg:pr-20 pointer-events-none">
      <div className="relative w-full max-w-[500px] aspect-[16/10] rounded-2xl border border-white/10 bg-[#0d1017] p-7 shadow-2xl flex flex-col justify-between overflow-hidden pointer-events-auto">
        <div className="absolute top-0 right-0 w-56 h-56 bg-[#ff5a1f]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Mock Terminal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="font-mono text-xs text-[#8c94a5] tracking-widest font-semibold">
            manas@workstation ~ (zsh)
          </span>
          <span className="text-[10px] font-mono text-[#ff5a1f] px-2 py-0.5 rounded bg-[#ff5a1f]/10 border border-[#ff5a1f]/30">
            ACTIVE
          </span>
        </div>

        {/* Mock Terminal Body */}
        <div className="font-mono text-sm text-white space-y-2.5 py-4">
          <p className="text-[#ff5a1f] font-bold text-base">&gt; whoami</p>
          <p className="text-white pl-4 font-bold text-base">manas mishra</p>
          <p className="text-[#ff5a1f] font-bold text-base">&gt; role</p>
          <p className="text-[#e2e8f0] pl-4">computer science engineer</p>
          <p className="text-[#ff5a1f] font-bold text-base">&gt; focus</p>
          <p className="text-[#ff8c5a] pl-4 font-semibold">data &rarr; intelligence &rarr; application</p>
          <p className="text-[#ff5a1f] font-bold text-base">&gt; status</p>
          <p className="text-[#ffffff] pl-4 font-semibold">building &bull; learning &bull; innovating</p>
        </div>

        {/* Mock Footer */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#788194]">
          <span>KSIT BENGALURU &apos;27</span>
          <span className="text-[#ff5a1f] font-semibold">ML / SYSTEMS</span>
        </div>
      </div>
    </div>
  );
}

export const HeroCanvas: React.FC<HeroCanvasProps> = ({
  onFocusScreen,
  interactiveControls = true,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    setMounted(true);

    const isMobile = window.innerWidth < 1024 || window.matchMedia("(pointer: coarse)").matches;
    const nav = navigator as unknown as { deviceMemory?: number; hardwareConcurrency?: number };
    const isUnderpowered = (nav.deviceMemory && nav.deviceMemory < 4) || (nav.hardwareConcurrency && nav.hardwareConcurrency < 4);

    if (isMobile || isUnderpowered) {
      setIsLowPower(true);
    }
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-[#08090b] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-[#ff5a1f] border-r-[#ff5a1f] border-b-transparent border-l-transparent animate-spin" />
      </div>
    );
  }

  if (isLowPower) {
    return <MobileStaticFallback />;
  }

  return (
    <div className="relative w-full h-full select-none cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0.32, 1.05, 5.0], fov: 38 }}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        dpr={[1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.25)]}
      >
        <Suspense fallback={<CanvasLoader />}>
          <StudioLighting />

          <SceneParallaxRig>
            <WorkstationScene onScreenClick={onFocusScreen} />
          </SceneParallaxRig>

          {/* Ground Contact Shadow */}
          <ContactShadows
            position={[1.35, -0.72, 0]}
            opacity={0.5}
            scale={8.5}
            blur={2.2}
            far={3.5}
            color="#000000"
          />

          {interactiveControls && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 1.7}
              minPolarAngle={Math.PI / 2.8}
              maxAzimuthAngle={Math.PI / 5.5}
              minAzimuthAngle={-Math.PI / 5.5}
              dampingFactor={0.06}
              rotateSpeed={0.35}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
