import { Html } from "@react-three/drei";

const DEG = Math.PI / 180;

/** Punkt på jordklotets yta, lat/lon i grader */
function surfacePosition(lat: number, lon: number): [number, number, number] {
  const la = lat * DEG;
  const lo = lon * DEG;
  return [
    Math.cos(la) * Math.cos(lo) * 1.01,
    Math.sin(la) * 1.01,
    -Math.cos(la) * Math.sin(lo) * 1.01,
  ];
}

function Marker({
  lat,
  lon,
  label,
}: {
  lat: number;
  lon: number;
  label: string;
}) {
  return (
    <group position={surfacePosition(lat, lon)}>
      <mesh>
        <sphereGeometry args={[0.06, 12, 8]} />
        <meshBasicMaterial color="#ffc23d" />
      </mesh>
      <Html zIndexRange={[10, 0]}>
        <span className="surface-label">{label}</span>
      </Html>
    </group>
  );
}

export function EarthAxis() {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.028, 0.028, 3.4, 8]} />
        <meshBasicMaterial color="#ffd66b" />
      </mesh>
      <Html position={[0, 1.8, 0]} zIndexRange={[10, 0]}>
        <span className="surface-label">Nordpolen</span>
      </Html>
      <Marker lat={59.33} lon={0} label="Sverige" />
      <Marker lat={-33.87} lon={133} label="Australien" />
    </group>
  );
}
