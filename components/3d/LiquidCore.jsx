"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PresentationControls, MeshDistortMaterial, Sphere, Torus } from "@react-three/drei";
import * as THREE from "three";

// Intercept benign THREE.Clock deprecation warning triggered by @react-three/fiber internals
if (typeof window !== "undefined") {
  const origWarn = console.warn;
  console.warn = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("THREE.Clock: This module has been deprecated")) {
      return;
    }
    origWarn(...args);
  };
}

// ── Data Packet Satellites revolving on orbital rings ────────────────────────
function DataPacket({ radius, speed, offset = 0, color = "#00f0ff", size = 0.08 }) {
  const ref = useRef();
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (ref.current) {
      timeRef.current += delta;
      const t = timeRef.current * speed + offset;
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
      ref.current.position.y = Math.sin(t * 2) * (radius * 0.2);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2.5}
        roughness={0.1}
      />
    </mesh>
  );
}

// ── Main Liquid Cyber-Core Scene ─────────────────────────────────────────────
function LiquidCoreScene() {
  const coreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    // Gentle rotation of the liquid sphere
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.2;
      coreRef.current.rotation.x += delta * 0.1;
    }
    // Spinning orbital rings at different angles & speeds
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.45;
      ring1Ref.current.rotation.y += delta * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x -= delta * 0.35;
      ring2Ref.current.rotation.z -= delta * 0.2;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y += delta * 0.25;
      ring3Ref.current.rotation.x += delta * 0.3;
    }
  });

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* ── 1. The Liquid Morphing Sphere (AI Core) ──────────────────────── */}
      <Sphere ref={coreRef} args={[1.55, 64, 64]}>
        <MeshDistortMaterial
          color={hovered ? "#00f0ff" : "#06b6d4"}
          emissive="#0891b2"
          emissiveIntensity={hovered ? 0.6 : 0.3}
          roughness={0.15}
          metalness={0.88}
          distort={hovered ? 0.58 : 0.4}
          speed={hovered ? 4.2 : 2.2}
        />
      </Sphere>

      {/* ── 2. Inner Bioluminescent Energy Nucleus ───────────────────────── */}
      <Sphere args={[0.95, 32, 32]}>
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={2.2}
          transparent
          opacity={0.45}
        />
      </Sphere>

      {/* ── 3. Orbital Ring 1 (Inner Tilted Ring) ────────────────────────── */}
      <group rotation={[Math.PI / 3, 0, 0]}>
        <Torus ref={ring1Ref} args={[2.15, 0.022, 16, 100]}>
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.8}
            roughness={0.2}
            metalness={0.9}
          />
        </Torus>
        <DataPacket radius={2.15} speed={1.8} offset={0} color="#00f0ff" size={0.09} />
        <DataPacket radius={2.15} speed={1.8} offset={Math.PI} color="#38bdf8" size={0.07} />
      </group>

      {/* ── 4. Orbital Ring 2 (Outer Diagonal Ring) ──────────────────────── */}
      <group rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
        <Torus ref={ring2Ref} args={[2.55, 0.016, 16, 100]}>
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#7c3aed"
            emissiveIntensity={0.7}
            roughness={0.3}
            metalness={0.8}
          />
        </Torus>
        <DataPacket radius={2.55} speed={-1.4} offset={1.5} color="#c084fc" size={0.08} />
      </group>

      {/* ── 5. Orbital Ring 3 (Outer High-Tech Wireframe Ring) ───────────── */}
      <group rotation={[Math.PI / 6, -Math.PI / 3, Math.PI / 4]}>
        <Torus ref={ring3Ref} args={[2.9, 0.03, 8, 60]}>
          <meshBasicMaterial
            wireframe
            color="#06b6d4"
            transparent
            opacity={0.32}
            blending={THREE.AdditiveBlending}
          />
        </Torus>
        <DataPacket radius={2.9} speed={1.2} offset={2.8} color="#06b6d4" size={0.08} />
      </group>
    </group>
  );
}

// ── Main Canvas Export ───────────────────────────────────────────────────────
export default function LiquidCore() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.touchAction = "none";
    }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ touchAction: "none" }}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none touch-none"
    >
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ touchAction: "none" }}
        className="w-full h-full relative z-10 touch-none"
        onCreated={({ gl }) => {
          if (gl.domElement) {
            gl.domElement.style.touchAction = "none";
          }
          if (gl.domElement && gl.domElement.parentElement) {
            gl.domElement.parentElement.style.touchAction = "none";
          }
        }}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[10, 10, 10]} intensity={2.2} color="#ffffff" />
        <pointLight position={[-8, -8, -8]} intensity={3.0} color="#06b6d4" />
        <pointLight position={[8, -5, 6]} intensity={2.2} color="#8b5cf6" />

        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-0.45, 0.45]}
          azimuth={[-0.8, 0.8]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 400 }}
        >
          <Float speed={2.2} rotationIntensity={0.6} floatIntensity={1.2}>
            <LiquidCoreScene />
          </Float>
        </PresentationControls>
      </Canvas>
    </div>
  );
}
