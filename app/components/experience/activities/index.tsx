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
import { ActivityTile } from "./ActivityTile";

const Activities = () => {
  const { camera } = useThree();
  const isActive = usePortalStore((state) => state.activePortalId === "activities");
  const data = useScroll();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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

  const activities = [
    {
      id: 'karate',
      model: <KarateModel />,
      modelScale: 0.004,
      modelRotation: [0, Math.PI / 4, 0],
      title: 'KARATE',
      subtitle: '2ND DAN BLACK BELT',
      details: ['WKF JUDGE B CERTIFIED', 'SHOTOKAN STYLE', 'SINCE 2023'],
    },
    {
      id: 'music',
      model: <PianoModel />,
      modelScale: 0.002,
      modelRotation: [0, -Math.PI / 6, 0],
      title: 'MUSICIAN',
      subtitle: 'KEYS. STAGE. VIBES',
      details: ['GUITAR & PIANO', 'BAND PERFORMER', 'COMPOSER'],
    },
  ];

  return (
    <group>
      <mesh receiveShadow>
        <planeGeometry args={[4, 4, 1]} />
        <shadowMaterial opacity={0.1} />
      </mesh>
      <group scale={new THREE.Vector3(1.5, 1.5, 1.5)} position={[0, -4, -1]}>
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
            position={[0, 0.5, 0]}
          >
            EXTRA CURRICULAR
          </Text>
          <group position={[0, -0.5, 0]}>
            {activities.map((activity, i) => (
              <ActivityTile
                key={activity.id}
                {...activity}
                index={i}
                isHovered={hoveredId === activity.id}
                onHover={() => setHoveredId(activity.id)}
                onUnhover={() => setHoveredId(null)}
              />
            ))}
          </group>
        </>
      )}
    </group>
  );
};

export default Activities;
