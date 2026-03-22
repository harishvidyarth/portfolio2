import React, { useRef, useEffect } from 'react';
import { Html } from "@react-three/drei";
import { Player } from '@lottiefiles/react-lottie-player';
import gsap from "gsap";
import * as THREE from "three";

const LOTTIE_KARATE = '/lottie/karate.json';
const LOTTIE_MUSIC = '/lottie/music.json';

const LottieBackground = ({ isActive }: { isActive: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useEffect(() => {
    if (!meshRef.current) return;
    gsap.to(meshRef.current.material, {
      opacity: isActive ? 0.15 : 0,
      duration: 0.8,
    });
  }, [isActive]);

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, -3]} scale={[12, 12, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#0f0f23" transparent opacity={0} />
      </mesh>
      {isActive && (
        <Html position={[-1.5, 0.5, -1]} center distanceFactor={4} zIndexRange={[0, 0]}>
          <Player
            src={LOTTIE_KARATE}
            autoplay
            loop
            style={{ width: '150px', height: '150px', opacity: 0.3 }}
          />
        </Html>
      )}
      {isActive && (
        <Html position={[1.5, 0.5, -1]} center distanceFactor={4} zIndexRange={[0, 0]}>
          <Player
            src={LOTTIE_MUSIC}
            autoplay
            loop
            style={{ width: '150px', height: '150px', opacity: 0.3 }}
          />
        </Html>
      )}
    </>
  );
};

export default LottieBackground;
