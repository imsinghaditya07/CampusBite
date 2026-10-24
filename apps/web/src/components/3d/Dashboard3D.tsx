'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshWobbleMaterial, OrbitControls, Sphere, Torus, Ring } from '@react-three/drei';
import * as THREE from 'three';

function RotatingCampusSphere() {
  const sphereRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.3;
      sphereRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.5;
      ringRef.current.rotation.x += delta * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.4;
      ring2Ref.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central 3D Core Node */}
      <mesh ref={sphereRef}>
        <icosahedronGeometry args={[1.2, 2]} />
        <MeshWobbleMaterial
          color="#F5B51B"
          factor={0.3}
          speed={1.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Orbit Ring 1 (Gold Node Ring) */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.0, 0.04, 16, 100]} />
        <meshStandardMaterial color="#F5B51B" emissive="#D97706" emissiveIntensity={0.6} />
      </mesh>

      {/* Orbit Ring 2 (Emerald Live Status Ring) */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.4, 0.03, 16, 100]} />
        <meshStandardMaterial color="#16A34A" emissive="#15803D" emissiveIntensity={0.5} />
      </mesh>

      {/* Floating Telemetry Satellite Spheres */}
      <mesh position={[1.8, 1.2, 0.5]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#16A34A" emissive="#16A34A" emissiveIntensity={0.8} />
      </mesh>

      <mesh position={[-1.9, -1.0, -0.4]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#F5B51B" emissive="#D97706" emissiveIntensity={0.8} />
      </mesh>

      <mesh position={[0.4, -2.1, 0.8]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#171717" roughness={0.1} />
      </mesh>
    </group>
  );
}

interface Dashboard3DProps {
  height?: string;
  badgeText?: string;
}

export default function Dashboard3D({ height = 'h-[280px]', badgeText = '3D Campus Telemetry Live' }: Dashboard3DProps) {
  return (
    <div className={`relative w-full ${height} rounded-2xl overflow-hidden bg-gradient-to-br from-[#171717] via-[#262626] to-[#0A0A0A] border border-[#333333] shadow-premium flex items-center justify-center`}>
      {/* 3D Telemetry Badge Header */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white shadow-xs">
        <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
        <span className="text-[#F5B51B] uppercase tracking-wider">{badgeText}</span>
      </div>

      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.8} color="#FEF3C7" />
        <pointLight position={[-5, -5, -5]} intensity={1.2} color="#16A34A" />
        
        <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.9}>
          <RotatingCampusSphere />
        </Float>

        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.2} />
      </Canvas>

      <div className="absolute bottom-2 right-3 z-10 text-[9px] font-mono text-zinc-400 bg-black/40 px-2 py-0.5 rounded border border-white/5">
        Drag to Rotate 3D Core
      </div>
    </div>
  );
}
