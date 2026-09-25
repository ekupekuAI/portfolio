"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { pointerToRotation } from "@/lib/pointerToRotation";

function HeroModel({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!meshRef.current) return;

    if (!reducedMotion) {
      const { x, y } = pointerToRotation(
        state.pointer.x * state.size.width * 0.5 + state.size.width * 0.5,
        -state.pointer.y * state.size.height * 0.5 + state.size.height * 0.5,
        state.size.width,
        state.size.height
      );
      target.current = { x, y };
    }

    // ease toward target rotation, plus a slow idle spin
    meshRef.current.rotation.x += (target.current.x - meshRef.current.rotation.x) * 0.05;
    meshRef.current.rotation.y +=
      (target.current.y - meshRef.current.rotation.y) * 0.05 + (reducedMotion ? 0 : 0.002);
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.6, 1]} />
      <meshStandardMaterial
        color="#0A0A0F"
        emissive="#00E5FF"
        emissiveIntensity={0.4}
        metalness={0.6}
        roughness={0.2}
      />
    </mesh>
  );
}

export default function HeroScene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#00E5FF" />
      <pointLight position={[-5, -3, -5]} intensity={0.6} color="#00E5FF" />
      <HeroModel reducedMotion={reducedMotion} />
    </Canvas>
  );
}
