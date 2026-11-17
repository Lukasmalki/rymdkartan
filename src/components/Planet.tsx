import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { MathUtils } from "three";
import type { Group, Mesh } from "three";
import type { Planet as PlanetData } from "../data/planets";
import { PlanetLabel } from "./PlanetLabel";
import { dayToAngle } from "../utils/sun";

const YEAR_IN_SECONDS = 80;

type Props = {
  data: PlanetData;
  onSelect: (id: string) => void;
  isSelected: boolean;
  missionDay?: number | null;
  tiltOverride?: number;
  children?: React.ReactNode;
};

export function Planet({
  data,
  onSelect,
  isSelected,
  missionDay,
  tiltOverride,
  children,
}: Props) {
  const orbit = useRef<Group>(null);
  const globe = useRef<Mesh>(null);
  const texture = useTexture(data.texture);

  const tilt = tiltOverride ?? data.axialTilt;
  const counter = useRef<Group>(null);

  useFrame((_, delta) => {
    if (orbit.current) {
      if (missionDay != null) {
        orbit.current.rotation.y = dayToAngle(missionDay); // NYTT
      } else {
        orbit.current.rotation.y +=
          (delta * Math.PI * 2) / (data.orbitalPeriod * YEAR_IN_SECONDS);
      }
      if (counter.current)
        counter.current.rotation.y = -orbit.current.rotation.y; // NYTT
    }
    if (globe.current)
      globe.current.rotation.y += delta * 0.3 * (missionDay != null ? 3 : 1); // ÄNDRAD
  });

  return (
    <group ref={orbit}>
      <group position={[data.distance, 0, 0]}>
        <group ref={counter}>
          {" "}
          {/* NYTT: motroterar så axeln pekar åt samma håll hela året */}
          {!isSelected && (
            <PlanetLabel
              name={data.name}
              radius={data.radius}
              onSelect={() => onSelect(data.id)}
            />
          )}
          <group rotation={[0, 0, MathUtils.degToRad(tilt)]}>
            {" "}
            {/* ÄNDRAD: använder tilt */}
            <mesh
              ref={globe}
              name={data.id}
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
            {children} {/* NYTT */}
          </group>
        </group>
      </group>
    </group>
  );
}
