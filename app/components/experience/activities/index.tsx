import { ScrollControls, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { SpaceBoi } from "../../models/SpaceBoi";
import { KarateModel } from "../../models/KarateModel";
import { PianoModel } from "../../models/PianoModel";

const SpaceBackground = () => {
  return (
    <group scale={2} position={[0, -8, -5]}>
      <SpaceBoi />
    </group>
  );
};

const Text3D = ({ title, subtitle, yOffset, opacity }: { title: string; subtitle: string; yOffset: number; opacity: number }) => {
  const ref = useRef<THREE.Group>(null);
  
  return (
    <group ref={ref} position={[0, yOffset, 0]}>
      <Text
        font="./soria-font.ttf"
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        fillOpacity={opacity}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          font="./Vercetti-Regular.woff"
          fontSize={0.25}
          color="#888"
          anchorX="center"
          anchorY="middle"
          position={[0, -0.5, 0]}
          fillOpacity={opacity}
        >
          {subtitle}
        </Text>
      )}
    </group>
  );
};

const KarateSide = ({ scrollProgress }: { scrollProgress: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const opacity = scrollProgress > 0.1 ? Math.min((scrollProgress - 0.1) * 3, 1) : 0;
  
  return (
    <group ref={groupRef} position={[-8, -5, 0]} visible={opacity > 0}>
      <group scale={0.015} rotation={[0, Math.PI / 4, 0]}>
        <KarateModel />
      </group>
      <Text3D title="KARATE" subtitle="2ND DAN BLACK BELT" yOffset={-3} opacity={opacity} />
      <Text3D title="WKF" subtitle="JUDGE B" yOffset={-5} opacity={opacity} />
    </group>
  );
};

const MusicSide = ({ scrollProgress }: { scrollProgress: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const opacity = scrollProgress > 0.4 ? Math.min((scrollProgress - 0.4) * 3, 1) : 0;
  
  return (
    <group ref={groupRef} position={[8, -6, 0]} visible={opacity > 0}>
      <group scale={0.008} rotation={[0, -Math.PI / 6, 0]}>
        <PianoModel />
      </group>
      <Text3D title="KEYS. STAGE. VIBES" subtitle="" yOffset={-4} opacity={opacity} />
      <Text3D title="BAND. MUSICIAN" subtitle="" yOffset={-5.5} opacity={opacity} />
    </group>
  );
};

const Scene = ({ scrollProgress }: { scrollProgress: number }) => {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (groupRef.current) {
      camera.position.x = THREE.MathUtils.damp(camera.position.x, -scrollProgress * 5, 4, delta);
    }
  });
  
  return (
    <group ref={groupRef}>
      <SpaceBackground />
      <KarateSide scrollProgress={scrollProgress} />
      <MusicSide scrollProgress={scrollProgress} />
    </group>
  );
};

const Activities = () => {
  const scrollProgressRef = useRef(0);
  
  return (
    <group>
      <ScrollControls style={{ zIndex: -1}} pages={1} maxSpeed={0.4}>
        <Scene scrollProgress={scrollProgressRef.current} />
      </ScrollControls>
    </group>
  );
};

export default Activities;