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
import { QuizStep } from "./components/QuizStep";
import {
  GuessStep,
  DistanceStep,
  TiltStep,
  ExperimentStep,
} from "./components/MissionSteps";

const DEFAULT_TILT = 23.4;
const MIDSUMMER = 171;

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [missionStep, setMissionStep] = useState<number | null>(null);
  const [day, setDay] = useState(MIDSUMMER);
  const [tilt, setTilt] = useState(DEFAULT_TILT);
  const [guess, setGuess] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [playing, setPlaying] = useState(false);
  const controls = useRef<OrbitControlsImpl>(null);

  const selected = PLANETS.find((p) => p.id === selectedId) ?? null;
  const inMission = missionStep !== null;
  const step = missionStep !== null ? SEASONS_MISSION.steps[missionStep] : null;
  const cameraTarget =
    step?.view.target === "earth" ? "earth" : inMission ? null : selectedId;

  function resetMission() {
    setDay(MIDSUMMER);
    setTilt(DEFAULT_TILT);
    setGuess(null);
    setAnswers({});
    setPlaying(false);
  }

  function startMission() {
    setSelectedId(null);
    resetMission();
    setMissionStep(0);
  }

  function endMission() {
    setMissionStep(null);
    setPlaying(false);
  }

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
              tiltOverride={
                inMission && p.id === "earth"
                  ? step?.id === "experiment"
                    ? tilt
                    : DEFAULT_TILT
                  : undefined
              }
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
          playing={inMission && (playing || step?.view.play === true)}
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
        <button className="start-mission" onClick={startMission}>
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
            setMissionStep((s) => {
              if ((s ?? 0) === SEASONS_MISSION.steps.length - 1) {
                setPlaying(false);
                return null;
              }
              return (s ?? 0) + 1;
            })
          }
          onExit={endMission}
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
          {step?.id === "quiz" && (
            <QuizStep
              questions={SEASONS_MISSION.quiz}
              answers={answers}
              onAnswer={(qi, oi) =>
                setAnswers((prev) =>
                  prev[qi] === undefined ? { ...prev, [qi]: oi } : prev,
                )
              }
              guess={guess}
              onRestart={() => {
                resetMission();
                setMissionStep(0);
              }}
            />
          )}
        </MissionPanel>
      )}
    </>
  );
}
