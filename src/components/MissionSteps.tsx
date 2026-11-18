import { sunInfo, formatDate, formatHours } from "../utils/sun";
import { DayLengthChart } from "./DayLengthChart";

const GUESSES = [
  { key: "distance", text: "Jorden är närmare solen på sommaren" },
  { key: "tilt", text: "Jordaxeln lutar" },
  { key: "sun", text: "Solen lyser starkare på sommaren" },
];

export function GuessStep({
  guess,
  onGuess,
}: {
  guess: string | null;
  onGuess: (g: string) => void;
}) {
  return (
    <>
      <p>
        I Sverige är det ljust och varmt på sommaren, men mörkt och kallt på
        vintern. Varför är det så?
      </p>
      <p>
        Gissa först. Det finns inga fel svar här, du får ta reda på det själv.
      </p>
      {GUESSES.map((g) => (
        <button
          key={g.key}
          type="button"
          className="option"
          aria-pressed={guess === g.key}
          onClick={() => onGuess(g.key)}
        >
          {g.text}
        </button>
      ))}
    </>
  );
}

export function DistanceStep({ guess }: { guess: string | null }) {
  return (
    <>
      <p>
        Många tror att det är sommar när jorden är närmast solen. Men jordens
        bana är nästan en perfekt cirkel.
      </p>
      <dl className="mini-facts">
        <div>
          <dt>Närmast solen</dt>
          <dd>i januari</dd>
        </div>
        <div>
          <dt>Längst bort</dt>
          <dd>i juli</dd>
        </div>
      </dl>
      <p>
        Jorden är alltså som närmast solen mitt i vår vinter. Skillnaden är bara
        ungefär 3 procent. Avståndet kan inte vara förklaringen.
      </p>
      {guess === "distance" && (
        <p className="callout">
          Du gissade på avståndet. Det är den vanligaste gissningen, även bland
          vuxna.
        </p>
      )}
    </>
  );
}

const JUNE_TEXT =
  "I juni lutar nordpolen in mot solen. Följ pricken för Sverige när jorden snurrar: den ligger i ljus nästan hela varvet, och solen står högt på himlen.";
const DEC_TEXT =
  "Nu är jorden på andra sidan solen. Axeln pekar fortfarande åt exakt samma håll, men därför lutar nordpolen nu bort från solen. Sverige ligger i mörker större delen av dygnet.";

export function TiltStep({
  day,
  onSetDay,
}: {
  day: number;
  onSetDay: (d: number) => void;
}) {
  const isJune = day < 250;
  return (
    <>
      <p>
        Den gula linjen är jordaxeln, en tänkt linje genom nordpolen och
        sydpolen. Den lutar 23,4 grader och pekar åt samma håll i rymden hela
        året.
      </p>
      <p className="callout">
        Solljuset kommer in från vänster i bilden. Titta på åt vilket håll
        nordpolen lutar när du byter månad.
      </p>
      <div className="chip-row">
        <button
          type="button"
          className="chip"
          aria-pressed={isJune}
          onClick={() => onSetDay(171)}
        >
          Visa juni
        </button>
        <button
          type="button"
          className="chip"
          aria-pressed={!isJune}
          onClick={() => onSetDay(354)}
        >
          Visa december
        </button>
      </div>
      <p>{isJune ? JUNE_TEXT : DEC_TEXT}</p>
      <p>
        Solen lyser ungefär lika starkt hela året. Det som ändras är hur länge
        och hur rakt solljuset träffar oss.
      </p>
    </>
  );
}

type ExperimentProps = {
  day: number;
  onSetDay: (d: number) => void;
  tilt: number;
  onSetTilt: (t: number) => void;
  playing: boolean;
  onTogglePlay: () => void;
};

export function ExperimentStep({
  day,
  onSetDay,
  tilt,
  onSetTilt,
  playing,
  onTogglePlay,
}: ExperimentProps) {
  const se = sunInfo(59.33, day, tilt);
  const au = sunInfo(-33.87, day, tilt);

  return (
    <>
      <p className="callout">
        Dra i lutningen och titta på kurvan. Vid 0° är alla dagar lika långa,
        året runt. Ju mer jorden lutar, desto större blir skillnaden mellan
        sommar och vinter.
      </p>

      <div className="control">
        <label htmlFor="day">
          Datum <b>{formatDate(day)}</b>
        </label>
        <input
          id="day"
          type="range"
          min={0}
          max={364}
          value={Math.round(day)}
          onChange={(e) => onSetDay(Number(e.target.value))}
        />
      </div>

      <div className="chip-row">
        <button type="button" className="chip" onClick={onTogglePlay}>
          {playing ? "Pausa" : "Spela upp året"}
        </button>
      </div>

      <div className="control">
        <label htmlFor="tilt">
          Jordaxelns lutning <b>{tilt.toFixed(1).replace(".", ",")}°</b>
        </label>
        <input
          id="tilt"
          type="range"
          min={0}
          max={45}
          step={0.1}
          value={tilt}
          onChange={(e) => onSetTilt(Number(e.target.value))}
        />
      </div>

      <div className="chip-row">
        <button type="button" className="chip" onClick={() => onSetTilt(23.4)}>
          Återställ till 23,4°
        </button>
      </div>

      <table className="measure">
        <thead>
          <tr>
            <th>Plats</th>
            <th>Dagens längd</th>
            <th>Solen mitt på dagen</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Sverige</th>
            <td>{formatHours(se.hours)}</td>
            <td>
              {se.altitude <= 0
                ? "under horisonten"
                : `${Math.round(se.altitude)}°`}
            </td>
          </tr>
          <tr>
            <th scope="row">Australien</th>
            <td>{formatHours(au.hours)}</td>
            <td>
              {au.altitude <= 0
                ? "under horisonten"
                : `${Math.round(au.altitude)}°`}
            </td>
          </tr>
        </tbody>
      </table>

      <DayLengthChart day={day} tilt={tilt} />
    </>
  );
}
