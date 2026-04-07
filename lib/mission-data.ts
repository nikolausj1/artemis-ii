export interface MissionPhase {
  id: string;
  name: string;
  day: number;
  date: string;
  startMET: number;
  endMET: number;
  description: string;
  color: string;
  curveStart: number;
  curveEnd: number;
  cameraPreset: CameraPresetId;
  stats: {
    distanceFromEarth: string;
    distanceFromMoon: string;
    velocity: string;
  };
}

export interface CrewMember {
  name: string;
  role: "Commander" | "Pilot" | "Mission Specialist 1" | "Mission Specialist 2";
  agency: "NASA" | "CSA";
  country: "US" | "CA";
  flightNumber: number;
  bio: string;
  initials: string;
  color: string;
}

export interface MissionActivity {
  id: string;
  day: number;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  crewInvolved: string[];
  icon: string;
}

export type CameraPresetId =
  | "wide_shot"
  | "earth_closeup"
  | "departure"
  | "deep_space"
  | "lunar_approach"
  | "lunar_flyby"
  | "return_overview";

export interface CameraPreset {
  position: [number, number, number];
  target: [number, number, number];
}

export const MISSION_PHASES: MissionPhase[] = [
  {
    id: "launch",
    name: "Launch & Earth Orbit",
    day: 1,
    date: "April 1, 2026",
    startMET: 0,
    endMET: 24,
    description: "SLS launches from Kennedy Space Center LC-39B. Orion completes two Earth orbits while systems are checked before committing to the Moon.",
    color: "#4488ff",
    curveStart: 0.0,
    curveEnd: 0.08,
    cameraPreset: "earth_closeup",
    stats: { distanceFromEarth: "0 - 250 mi", distanceFromMoon: "~239,000 mi", velocity: "17,500 mph" }
  },
  {
    id: "tli",
    name: "Trans-Lunar Injection",
    day: 2,
    date: "April 2, 2026",
    startMET: 24,
    endMET: 48,
    description: "The ICPS upper stage fires its RL-10 engine one final time, accelerating Orion to 24,500 mph and setting it on the free-return path to the Moon.",
    color: "#44ddff",
    curveStart: 0.08,
    curveEnd: 0.15,
    cameraPreset: "departure",
    stats: { distanceFromEarth: "250 - 30,000 mi", distanceFromMoon: "~210,000 mi", velocity: "24,500 mph" }
  },
  {
    id: "outbound_coast_1",
    name: "Outbound Coast (Day 3)",
    day: 3,
    date: "April 3, 2026",
    startMET: 48,
    endMET: 72,
    description: "First trajectory correction burn fine-tunes the path. Crew rehearses lunar flyby observation tasks and performs medical demonstrations including CPR in microgravity.",
    color: "#44ccee",
    curveStart: 0.15,
    curveEnd: 0.25,
    cameraPreset: "wide_shot",
    stats: { distanceFromEarth: "30,000 - 80,000 mi", distanceFromMoon: "~170,000 mi", velocity: "10,000 mph" }
  },
  {
    id: "outbound_coast_2",
    name: "Outbound Coast (Day 4)",
    day: 4,
    date: "April 4, 2026",
    startMET: 72,
    endMET: 96,
    description: "Victor Glover takes manual control of Orion to test handling in deep space. 24-hour acoustics test begins. Cabin reconfigured for lunar flyby.",
    color: "#55bbdd",
    curveStart: 0.25,
    curveEnd: 0.35,
    cameraPreset: "deep_space",
    stats: { distanceFromEarth: "80,000 - 140,000 mi", distanceFromMoon: "~110,000 mi", velocity: "5,500 mph" }
  },
  {
    id: "lunar_influence",
    name: "Lunar Sphere of Influence",
    day: 5,
    date: "April 5, 2026",
    startMET: 96,
    endMET: 120,
    description: "The Moon's gravity becomes the dominant force on Orion. Crew demonstrates survival suits, reviews final science targets, and positions cameras for the flyby.",
    color: "#66aacc",
    curveStart: 0.35,
    curveEnd: 0.43,
    cameraPreset: "lunar_approach",
    stats: { distanceFromEarth: "140,000 - 200,000 mi", distanceFromMoon: "~50,000 mi", velocity: "3,500 mph" }
  },
  {
    id: "lunar_flyby",
    name: "Lunar Flyby",
    day: 6,
    date: "April 6, 2026",
    startMET: 120,
    endMET: 144,
    description: "Closest approach: 4,067 miles above the Moon at 7:02 PM EDT. ~40-min comms blackout behind the far side. Crew photographs Earthrise and observes craters, maria, and polar regions.",
    color: "#ffcc44",
    curveStart: 0.43,
    curveEnd: 0.57,
    cameraPreset: "lunar_flyby",
    stats: { distanceFromEarth: "~230,000 mi", distanceFromMoon: "4,067 mi (closest)", velocity: "5,100 mph" }
  },
  {
    id: "return_coast_1",
    name: "Return Coast (Day 7)",
    day: 7,
    date: "April 7, 2026",
    startMET: 144,
    endMET: 168,
    description: "First return trajectory correction burn. Crew reviews and catalogs flyby photos and observations. Orion exits lunar sphere of influence.",
    color: "#ee9944",
    curveStart: 0.57,
    curveEnd: 0.67,
    cameraPreset: "return_overview",
    stats: { distanceFromEarth: "200,000 - 160,000 mi", distanceFromMoon: "~50,000 mi", velocity: "3,800 mph" }
  },
  {
    id: "return_coast_2",
    name: "Return Coast (Day 8)",
    day: 8,
    date: "April 8, 2026",
    startMET: 168,
    endMET: 192,
    description: "Wiseman and Glover practice manual piloting. Crew builds improvised radiation shelter from Orion supplies to test solar storm protection. Second trajectory correction burn.",
    color: "#dd7744",
    curveStart: 0.67,
    curveEnd: 0.78,
    cameraPreset: "return_overview",
    stats: { distanceFromEarth: "160,000 - 100,000 mi", distanceFromMoon: "~130,000 mi", velocity: "5,200 mph" }
  },
  {
    id: "return_coast_3",
    name: "Return Coast (Day 9)",
    day: 9,
    date: "April 9, 2026",
    startMET: 192,
    endMET: 216,
    description: "Final trajectory correction burn. Crew rehearses re-entry and splashdown procedures. All equipment secured for re-entry. Last rest period before return.",
    color: "#cc5544",
    curveStart: 0.78,
    curveEnd: 0.90,
    cameraPreset: "return_overview",
    stats: { distanceFromEarth: "100,000 - 30,000 mi", distanceFromMoon: "~210,000 mi", velocity: "8,500 mph" }
  },
  {
    id: "reentry",
    name: "Earth Return & Splashdown",
    day: 10,
    date: "April 10, 2026",
    startMET: 216,
    endMET: 240,
    description: "Service module separates. Orion hits atmosphere at 24,500 mph. Heat shield reaches 5,000 degrees F. Parachutes deploy. Splashdown in Pacific Ocean off San Diego at ~8:07 PM EDT.",
    color: "#ff4444",
    curveStart: 0.90,
    curveEnd: 1.0,
    cameraPreset: "earth_closeup",
    stats: { distanceFromEarth: "30,000 - 0 mi", distanceFromMoon: "~239,000 mi", velocity: "24,500 mph (entry) / 17 mph (splashdown)" }
  }
];

