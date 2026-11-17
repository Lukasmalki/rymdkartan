import { useTexture } from "@react-three/drei";

export function Sun() {
  const texture = useTexture("/textures/sun.jpg");

  return (
    <mesh>
      <sphereGeometry args={[5, 64, 48]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}
