"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PresentationControls, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

// ── Satellite Polyhedron orbiting the central core ───────────────────────────
function Satellite({ geometry, position, color, speed, scale = 0.3 }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * speed;
      meshRef.current.rotation.y += delta * (speed * 0.8);
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {geometry}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

// ── Main Holographic Cluster Scene ───────────────────────────────────────────
function HolographicScene() {
  const coreRef = useRef();
  const wireframeRef = useRef();
  const orbitGroupRef = useRef();

  useFrame((state, delta) => {
    // Gentle rotation of the central crystal
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.15;
      coreRef.current.rotation.x += delta * 0.08;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y -= delta * 0.1;
      wireframeRef.current.rotation.z += delta * 0.05;
    }
    // Orbiting satellites around the core
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y += delta * 0.35;
      orbitGroupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group>
      {/* ── Central Glass Icosahedron Crystal ────────────────────────────── */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.5, 0]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.6}
          roughness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.92}
          chromaticAberration={0.35}
          anisotropy={0.3}
          distortion={0.25}
          distortionScale={0.4}
          temporalDistortion={0.1}
          color="#06b6d4"
          attenuationDistance={0.8}
          attenuationColor="#0284c7"
        />
      </mesh>

      {/* Inner Glowing Energy Sphere inside the crystal */}
      <mesh>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#00f0ff"
          emissiveIntensity={2.5}
          roughness={0.1}
        />
      </mesh>

      {/* Outer Delicate Holographic Wireframe Cage */}
      <mesh ref={wireframeRef}>
        <icosahedronGeometry args={[1.56, 1]} />
        <meshBasicMaterial
          wireframe
          color="#38bdf8"
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── Orbiting Satellite Crystals ──────────────────────────────────── */}
      <group ref={orbitGroupRef}>
        <Satellite
          geometry={<octahedronGeometry args={[1, 0]} />}
          position={[2.4, 0.8, 0]}
          color="#06b6d4"
          speed={1.5}
          scale={0.32}
        />
        <Satellite
          geometry={<dodecahedronGeometry args={[1, 0]} />}
          position={[-2.3, -0.6, 1.2]}
          color="#8b5cf6"
          speed={1.2}
          scale={0.28}
        />
        <Satellite
          geometry={<tetrahedronGeometry args={[1, 0]} />}
          position={[0.8, -2.2, -1.0]}
          color="#3b82f6"
          speed={1.8}
          scale={0.35}
        />
        <Satellite
          geometry={<octahedronGeometry args={[1, 0]} />}
          position={[-1.2, 2.1, -0.8]}
          color="#a855f7"
          speed={1.4}
          scale={0.26}
        />
        <Satellite
          geometry={<boxGeometry args={[1, 1, 1]} />}
          position={[1.8, -1.2, 1.6]}
          color="#06b6d4"
          speed={1.6}
          scale={0.25}
        />
      </group>
    </group>
  );
}

// ── Main Canvas Export ───────────────────────────────────────────────────────
export default function PolyhedronCluster() {
  return (
    <div className="relative w-full h-full cursor-grab active:cursor-grabbing select-none">
      {/* Background radial glow */}
      <div className="absolute inset-0 rounded-full bg-linear-to-br from-cyan-500/15 via-blue-600/10 to-violet-600/10 blur-3xl pointer-events-none scale-110" />

      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full relative z-10"
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={1.8} color="#ffffff" />
        <pointLight position={[-8, -8, -8]} intensity={2.5} color="#06b6d4" />
        <pointLight position={[8, -5, 6]} intensity={2.0} color="#a855f7" />

        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-0.45, 0.45]}
          azimuth={[-0.8, 0.8]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 400 }}
        >
          <Float speed={2.2} rotationIntensity={0.8} floatIntensity={1.2}>
            <HolographicScene />
          </Float>
        </PresentationControls>
      </Canvas>
    </div>
  );
}
