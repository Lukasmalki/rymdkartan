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
import { SEASONS_MISSION } from "./data/missions";
import { MissionPanel } from "./components/MissionPanel";
import { EarthAxis } from "./components/EarthAxis"; // NYTT

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = PLANETS.find((p) => p.id === selectedId) ?? null;
  const controls = useRef<OrbitControlsImpl>(null);
  const [missionStep, setMissionStep] = useState<number | null>(null);
  const inMission = missionStep !== null;
  const [day, setDay] = useState(171);
  const step = missionStep !== null ? SEASONS_MISSION.steps[missionStep] : null;
  const cameraTarget =
    step?.view.target === "earth" ? "earth" : inMission ? null : selectedId;

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
              missionDay={inMission && p.id === "earth" ? day : null} // NYTT
            >
              {step?.view.showAxis && p.id === "earth" && <EarthAxis />}{" "}
              {/* NYTT */}
            </Planet>
          ))}
        </Suspense>
        <OrbitControls ref={controls} />
        <CameraRig
          targetId={cameraTarget}
          controls={controls}
          panelOpen={selected !== null || inMission}
        />{" "}
      </Canvas>
      <InfoPanel planet={selected} onClose={() => setSelectedId(null)} />
      {!inMission && (
        <button
          className="start-mission"
          onClick={() => {
            setSelectedId(null);
            setMissionStep(0);
          }}
        >
          Starta uppdrag: {SEASONS_MISSION.title}
          <small>{SEASONS_MISSION.subtitle}</small>
        </button>
      )}

      {inMission && (
        <MissionPanel
          mission={SEASONS_MISSION}
          stepIndex={missionStep}
          canGoNext={true}
          onBack={() => setMissionStep((s) => Math.max(0, (s ?? 0) - 1))}
          onNext={() =>
            setMissionStep((s) =>
              (s ?? 0) === SEASONS_MISSION.steps.length - 1
                ? null
                : (s ?? 0) + 1,
            )
          }
          onExit={() => setMissionStep(null)}
        >
          <p>Innehåll för steg {missionStep + 1} kommer här.</p>
        </MissionPanel>
      )}
    </>
  );
}
