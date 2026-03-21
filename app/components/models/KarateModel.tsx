import { useGLTF } from '@react-three/drei'
import { ThreeElements } from '@react-three/fiber'

export function KarateModel(props: ThreeElements['group']) {
  const { scene } = useGLTF('models/karate.glb')
  return <primitive object={scene} {...props} />
}

useGLTF.preload('models/karate.glb')
