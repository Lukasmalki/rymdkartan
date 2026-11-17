import type { Mission } from "../data/missions";
import "./MissionPanel.css";

type Props = {
  mission: Mission;
  stepIndex: number;
  onBack: () => void;
  onNext: () => void;
  onExit: () => void;
  canGoNext: boolean;
  children: React.ReactNode;
};

export function MissionPanel({
  mission,
  stepIndex,
  onBack,
  onNext,
  onExit,
  canGoNext,
  children,
}: Props) {
  const step = mission.steps[stepIndex];
  const isLast = stepIndex === mission.steps.length - 1;
  const progress = ((stepIndex + 1) / mission.steps.length) * 100;

  return (
    <aside className="mission-panel">
      <div className="mission-top">
        <p className="mission-step">
          Steg {stepIndex + 1} av {mission.steps.length}
        </p>
        <button type="button" className="mission-exit" onClick={onExit}>
          Avsluta uppdraget
        </button>
      </div>

      <div className="mission-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <h2>{step.title}</h2>

      <div className="mission-content">{children}</div>

      <div className="mission-nav">
        <button
          type="button"
          className="secondary"
          onClick={onBack}
          disabled={stepIndex === 0}
        >
          Bakåt
        </button>
        <button
          type="button"
          className="primary"
          onClick={onNext}
          disabled={!canGoNext}
        >
          {isLast ? "Klar" : "Nästa"}
        </button>
      </div>
    </aside>
  );
}
