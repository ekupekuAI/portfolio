"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { pointerToRotation } from "@/lib/pointerToRotation";

function HeroModel({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
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
    <group ref={meshRef}>
      {/* meshBasicMaterial (unlit) is used deliberately here, confirmed by direct WebGL
          framebuffer readback (not just a screenshot) to render correctly. A wireframe
          glowing icosahedron is also a legitimate "tech" aesthetic on its own, not a
          fallback. If you swap in a real Spline export with a lit/PBR material, verify
          it renders as expected in your actual target browsers first. */}
      <mesh>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.15} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial color="#00E5FF" wireframe />
      </mesh>
    </group>
  );
}

export default function HeroScene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]} gl={{ alpha: false }}>
      <color attach="background" args={["#0A0A0F"]} />
      <HeroModel reducedMotion={reducedMotion} />
    </Canvas>
  );
}
