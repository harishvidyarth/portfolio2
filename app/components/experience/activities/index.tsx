import React, { useRef, useEffect } from 'react';
import { Text, useScroll, Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import dynamic from 'next/dynamic';
import gsap from "gsap";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from "three";
import { usePortalStore } from "@stores";
import { SpaceBoi } from "../../models/SpaceBoi";
import { KarateModel } from "../../models/KarateModel";
import { PianoModel } from "../../models/PianoModel";

const KarateSection = ({ isActive }: { isActive: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    if (!groupRef.current) return;
    gsap.to(groupRef.current.position, {
      x: isActive ? -1.2 : -3,
      duration: 0.6,
    });
    gsap.to(groupRef.current.scale, {
      x: isActive ? 1 : 0,
      y: isActive ? 1 : 0,
      z: isActive ? 1 : 0,
      duration: 0.6,
    });
  }, [isActive]);

  return (
    <group ref={groupRef} position={[-3, 0, 0]} scale={[0, 0, 0]}
      onPointerOver={() => { if (isActive) { setHovered(true); document.body.style.cursor = 'pointer'; }}}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <group scale={0.006} rotation={[0, Math.PI / 4, 0]} position={[0, -0.3, 0]}>
        <KarateModel />
      </group>
      <Html position={[0, 0.5, 0]} center transform distanceFactor={3}>
        <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
          <div style={{ 
            fontSize: '14px', 
            color: hovered ? '#fff' : '#ccc',
            fontFamily: 'soria-font',
            marginBottom: '4px',
            transition: 'color 0.3s'
          }}>
            KARATE
          </div>
          <div style={{ 
            fontSize: '9px', 
            color: '#888',
            marginBottom: '2px'
          }}>
            2ND DAN BLACK BELT
          </div>
          <div style={{ 
            fontSize: '7px', 
            color: '#666'
          }}>
            WKF JUDGE B
          </div>
        </div>
      </Html>
    </group>
  );
};

const MusicSection = ({ isActive }: { isActive: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    if (!groupRef.current) return;
    gsap.to(groupRef.current.position, {
      x: isActive ? 1.2 : 3,
      duration: 0.6,
      delay: 0.1,
    });
    gsap.to(groupRef.current.scale, {
      x: isActive ? 1 : 0,
      y: isActive ? 1 : 0,
      z: isActive ? 1 : 0,
      duration: 0.6,
      delay: 0.1,
    });
  }, [isActive]);

  return (
    <group ref={groupRef} position={[3, 0, 0]} scale={[0, 0, 0]}
      onPointerOver={() => { if (isActive) { setHovered(true); document.body.style.cursor = 'pointer'; }}}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <group scale={0.0025} rotation={[0, -Math.PI / 6, 0]} position={[0, -0.3, 0]}>
        <PianoModel />
      </group>
      <Html position={[0, 0.5, 0]} center transform distanceFactor={3}>
        <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
          <div style={{ 
            fontSize: '14px', 
            color: hovered ? '#fff' : '#ccc',
            fontFamily: 'soria-font',
            marginBottom: '4px',
            transition: 'color 0.3s'
          }}>
            MUSIC
          </div>
          <div style={{ 
            fontSize: '9px', 
            color: '#888',
            marginBottom: '2px'
          }}>
            KEYS. STAGE. VIBES
          </div>
          <div style={{ 
            fontSize: '7px', 
            color: '#666'
          }}>
            BAND PERFORMER
          </div>
        </div>
      </Html>
    </group>
  );
};

const LottieBackground = dynamic(() => import('./LottieBackground'), { ssr: false });

const Activities = () => {
  const { camera } = useThree();
  const isActive = usePortalStore((state) => state.activePortalId === "activities");
  const data = useScroll();
  const titleRef = useRef<THREE.Group>(null);

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

  useEffect(() => {
    if (titleRef.current) {
      gsap.to(titleRef.current.position, {
        y: isActive ? 0.7 : 1.2,
        duration: 0.5,
      });
      gsap.to(titleRef.current, {
        fillOpacity: isActive ? 1 : 0,
        duration: 0.5,
      });
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
      
      <LottieBackground isActive={isActive} />
      
      <group scale={new THREE.Vector3(1.5, 1.5, 1.5)} position={[0, -1.5, -1]}>
        <SpaceBoi />
      </group>
      
      <group ref={titleRef} position={[0, 1.2, 0]}>
        <Text
          font="./soria-font.ttf"
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          fillOpacity={0}
        >
          EXTRA CURRICULAR
        </Text>
      </group>
      
      <KarateSection isActive={isActive} />
      <MusicSection isActive={isActive} />
    </group>
  );
};

export default Activities;
