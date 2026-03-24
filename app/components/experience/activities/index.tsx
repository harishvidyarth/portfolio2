import React, { useRef, useEffect, useState } from 'react';
import { Text, useScroll, Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { isMobile } from "react-device-detect";
import * as THREE from "three";
import { usePortalStore } from "@stores";
import { SpaceBoi } from "../../models/SpaceBoi";
import { TouchPanControls } from "./TouchPanControls";

const LOTTIE_KARATE = '/lottie/karate.gif';
const LOTTIE_MUSIC = '/lottie/music.gif';

const GlassCard = ({ 
  side, 
  isActive,
}: { 
  side: 'left' | 'right'; 
  isActive: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  const xPos = side === 'left' ? (isMobile ? -1.2 : -2.2) : (isMobile ? 1.2 : 2.2);
  const label = side === 'left' ? 'KARATE' : 'MUSIC';
  const subtitle = side === 'left' ? '2ND DAN BLACK BELT' : 'KEYS. STAGE. VIBES';
  const lottieSrc = side === 'left' ? LOTTIE_KARATE : LOTTIE_MUSIC;
  const cardW = isMobile ? 1.0 : 1.4;
  const cardH = isMobile ? 1.5 : 2.0;

  useEffect(() => {
    if (!isActive) {
      setVisible(false);
      return;
    }
    const delay = side === 'left' ? 400 : 600;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [isActive, side]);

  useEffect(() => {
    if (!groupRef.current || !visible) return;
    gsap.to(groupRef.current.scale, {
      x: hovered ? 1.07 : 1,
      y: hovered ? 1.07 : 1,
      z: hovered ? 1.07 : 1,
      duration: 0.2,
    });
  }, [hovered, visible]);

  if (!visible) return null;

  return (
    <group
      ref={groupRef}
      position={[xPos, 0, 0.1]}
      scale={[1, 1, 1]}
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
        <planeGeometry args={[cardW + 0.02, cardH + 0.02]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </mesh>

      <mesh>
        <planeGeometry args={[cardW, cardH]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.07}
          roughness={0.05}
          metalness={0.15}
        />
      </mesh>

      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[cardW - 0.05, cardH - 0.05]} />
        <meshBasicMaterial color="#050510" transparent opacity={0.5} />
      </mesh>

      <Html
        position={[0, isMobile ? 0.25 : 0.35, 0.02]}
        center
        occlude={false}
        style={{ pointerEvents: 'none' }}
      >
        <img
          src={lottieSrc}
          alt={label}
          style={{
            width: isMobile ? '80px' : '110px',
            height: isMobile ? '80px' : '110px',
            objectFit: 'contain',
            opacity: hovered ? 1 : 0.5,
            transition: 'opacity 0.3s ease',
            display: 'block',
          }}
        />
      </Html>

      <Text
        font="./soria-font.ttf"
        fontSize={isMobile ? 0.1 : 0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        position={[0, isMobile ? -0.45 : -0.65, 0.02]}
      >
        {label}
      </Text>

      <Text
        font="./Vercetti-Regular.woff"
        fontSize={isMobile ? 0.045 : 0.055}
        color="#aaaaaa"
        anchorX="center"
        anchorY="middle"
        position={[0, isMobile ? -0.6 : -0.85, 0.02]}
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
  const [touchReady, setTouchReady] = useState(false);

  useEffect(() => {
    if (data?.el) {
      data.el.style.overflow = isActive ? 'hidden' : 'auto';
    }
    if (isActive) {
      if (isMobile) {
        gsap.to(camera.position, {
          y: -39, x: 0, z: 11.5, duration: 1,
          onComplete: () => {
            targetZ.current = 11.5;
            setTouchReady(true);
          }
        });
        gsap.to(camera.rotation, { x: -Math.PI / 2, y: 0, z: 0, duration: 1 });
      } else {
        gsap.to(camera.position, { y: -39, x: 0, z: 11.5, duration: 1 });
        gsap.to(camera.rotation, { x: -Math.PI / 2, y: 0, z: 0, duration: 1 });
      }
    }
  }, [isActive, camera, data]);

  useEffect(() => {
    if (!isActive) setTouchReady(false);
  }, [isActive]);

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
          targetZ.current = THREE.MathUtils.clamp(targetZ.current + delta * 0.02, 6, 18);
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
      camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, -(touchPointer.current.x * Math.PI) / 10, 0.05);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ.current, 6, delta);
    } else {
      camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, -(state.pointer.x * Math.PI) / 10, 0.02);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, 11.5 - state.pointer.y, 7, delta);
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

      <group scale={new THREE.Vector3(1, 1, 1)} position={[0, -4, 0]}>
        <SpaceBoi />
      </group>

      {isActive && (
        <>
          <GlassCard side="left" isActive={isActive} />
          <GlassCard side="right" isActive={isActive} />
          {isMobile && touchReady && <TouchPanControls initialRotationY={0} />}
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
