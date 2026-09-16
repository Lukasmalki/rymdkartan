import { Canvas } from "@react-three/fiber";
import { PLANETS } from "./data/planets";
import { Planet } from "./components/Planet"
import { useState, Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import { InfoPanel } from "./components/InfoPanel";

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = PLANETS.find((p) => p.id === selectedId) ?? null;
  return (
    <>
      <Canvas camera={{ position: [0, 20, 45] }}>
        <ambientLight intensity={0.35} />
        <pointLight position={[0, 0, 0]} intensity={200} decay={2} />
        <Suspense fallback={null}>
          {PLANETS.map((p) => (
            <Planet key={p.id} data={p} onSelect={setSelectedId} />
          ))}
        </Suspense>
        <OrbitControls />
      </Canvas>
      <InfoPanel planet={selected} onClose={() => setSelectedId(null)} />
    </>
  );
}