export const CREW: CrewMember[] = [
  {
    name: "Reid Wiseman",
    role: "Commander",
    agency: "NASA",
    country: "US",
    flightNumber: 2,
    bio: "Second spaceflight. Flew as flight engineer on ISS Expedition 41 (2014). Logged 165+ days in space and nearly 13 hours across 2 spacewalks. Former Navy test pilot.",
    initials: "RW",
    color: "#3b82f6"
  },
  {
    name: "Victor Glover",
    role: "Pilot",
    agency: "NASA",
    country: "US",
    flightNumber: 2,
    bio: "Second spaceflight. Pilot on SpaceX Crew-1, spent 168 days on ISS Expedition 64. Completed 4 spacewalks. Navy pilot with 3,000+ flight hours in 40+ aircraft types.",
    initials: "VG",
    color: "#10b981"
  },
  {
    name: "Christina Koch",
    role: "Mission Specialist 1",
    agency: "NASA",
    country: "US",
    flightNumber: 2,
    bio: "Second spaceflight. Set record for longest single spaceflight by a woman: 328 days on ISS (Expeditions 59-61). Participated in first all-female spacewalks. Electrical engineer.",
    initials: "CK",
    color: "#f59e0b"
  },
  {
    name: "Jeremy Hansen",
    role: "Mission Specialist 2",
    agency: "CSA",
    country: "CA",
    flightNumber: 1,
    bio: "First spaceflight. Colonel in the Canadian Armed Forces, former CF-18 fighter pilot. Bachelor of Science in space science from Royal Military College. First Canadian on a lunar mission.",
    initials: "JH",
    color: "#ef4444"
  }
];

