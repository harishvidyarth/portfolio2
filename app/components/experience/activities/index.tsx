import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Text, useScroll, Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { isMobile } from "react-device-detect";
import * as THREE from "three";
import { usePortalStore } from "@stores";
import { SpaceBoi } from "../../models/SpaceBoi";
import { TouchPanControls } from "../projects/TouchPanControls";

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
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
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
  const { camera, gl } = useThree();
  const isActive = usePortalStore((state) => state.activePortalId === "activities");
  const data = useScroll();

  const touchPointer = useRef({ x: 0, y: 0 });
  const pinchRef = useRef<number | null>(null);
  const targetZ = useRef(11.5);

  useEffect(() => {
    if (data?.el) {
      data.el.style.overflow = isActive ? 'hidden' : 'auto';
    }
    if (isActive) {
      if (isMobile) {
        gsap.to(camera.position, {
          y: -39,
          x: 0,
          z: 11.5,
          duration: 1,
          onComplete: () => { targetZ.current = 11.5; }
        });
      } else {
        gsap.to(camera.position, { y: -39, x: 2, z: 11.5, duration: 1 });
      }
    }
  }, [isActive, camera, data]);

  useEffect(() => {
    if (!isMobile) return;

    const canvas = gl.domElement;

    const onTouchMove = (e: TouchEvent) => {
      if (!isActive) return;

      if (e.touches.length === 1) {
        touchPointer.current = {
          x: (e.touches[0].clientX / window.innerWidth) * 2 - 1,
          y: -((e.touches[0].clientY / window.innerHeight) * 2 - 1),
        };
      }

      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (pinchRef.current !== null) {
          const delta = pinchRef.current - dist;
          targetZ.current = THREE.MathUtils.clamp(
            targetZ.current + delta * 0.02,
            6,
            18
          );
        }
        pinchRef.current = dist;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) pinchRef.current = null;
    };

    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [isActive, gl]);

  useFrame((state, delta) => {
    if (!isActive) return;

    if (isMobile) {
      camera.position.z = THREE.MathUtils.damp(
        camera.position.z,
        targetZ.current,
        6,
        delta
      );
    } else {
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
        position={isMobile ? [0, -8, 0] : [0, -4, 0]}
      >
        <SpaceBoi />
      </group>

      {isActive && (
        <>
          <GlassCard side="left" isActive={isActive} />
          <GlassCard side="right" isActive={isActive} />
          {isMobile && <TouchPanControls />}
        </>
      )}

      <Text
        font="./soria-font.ttf"
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        position={[0, 2.3, 0.5]}
      >
        EXTRA CURRICULAR
      </Text>
    </group>
  );
};

export default Activities;
