"use client";

import React, { useState, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { soundManager } from "@/lib/audio";
import { Sliders, RotateCcw, Cpu, Sparkles } from "lucide-react";
import { CinderBlock } from "../canvas/CinderBlock";

function SandboxMesh({
  rotationSpeed,
  roughness,
  wireframe,
  glow,
}: {
  rotationSpeed: number;
  roughness: number;
  wireframe: boolean;
  glow: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const icosaRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (rotationSpeed * 0.5);
      meshRef.current.rotation.x += delta * (rotationSpeed * 0.25);
    }
    if (icosaRef.current) {
      icosaRef.current.rotation.z -= delta * (rotationSpeed * 0.7);
    }
  });

  return (
    <Float speed={rotationSpeed * 2} rotationIntensity={0.6} floatIntensity={0.8}>
      <group ref={meshRef}>
        {/* Central Cinder Block with configurable roughness */}
        <CinderBlock
          position={[0, 0, 0]}
          rotation={[0.3, 0.5, -0.2]}
          scale={0.9}
          color="#353840"
          wireframe={wireframe}
        />

        {/* Orbiting Wireframe Polyhedron */}
        <mesh ref={icosaRef} position={[1.4, 0.8, 0.4]} scale={0.45}>
          <icosahedronGeometry args={[1, 0]} />
          <meshBasicMaterial
            color="#ff5a1f"
            wireframe
            transparent
            opacity={Math.min(1, 0.4 + glow * 0.6)}
          />
        </mesh>

        {/* Orbiting Metallic Cube */}
        <mesh position={[-1.2, -0.7, -0.3]} scale={0.3}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#22252a"
            metalness={0.9}
            roughness={roughness}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </Float>
  );
}

export const Playground3D: React.FC = () => {
  const [speed, setSpeed] = useState<number>(1.2);
  const [roughness, setRoughness] = useState<number>(0.3);
  const [glow, setGlow] = useState<number>(0.8);
  const [wireframe, setWireframe] = useState<boolean>(false);

  const handleReset = () => {
    soundManager.playClick();
    setSpeed(1.2);
    setRoughness(0.3);
    setGlow(0.8);
    setWireframe(false);
  };

  return (
    <section className="relative py-28 px-6 md:px-16 md:pl-28 max-w-7xl mx-auto border-t border-[#23262c]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#23262c]">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#ff5a1f]" />
            <span className="font-mono text-xs text-[#878e9c] tracking-[0.3em] uppercase">
              STUDIO R&amp;D // INTERACTIVE LAB
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Zero-Gravity Material Sandbox
          </h2>
        </div>

        <p className="text-sm text-[#878e9c] max-w-sm mt-4 md:mt-0 font-sans">
          Experiment live with our physics parameters, procedural roughness shaders, and neon emission radiance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: 3D Interactive Canvas Viewport */}
        <div className="lg:col-span-7 h-[420px] rounded-2xl border border-[#272a31] bg-gradient-to-b from-[#131518] to-[#0c0d0e] relative overflow-hidden shadow-2xl">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-md bg-[#0c0d0e]/80 border border-[#23262c] text-white font-mono text-[10px]">
            <Cpu className="w-3 h-3 text-[#ff5a1f]" />
            <span>THREE.JS SHADER KERNEL // LIVE</span>
          </div>

          <Canvas
            camera={{ position: [0, 0, 4.2], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.6} color="#636c7e" />
            <directionalLight position={[4, 5, 3]} intensity={3} color="#ffffff" />
            <pointLight position={[-3, 2, -2]} intensity={3.5} color="#ff5a1f" />

            <Suspense fallback={null}>
              <SandboxMesh
                rotationSpeed={speed}
                roughness={roughness}
                wireframe={wireframe}
                glow={glow}
              />
              <OrbitControls enableZoom={false} enablePan={false} />
            </Suspense>
          </Canvas>

          <div className="absolute bottom-4 right-4 z-10 font-mono text-[10px] text-[#636875] bg-[#0c0d0e]/80 px-2.5 py-1 rounded border border-[#23262c]">
            DRAG TO ROTATE
          </div>
        </div>

        {/* Right: Interactive Parameter Sliders */}
        <div className="lg:col-span-5 p-8 rounded-2xl border border-[#23262c] bg-[#121417]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#23262c]">
            <div className="flex items-center gap-2 text-white font-mono text-xs font-semibold uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-[#ff5a1f]" />
              <span>Telemetry Controls</span>
            </div>

            <button
              onClick={handleReset}
              onMouseEnter={() => soundManager.playHover()}
              className="flex items-center gap-1.5 text-xs font-mono text-[#7e8492] hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-6">
            {/* Slider 1: Drift Speed */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-[#a0a5b2]">ZERO-G DRIFT VELOCITY</span>
                <span className="text-[#ff5a1f] font-bold">{speed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-[#ff5a1f] bg-[#22252b] h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 2: Roughness */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-[#a0a5b2]">SURFACE ROUGHNESS</span>
                <span className="text-[#ff5a1f] font-bold">{roughness.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.95"
                step="0.05"
                value={roughness}
                onChange={(e) => setRoughness(parseFloat(e.target.value))}
                className="w-full accent-[#ff5a1f] bg-[#22252b] h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 3: Glow / Emission */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-[#a0a5b2]">NEON EMISSION RADIANCE</span>
                <span className="text-[#ff5a1f] font-bold">{Math.round(glow * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.5"
                step="0.1"
                value={glow}
                onChange={(e) => setGlow(parseFloat(e.target.value))}
                className="w-full accent-[#ff5a1f] bg-[#22252b] h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Wireframe Toggle Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setWireframe(!wireframe);
                }}
                onMouseEnter={() => soundManager.playHover()}
                className={`w-full py-3 px-4 rounded-xl font-mono text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                  wireframe
                    ? "bg-[#ff5a1f] text-white shadow-[0_0_20px_rgba(255,90,31,0.4)]"
                    : "border border-[#2d3038] bg-[#17191e] text-[#b3b8c4] hover:text-white hover:border-[#ff5a1f]/50"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{wireframe ? "Wireframe Active" : "Toggle Wireframe Mesh"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
