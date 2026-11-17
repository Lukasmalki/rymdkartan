import { useMemo } from "react";
import { BufferGeometry, Vector3 } from "three";

export function OrbitRing({ radius }: { radius: number }) {
  const geometry = useMemo(() => {
    const points: Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      points.push(
        new Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius),
      );
    }
    return new BufferGeometry().setFromPoints(points);
  }, [radius]);

  return (
    <line>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial color="#9aa3c7" transparent opacity={0.2} />
    </line>
  );
}
