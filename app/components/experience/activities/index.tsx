import React, { useRef } from 'react';
import { Text, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useState } from "react";
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
    modelScale: 0.006,
    modelRotation: [0, Math.PI / 4, 0] as [number, number, number],
  },
  music: {
    title: 'MUSIC',
    subtitle: 'KEYS. STAGE. VIBES',
    details: ['GUITAR & PIANO', 'BAND PERFORMER', 'COMPOSER'],
    model: <PianoModel />,
    modelScale: 0.003,
    modelRotation: [0, -Math.PI / 6, 0] as [number, number, number],
  },
};

const TabButton = ({ 
  tab, 
  isActive, 
  onClick,
  isSectionActive
}: { 
  tab: Tab; 
  isActive: boolean; 
  onClick: () => void;
  isSectionActive: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const data = TAB_DATA[tab];
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    if (!groupRef.current || !isSectionActive) return;
    gsap.to(groupRef.current.position, {
      y: isActive ? 0.1 : (hovered ? 0.05 : 0),
      duration: 0.3,
    });
    gsap.to(groupRef.current.scale, {
      x: isActive ? 1.1 : (hovered ? 1.05 : 1),
      y: isActive ? 1.1 : (hovered ? 1.05 : 1),
      z: isActive ? 1.1 : (hovered ? 1.05 : 1),
      duration: 0.3,
    });
  }, [isActive, hovered, isSectionActive]);

  return (
    <group 
      ref={groupRef} 
      position={[tab === 'karate' ? -0.7 : 0.7, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => { 
        if (isSectionActive) {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => { 
        setHovered(false);
        document.body.style.cursor = 'auto'; 
      }}
    >
      <Text
        font="./soria-font.ttf"
        fontSize={0.12}
        color={isActive ? "#fff" : (hovered ? "#ccc" : "#666")}
        anchorX="center"
        anchorY="middle"
      >
        {data.title}
      </Text>
      {isActive && isSectionActive && (
        <mesh position={[0, -0.12, -0.05]}>
          <planeGeometry args={[0.8, 0.02]} />
          <meshBasicMaterial color="#fff" transparent opacity={0.9} />
        </mesh>
      )}
    </group>
  );
};

const ModelDisplay = ({ tab, isVisible }: { tab: Tab; isVisible: boolean }) => {
  const data = TAB_DATA[tab];
  const groupRef = useRef<THREE.Group>(null);
  const [displayTab, setDisplayTab] = useState(tab);
  
  useEffect(() => {
    if (!groupRef.current) return;
    
    if (tab !== displayTab) {
      gsap.to(groupRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.2,
        onComplete: () => {
          setDisplayTab(tab);
          if (groupRef.current) {
            gsap.to(groupRef.current.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.3,
            });
          }
        }
      });
    } else {
      gsap.to(groupRef.current.scale, {
        x: isVisible ? 1 : 0,
        y: isVisible ? 1 : 0,
        z: isVisible ? 1 : 0,
        duration: 0.4,
      });
    }
  }, [tab, isVisible, displayTab]);

  return (
    <group ref={groupRef}>
      <group 
        scale={data.modelScale} 
        rotation={data.modelRotation}
        position={[0, -1.2, 0]}
      >
        {data.model}
      </group>
    </group>
  );
};

const DetailsPanel = ({ tab, isVisible }: { tab: Tab; isVisible: boolean }) => {
  const data = TAB_DATA[tab];
  const groupRef = useRef<THREE.Group>(null);
  const subtitleRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (!groupRef.current || !subtitleRef.current) return;
    
    const targetY = isVisible ? 0.3 : 0.8;
    gsap.to(groupRef.current.position, {
      y: targetY,
      duration: 0.4,
    });
    gsap.to(subtitleRef.current.position, {
      y: isVisible ? 0 : 0.3,
      duration: 0.4,
    });
    gsap.to(groupRef.current, {
      fillOpacity: isVisible ? 1 : 0,
      duration: 0.3,
    });
  }, [isVisible]);

  return (
    <>
      <group ref={subtitleRef} position={[0, 0.3, 0]}>
        <Text
          font="./soria-font.ttf"
          fontSize={0.1}
          color="#aaa"
          anchorX="center"
          anchorY="middle"
        >
          {data.subtitle}
        </Text>
      </group>
      <group ref={groupRef} position={[0, 0.8, 0]}>
        {data.details.map((detail, i) => (
          <Text
            key={i}
            font="./Vercetti-Regular.woff"
            fontSize={0.07}
            color="#888"
            anchorX="center"
            position={[0, -i * 0.15, 0]}
          >
            {detail}
          </Text>
        ))}
      </group>
    </>
  );
};

const Activities = () => {
  const { camera } = useThree();
  const isActive = usePortalStore((state) => state.activePortalId === "activities");
  const data = useScroll();
  const [activeTab, setActiveTab] = useState<Tab>('karate');
  const containerRef = useRef<THREE.Group>(null);

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

  useEffect(() => {
    if (containerRef.current) {
      gsap.to(containerRef.current.position, {
        y: isActive ? 0 : -2,
        duration: 0.6,
      });
      gsap.to(containerRef.current.scale, {
        x: isActive ? 1 : 0,
        y: isActive ? 1 : 0,
        z: isActive ? 1 : 0,
        duration: 0.6,
      });
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

  return (
    <group>
      <mesh receiveShadow>
        <planeGeometry args={[4, 4, 1]} />
        <shadowMaterial opacity={0.1} />
      </mesh>
      
      <group scale={new THREE.Vector3(1.5, 1.5, 1.5)} position={[0, -2, -1]}>
        <SpaceBoi />
      </group>
      
      <group ref={containerRef} position={[0, -2, 0]} scale={[0, 0, 0]}>
        <Text
          font="./soria-font.ttf"
          fontSize={0.18}
          color="white"
          anchorX="center"
          anchorY="middle"
          position={[0, 0.5, 0]}
        >
          EXTRA CURRICULAR
        </Text>
        
        <group position={[0, 0.15, 0]}>
          <TabButton tab="karate" isActive={activeTab === 'karate'} onClick={() => setActiveTab('karate')} isSectionActive={isActive} />
          <TabButton tab="music" isActive={activeTab === 'music'} onClick={() => setActiveTab('music')} isSectionActive={isActive} />
        </group>
        
        <ModelDisplay tab={activeTab} isVisible={isActive} />
        
        <DetailsPanel tab={activeTab} isVisible={isActive} />
      </group>
    </group>
  );
};

export default Activities;
