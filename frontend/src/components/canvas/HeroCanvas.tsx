"use client";

import React, { Suspense, useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { LaptopModel } from "./LaptopModel";
import { CanvasLoader } from "./CanvasLoader";

interface HeroCanvasProps {
  onFocusScreen?: () => void;
  interactiveControls?: boolean;
}

// Check real WebGL support safely
function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

// Responsive layout descriptor based on viewport width
interface ResponsiveConfig {
  isMobile: boolean;
  isTablet: boolean;
  scale: number;
  position: [number, number, number];
  rotation: [number, number, number];
  plinthSize: [number, number, number];
  shadowPos: [number, number, number];
  shadowScale: number;
  cameraPos: [number, number, number];
  fov: number;
  maxDpr: number;
}

function getResponsiveConfig(width: number): ResponsiveConfig {
  if (width < 480) {
    // Small to medium smartphones (320px - 479px)
    // Scale dynamically down for extremely small devices (e.g. 320px)
    const factor = Math.max(0.68, Math.min(0.85, (width / 400) * 0.82));
    return {
      isMobile: true,
      isTablet: false,
      scale: factor,
      // Shifted downwards to leave generous breathing room for the hero headline
      position: [0, -0.42, 0],
      // Rotated forward slightly so the screen faces camera squarely and is easily readable
      rotation: [-0.02, -0.16, 0],
      plinthSize: [3.4, 0.3, 2.8],
      shadowPos: [0, -0.66, 0],
      shadowScale: 5.5,
      cameraPos: [0, 0.85, 5.2],
      fov: 42,
      maxDpr: 1.25,
    };
  } else if (width < 768) {
    // Large smartphones (480px - 767px)
    return {
      isMobile: true,
      isTablet: false,
      scale: 0.95,
      position: [0, -0.32, 0],
      rotation: [-0.02, -0.22, 0],
      plinthSize: [3.8, 0.32, 3.0],
      shadowPos: [0, -0.68, 0],
      shadowScale: 6.5,
      cameraPos: [0, 0.95, 5.0],
      fov: 40,
      maxDpr: 1.25,
    };
  } else if (width < 1024) {
    // Tablets & Small Laptops (768px - 1023px)
    return {
      isMobile: false,
      isTablet: true,
      scale: 1.05,
      position: [0.65, -0.12, 0],
      rotation: [-0.03, -0.3, 0.01],
      plinthSize: [4.6, 0.35, 3.4],
      shadowPos: [0.65, -0.7, 0],
      shadowScale: 7.5,
      cameraPos: [0.15, 1.0, 5.0],
      fov: 39,
      maxDpr: 1.5,
    };
  } else {
    // Desktop (1024px+) - Exact original pristine coordinates & lighting
    return {
      isMobile: false,
      isTablet: false,
      scale: 1.22,
      position: [1.35, -0.06, 0],
      rotation: [-0.03, -0.36, 0.01],
      plinthSize: [5.2, 0.38, 3.8],
      shadowPos: [1.35, -0.72, 0],
      shadowScale: 8.5,
      cameraPos: [0.32, 1.05, 5.0],
      fov: 38,
      maxDpr: 1.5,
    };
  }
}

// Controlled mouse parallax rig with gentle, organic breathing idle motion
// Respects prefers-reduced-motion and touch devices
function SceneParallaxRig({
  children,
  reducedMotion = false,
}: {
  children: React.ReactNode;
  reducedMotion?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!groupRef.current) return;
    if (reducedMotion) {
      groupRef.current.rotation.x = 0;
      groupRef.current.rotation.y = 0;
      return;
    }

    const time = state.clock.getElapsedTime();
    // Subtle breathing float
    const idleRotX = Math.sin(time * 0.7) * 0.005;
    const idleRotY = Math.cos(time * 0.5) * 0.007;

    target.current.x = THREE.MathUtils.lerp(
      target.current.x,
      -state.pointer.y * 0.015 + idleRotX,
      0.04
    );
    target.current.y = THREE.MathUtils.lerp(
      target.current.y,
      state.pointer.x * 0.02 + idleRotY,
      0.04
    );

    groupRef.current.rotation.x = target.current.x;
    groupRef.current.rotation.y = target.current.y;
  });

  return <group ref={groupRef}>{children}</group>;
}

