import type { Planet } from "../data/planets";
import "./InfoPanel.css";

type Props = {
  planet: Planet | null;
  onClose: () => void;
};

export function InfoPanel({ planet, onClose }: Props) {
  return (
    <aside className={`info-panel ${planet ? "open" : ""}`} aria-hidden={!planet}>
      {planet && (
        <>
          <h2>{planet.name}</h2>
          <p className="type">{planet.type}</p>
          <p className="description">{planet.description}</p>
          <dl className="facts">
            {planet.facts.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <button type="button" onClick={onClose}>
            Tillbaka till solsystemet
          </button>
        </>
      )}
    </aside>
  );
}