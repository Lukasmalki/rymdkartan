import { Canvas } from "@react-three/fiber";
import { useRef, useState, Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { PLANETS } from "./data/planets";
import { Planet } from "./components/Planet";
import { InfoPanel } from "./components/InfoPanel";
import { Sun } from "./components/Sun";
import { OrbitRing } from "./components/OrbitRing";
import { CameraRig } from "./components/CameraRig";

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = PLANETS.find((p) => p.id === selectedId) ?? null;
  const controls = useRef<OrbitControlsImpl>(null);

  return (
    <>
      <Canvas camera={{ position: [0, 20, 45] }}>
        <ambientLight intensity={0.35} />
        <pointLight position={[0, 0, 0]} intensity={200} decay={2} />
        <Suspense fallback={null}>
          <Sun />
          {PLANETS.map((p) => (
            <OrbitRing key={`orbit-${p.id}`} radius={p.distance} />
          ))}
          {PLANETS.map((p) => (
            <Planet
              key={p.id}
              data={p}
              onSelect={setSelectedId}
              isSelected={p.id === selectedId}
            />
          ))}
        </Suspense>
        <OrbitControls ref={controls} />
        <CameraRig
          targetId={selectedId}
          controls={controls}
          panelOpen={selected !== null}
        />{" "}
      </Canvas>
      <InfoPanel planet={selected} onClose={() => setSelectedId(null)} />
    </>
  );
}
