import { CameraPresetId, CameraPreset } from "./mission-data";

// Mission timing
export const MISSION_LAUNCH_TIME = new Date("2026-04-01T12:48:00-04:00");
export const MISSION_SPLASHDOWN_TIME = new Date("2026-04-10T20:07:00-04:00");
export const TOTAL_MISSION_DURATION_HOURS = 240;

// Scale factors
export const EARTH_RADIUS = 2;
export const MOON_RADIUS = EARTH_RADIUS * 0.27;
export const EARTH_MOON_DISTANCE = 40;

// Texture paths
export const TEXTURE_PATHS = {
  earthDay: "/textures/earth-day.jpg",
  earthNight: "/textures/earth-night.jpg",
  earthClouds: "/textures/earth-clouds.jpg",
  earthSpecular: "/textures/earth-specular.jpg",
  moonColor: "/textures/moon-color.jpg",
  moonDisplacement: "/textures/moon-displacement.jpg",
};

// Colors
export const COLORS = {
  sunLight: "#fff5e6",
  atmosphereBlue: "#4488ff",
  spacecraftGlow: "#88eeff",
  uiBackground: "rgba(10, 15, 30, 0.75)",
  sceneBackground: "#000008",
};

// Camera presets
export const CAMERA_PRESETS: Record<CameraPresetId, CameraPreset> = {
  wide_shot:       { position: [20, 25, 45],  target: [20, 0, 0] },
  earth_closeup:   { position: [0, 3, 8],     target: [0, 0, 0] },
  departure:       { position: [5, 8, 15],    target: [8, 0, 0] },
  deep_space:      { position: [20, 5, 20],   target: [20, 0, 0] },
  lunar_approach:  { position: [35, 3, 10],   target: [40, 0, 0] },
  lunar_flyby:     { position: [42, 2, 6],    target: [40, 0, 0] },
  return_overview: { position: [20, 30, 35],  target: [20, 0, 0] },
};

// Playback speeds
export const PLAYBACK_SPEEDS = [1, 10, 100, 1000];
