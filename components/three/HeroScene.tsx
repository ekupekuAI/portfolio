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
      {/* meshBasicMaterial (unlit), solid opaque fill, single mesh: this exact
          configuration is confirmed by direct WebGL framebuffer readback to render
          correctly. A second, wireframe-overlay mesh sharing the identical geometry
          was removed — two coincident surfaces at the same depth can z-fight, and
          that risk isn't worth it while this is still unconfirmed in a real user's
          browser. Re-add styling only after confirming this bare version is visible.
          If you swap in a real Spline export with a lit/PBR material, verify it
          renders as expected in your actual target browsers first. */}
      <mesh>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial color="#00E5FF" />
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
