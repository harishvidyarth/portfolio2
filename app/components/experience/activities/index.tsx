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
  onClick 
}: { 
  side: 'left' | 'right'; 
  isActive: boolean;
  onClick: () => void;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const xPos = side === 'left' ? -1.8 : 1.8;
  const label = side === 'left' ? 'KARATE' : 'MUSIC';
  const subtitle = side === 'left' ? '2ND DAN BLACK BELT' : 'KEYS. STAGE. VIBES';
  
  useEffect(() => {
    if (!groupRef.current) return;
    gsap.to(groupRef.current.scale, {
      x: isActive ? 1 : 0,
      y: isActive ? 1 : 0,
      z: isActive ? 1 : 0,
      duration: 0.5,
    });
  }, [isActive]);

  return (
    <group 
      ref={groupRef} 
      position={[xPos, 0, 0]} 
      scale={[0, 0, 0]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={() => { if (isActive) document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      <mesh>
        <planeGeometry args={[1.2, 1.8]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.15} 
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[1.15, 1.75]} />
        <meshBasicMaterial color="#000" transparent opacity={0.3} />
      </mesh>
      
      <Html position={[0, 0.5, 0.02]} center transform distanceFactor={3}>
        <div style={{
          width: '100px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <PlayerCard src={LOTTIE_CARD} />
        </div>
      </Html>
      
      <Text
        font="./soria-font.ttf"
        fontSize={0.1}
        color="#fff"
        anchorX="center"
        anchorY="middle"
        position={[0, -0.6, 0.02]}
      >
        {label}
      </Text>
      <Text
        font="./Vercetti-Regular.woff"
        fontSize={0.05}
        color="#aaa"
        anchorX="center"
        anchorY="middle"
        position={[0, -0.8, 0.02]}
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
  const [selectedCard, setSelectedCard] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    if (!isActive) setSelectedCard(null);
  }, [isActive]);

  useEffect(() => {
    data.el.style.overflow = isActive ? 'hidden' : 'auto';
    if (isActive) {
      if (isMobile) {
        gsap.to(camera.position, { z: 11.5, y: -39, x: 1, duration: 1 });
      } else {
        gsap.to(camera.position, { y: -39, x: 0, duration: 1 });
      }
    }
  }, [isActive]);

  useFrame((state, delta) => {
    if (isActive) {
      if (!isMobile) {
        camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, -(state.pointer.x * Math.PI) / 10, 0.02);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, 11.5 - state.pointer.y, 7, delta);
      }
    }
  });

  return (
    <group>
      <mesh receiveShadow>
        <planeGeometry args={[4, 4, 1]} />
        <shadowMaterial opacity={0.1} />
      </mesh>
      
      <mesh position={[0, 0, -2]} scale={[12, 12, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#0a0a0f" />
      </mesh>
      
      <group scale={new THREE.Vector3(1.5, 1.5, 1.5)} position={[0, -4, -1]}>
        <SpaceBoi />
      </group>
      
      {isActive && (
        <>
          <GlassCard side="left" isActive={isActive} onClick={() => setSelectedCard(selectedCard === 'left' ? null : 'left')} />
          <GlassCard side="right" isActive={isActive} onClick={() => setSelectedCard(selectedCard === 'right' ? null : 'right')} />
        </>
      )}
      
      <Text
        font="./soria-font.ttf"
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        position={[0, 0.7, 0]}
      >
        EXTRA CURRICULAR
      </Text>
    </group>
  );
};

export default Activities;
