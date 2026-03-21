import { Text } from "@react-three/drei";
import { SpaceBoi } from "../../models/SpaceBoi";
import { KarateModel } from "../../models/KarateModel";
import { PianoModel } from "../../models/PianoModel";

const Text3D = ({ title, subtitle, yOffset }: { title: string; subtitle: string; yOffset: number }) => {
  return (
    <group position={[0, yOffset, 0]}>
      <Text
        font="./soria-font.ttf"
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          font="./Vercetti-Regular.woff"
          fontSize={0.15}
          color="#aaa"
          anchorX="center"
          anchorY="middle"
          position={[0, -0.3, 0]}
        >
          {subtitle}
        </Text>
      )}
    </group>
  );
};

const Activities = () => {
  return (
    <group>
      <group scale={0.3} position={[0, -3, -5]}>
        <SpaceBoi />
      </group>
      
      <group position={[-2, -1, 0]}>
        <group scale={0.006} rotation={[0, Math.PI / 4, 0]}>
          <KarateModel />
        </group>
        <Text3D title="KARATE" subtitle="" yOffset={0.8} />
        <Text3D title="2ND DAN BLACK BELT" subtitle="" yOffset={0.4} />
        <Text3D title="WKF JUDGE B" subtitle="" yOffset={0} />
      </group>
      
      <group position={[2, -1, 0]}>
        <group scale={0.003} rotation={[0, -Math.PI / 6, 0]}>
          <PianoModel />
        </group>
        <Text3D title="KEYS. STAGE. VIBES" subtitle="" yOffset={0.8} />
        <Text3D title="BAND. MUSICIAN" subtitle="" yOffset={0.4} />
      </group>
    </group>
  );
};

export default Activities;