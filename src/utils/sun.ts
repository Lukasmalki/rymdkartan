const DEG = Math.PI / 180;

/** Dag 0 = 1 januari. Vinkeln i jordens bana, 0 vid sommarsolståndet. */
export const dayToAngle = (day: number) => (2 * Math.PI * (day - 171)) / 365;

/** Dagens längd i timmar och solens höjd mitt på dagen. Förenklad, utan ljusbrytning. */
export function sunInfo(latitude: number, day: number, tilt: number) {
  const declination = -tilt * Math.cos((2 * Math.PI * (day + 11)) / 365);
  const x = -Math.tan(latitude * DEG) * Math.tan(declination * DEG);
  const hours = x <= -1 ? 24 : x >= 1 ? 0 : (2 * Math.acos(x)) / DEG / 15;
  return { hours, altitude: 90 - Math.abs(latitude - declination) };
}

const MONTHS = [
  "januari",
  "februari",
  "mars",
  "april",
  "maj",
  "juni",
  "juli",
  "augusti",
  "september",
  "oktober",
  "november",
  "december",
];
const MONTH_STARTS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

export function formatDate(day: number) {
  const d = Math.floor(((day % 365) + 365) % 365);
  let m = 0;
  for (let i = 11; i >= 0; i--)
    if (d >= MONTH_STARTS[i]) {
      m = i;
      break;
    }
  return `${d - MONTH_STARTS[m] + 1} ${MONTHS[m]}`;
}

export function formatHours(hours: number) {
  if (hours >= 23.99) return "24 h, solen går inte ner";
  if (hours <= 0.01) return "0 h, solen går inte upp";
  let h = Math.floor(hours);
  let m = Math.round((hours - h) * 60);
  if (m === 60) {
    h++;
    m = 0;
  }
  return `${h} h ${m} min`;
}
