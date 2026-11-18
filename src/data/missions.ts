export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type MissionStep = {
  id: string;
  title: string;
  /** Vad kameran ska titta på under steget */
  view: {
    target: "overview" | "earth";
    showAxis?: boolean;
    showOrbitMarkers?: boolean;
    /** Dag på året, 0 = 1 januari. Utelämnad = behåll nuvarande */
    day?: number;
    /** Spela upp året automatiskt */
    play?: boolean;
  };
};

export type Mission = {
  id: string;
  title: string;
  subtitle: string;
  gradeLevel: string;
  steps: MissionStep[];
  quiz: QuizQuestion[];
};

export const SEASONS_MISSION: Mission = {
  id: "seasons",
  title: "Varför har vi årstider?",
  subtitle: "Cirka 5 minuter, för årskurs 4–6",
  gradeLevel: "4-6",
  steps: [
    {
      id: "guess",
      title: "Varför har vi årstider?",
      view: { target: "overview", play: true },
    },
    {
      id: "distance",
      title: "Är det avståndet?",
      view: { target: "overview", showOrbitMarkers: true, play: true },
    },
    {
      id: "tilt",
      title: "Jordaxeln lutar",
      view: { target: "earth", showAxis: true, day: 171 },
    },
    {
      id: "experiment",
      title: "Prova själv",
      view: { target: "earth", showAxis: true },
    },
    {
      id: "quiz",
      title: "Tre frågor",
      view: { target: "earth", showAxis: true, play: true },
    },
  ],
  quiz: [
    {
      question: "Varför är det sommar i Sverige i juli?",
      options: [
        "Jorden är som närmast solen",
        "Norra halvklotet lutar mot solen",
        "Solen lyser starkare i juli",
      ],
      correctIndex: 1,
      explanation:
        "I juli lutar norra halvklotet mot solen. Då står solen högt och dagarna är långa. Jorden är faktiskt lite längre från solen i juli än i januari.",
    },
    {
      question: "Vad skulle hända om jordaxeln inte lutade alls?",
      options: [
        "Det skulle bli sommar hela året",
        "Det skulle bli vinter hela året",
        "Årstiderna skulle nästan försvinna",
      ],
      correctIndex: 2,
      explanation:
        "Utan lutning skulle solen stå lika högt varje dag, och dagen skulle vara ungefär tolv timmar lång hela året.",
    },
    {
      question:
        "När det är sommar i Sverige, vilken årstid är det då i Australien?",
      options: ["Vinter", "Sommar", "Vår"],
      correctIndex: 0,
      explanation:
        "När norra halvklotet lutar mot solen lutar södra halvklotet bort från den. Därför firar många i Australien jul mitt i sommaren.",
    },
  ],
};

export const MISSIONS: Mission[] = [SEASONS_MISSION];
