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

const LottieCard = ({ side, isHovered }: { side: 'left' | 'right'; isHovered: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (!groupRef.current) return;
    gsap.to(groupRef.current.scale, {
      x: isHovered ? 1 : 0,
      y: isHovered ? 1 : 0,
      z: isHovered ? 1 : 0,
      duration: 0.4,
    });
  }, [isHovered]);

  const xPos = side === 'left' ? -2.5 : 2.5;
  const label = side === 'left' ? 'KARATE' : 'MUSIC';
  const subtitle = side === 'left' ? '2ND DAN BLACK BELT' : 'KEYS. STAGE. VIBES';

  return (
    <group ref={groupRef} position={[xPos, 0, 0]} scale={[0, 0, 0]}>
      <Html position={[0, 0.8, 0]} center transform distanceFactor={4}>
        <div style={{
          background: 'rgba(15, 15, 35, 0.9)',
          borderRadius: '12px',
          padding: '15px',
          width: '140px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 10px',
          }}>
            <PlayerCard src={LOTTIE_CARD} />
          </div>
          <div style={{
            fontSize: '14px',
            color: '#fff',
            fontFamily: 'soria-font',
            marginBottom: '4px',
          }}>
            {label}
          </div>
          <div style={{
            fontSize: '9px',
            color: '#888',
          }}>
            {subtitle}
          </div>
        </div>
      </Html>
    </group>
  );
};

const PlayerCard = dynamic(() => import('./PlayerCard'), { ssr: false });

const Activities = () => {
  const { camera } = useThree();
  const isActive = usePortalStore((state) => state.activePortalId === "activities");
  const data = useScroll();
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null);

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
      
      <group 
        scale={new THREE.Vector3(1.5, 1.5, 1.5)} 
        position={[0, -1.5, -1]}
        onPointerOver={() => setHoveredSide(null)}
        onPointerOut={() => setHoveredSide(null)}
      >
        <SpaceBoi />
      </group>
      
      <group 
        position={[-1.5, 0, 0]}
        onPointerOver={() => setHoveredSide('left')}
        onPointerOut={() => setHoveredSide(null)}
      >
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[1.5, 2]} />
          <meshBasicMaterial color="#0f0f1a" transparent opacity={hoveredSide === 'left' ? 0.3 : 0} />
        </mesh>
        <Text
          font="./soria-font.ttf"
          fontSize={0.12}
          color={hoveredSide === 'left' ? "#fff" : "#555"}
          anchorX="center"
          anchorY="middle"
        >
          KARATE
        </Text>
      </group>
      
      <group 
        position={[1.5, 0, 0]}
        onPointerOver={() => setHoveredSide('right')}
        onPointerOut={() => setHoveredSide(null)}
      >
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[1.5, 2]} />
          <meshBasicMaterial color="#0f0f1a" transparent opacity={hoveredSide === 'right' ? 0.3 : 0} />
        </mesh>
        <Text
          font="./soria-font.ttf"
          fontSize={0.12}
          color={hoveredSide === 'right' ? "#fff" : "#555"}
          anchorX="center"
          anchorY="middle"
        >
          MUSIC
        </Text>
      </group>
      
      <LottieCard side="left" isHovered={hoveredSide === 'left'} />
      <LottieCard side="right" isHovered={hoveredSide === 'right'} />
      
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
