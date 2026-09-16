export type Planet = {
  id: string;
  name: string;
  radius: number;
  distance: number;
  orbitalPeriod: number;
  axialTilt: number;   
  texture: string;
};

export const PLANETS: Planet[] = [
  { id: "mercury", name: "Merkurius", radius: 0.55, distance: 11,   orbitalPeriod: 0.241, axialTilt: 0.03, texture: "/textures/mercury.jpg" },
  { id: "venus",   name: "Venus",     radius: 0.95, distance: 15,   orbitalPeriod: 0.615, axialTilt: 177,  texture: "/textures/venus.jpg" },
  { id: "earth",   name: "Jorden",    radius: 1,    distance: 19.5, orbitalPeriod: 1,     axialTilt: 23.4, texture: "/textures/earth.jpg" },
  { id: "mars",    name: "Mars",      radius: 0.72, distance: 24.5, orbitalPeriod: 1.881, axialTilt: 25.2, texture: "/textures/mars.jpg" },
];