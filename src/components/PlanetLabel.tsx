import { Html } from "@react-three/drei";

type Props = {
  name: string;
  radius: number;
  onSelect: () => void;
};

export function PlanetLabel({ name, radius, onSelect }: Props) {
  return (
    <Html position={[radius * 1.2, 0, 0]} center={false} zIndexRange={[10, 0]}>
      <button className="planet-label" onClick={onSelect}>
        {name}
      </button>
    </Html>
  );
}
