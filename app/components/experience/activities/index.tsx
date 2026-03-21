import { ScrollControls, Text, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { SpaceBoi } from "../../models/SpaceBoi";
import { KarateModel } from "../../models/KarateModel";
import { PianoModel } from "../../models/PianoModel";

const SpaceBackground = () => {
  return (
    <group scale={0.5} position={[0, -12, -10]}>
      <SpaceBoi />
    </group>
  );
};

const Text3D = ({ title, subtitle, yOffset }: { title: string; subtitle: string; yOffset: number }) => {
  return (
    <group position={[0, yOffset, 0]}>
      <Text
        font="./soria-font.ttf"
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          font="./Vercetti-Regular.woff"
          fontSize={0.2}
          color="#888"
          anchorX="center"
          anchorY="middle"
          position={[0, -0.4, 0]}
        >
          {subtitle}
        </Text>
      )}
    </group>
  );
};

const KarateSide = () => {
  return (
    <group position={[-4, -2, 0]}>
      <group scale={0.01} rotation={[0, Math.PI / 4, 0]}>
        <KarateModel />
      </group>
      <Text3D title="KARATE" subtitle="2ND DAN BLACK BELT" yOffset={-1.5} />
      <Text3D title="WKF JUDGE B" subtitle="" yOffset={-2} />
    </group>
  );
};

const MusicSide = () => {
  return (
    <group position={[4, -2, 0]}>
      <group scale={0.005} rotation={[0, -Math.PI / 6, 0]}>
        <PianoModel />
      </group>
      <Text3D title="KEYS. STAGE. VIBES" subtitle="" yOffset={-1.5} />
      <Text3D title="BAND. MUSICIAN" subtitle="" yOffset={-2} />
    </group>
  );
};

const Scene = () => {
  const data = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      const offset = data.offset;
      
      if (offset < 0.75) {
        groupRef.current.position.x = -offset * 8;
        groupRef.current.position.y = -12 + offset * 4;
      }
    }
  });
  
  return (
    <group ref={groupRef} position={[0, -12, 0]}>
      <SpaceBackground />
      <KarateSide />
      <MusicSide />
    </group>
  );
};

const Activities = () => {
  return (
    <group>
      <ScrollControls pages={4} maxSpeed={0.4}>
        <Scene />
      </ScrollControls>
    </group>
  );
};

export default Activities;