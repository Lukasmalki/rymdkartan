import { useFrame } from "@react-three/fiber";

export function DayTicker({
  playing,
  onTick,
}: {
  playing: boolean;
  onTick: (delta: number) => void;
}) {
  useFrame((_, delta) => {
    if (playing) onTick(delta);
  });
  return null;
}
