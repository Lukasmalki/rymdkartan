import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three"
import { MathUtils } from "three";
import { useTexture } from "@react-three/drei";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";

function Earth() {
  const ref = useRef<Mesh>(null);
  const texture = useTexture("/textures/earth.jpg")

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.5
  });

  return (
    <group rotation-z={MathUtils.degToRad(23.4)}>
      <mesh ref={ref}>
        <sphereGeometry args={[1, 64, 32]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  );
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 4] }}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 0, 5]} intensity={2} />
      <Suspense fallback={null}>
        <Earth />
      </Suspense>
    </Canvas>
  )
}