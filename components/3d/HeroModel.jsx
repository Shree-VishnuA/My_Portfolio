"use client";

import React, { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Intercept benign THREE.Clock deprecation warning triggered by @react-three/fiber internals
if (typeof window !== "undefined") {
  const origWarn = console.warn;
  console.warn = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("THREE.Clock: This module has been deprecated")
    ) {
      return;
    }
    origWarn(...args);
  };
}

// ── 3D Model Scene ────────────────────────────────────────────────────────────
// isInsideRef.current  → true when cursor is within the circular boundary
// pointerRef.current   → {x, y} normalized [-1..1] relative to the circle centre
function ModelScene({ isInsideRef, pointerRef }) {
  const { scene } = useGLTF("/models/dev3D.glb");
  const trackingGroup = useRef(); // outer: cursor-tracking rotation (world space)
  const correctionGroup = useRef(); // inner: corrective rotation so face points toward camera

  // ── Compute corrective quaternion once on mount ───────────────────────────
  // The GLB node has a baked quaternion [x=0.356, y=-0.448, z=0.468, w=0.673].
  // Y is the thin axis of this mesh (thickness ≈ 0.11 units), so the face normal
  // is ±Y in the model's LOCAL space. After the baked quat is applied we figure out
  // which of ±Y is pointing more toward the camera (+Z world) and rotate it there.
  useEffect(() => {
    if (!correctionGroup.current) return;

    const bakedQuat = new THREE.Quaternion(0.3558, -0.4478, 0.4682, 0.6735);

    // Where do local ±Y land in world space after the baked rotation?
    const posY = new THREE.Vector3(0,  1, 0).applyQuaternion(bakedQuat);
    const negY = new THREE.Vector3(0, -1, 0).applyQuaternion(bakedQuat);

    // Pick the ±Y direction that has the larger +Z component (more toward camera)
    const faceDir = negY.z >= posY.z ? negY : posY;

    // Corrective quaternion: rotate faceDir → +Z (toward camera)
    const corrQuat = new THREE.Quaternion().setFromUnitVectors(
      faceDir.normalize(),
      new THREE.Vector3(0, 0, 1)
    );

    correctionGroup.current.quaternion.copy(corrQuat);
  }, []);

  // ── Cursor-tracking animation ─────────────────────────────────────────────
  useFrame((_, delta) => {
  if (!trackingGroup.current) return;

  let targetX = 0;
  let targetY = 0;
  let targetZ = 0;

  if (isInsideRef.current) {
    targetY = pointerRef.current.x * 0.75; // flipped: left / right
    targetX = pointerRef.current.y * 0.45; // up / down (unchanged)
    targetZ =  pointerRef.current.x * 0.12; // flipped: subtle banking roll
  }

  const speed = delta * 6;
  trackingGroup.current.rotation.y = THREE.MathUtils.lerp(trackingGroup.current.rotation.y, targetY, speed);
  trackingGroup.current.rotation.x = THREE.MathUtils.lerp(trackingGroup.current.rotation.x, targetX, speed);
  trackingGroup.current.rotation.z = THREE.MathUtils.lerp(trackingGroup.current.rotation.z, targetZ, speed);
});

  return (
    // Outer group: world-space cursor-tracking rotation
    <group ref={trackingGroup}>
      {/* Inner group: corrective rotation so the model faces +Z (camera) at rest */}
      <group ref={correctionGroup}>
        <Center>
          <primitive object={scene} scale={2.8} />
        </Center>
      </group>
    </group>
  );
}

// Preload the GLTF file for instant rendering
useGLTF.preload("/models/dev3D.glb");

// ── Main Hero Model Export ───────────────────────────────────────────────────
export default function HeroModel() {
  const containerRef = useRef(null);
  const isInsideRef  = useRef(false);
  const pointerRef   = useRef({ x: 0, y: 0 });

  useEffect(() => {
  const el = containerRef.current;
  if (el) el.style.touchAction = "none";

  function onMouseMove(e) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    // Centre of the container in screen space
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    // Radius used just to normalise distance, not to gate tracking
    const radius = Math.min(rect.width, rect.height) / 2;

    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    // Always track — no inside/outside check anymore
    isInsideRef.current = true;

    // Normalise to [-1, 1], clamped so far-away cursor positions
    // don't over-rotate the model
    pointerRef.current = {
      x: THREE.MathUtils.clamp(dx / radius, -1, 1),
      y: THREE.MathUtils.clamp(dy / radius, -1, 1),
    };
  }

  window.addEventListener("mousemove", onMouseMove);
  return () => window.removeEventListener("mousemove", onMouseMove);
}, []);

  return (
    <div
      ref={containerRef}
      className="relative shrink-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 order-1 lg:order-2 cursor-pointer select-none group"
    >
      {/* Glowing radial backdrop */}
      <div className="absolute inset-0 rounded-full bg-linear-to-br from-cyan-500/20 via-blue-600/15 to-purple-600/10 blur-3xl pointer-events-none scale-110 transition-opacity duration-500 group-hover:opacity-100 opacity-80" />

      <Canvas
        camera={{ position: [0, 0, 5], fov:40 }}
        dpr={[1, 5]}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full relative z-10"
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 10]} intensity={2.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={1.2} color="#06b6d4" />
        <pointLight position={[0, -5, 5]} intensity={1.8} color="#3b82f6" />
        <pointLight position={[6, 5, 4]} intensity={1.5} color="#8b5cf6" />

        <Suspense fallback={null}>
          <ModelScene isInsideRef={isInsideRef} pointerRef={pointerRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