export const MISSION_ACTIVITIES: MissionActivity[] = [
  // Flight Day 1 - April 1
  { id: "d1_liftoff", day: 1, startTime: "2026-04-01T12:48:00-04:00", endTime: "2026-04-01T12:56:00-04:00", title: "Liftoff", description: "SLS launches from Kennedy Space Center LC-39B. The crew experiences 8.8 million pounds of thrust.", crewInvolved: ["all"], icon: "🚀" },
  { id: "d1_orbit", day: 1, startTime: "2026-04-01T12:56:00-04:00", endTime: "2026-04-01T13:00:00-04:00", title: "Orbit insertion", description: "Orion reaches low Earth orbit ~8 minutes after launch.", crewInvolved: ["all"], icon: "🌍" },
  { id: "d1_checkout", day: 1, startTime: "2026-04-01T13:00:00-04:00", endTime: "2026-04-01T17:00:00-04:00", title: "Spacecraft checkout", description: "Crew verifies life support, power, communications, water, and waste systems.", crewInvolved: ["all"], icon: "🔧" },
  { id: "d1_prox", day: 1, startTime: "2026-04-01T17:00:00-04:00", endTime: "2026-04-01T21:00:00-04:00", title: "Proximity operations demo", description: "Orion maneuvers relative to the spent ICPS upper stage, testing piloting and rendezvous skills.", crewInvolved: ["Wiseman", "Glover"], icon: "🎯" },
  { id: "d1_sleep", day: 1, startTime: "2026-04-01T21:00:00-04:00", endTime: "2026-04-02T00:00:00-04:00", title: "First sleep period", description: "Crew sleeps in rotating 4-hour shifts while Orion completes its first Earth orbit.", crewInvolved: ["all"], icon: "😴" },

  // Flight Day 2 - April 2
  { id: "d2_pretli", day: 2, startTime: "2026-04-02T06:00:00-04:00", endTime: "2026-04-02T09:00:00-04:00", title: "Pre-TLI checkout", description: "Final systems check before committing to the Moon. Life support stress test with high-intensity exercise.", crewInvolved: ["all"], icon: "🔧" },
  { id: "d2_tliprep", day: 2, startTime: "2026-04-02T09:00:00-04:00", endTime: "2026-04-02T10:00:00-04:00", title: "TLI prep", description: "Christina Koch leads TLI burn preparations, configuring the engine and navigation systems.", crewInvolved: ["Koch"], icon: "⚙️" },
  { id: "d2_tli", day: 2, startTime: "2026-04-02T10:30:00-04:00", endTime: "2026-04-02T11:00:00-04:00", title: "Trans-Lunar Injection burn", description: "The ICPS fires its RL-10 engine one final time, accelerating Orion to 24,500 mph and setting the free-return course.", crewInvolved: ["all"], icon: "🔥" },
  { id: "d2_posttli", day: 2, startTime: "2026-04-02T11:00:00-04:00", endTime: "2026-04-02T15:00:00-04:00", title: "Post-TLI systems check", description: "Verify trajectory, separate from ICPS, deploy solar arrays fully, confirm free-return path.", crewInvolved: ["all"], icon: "✅" },
  { id: "d2_settle", day: 2, startTime: "2026-04-02T15:00:00-04:00", endTime: "2026-04-02T20:00:00-04:00", title: "Settling in for deep space", description: "First meals in transit, configure cabin for multi-day coast. Earth shrinking visibly through windows.", crewInvolved: ["all"], icon: "🌌" },

  // Flight Day 3 - April 3
  { id: "d3_otc", day: 3, startTime: "2026-04-03T07:00:00-04:00", endTime: "2026-04-03T09:00:00-04:00", title: "Outbound trajectory correction burn", description: "First OTC burn fine-tunes the path to the Moon.", crewInvolved: ["all"], icon: "🎯" },
  { id: "d3_rehearsal", day: 3, startTime: "2026-04-03T09:00:00-04:00", endTime: "2026-04-03T12:00:00-04:00", title: "Lunar flyby rehearsal", description: "Crew practices the observation tasks they will perform during the 3-hour lunar close approach window.", crewInvolved: ["all"], icon: "📋" },
  { id: "d3_medical", day: 3, startTime: "2026-04-03T13:00:00-04:00", endTime: "2026-04-03T15:00:00-04:00", title: "Medical demonstrations", description: "CPR procedures in microgravity. Wiseman and Glover check out the medical kit (thermometer, blood pressure monitor, stethoscope).", crewInvolved: ["Glover", "Koch", "Hansen"], icon: "🏥" },
  { id: "d3_science", day: 3, startTime: "2026-04-03T15:00:00-04:00", endTime: "2026-04-03T18:00:00-04:00", title: "Lunar science target review", description: "Mission control uplinks final observation assignments for the flyby.", crewInvolved: ["all"], icon: "🔬" },

  // Flight Day 4 - April 4
  { id: "d4_piloting", day: 4, startTime: "2026-04-04T08:00:00-04:00", endTime: "2026-04-04T12:00:00-04:00", title: "Manual piloting demonstration", description: "Victor Glover takes manual control of Orion, testing handling qualities across six-degree-of-freedom and three-degree-of-freedom attitude modes.", crewInvolved: ["Glover"], icon: "🎮" },
  { id: "d4_acoustics", day: 4, startTime: "2026-04-04T12:00:00-04:00", endTime: "2026-04-04T18:00:00-04:00", title: "24-hour acoustics test begins", description: "Engineers characterize the sound environment inside Orion for crew comfort data.", crewInvolved: ["all"], icon: "🔊" },
  { id: "d4_reconfig", day: 4, startTime: "2026-04-04T14:00:00-04:00", endTime: "2026-04-04T16:00:00-04:00", title: "Cabin reconfiguration for flyby", description: "Stow loose items, position cameras and observation gear at windows.", crewInvolved: ["all"], icon: "📦" },

  // Flight Day 5 - April 5
  { id: "d5_suits", day: 5, startTime: "2026-04-05T08:00:00-04:00", endTime: "2026-04-05T11:00:00-04:00", title: "Spacesuit demonstration", description: "Crew demonstrates the Orion Crew Survival System suit, testing fit and mobility in the cabin.", crewInvolved: ["all"], icon: "🧑‍🚀" },
  { id: "d5_finalprep", day: 5, startTime: "2026-04-05T11:00:00-04:00", endTime: "2026-04-05T14:00:00-04:00", title: "Lunar flyby final prep", description: "Review final science targets, camera settings, observation timeline. The Moon's gravity is now the dominant force on Orion.", crewInvolved: ["all"], icon: "🌙" },
  { id: "d5_photo", day: 5, startTime: "2026-04-05T14:00:00-04:00", endTime: "2026-04-05T17:00:00-04:00", title: "Window photography setup", description: "Position handheld cameras and configure Orion's external cameras for lunar surface imaging.", crewInvolved: ["Koch", "Hansen"], icon: "📸" },

  // Flight Day 6 - April 6
  { id: "d6_approach", day: 6, startTime: "2026-04-06T08:00:00-04:00", endTime: "2026-04-06T14:00:00-04:00", title: "Flyby approach and prep", description: "Final preparations. The Moon grows rapidly in the windows.", crewInvolved: ["all"], icon: "🌙" },
  { id: "d6_window_open", day: 6, startTime: "2026-04-06T14:45:00-04:00", endTime: "2026-04-06T15:30:00-04:00", title: "Flyby window opens", description: "Orion is close enough for detailed lunar surface observations to begin.", crewInvolved: ["all"], icon: "👁️" },
  { id: "d6_eclipse", day: 6, startTime: "2026-04-06T15:30:00-04:00", endTime: "2026-04-06T17:47:00-04:00", title: "Solar eclipse from space", description: "The Sun disappears behind the Moon for nearly an hour as Orion, Moon, and Sun align. Crew observes the solar corona around the Moon's dark disk.", crewInvolved: ["all"], icon: "🌑" },
  { id: "d6_blackout", day: 6, startTime: "2026-04-06T17:47:00-04:00", endTime: "2026-04-06T18:27:00-04:00", title: "Communications blackout", description: "Orion passes behind the Moon. Radio signals blocked for ~40 minutes. The crew is alone on the far side.", crewInvolved: ["all"], icon: "📡" },
  { id: "d6_restored", day: 6, startTime: "2026-04-06T18:27:00-04:00", endTime: "2026-04-06T19:02:00-04:00", title: "Communications restored", description: "Orion emerges from behind the Moon. Signal reacquired by the Deep Space Network.", crewInvolved: ["all"], icon: "📡" },
  { id: "d6_closest", day: 6, startTime: "2026-04-06T19:02:00-04:00", endTime: "2026-04-06T21:40:00-04:00", title: "Closest approach & observations", description: "Orion passes 4,067 miles above the lunar surface. The Moon appears as large as a basketball held at arm's length. Crew photographs Earthrise.", crewInvolved: ["all"], icon: "🌙" },
  { id: "d6_window_close", day: 6, startTime: "2026-04-06T21:40:00-04:00", endTime: "2026-04-06T23:59:00-04:00", title: "Flyby window closes", description: "Orion moves beyond optimal observation range. The Moon begins to shrink in the windows.", crewInvolved: ["all"], icon: "🔭" },

  // Flight Day 7 - April 7
  { id: "d7_rtc1", day: 7, startTime: "2026-04-07T08:00:00-04:00", endTime: "2026-04-07T10:00:00-04:00", title: "Return trajectory correction burn 1", description: "First of three RTC burns to fine-tune the path home.", crewInvolved: ["all"], icon: "🎯" },
  { id: "d7_review", day: 7, startTime: "2026-04-07T10:00:00-04:00", endTime: "2026-04-07T14:00:00-04:00", title: "Observation data review", description: "Review and catalog photos and observation notes from the flyby for downlink to mission control.", crewInvolved: ["Koch", "Hansen"], icon: "📸" },
  { id: "d7_systems", day: 7, startTime: "2026-04-07T14:00:00-04:00", endTime: "2026-04-07T18:00:00-04:00", title: "Spacecraft systems check", description: "Full systems health review as Orion exits the lunar sphere of influence. Earth's gravity becomes dominant again.", crewInvolved: ["all"], icon: "🔧" },

  // Flight Day 8 - April 8
  { id: "d8_piloting", day: 8, startTime: "2026-04-08T08:00:00-04:00", endTime: "2026-04-08T11:00:00-04:00", title: "Manual piloting demo 2", description: "Commanders practice manual attitude control: centering targets in windows, tail-to-Sun attitude, comparing control modes.", crewInvolved: ["Wiseman", "Glover"], icon: "🎮" },
  { id: "d8_shelter", day: 8, startTime: "2026-04-08T11:00:00-04:00", endTime: "2026-04-08T15:00:00-04:00", title: "Radiation shelter construction", description: "Crew builds an improvised radiation shelter using Orion's supplies and central stowage bays. Tests how quickly they can establish a low-dose zone for solar storm protection.", crewInvolved: ["all"], icon: "🛡️" },
  { id: "d8_rtc2", day: 8, startTime: "2026-04-08T15:00:00-04:00", endTime: "2026-04-08T17:00:00-04:00", title: "Return trajectory correction burn 2", description: "Second mid-course correction to refine splashdown targeting.", crewInvolved: ["all"], icon: "🎯" },

  // Flight Day 9 - April 9
  { id: "d9_reentry_review", day: 9, startTime: "2026-04-09T08:00:00-04:00", endTime: "2026-04-09T12:00:00-04:00", title: "Re-entry procedure review", description: "Crew studies and rehearses the re-entry and splashdown procedures with mission control.", crewInvolved: ["all"], icon: "📋" },
  { id: "d9_final_rtc", day: 9, startTime: "2026-04-09T12:00:00-04:00", endTime: "2026-04-09T14:00:00-04:00", title: "Final trajectory correction burn", description: "Last RTC burn ensures precise splashdown targeting off the coast of San Diego.", crewInvolved: ["all"], icon: "🎯" },
  { id: "d9_stowdown", day: 9, startTime: "2026-04-09T14:00:00-04:00", endTime: "2026-04-09T18:00:00-04:00", title: "Cabin stowdown", description: "Secure all equipment and loose items for re-entry. Configure seats and restraints.", crewInvolved: ["all"], icon: "📦" },
  { id: "d9_rest", day: 9, startTime: "2026-04-09T18:00:00-04:00", endTime: "2026-04-09T20:00:00-04:00", title: "Crew rest", description: "Final sleep period before re-entry day.", crewInvolved: ["all"], icon: "😴" },

  // Flight Day 10 - April 10
  { id: "d10_prep", day: 10, startTime: "2026-04-10T08:00:00-04:00", endTime: "2026-04-10T12:00:00-04:00", title: "Re-entry prep", description: "Final systems configuration. Service module separation prep.", crewInvolved: ["all"], icon: "🔧" },
  { id: "d10_separation", day: 10, startTime: "2026-04-10T16:00:00-04:00", endTime: "2026-04-10T16:30:00-04:00", title: "Service module separation", description: "The European Service Module separates from the crew module. Only the capsule returns to Earth.", crewInvolved: ["all"], icon: "✂️" },
  { id: "d10_entry", day: 10, startTime: "2026-04-10T19:30:00-04:00", endTime: "2026-04-10T19:50:00-04:00", title: "Entry interface", description: "Orion hits the top of Earth's atmosphere at 24,500 mph. Heat shield reaches 5,000 degrees F (~2,760 degrees C).", crewInvolved: ["all"], icon: "🔥" },
  { id: "d10_chutes", day: 10, startTime: "2026-04-10T19:50:00-04:00", endTime: "2026-04-10T20:07:00-04:00", title: "Parachute deploy", description: "Two drogue chutes slow Orion to ~307 mph. Three pilot chutes then pull out the three main parachutes.", crewInvolved: ["all"], icon: "🪂" },
  { id: "d10_splashdown", day: 10, startTime: "2026-04-10T20:07:00-04:00", endTime: "2026-04-10T20:30:00-04:00", title: "Splashdown", description: "Orion touches down in the Pacific Ocean at ~17 mph off the coast of San Diego. USS John P. Murtha recovery team moves in.", crewInvolved: ["all"], icon: "🌊" },
  { id: "d10_recovery", day: 10, startTime: "2026-04-10T20:30:00-04:00", endTime: "2026-04-10T23:59:00-04:00", title: "Recovery", description: "Helicopters retrieve crew, deliver to USS John P. Murtha for post-mission medical evaluations.", crewInvolved: ["all"], icon: "🚁" },
];
