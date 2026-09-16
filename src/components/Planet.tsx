import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { MathUtils } from "three";
import type { Group, Mesh } from "three";
import type { Planet as PlanetData } from "../data/planets";

const YEAR_IN_SECONDS = 80;

type Props = {
    data: PlanetData;
    onSelect: (id: string) => void;
}

export function Planet({ data, onSelect }: Props) {
    const orbit = useRef<Group>(null);
    const globe = useRef<Mesh>(null);
    const texture = useTexture(data.texture);

    useFrame((_, delta) => {
        if (orbit.current) {
            orbit.current.rotation.y += (delta * Math.PI * 2) / (data.orbitalPeriod * YEAR_IN_SECONDS);
        }
        if (globe.current) globe.current.rotation.y += delta * 0.3;
    });

    return (
    <group ref={orbit}>
      <group position={[data.distance, 0, 0]} rotation={[0, 0, MathUtils.degToRad(data.axialTilt)]}>
        <mesh 
        ref={globe}
        onClick={(e) => {
            e.stopPropagation();
            onSelect(data.id);
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
        >
          <sphereGeometry args={[data.radius, 48, 32]} />
          <meshStandardMaterial map={texture} />
        </mesh>
      </group>
    </group>
  );
}