import { Text } from "@react-three/drei";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from "three";

interface ActivityTileProps {
  id: string;
  model: React.ReactNode;
  modelScale: number;
  modelRotation: [number, number, number];
  title: string;
  subtitle: string;
  details: string[];
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onUnhover: () => void;
}

const ActivityTile = ({
  model,
  modelScale,
  modelRotation,
  title,
  subtitle,
  details,
  index,
  isHovered,
  onHover,
  onUnhover,
}: ActivityTileProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const xPos = index === 0 ? -1.3 : 1.3;

  useEffect(() => {
    if (!groupRef.current) return;
    gsap.to(groupRef.current.position, {
      x: xPos + (isHovered ? 0 : 0),
      z: isHovered ? 0.3 : 0,
      y: isHovered ? 0.2 : 0,
      duration: 0.3,
    });
    gsap.to(groupRef.current.scale, {
      x: isHovered ? 1.1 : 1,
      y: isHovered ? 1.1 : 1,
      z: isHovered ? 1.1 : 1,
      duration: 0.3,
    });
  }, [isHovered, xPos]);

  return (
    <group
      ref={groupRef}
      position={[xPos, 0, 0]}
      onPointerOver={() => !isMobile && onHover()}
      onPointerOut={() => !isMobile && onUnhover()}
    >
      <group scale={modelScale} rotation={modelRotation}>
        {model}
      </group>
      <group position={[0, -1, 0]}>
        <Text
          font="./soria-font.ttf"
          fontSize={0.12}
          color={isHovered ? "white" : "#aaa"}
          anchorX="center"
          fillOpacity={isHovered ? 1 : 0.7}
        >
          {title}
        </Text>
        <Text
          font="./soria-font.ttf"
          fontSize={0.08}
          color="#888"
          anchorX="center"
          position={[0, -0.2, 0]}
          fillOpacity={isHovered ? 1 : 0}
        >
          {subtitle}
        </Text>
        {details.map((detail, i) => (
          <Text
            key={i}
            font="./Vercetti-Regular.woff"
            fontSize={0.06}
            color="#666"
            anchorX="center"
            position={[0, -0.4 - i * 0.15, 0]}
            fillOpacity={isHovered ? 1 : 0}
          >
            {detail}
          </Text>
        ))}
      </group>
    </group>
  );
};

export { ActivityTile };
