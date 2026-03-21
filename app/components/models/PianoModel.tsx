import { useGLTF } from '@react-three/drei'
import { ThreeElements } from '@react-three/fiber'

export function PianoModel(props: ThreeElements['group']) {
  const { scene } = useGLTF('models/piano.glb')
  return <primitive object={scene} {...props} />
}

useGLTF.preload('models/piano.glb')
