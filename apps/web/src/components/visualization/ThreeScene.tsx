// PATH: src/components/visualization/ThreeScene.tsx
"use client";

import { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Float,
  Text,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";
import {
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
} from "lucide-react";

// ─────────────────────────────────────────────
// Reusable 3D primitives
// ─────────────────────────────────────────────

/** A glowing data node sphere */
function DataSphere({
  position = [0, 0, 0],
  color = "#3B82F6",
  label,
  highlighted = false,
  size = 0.4,
}: {
  position?: [number, number, number];
  color?: string;
  label?: string;
  highlighted?: boolean;
  size?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current) {
      if (highlighted || hovered) {
        meshRef.current.scale.lerp(
          new THREE.Vector3(1.3, 1.3, 1.3),
          delta * 5
        );
      } else {
        meshRef.current.scale.lerp(
          new THREE.Vector3(1, 1, 1),
          delta * 5
        );
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group position={position}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          castShadow
        >
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial
            color={highlighted ? "#A78BFA" : color}
            emissive={highlighted || hovered ? color : "#000000"}
            emissiveIntensity={highlighted || hovered ? 0.6 : 0.1}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Glow ring */}
        {(highlighted || hovered) && (
          <mesh>
            <ringGeometry args={[size * 1.2, size * 1.5, 32]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.15}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* Label */}
        {label && (
          <Text
            position={[0, size + 0.3, 0]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            font="/fonts/Inter-Bold.woff"
          >
            {label}
          </Text>
        )}
      </group>
    </Float>
  );
}

/** Connection line between two points */
function ConnectionLine({
  start,
  end,
  color = "#3B82F680",
}: {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
}) {
  const lineObj = useMemo(() => {
    const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.5,
    });
    return new THREE.Line(geometry, material);
  }, [start, end, color]);

  return <primitive object={lineObj} />;
}

/** Animated grid floor */
function GridFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[50, 50, 50, 50]} />
      <meshStandardMaterial
        color="#0D0D14"
        wireframe
        transparent
        opacity={0.08}
      />
    </mesh>
  );
}

