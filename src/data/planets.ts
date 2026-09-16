export type Planet = {
  id: string;
  name: string;
  radius: number;
  distance: number;
  orbitalPeriod: number;
  axialTilt: number;
  texture: string;
  type: string;
  description: string;
  facts: [string, string][];
};

export const PLANETS: Planet[] = [
  {
    id: "mercury",
    name: "Merkurius",
    radius: 0.55,
    distance: 11,
    orbitalPeriod: 0.241,
    axialTilt: 0.03,
    texture: "/textures/mercury.jpg",
    type: "Stenplanet, nummer ett från solen",
    description:
      "Den minsta planeten och den som ligger närmast solen. Merkurius har nästan ingen atmosfär, så värmen stannar inte kvar när det blir natt.",
    facts: [
      ["Avstånd från solen", "58 miljoner km"],
      ["Diameter", "4 879 km"],
      ["Ett år", "88 dygn"],
      ["Månar", "0"],
    ],
  },
  {
    id: "venus",
    name: "Venus",
    radius: 0.95,
    distance: 15,
    orbitalPeriod: 0.615,
    axialTilt: 177,
    texture: "/textures/venus.jpg",
    type: "Stenplanet, nummer två från solen",
    description:
      "Venus är nästan lika stor som jorden, men täckt av tjocka moln. De stänger inne värmen som i ett växthus, så ytan är runt 465 °C. Det är varmare än på Merkurius.",
    facts: [
      ["Avstånd från solen", "108 miljoner km"],
      ["Diameter", "12 104 km"],
      ["Ett år", "225 dygn"],
      ["Månar", "0"],
    ],
  },
  {
    id: "earth",
    name: "Jorden",
    radius: 1,
    distance: 19.5,
    orbitalPeriod: 1,
    axialTilt: 23.4,
    texture: "/textures/earth.jpg",
    type: "Stenplanet, nummer tre från solen",
    description:
      "Vår hemplanet, och den enda plats där vi vet att det finns liv. Ungefär 71 procent av ytan är täckt av hav.",
    facts: [
      ["Avstånd från solen", "150 miljoner km"],
      ["Diameter", "12 742 km"],
      ["Ett år", "365 dygn"],
      ["Månar", "1"],
    ],
  },
  {
    id: "mars",
    name: "Mars",
    radius: 0.72,
    distance: 24.5,
    orbitalPeriod: 1.881,
    axialTilt: 25.2,
    texture: "/textures/mars.jpg",
    type: "Stenplanet, nummer fyra från solen",
    description:
      "Den röda planeten. Färgen kommer från järnoxid, alltså rost, i sanden. Mars är kall och torr idag, men för länge sedan fanns det troligen flytande vatten där.",
    facts: [
      ["Avstånd från solen", "228 miljoner km"],
      ["Diameter", "6 779 km"],
      ["Ett år", "687 dygn"],
      ["Månar", "2"],
    ],
  },
];