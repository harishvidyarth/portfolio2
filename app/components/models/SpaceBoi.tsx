import { useGLTF } from '@react-three/drei'
import { ThreeElements } from '@react-three/fiber'

export function SpaceBoi(props: ThreeElements['group']) {
  const { scene } = useGLTF('models/space_boi.glb')
  return <primitive object={scene} {...props} />
}

useGLTF.preload('models/space_boi.glb')
