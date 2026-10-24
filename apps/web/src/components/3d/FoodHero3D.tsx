'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshWobbleMaterial, OrbitControls, Sphere, Torus } from '@react-three/drei';
import * as THREE from 'three';

function FloatingDosa() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 3D Golden Dosa Roll geometry */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.55, 3.2, 32]} />
        <meshStandardMaterial
          color="#F59E0B"
          roughness={0.3}
          metalness={0.1}
          emissive="#D97706"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Spiced potato dip bowl */}
      <mesh position={[1.4, -0.6, 0.4]}>
        <cylinderGeometry args={[0.45, 0.3, 0.4, 32]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.1} />
      </mesh>
      <mesh position={[1.4, -0.42, 0.4]}>
        <cylinderGeometry args={[0.42, 0.42, 0.05, 32]} />
        <meshStandardMaterial color="#EAB308" roughness={0.4} />
      </mesh>

      {/* Mint chutney bowl */}
      <mesh position={[-1.4, -0.6, 0.3]}>
        <cylinderGeometry args={[0.4, 0.25, 0.4, 32]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.1} />
      </mesh>
      <mesh position={[-1.4, -0.42, 0.3]}>
        <cylinderGeometry args={[0.38, 0.38, 0.05, 32]} />
        <meshStandardMaterial color="#16A34A" roughness={0.3} />
      </mesh>
    </group>
  );
}

export default function FoodHero3D() {
  return (
    <div className="relative w-full h-[360px] md:h-[480px] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50/50 via-amber-100/30 to-orange-50/40 border border-amber-200/60 shadow-soft flex items-center justify-center">
      <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FEF3C7" />
        <pointLight position={[-5, -5, 5]} intensity={0.6} color="#F59E0B" />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
          <FloatingDosa />
        </Float>

        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  );
}
