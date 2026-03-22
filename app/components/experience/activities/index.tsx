import React, { useRef, useEffect } from 'react';
import { Text, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
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
      x: isActive ? 0 : -2,
      duration: 0.5,
    });
    gsap.to(groupRef.current.scale, {
      x: isActive ? 1 : 0,
      y: isActive ? 1 : 0,
      z: isActive ? 1 : 0,
      duration: 0.5,
    });
  }, [isActive]);

  return (
    <group ref={groupRef} position={[-2, 0, 0]} scale={[0, 0, 0]}
      onPointerOver={() => { if (isActive) { setHovered(true); document.body.style.cursor = 'pointer'; }}}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <group scale={0.008} rotation={[0, Math.PI / 4, 0]} position={[0, -0.5, 0]}>
        <KarateModel />
      </group>
      <group position={[0, 0.4, 0]}>
        <Text
          font="./soria-font.ttf"
          fontSize={0.15}
          color={hovered ? "#fff" : "#ccc"}
          anchorX="center"
        >
          KARATE
        </Text>
        <Text
          font="./soria-font.ttf"
          fontSize={0.08}
          color="#888"
          anchorX="center"
          position={[0, -0.2, 0]}
        >
          2ND DAN BLACK BELT
        </Text>
        <Text
          font="./Vercetti-Regular.woff"
          fontSize={0.05}
          color="#666"
          anchorX="center"
          position={[0, -0.35, 0]}
        >
          WKF JUDGE B
        </Text>
      </group>
    </group>
  );
};

const MusicSection = ({ isActive }: { isActive: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    if (!groupRef.current) return;
    gsap.to(groupRef.current.position, {
      x: isActive ? 0 : 2,
      duration: 0.5,
      delay: 0.1,
    });
    gsap.to(groupRef.current.scale, {
      x: isActive ? 1 : 0,
      y: isActive ? 1 : 0,
      z: isActive ? 1 : 0,
      duration: 0.5,
      delay: 0.1,
    });
  }, [isActive]);

  return (
    <group ref={groupRef} position={[2, 0, 0]} scale={[0, 0, 0]}
      onPointerOver={() => { if (isActive) { setHovered(true); document.body.style.cursor = 'pointer'; }}}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <group scale={0.003} rotation={[0, -Math.PI / 6, 0]} position={[0, -0.5, 0]}>
        <PianoModel />
      </group>
      <group position={[0, 0.4, 0]}>
        <Text
          font="./soria-font.ttf"
          fontSize={0.15}
          color={hovered ? "#fff" : "#ccc"}
          anchorX="center"
        >
          MUSIC
        </Text>
        <Text
          font="./soria-font.ttf"
          fontSize={0.08}
          color="#888"
          anchorX="center"
          position={[0, -0.2, 0]}
        >
          KEYS. STAGE. VIBES
        </Text>
        <Text
          font="./Vercetti-Regular.woff"
          fontSize={0.05}
          color="#666"
          anchorX="center"
          position={[0, -0.35, 0]}
        >
          BAND PERFORMER
        </Text>
      </group>
    </group>
  );
};

const VideoBackground = ({ isActive }: { isActive: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useEffect(() => {
    if (!meshRef.current) return;
    gsap.to(meshRef.current.material, {
      opacity: isActive ? 0.3 : 0,
      duration: 0.5,
    });
  }, [isActive]);

  return (
    <mesh ref={meshRef} position={[0, 0, -2]} scale={[8, 8, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="#1a1a2e" transparent opacity={0} />
    </mesh>
  );
};

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
        y: isActive ? 0.6 : 1,
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
        camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, -(state.pointer.x * Math.PI) / 8, 0.02);
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
      
      <VideoBackground isActive={isActive} />
      
      <group scale={new THREE.Vector3(1.5, 1.5, 1.5)} position={[0, -2, -1]}>
        <SpaceBoi />
      </group>
      
      <group ref={titleRef} position={[0, 1, 0]}>
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
