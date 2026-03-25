import React, { useRef, useEffect, useState } from 'react';
import { Text, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { isMobile } from "react-device-detect";
import * as THREE from "three";
import { usePortalStore } from "@stores";
import { SpaceBoi } from "../../models/SpaceBoi";
import { TouchPanControls } from "./TouchPanControls";

const LOTTIE_KARATE = '/lottie/karate.gif';
const LOTTIE_MUSIC = '/lottie/music.gif';

const GifPlane = ({ src, width, height, position }: { 
  src: string; 
  width: number; 
  height: number;
  position: [number, number, number];
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const texture = new THREE.Texture(img);
      texture.minFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
      if (meshRef.current) {
        (meshRef.current.material as THREE.MeshBasicMaterial).map = texture;
        (meshRef.current.material as THREE.MeshBasicMaterial).needsUpdate = true;
      }
    };
  }, [src]);

  useFrame(() => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      if (mat.map) mat.map.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial transparent />
    </mesh>
  );
};

interface GlassCardProps {
  side: 'left' | 'right';
  isActive: boolean;
}

const GlassCard = ({ side, isActive }: GlassCardProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  const xPos   = side === 'left' ? (isMobile ? -1.2 : -2.1) : (isMobile ? 1.2 : 2.1);
  const label  = side === 'left' ? 'KARATE'           : 'MUSIC';
  const sub    = side === 'left' ? '2ND DAN BLACK BELT' : 'KEYS. STAGE. VIBES';
  const cardW  = isMobile ? 1.0 : 1.35;
  const cardH  = isMobile ? 1.6 : 2.1;

  useEffect(() => {
    if (!isActive) {
      setMounted(false);
      return;
    }
    const delay = side === 'left' ? 500 : 700;
    const t = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(t);
  }, [isActive, side]);

  useEffect(() => {
    if (!groupRef.current) return;
    gsap.fromTo(
      groupRef.current.scale,
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 1, z: 1, duration: 0.5, ease: 'back.out(1.4)' }
    );
  }, [mounted]);

  useEffect(() => {
    if (!groupRef.current) return;
    gsap.to(groupRef.current.position, {
      z: hovered ? 0.3 : 0.1,
      duration: 0.25,
    });
    gsap.to(groupRef.current.scale, {
      x: hovered ? 1.06 : 1,
      y: hovered ? 1.06 : 1,
      z: hovered ? 1.06 : 1,
      duration: 0.25,
    });
  }, [hovered]);

  if (!mounted) return null;

  return (
    <group
      ref={groupRef}
      position={[xPos, 0, 0.1]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true);  document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e)  => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <mesh position={[0, 0, -0.015]}>
        <planeGeometry args={[cardW + 0.04, cardH + 0.04]} />
        <meshBasicMaterial
          color={hovered ? '#6688ff' : '#ffffff'}
          transparent
          opacity={hovered ? 0.18 : 0.09}
        />
      </mesh>

      <mesh>
        <planeGeometry args={[cardW, cardH]} />
        <meshPhysicalMaterial
          color="#a0b0ff"
          transparent
          opacity={0.06}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>

      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[cardW - 0.06, cardH - 0.06]} />
        <meshBasicMaterial color="#04040e" transparent opacity={0.55} />
      </mesh>

      <GifPlane
        src={side === 'left' ? LOTTIE_KARATE : LOTTIE_MUSIC}
        width={isMobile ? 0.5 : 0.7}
        height={isMobile ? 0.5 : 0.7}
        position={[0, isMobile ? 0.22 : 0.28, 0.03]}
      />
      
      {/* Debug - red box to check position */}
      <mesh position={[0, isMobile ? 0.22 : 0.28, 0.035]}>
        <planeGeometry args={[0.6, 0.6]} />
        <meshBasicMaterial color="red" opacity={0.5} transparent />
      </mesh>

      <mesh position={[0, isMobile ? -0.35 : -0.45, 0.02]}>
        <planeGeometry args={[cardW - 0.2, 0.004]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>

      <Text
        font="./soria-font.ttf"
        fontSize={isMobile ? 0.1 : 0.115}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        position={[0, isMobile ? -0.52 : -0.65, 0.02]}
      >
        {label}
      </Text>

      <Text
        font="./Vercetti-Regular.woff"
        fontSize={isMobile ? 0.042 : 0.052}
        color="#8899cc"
        anchorX="center"
        anchorY="middle"
        position={[0, isMobile ? -0.68 : -0.84, 0.02]}
      >
        {sub}
      </Text>
    </group>
  );
};

const Activities = () => {
  const { camera, gl } = useThree();
  const isActive = usePortalStore((state) => state.activePortalId === "activities");
  const data = useScroll();

  const touchPointer = useRef({ x: 0, y: 0 });
  const pinchRef     = useRef<number | null>(null);
  const targetZ      = useRef(11.5);
  const [touchReady, setTouchReady] = useState(false);

  useEffect(() => {
    if (data?.el) {
      data.el.style.overflow = isActive ? 'hidden' : 'auto';
    }
    if (isActive) {
      if (isMobile) {
        gsap.to(camera.position, {
          y: -39, x: 0, z: 11.5, duration: 1,
          onComplete: () => { targetZ.current = 11.5; setTouchReady(true); },
        });
      } else {
        gsap.to(camera.position, { y: -39, x: 2, z: 11.5, duration: 1 });
      }
      gsap.to(camera.rotation, { x: -Math.PI / 2, y: 0, z: 0, duration: 1 });
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
          x:  (e.touches[0].clientX / window.innerWidth)  * 2 - 1,
          y: -((e.touches[0].clientY / window.innerHeight) * 2 - 1),
        };
      }
      if (e.touches.length === 2) {
        const dx   = e.touches[0].clientX - e.touches[1].clientX;
        const dy   = e.touches[0].clientY - e.touches[1].clientY;
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
    canvas.addEventListener('touchend',  onTouchEnd,  { passive: true });
    return () => {
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend',  onTouchEnd);
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

      <mesh position={[0, 0, -5]} scale={[50, 30, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#0a0a0f" />
      </mesh>

      <group position={[0, -4, 0]}>
        <SpaceBoi />
      </group>

      {isActive && (
        <>
          <GlassCard side="left"  isActive={isActive} />
          <GlassCard side="right" isActive={isActive} />
          {isMobile && touchReady && <TouchPanControls initialRotationY={0} />}
        </>
      )}

      <Text
        font="./soria-font.ttf"
        fontSize={isMobile ? 0.16 : 0.2}
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