/** Animated particles system */
function FloatingParticles({ count = 100 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D());

  useEffect(() => {
    if (!meshRef.current) return;

    for (let i = 0; i < count; i++) {
      dummy.current.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      dummy.current.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.current.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      meshRef.current.getMatrixAt(i, dummy.current.matrix);
      dummy.current.matrix.decompose(
        dummy.current.position,
        dummy.current.quaternion,
        dummy.current.scale
      );
      dummy.current.position.y += Math.sin(time + i) * 0.002;
      dummy.current.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.current.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color="#3B82F6" transparent opacity={0.4} />
    </instancedMesh>
  );
}



// ─────────────────────────────────────────────
// Scene presets
// ─────────────────────────────────────────────

export type ScenePreset = "default" | "binary-tree" | "graph" | "particles";

function DefaultScene() {
  return (
    <>
      <DataSphere position={[0, 0, 0]} color="#3B82F6" label="Root" highlighted />
      <DataSphere position={[-2, -1.5, 0]} color="#8B5CF6" label="L" />
      <DataSphere position={[2, -1.5, 0]} color="#8B5CF6" label="R" />
      <DataSphere position={[-3, -3, 0]} color="#06B6D4" label="LL" />
      <DataSphere position={[-1, -3, 0]} color="#06B6D4" label="LR" />
      <DataSphere position={[1, -3, 0]} color="#06B6D4" label="RL" />
      <DataSphere position={[3, -3, 0]} color="#06B6D4" label="RR" />

      <ConnectionLine start={[0, 0, 0]} end={[-2, -1.5, 0]} />
      <ConnectionLine start={[0, 0, 0]} end={[2, -1.5, 0]} />
      <ConnectionLine start={[-2, -1.5, 0]} end={[-3, -3, 0]} />
      <ConnectionLine start={[-2, -1.5, 0]} end={[-1, -3, 0]} />
      <ConnectionLine start={[2, -1.5, 0]} end={[1, -3, 0]} />
      <ConnectionLine start={[2, -1.5, 0]} end={[3, -3, 0]} />
    </>
  );
}

function GraphScene() {
  const positions: [number, number, number][] = [
    [0, 2, 0],
    [-2, 0, 1],
    [2, 0, -1],
    [-1, -2, -1],
    [1, -2, 1],
    [0, 0, 0],
  ];

  const edges: [number, number][] = [
    [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5], [1, 5], [2, 5],
  ];

  const colors = ["#3B82F6", "#8B5CF6", "#EC4899", "#06B6D4", "#10B981", "#F59E0B"];

  return (
    <>
      {positions.map((pos, i) => (
        <DataSphere
          key={i}
          position={pos}
          color={colors[i]}
          label={String.fromCharCode(65 + i)}
          highlighted={i === 0}
          size={0.35}
        />
      ))}
      {edges.map(([from, to], i) => (
        <ConnectionLine
          key={i}
          start={positions[from]}
          end={positions[to]}
          color="#FFFFFF30"
        />
      ))}
    </>
  );
}

function ParticlesScene() {
  return (
    <>
      <FloatingParticles count={200} />
      <DataSphere position={[0, 0, 0]} color="#8B5CF6" highlighted size={0.6} />
    </>
  );
}

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

interface ThreeSceneProps {
  /** Scene preset */
  preset?: ScenePreset;
  /** Height */
  height?: string | number;
  /** Show toolbar */
  showToolbar?: boolean;
  /** Show stars background */
  showStars?: boolean;
  /** Custom children to render inside Canvas */
  children?: React.ReactNode;
  /** Custom class name */
  className?: string;
  /** Camera position */
  cameraPosition?: [number, number, number];
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function ThreeScene({
  preset = "default",
  height = 400,
  showToolbar = true,
  showStars = true,
  children,
  className = "",
  cameraPosition = [0, 0, 8],
}: ThreeSceneProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [currentPreset, setCurrentPreset] = useState<ScenePreset>(preset);

  const renderScene = () => {
    switch (currentPreset) {
      case "binary-tree":
      case "default":
        return <DefaultScene />;
      case "graph":
        return <GraphScene />;
      case "particles":
        return <ParticlesScene />;
      default:
        return <DefaultScene />;
    }
  };

  return (
    <div
      className={`flex flex-col glass-card overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      } ${className}`}
    >
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              3D View
            </h3>
            {/* Preset buttons */}
            <div className="flex items-center gap-1">
              {(["default", "graph", "particles"] as ScenePreset[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPreset(p)}
                  className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                    currentPreset === p
                      ? "bg-brand-blue/20 text-brand-blue"
                      : "bg-white/5 text-muted-foreground hover:text-white"
                  }`}
                >
                  {p === "default" ? "Tree" : p === "graph" ? "Graph" : "Particles"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-1.5 rounded-lg transition-colors ${
                showGrid
                  ? "bg-brand-blue/10 text-brand-blue"
                  : "bg-white/5 text-muted-foreground"
              }`}
              title="Toggle grid"
            >
              {showGrid ? (
                <Eye className="w-3.5 h-3.5" />
              ) : (
                <EyeOff className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg bg-white/5 text-muted-foreground hover:text-white transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div
        style={{
          height: isFullscreen
            ? "100%"
            : typeof height === "number"
              ? `${height}px`
              : height,
        }}
        className="flex-1 bg-[#0A0A12]"
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Loading 3D scene...
            </div>
          }
        >
          <Canvas shadows dpr={[1, 2]}>
            <PerspectiveCamera
              makeDefault
              position={cameraPosition}
              fov={50}
            />

            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <pointLight
              position={[10, 10, 10]}
              intensity={1}
              color="#3B82F6"
              castShadow
            />
            <pointLight
              position={[-10, 5, -10]}
              intensity={0.5}
              color="#8B5CF6"
            />
            <spotLight
              position={[0, 10, 0]}
              angle={0.3}
              penumbra={1}
              intensity={0.5}
              color="#ffffff"
              castShadow
            />

            {/* Stars background */}
            {showStars && (
              <Stars
                radius={100}
                depth={50}
                count={2000}
                factor={4}
                saturation={0}
                fade
                speed={0.5}
              />
            )}

            {/* Grid */}
            {showGrid && <GridFloor />}

            {/* Scene content */}
            {children || renderScene()}

            {/* Controls */}
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              autoRotate
              autoRotateSpeed={0.5}
              minDistance={3}
              maxDistance={20}
            />
          </Canvas>
        </Suspense>
      </div>
    </div>
  );
}

// Export primitives for use in custom scenes
export { DataSphere, ConnectionLine, GridFloor, FloatingParticles };
