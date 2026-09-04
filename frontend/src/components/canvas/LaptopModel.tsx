"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LaptopModelProps {
  accentColor?: string;
  wireframe?: boolean;
  onScreenClick?: () => void;
}

export const LaptopModel: React.FC<LaptopModelProps> = ({
  accentColor = "#ff5a1f",
  wireframe = false,
  onScreenClick,
}) => {
  const laptopGroupRef = useRef<THREE.Group>(null);
  const screenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const screenTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const lastRenderStateRef = useRef<{ textKey: string; blinkState: boolean; lastUpdate: number }>({
    textKey: "",
    blinkState: false,
    lastUpdate: 0,
  });

  const [screenTexture, setScreenTexture] = useState<THREE.CanvasTexture | null>(null);

  // High-performance screen canvas (1024 x 640): razor-sharp text with 75% less GPU bandwidth
  useEffect(() => {
    if (typeof document === "undefined") return;

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 640;
    screenCanvasRef.current = canvas;

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    screenTextureRef.current = texture;
    setScreenTexture(texture);

    return () => {
      texture.dispose();
      screenTextureRef.current = null;
      screenCanvasRef.current = null;
    };
  }, []);

  // Throttled high-contrast terminal renderer (only redraws on character/blink updates)
  useFrame((state) => {
    const canvas = screenCanvasRef.current;
    const texture = screenTextureRef.current;
    if (!canvas || !texture) return;

    const time = state.clock.getElapsedTime();
    const now = performance.now();

    // Limit canvas updates to max 24 FPS to completely eliminate GPU bus saturation
    if (now - lastRenderStateRef.current.lastUpdate < 40) return;

    const cursorBlink = Math.sin(time * 5) > 0;
    const cycleDuration = 18;
    const phase = time % cycleDuration;

    const scriptItems = [
      { cmd: "> whoami", output: "manas mishra", outputColor: "#ffffff" },
      { cmd: "> role", output: "computer science engineer", outputColor: "#e2e8f0" },
      { cmd: "> focus", output: "data → intelligence → application", outputColor: accentColor },
      { cmd: "> status", output: "building • learning • innovating", outputColor: "#ffffff" },
    ];

    let stateKey = `${cursorBlink ? "1" : "0"}`;
    const linesToDraw: { cmd: string; output?: string; outColor?: string }[] = [];

    scriptItems.forEach((item, idx) => {
      const startTime = idx * 3.5;
      if (phase < startTime) return;

      const elapsed = phase - startTime;
      const cmdChars = Math.min(item.cmd.length, Math.floor(elapsed * 18));
      const typedCmd = item.cmd.substring(0, cmdChars);
      stateKey += `_${typedCmd}`;

      let typedOut: string | undefined;
      if (elapsed > item.cmd.length / 18 + 0.25) {
        if (idx === 3) {
          const outChars = Math.min(item.output.length, Math.floor((elapsed - 0.7) * 16));
          typedOut = item.output.substring(0, Math.max(0, outChars));
        } else {
          typedOut = item.output;
        }
        stateKey += `_${typedOut}`;
      }

      linesToDraw.push({
        cmd: typedCmd,
        output: typedOut,
        outColor: item.outputColor,
      });
    });

    // Skip repaint if screen content is identical
    if (
      lastRenderStateRef.current.textKey === stateKey &&
      lastRenderStateRef.current.blinkState === cursorBlink
    ) {
      return;
    }

    lastRenderStateRef.current.textKey = stateKey;
    lastRenderStateRef.current.blinkState = cursorBlink;
    lastRenderStateRef.current.lastUpdate = now;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // 1. Inky OLED Deep Black Screen Canvas
    ctx.fillStyle = "#050608";
    ctx.fillRect(0, 0, w, h);

    // Subtle radial glow from center
    const glow = ctx.createRadialGradient(w * 0.5, h * 0.45, 80, w * 0.5, h * 0.5, w * 0.85);
    glow.addColorStop(0, "#0e1118");
    glow.addColorStop(1, "#050608");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // 2. Sleek Terminal Titlebar
    ctx.fillStyle = "#11141b";
    ctx.fillRect(0, 0, w, 52);

    // Titlebar Divider line
    ctx.fillStyle = "#1e222d";
    ctx.fillRect(0, 51, w, 1);

    // Mac Window Action Dots
    ctx.fillStyle = "#ff5f56"; // Red
    ctx.beginPath();
    ctx.arc(36, 26, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffbd2e"; // Yellow
    ctx.beginPath();
    ctx.arc(58, 26, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#27c93f"; // Green
    ctx.beginPath();
    ctx.arc(80, 26, 7, 0, Math.PI * 2);
    ctx.fill();

    // Window Title
    ctx.fillStyle = "#8d96a7";
    ctx.font = "600 20px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("manas@workstation: ~ (zsh)", 115, 33);

    // Status Pill on top right
    ctx.fillStyle = "rgba(255, 90, 31, 0.15)";
    ctx.fillRect(w - 180, 14, 144, 24);
    ctx.strokeStyle = "rgba(255, 90, 31, 0.4)";
    ctx.lineWidth = 1;
    ctx.strokeRect(w - 180, 14, 144, 24);

    ctx.fillStyle = accentColor;
    ctx.font = "700 13px 'Courier New', Courier, monospace";
    ctx.fillText("● KERNEL ACTIVE", w - 165, 31);

    // 3. Crisp, Bold Monospace Terminal Content
    const mx = 64;
    let y = 118;

    linesToDraw.forEach((line, idx) => {
      // Command prompt in electric orange
      ctx.fillStyle = accentColor;
      ctx.font = "700 32px 'Courier New', Courier, monospace";
      ctx.fillText(line.cmd, mx, y);

      const isCurrentTyping = idx === linesToDraw.length - 1 && !line.output;
      if (isCurrentTyping && cursorBlink) {
        const cw = ctx.measureText(line.cmd).width;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(" ▋", mx + cw, y);
      }
      y += 42;

      // Indented Output in high-contrast crisp white/tint
      if (line.output !== undefined) {
        ctx.fillStyle = line.outColor || "#ffffff";
        ctx.font = "600 30px 'Courier New', Courier, monospace";
        ctx.fillText("  " + line.output, mx, y);

        if (idx === 3 && cursorBlink) {
          const ow = ctx.measureText("  " + line.output).width;
          ctx.fillStyle = "#ffffff";
          ctx.fillText(" ▋", mx + ow, y);
        }
      }
      y += 64;
    });

    texture.needsUpdate = true;
  });

  // Physical specifications (MacBook Pro unibody)
  const baseWidth = 3.4;
  const baseDepth = 2.25;
  const baseThickness = 0.085;
  const lidRotationX = -0.34;

  const keyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#12141a",
        roughness: 0.35,
        metalness: 0.25,
      }),
    []
  );

  const keyboardKeys = useMemo(() => {
    const keys: { x: number; z: number; w: number; d: number }[] = [];
    const rows = 6;
    const startZ = -0.78;
    const keyDepth = 0.145;
    const gapZ = 0.032;

    for (let r = 0; r < rows; r++) {
      const z = startZ + r * (keyDepth + gapZ);
      if (r === 5) {
        keys.push({ x: -1.05, z, w: 0.28, d: keyDepth });
        keys.push({ x: -0.7, z, w: 0.28, d: keyDepth });
        keys.push({ x: 0, z, w: 0.95, d: keyDepth });
        keys.push({ x: 0.7, z, w: 0.28, d: keyDepth });
        keys.push({ x: 1.05, z, w: 0.28, d: keyDepth });
      } else {
        const cols = 14;
        const keyWidth = 0.18;
        const gapX = 0.03;
        const startX = -((cols * (keyWidth + gapX)) / 2) + keyWidth / 2;
        for (let c = 0; c < cols; c++) {
          keys.push({ x: startX + c * (keyWidth + gapX), z, w: keyWidth, d: keyDepth });
        }
      }
    }
    return keys;
  }, []);

  return (
    <group
      ref={laptopGroupRef}
      dispose={null}
      onClick={(e) => {
        e.stopPropagation();
        onScreenClick?.();
      }}
    >
      {/* 1. BASE UNIBODY ENCLOSURE (Sleek Space Gray Aluminum) */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[baseWidth, baseThickness, baseDepth]} />
          <meshStandardMaterial
            color="#323642"
            metalness={0.88}
            roughness={0.22}
            wireframe={wireframe}
          />
        </mesh>

        {/* Crisp Chamfer Highlight Line */}
        <lineSegments position={[0, 0, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(baseWidth, baseThickness, baseDepth)]} />
          <lineBasicMaterial color="#5a637a" transparent opacity={0.65} />
        </lineSegments>

        {/* Display Notch Cutout */}
        <mesh position={[0, baseThickness / 2 - 0.002, baseDepth / 2 - 0.02]}>
          <boxGeometry args={[0.45, 0.02, 0.03]} />
          <meshStandardMaterial color="#161820" roughness={0.4} />
        </mesh>

        {/* Recessed Keyboard Well */}
        <mesh position={[0, baseThickness / 2 + 0.001, -0.32]}>
          <boxGeometry args={[3.0, 0.005, 1.18]} />
          <meshStandardMaterial color="#14161c" roughness={0.45} />
        </mesh>

        {/* Chiclet Keycaps */}
        {keyboardKeys.map((k, idx) => (
          <mesh
            key={idx}
            position={[k.x, baseThickness / 2 + 0.012, k.z]}
            material={keyMat}
          >
            <boxGeometry args={[k.w, 0.016, k.d]} />
          </mesh>
        ))}

        {/* Precision Glass Trackpad */}
        <mesh position={[0, baseThickness / 2 + 0.003, 0.54]} receiveShadow>
          <boxGeometry args={[1.25, 0.002, 0.8]} />
          <meshStandardMaterial
            color="#272b36"
            metalness={0.68}
            roughness={0.16}
          />
        </mesh>
        <lineSegments position={[0, baseThickness / 2 + 0.005, 0.54]}>
          <edgesGeometry args={[new THREE.BoxGeometry(1.25, 0.002, 0.8)]} />
          <lineBasicMaterial color="#586178" transparent opacity={0.7} />
        </lineSegments>
      </group>

      {/* 2. PRECISION CYLINDRICAL HINGE */}
      <mesh
        position={[0, baseThickness / 2 + 0.02, -baseDepth / 2 + 0.05]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.045, 0.045, baseWidth - 0.2, 20]} />
        <meshStandardMaterial color="#262933" metalness={0.92} roughness={0.2} />
      </mesh>

      {/* 3. DISPLAY LID */}
      <group
        position={[0, baseThickness / 2 + 0.02, -baseDepth / 2 + 0.05]}
        rotation={[lidRotationX, 0, 0]}
      >
        {/* Rear Lid Shell */}
        <mesh position={[0, baseDepth / 2, -0.025]} castShadow>
          <boxGeometry args={[baseWidth, baseDepth, 0.04]} />
          <meshStandardMaterial
            color="#323642"
            metalness={0.88}
            roughness={0.22}
            wireframe={wireframe}
          />
        </mesh>

        <lineSegments position={[0, baseDepth / 2, -0.025]}>
          <edgesGeometry args={[new THREE.BoxGeometry(baseWidth, baseDepth, 0.04)]} />
          <lineBasicMaterial color="#5a637a" transparent opacity={0.65} />
        </lineSegments>

        {/* Front OLED Bezel Frame */}
        <mesh position={[0, baseDepth / 2, 0]}>
          <boxGeometry args={[baseWidth - 0.06, baseDepth - 0.06, 0.02]} />
          <meshStandardMaterial color="#07080b" roughness={0.5} />
        </mesh>

        {/* Ultra-Sharp High-Contrast OLED Display Surface */}
        {screenTexture && (
          <mesh position={[0, baseDepth / 2, 0.012]}>
            <planeGeometry args={[baseWidth - 0.16, baseDepth - 0.16]} />
            <meshBasicMaterial map={screenTexture} toneMapped={false} />
          </mesh>
        )}

        {/* Realistic Screen Bounce Light onto Keyboard */}
        <pointLight
          position={[0, baseDepth / 2, 0.45]}
          intensity={1.8}
          distance={4.0}
          color="#ff7733"
        />
      </group>
    </group>
  );
};
