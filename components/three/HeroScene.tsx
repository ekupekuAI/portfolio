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
      {/* meshBasicMaterial (unlit), solid opaque fill: this exact configuration is
          confirmed by direct WebGL framebuffer readback (not just a screenshot) to
          render correctly. An earlier version used a faint wireframe + 15% opacity
          fill — never independently re-verified after being written, and too subtle
          to actually see. Kept deliberately bold/opaque now. If you swap in a real
          Spline export with a lit/PBR material, verify it renders as expected in your
          actual target browsers first. */}
      <mesh>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial color="#00E5FF" />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial color="#0A0A0F" wireframe />
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
