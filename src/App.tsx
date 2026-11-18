import { Canvas } from "@react-three/fiber";
import { useRef, useState, Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { PLANETS } from "./data/planets";
import { SEASONS_MISSION } from "./data/missions";
import { Planet } from "./components/Planet";
import { InfoPanel } from "./components/InfoPanel";
import { Sun } from "./components/Sun";
import { OrbitRing } from "./components/OrbitRing";
import { CameraRig } from "./components/CameraRig";
import { MissionPanel } from "./components/MissionPanel";
import { EarthAxis } from "./components/EarthAxis";
import { DayTicker } from "./components/DayTicker";
import {
  GuessStep,
  DistanceStep,
  TiltStep,
  ExperimentStep,
} from "./components/MissionSteps";

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [missionStep, setMissionStep] = useState<number | null>(null);
  const [day, setDay] = useState(171);
  const [tilt, setTilt] = useState(23.4);
  const [guess, setGuess] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const controls = useRef<OrbitControlsImpl>(null);

  const selected = PLANETS.find((p) => p.id === selectedId) ?? null;
  const inMission = missionStep !== null;
  const step = missionStep !== null ? SEASONS_MISSION.steps[missionStep] : null;
  const cameraTarget =
    step?.view.target === "earth" ? "earth" : inMission ? null : selectedId;

  return (
    <>
      <Canvas camera={{ position: [0, 20, 45] }}>
        <ambientLight intensity={inMission ? 0.05 : 0.35} />
        <pointLight
          position={[0, 0, 0]}
          intensity={inMission ? 700 : 200}
          decay={2}
        />
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
              missionDay={inMission && p.id === "earth" ? day : null}
              tiltOverride={inMission && p.id === "earth" ? tilt : undefined}
            >
              {step?.view.showAxis && p.id === "earth" && <EarthAxis />}
            </Planet>
          ))}
        </Suspense>
        <OrbitControls ref={controls} />
        <CameraRig
          targetId={cameraTarget}
          controls={controls}
          panelOpen={selected !== null || inMission}
          sideView={step?.view.showAxis === true}
        />
        <DayTicker
          playing={playing && inMission}
          onTick={(d) =>
            setDay((prev) => {
              const next = prev + d * 30;
              if (next >= 365) {
                setPlaying(false);
                return 0;
              }
              return next;
            })
          }
        />
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
          canGoNext={step?.id !== "guess" || guess !== null}
          onBack={() => setMissionStep((s) => Math.max(0, (s ?? 0) - 1))}
          onNext={() =>
            setMissionStep((s) =>
              (s ?? 0) === SEASONS_MISSION.steps.length - 1
                ? null
                : (s ?? 0) + 1,
            )
          }
          onExit={() => {
            setMissionStep(null);
            setPlaying(false);
          }}
        >
          {step?.id === "guess" && (
            <GuessStep guess={guess} onGuess={setGuess} />
          )}
          {step?.id === "distance" && <DistanceStep guess={guess} />}
          {step?.id === "tilt" && <TiltStep day={day} onSetDay={setDay} />}
          {step?.id === "experiment" && (
            <ExperimentStep
              day={day}
              onSetDay={(d) => {
                setPlaying(false);
                setDay(d);
              }}
              tilt={tilt}
              onSetTilt={setTilt}
              playing={playing}
              onTogglePlay={() => setPlaying((p) => !p)}
            />
          )}
          {step?.id === "quiz" && <p>Frågorna kommer i nästa del.</p>}
        </MissionPanel>
      )}
    </>
  );
}
