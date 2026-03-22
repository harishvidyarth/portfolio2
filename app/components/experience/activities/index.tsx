import React from 'react';
import { Text, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from "three";
import { usePortalStore } from "@stores";
import { SpaceBoi } from "../../models/SpaceBoi";
import { KarateModel } from "../../models/KarateModel";
import { PianoModel } from "../../models/PianoModel";

type Tab = 'karate' | 'music';

const TAB_DATA: Record<Tab, {
  title: string;
  subtitle: string;
  details: string[];
  model: React.ReactNode;
  modelScale: number;
  modelRotation: [number, number, number];
}> = {
  karate: {
    title: 'KARATE',
    subtitle: '2ND DAN BLACK BELT',
    details: ['WKF JUDGE B CERTIFIED', 'SHOTOKAN STYLE', 'SINCE 2023'],
    model: <KarateModel />,
    modelScale: 0.005,
    modelRotation: [0, Math.PI / 4, 0] as [number, number, number],
  },
  music: {
    title: 'MUSIC',
    subtitle: 'KEYS. STAGE. VIBES',
    details: ['GUITAR & PIANO', 'BAND PERFORMER', 'COMPOSER'],
    model: <PianoModel />,
    modelScale: 0.0025,
    modelRotation: [0, -Math.PI / 6, 0] as [number, number, number],
  },
};

const TabButton = ({ 
  tab, 
  isActive, 
  onClick 
}: { 
  tab: Tab; 
  isActive: boolean; 
  onClick: () => void;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const data = TAB_DATA[tab];
  
  useEffect(() => {
    if (!groupRef.current) return;
    gsap.to(groupRef.current.position, {
      y: isActive ? 0.3 : 0,
      duration: 0.3,
    });
  }, [isActive]);

  return (
    <group 
      ref={groupRef} 
      position={[tab === 'karate' ? -0.8 : 0.8, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      <Text
        font="./soria-font.ttf"
        fontSize={0.15}
        color={isActive ? "#fff" : "#888"}
        anchorX="center"
        anchorY="middle"
        fillOpacity={isActive ? 1 : 0.6}
      >
        {data.title}
      </Text>
      {isActive && (
        <mesh position={[0, -0.15, -0.1]}>
          <planeGeometry args={[1.2, 0.03]} />
          <meshBasicMaterial color="#fff" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
};

const DetailsPanel = ({ tab, isVisible }: { tab: Tab; isVisible: boolean }) => {
  const data = TAB_DATA[tab];
  const groupRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (!groupRef.current) return;
    gsap.to(groupRef.current.position, {
      y: isVisible ? 0 : -0.5,
      duration: 0.4,
    });
  }, [isVisible]);

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <Text
        font="./soria-font.ttf"
        fontSize={0.12}
        color="#ccc"
        anchorX="center"
        position={[0, 0, 0]}
      >
        {data.subtitle}
      </Text>
      {data.details.map((detail, i) => (
        <Text
          key={i}
          font="./Vercetti-Regular.woff"
          fontSize={0.08}
          color="#666"
          anchorX="center"
          position={[0, -0.25 - i * 0.15, 0]}
        >
          {detail}
        </Text>
      ))}
    </group>
  );
};

const Activities = () => {
  const { camera } = useThree();
  const isActive = usePortalStore((state) => state.activePortalId === "activities");
  const data = useScroll();
  const [activeTab, setActiveTab] = useState<Tab>('karate');
  
  const currentData = TAB_DATA[activeTab];
  const modelRef = useRef<THREE.Group>(null);

  useEffect(() => {
    data.el.style.overflow = isActive ? 'hidden' : 'auto';
    if (isActive) {
      if (isMobile) {
        gsap.to(camera.position, { z: 11.5, y: -39, x: 1, duration: 1 });
      } else {
        gsap.to(camera.position, { y: -39, x: 2, duration: 1 });
      }
    }
  }, [isActive]);

  useFrame((state, delta) => {
    if (isActive) {
      if (!isMobile) {
        camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, -(state.pointer.x * Math.PI) / 4, 0.03);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, 11.5 - state.pointer.y, 7, delta);
      }
    }
  });

  useEffect(() => {
    if (!modelRef.current) return;
    gsap.to(modelRef.current.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 0.2,
      onComplete: () => {
        if (modelRef.current) {
          gsap.to(modelRef.current.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.2,
          });
        }
      }
    });
  }, [activeTab]);

  return (
    <group>
      <mesh receiveShadow>
        <planeGeometry args={[4, 4, 1]} />
        <shadowMaterial opacity={0.1} />
      </mesh>
      
      <group scale={new THREE.Vector3(1.5, 1.5, 1.5)} position={[0, -2, -1]}>
        <SpaceBoi />
      </group>
      
      {isActive && (
        <>
          <Text
            font="./soria-font.ttf"
            fontSize={0.25}
            color="white"
            anchorX="center"
            anchorY="middle"
            position={[0, 0.6, 0]}
          >
            EXTRA CURRICULAR
          </Text>
          
          <group position={[0, 0.2, 0]}>
            <TabButton tab="karate" isActive={activeTab === 'karate'} onClick={() => setActiveTab('karate')} />
            <TabButton tab="music" isActive={activeTab === 'music'} onClick={() => setActiveTab('music')} />
          </group>
          
          <group ref={modelRef} position={[0, -0.8, 0]}>
            <group scale={currentData.modelScale} rotation={currentData.modelRotation}>
              {currentData.model}
            </group>
          </group>
          
          <DetailsPanel tab={activeTab} isVisible={isActive} />
        </>
      )}
    </group>
  );
};

export default Activities;
