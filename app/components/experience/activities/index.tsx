import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Text, useScroll, Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { isMobile } from "react-device-detect";
import * as THREE from "three";
import { usePortalStore } from "@stores";
import { SpaceBoi } from "../../models/SpaceBoi";

const LOTTIE_CARD = '/lottie/card.json';
const PlayerCard = dynamic(() => import('./PlayerCard'), { ssr: false });

const GlassCard = ({ 
  side, 
  isActive,
}: { 
  side: 'left' | 'right'; 
  isActive: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const xPos = side === 'left' ? -2.2 : 2.2;
  const label = side === 'left' ? 'KARATE' : 'MUSIC';
  const subtitle = side === 'left' ? '2ND DAN BLACK BELT' : 'KEYS. STAGE. VIBES';

  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.scale.set(
      isActive ? 1 : 0,
      isActive ? 1 : 0,
      isActive ? 1 : 0
    );
  }, [isActive]);

  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.scale.set(
      hovered ? 1.07 : 1,
      hovered ? 1.07 : 1,
      hovered ? 1.07 : 1
    );
  }, [hovered]);

  const handlePointerOver = () => {
    setHovered(true);
    if (typeof document !== 'undefined') {
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    setHovered(false);
    if (typeof document !== 'undefined') {
      document.body.style.cursor = 'auto';
    }
  };

  return (
    <group 
      ref={groupRef} 
      position={[xPos, 0, 0]} 
      scale={[0, 0, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <mesh>
        <planeGeometry args={[1.4, 2.0]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.08}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>

      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[1.35, 1.95]} />
        <meshBasicMaterial color="#050510" transparent opacity={0.45} />
      </mesh>

      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[1.42, 2.02]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
      </mesh>

      {isActive && (
        <Html position={[0, 0.35, 0.02]} center transform distanceFactor={3}>
          <div style={{
            width: '110px',
            height: '110px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: hovered ? 1 : 0.5,
            transition: 'opacity 0.3s ease',
          }}>
            <PlayerCard src={LOTTIE_CARD} />
          </div>
        </Html>
      )}

      <Text
        font="./soria-font.ttf"
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        position={[0, -0.65, 0.02]}
      >
        {label}
      </Text>

      <Text
        font="./Vercetti-Regular.woff"
        fontSize={0.055}
        color="#aaaaaa"
        anchorX="center"
        anchorY="middle"
        position={[0, -0.85, 0.02]}
      >
        {subtitle}
      </Text>
    </group>
  );
};

const Activities = () => {
  const { camera } = useThree();
  const isActive = usePortalStore((state) => state.activePortalId === "activities");
  const data = useScroll();

  useEffect(() => {
    if (data?.el && data.el.style) {
      data.el.style.overflow = isActive ? 'hidden' : 'auto';
    }

    if (isActive) {
      if (isMobile) {
        gsap.to(camera.position, { z: 11.5, y: -39, x: 0, duration: 1 });
      } else {
        gsap.to(camera.position, { y: -39, x: 0, duration: 1 });
      }
    }
  }, [isActive]);

  useFrame((state, delta) => {
    if (isActive && !isMobile) {
      camera.rotation.y = THREE.MathUtils.lerp(
        camera.rotation.y,
        -(state.pointer.x * Math.PI) / 10,
        0.02
      );
      camera.position.z = THREE.MathUtils.damp(
        camera.position.z,
        11.5 - state.pointer.y,
        7,
        delta
      );
    }
  });

  return (
    <group>
      <mesh receiveShadow>
        <planeGeometry args={[4, 4, 1]} />
        <shadowMaterial opacity={0.1} />
      </mesh>

      <mesh position={[0, 0, -3]} scale={[30, 20, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#0a0a0f" />
      </mesh>

      <group 
        scale={new THREE.Vector3(1.5, 1.5, 1.5)} 
        position={[0, -3.5, 0]}
      >
        <SpaceBoi />
      </group>

      {isActive && (
        <>
          <GlassCard side="left" isActive={isActive} />
          <GlassCard side="right" isActive={isActive} />
        </>
      )}

      <Text
        font="./soria-font.ttf"
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        position={[0, 1.1, 0]}
      >
        EXTRA CURRICULAR
      </Text>
    </group>
  );
};

export default Activities;