// Architectural Slate Desk Plinth (Dimensions adapt smoothly to screen width)
function WorkstationPlinth({
  size = [5.2, 0.38, 3.8],
}: {
  size?: [number, number, number];
}) {
  const edgeGeo = useMemo(() => new THREE.BoxGeometry(...size), [size]);

  useEffect(() => {
    return () => {
      edgeGeo.dispose();
    };
  }, [edgeGeo]);

  return (
    <group position={[0, -0.48, 0]}>
      {/* Precision architectural pedestal */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color="#14171f"
          roughness={0.82}
          metalness={0.18}
        />
      </mesh>
      {/* Subtle chamfer outline */}
      <lineSegments position={[0, 0, 0]}>
        <edgesGeometry args={[edgeGeo]} />
        <lineBasicMaterial color="#2c3345" transparent opacity={0.6} />
      </lineSegments>
    </group>
  );
}

// Dominant 3D Workstation Scene (Seamlessly positioned and scaled by viewport)
function WorkstationScene({
  onScreenClick,
  config,
}: {
  onScreenClick?: () => void;
  config: ResponsiveConfig;
}) {
  return (
    <group position={config.position}>
      {/* 1. Architectural Slate Plinth */}
      <WorkstationPlinth size={config.plinthSize} />

      {/* 2. Dominant Laptop */}
      <group
        position={[0, -0.22, 0]}
        rotation={config.rotation}
        scale={config.scale}
      >
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

// Universal Graceful Fallback if WebGL is completely disabled or unsupported
function MobileStaticFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center lg:justify-end px-4 sm:px-6 lg:pr-20 pointer-events-none">
      <div className="relative w-full max-w-[480px] aspect-[16/10] rounded-2xl border border-[#ff5a1f]/30 bg-[#0d1017] p-5 sm:p-7 shadow-2xl flex flex-col justify-between overflow-hidden pointer-events-auto">
        <div className="absolute top-0 right-0 w-56 h-56 bg-[#ff5a1f]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Mock Terminal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <span className="font-mono text-[11px] sm:text-xs text-[#8c94a5] tracking-widest font-semibold truncate px-2">
            manas@workstation ~ (zsh)
          </span>
          <span className="text-[9px] sm:text-[10px] font-mono text-[#ff5a1f] px-2 py-0.5 rounded bg-[#ff5a1f]/10 border border-[#ff5a1f]/30 whitespace-nowrap">
            ACTIVE
          </span>
        </div>

        {/* Mock Terminal Body */}
        <div className="font-mono text-xs sm:text-sm text-white space-y-2 py-3">
          <p className="text-[#ff5a1f] font-bold">&gt; whoami</p>
          <p className="text-white pl-3 font-bold">manas mishra</p>
          <p className="text-[#ff5a1f] font-bold">&gt; role</p>
          <p className="text-[#e2e8f0] pl-3">computer science engineer</p>
          <p className="text-[#ff5a1f] font-bold">&gt; focus</p>
          <p className="text-[#ff8c5a] pl-3 font-semibold">data &rarr; intelligence &rarr; application</p>
          <p className="text-[#ff5a1f] font-bold">&gt; status</p>
          <p className="text-[#ffffff] pl-3 font-semibold">building &bull; learning &bull; innovating</p>
        </div>

        {/* Mock Footer */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#788194]">
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
  const [hasWebGL, setHasWebGL] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    setMounted(true);
    setHasWebGL(checkWebGLSupport());

    const checkMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(checkMotion.matches);
    const motionListener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    checkMotion.addEventListener("change", motionListener);

    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      checkMotion.removeEventListener("change", motionListener);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const config = useMemo(() => getResponsiveConfig(viewportWidth), [viewportWidth]);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-[#08090b] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-[#ff5a1f] border-r-[#ff5a1f] border-b-transparent border-l-transparent animate-spin" />
      </div>
    );
  }

  // Graceful fallback ONLY if WebGL cannot be initialized at all
  if (!hasWebGL) {
    return <MobileStaticFallback />;
  }

  return (
    <div className="relative w-full h-full select-none cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: config.cameraPos, fov: config.fov }}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        dpr={[1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, config.maxDpr)]}
      >
        <Suspense fallback={<CanvasLoader />}>
          <StudioLighting />

          <SceneParallaxRig reducedMotion={reducedMotion}>
            <WorkstationScene onScreenClick={onFocusScreen} config={config} />
          </SceneParallaxRig>

          {/* Ground Contact Shadow - Position and scale adapt dynamically */}
          <ContactShadows
            position={config.shadowPos}
            opacity={0.5}
            scale={config.shadowScale}
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
              rotateSpeed={config.isMobile ? 0.25 : 0.35}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

