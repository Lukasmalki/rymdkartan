import { sunInfo } from "../utils/sun";

const W = 320;
const H = 140;
const LEFT = 26;
const RIGHT = 8;
const TOP = 14;
const BOTTOM = 22;

const xFor = (day: number) => LEFT + (day / 365) * (W - LEFT - RIGHT);
const yFor = (hours: number) => H - BOTTOM - (hours / 24) * (H - TOP - BOTTOM);

export function DayLengthChart({ day, tilt }: { day: number; tilt: number }) {
  const points: string[] = [];
  for (let d = 0; d <= 365; d += 5) {
    const { hours } = sunInfo(59.33, d, tilt);
    points.push(`${xFor(d).toFixed(1)},${yFor(hours).toFixed(1)}`);
  }

  const today = sunInfo(59.33, day, tilt);

  return (
    <figure className="chart">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Dagens längd i Sverige över året vid ${tilt} graders lutning`}
      >
        {[0, 6, 12, 18, 24].map((h) => (
          <g key={h}>
            <line
              x1={LEFT}
              y1={yFor(h)}
              x2={W - RIGHT}
              y2={yFor(h)}
              stroke="rgba(154,163,199,0.18)"
              strokeWidth="1"
            />
            <text
              x={LEFT - 6}
              y={yFor(h) + 3.5}
              textAnchor="end"
              fill="#9aa3c7"
              fontSize="9"
            >
              {h}
            </text>
          </g>
        ))}

        <polyline
          points={points.join(" ")}
          fill="none"
          stroke="#ffc23d"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        <line
          x1={xFor(day)}
          y1={TOP}
          x2={xFor(day)}
          y2={H - BOTTOM}
          stroke="#eef1ff"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.5"
        />
        <circle cx={xFor(day)} cy={yFor(today.hours)} r="4.5" fill="#eef1ff" />

        {[
          { d: 15, label: "jan" },
          { d: 105, label: "apr" },
          { d: 196, label: "jul" },
          { d: 288, label: "okt" },
        ].map((m) => (
          <text
            key={m.label}
            x={xFor(m.d)}
            y={H - 6}
            textAnchor="middle"
            fill="#9aa3c7"
            fontSize="9"
          >
            {m.label}
          </text>
        ))}
      </svg>
      <figcaption>
        Dagens längd i Sverige, timmar per dygn över hela året.
      </figcaption>
    </figure>
  );
}
