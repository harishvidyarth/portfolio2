import { Text } from "@react-three/drei";
import { SpaceBoi } from "../../models/SpaceBoi";
import { KarateModel } from "../../models/KarateModel";
import { PianoModel } from "../../models/PianoModel";

const Text3D = ({ title, subtitle, yOffset }: { title: string; subtitle: string; yOffset: number }) => {
  return (
    <group position={[0, yOffset, 0]}>
      <Text
        font="./soria-font.ttf"
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          font="./Vercetti-Regular.woff"
          fontSize={0.12}
          color="#aaa"
          anchorX="center"
          anchorY="middle"
          position={[0, -0.25, 0]}
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
      <group scale={0.2} position={[0, -2, -3]}>
        <SpaceBoi />
      </group>
      
      <group position={[-1.5, 0, 0]}>
        <group scale={0.004} rotation={[0, Math.PI / 4, 0]}>
          <KarateModel />
        </group>
        <Text3D title="KARATE" subtitle="" yOffset={0.6} />
        <Text3D title="2ND DAN BLACK BELT" subtitle="" yOffset={0.3} />
        <Text3D title="WKF JUDGE B" subtitle="" yOffset={0} />
      </group>
      
      <group position={[1.5, 0, 0]}>
        <group scale={0.002} rotation={[0, -Math.PI / 6, 0]}>
          <PianoModel />
        </group>
        <Text3D title="KEYS. STAGE. VIBES" subtitle="" yOffset={0.6} />
        <Text3D title="BAND. MUSICIAN" subtitle="" yOffset={0.3} />
      </group>
    </group>
  );
};

export default Activities;