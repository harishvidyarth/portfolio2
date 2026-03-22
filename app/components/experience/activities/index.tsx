import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Text, useScroll, Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { isMobile } from "react-device-detect";
import * as THREE from "three";
import { usePortalStore } from "@stores";
import { SpaceBoi } from "../../models/SpaceBoi";

const LOTTIE_KARATE = '/lottie/karate.json';
const LOTTIE_MUSIC = '/lottie/music.json';

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
  const lottieSrc = side === 'left' ? LOTTIE_KARATE : LOTTIE_MUSIC;

  useEffect(() => {
    if (!groupRef.current) return;
    gsap.to(groupRef.current.scale, {
      x: isActive ? 1 : 0,
      y: isActive ? 1 : 0,
      z: isActive ? 1 : 0,
      duration: 0.5,
      delay: isActive ? (side === 'left' ? 0.2 : 0.35) : 0,
    });
  }, [isActive]);

  useEffect(() => {
    if (!groupRef.current || !isActive) return;
    gsap.to(groupRef.current.scale, {
      x: hovered ? 1.07 : 1,
      y: hovered ? 1.07 : 1,
      z: hovered ? 1.07 : 1,
      duration: 0.2,
    });
  }, [hovered, isActive]);

  return (
    <group
      ref={groupRef}
      position={[xPos, 0, 0.1]}
      scale={[0, 0, 0]}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[1.42, 2.02]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </mesh>

      <mesh>
        <planeGeometry args={[1.4, 2.0]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.07}
          roughness={0.05}
          metalness={0.15}
        />
      </mesh>

      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[1.35, 1.95]} />
        <meshBasicMaterial color="#050510" transparent opacity={0.5} />
      </mesh>

      <Html position={[0, 0.35, 0.02]} center transform distanceFactor={3}>
        <div style={{
          width: '110px',
          height: '110px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: hovered ? 1 : 0.4,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }}>
          <PlayerCard src={lottieSrc} />
        </div>
      </Html>

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
    if (data?.el) {
      data.el.style.overflow = isActive ? 'hidden' : 'auto';
    }
    if (isActive) {
      if (isMobile) {
        gsap.to(camera.position, { z: 11.5, y: -39, x: 4, duration: 1 });
      } else {
        gsap.to(camera.position, { y: -39, x: 4, z: 11.5, duration: 1 });
      }
    }
  }, [isActive, camera, data]);

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

      <mesh position={[0, 0, -4]} scale={[40, 25, 1]}>
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
        position={[0, 1.1, 0.5]}
      >
        EXTRA CURRICULAR
      </Text>
    </group>
  );
};

export default Activities;
