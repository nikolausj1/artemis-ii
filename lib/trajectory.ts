import * as THREE from "three";

const TRAJECTORY_CONTROL_POINTS = [
  // Earth orbit (tight loops near origin)
  new THREE.Vector3(0, 0, 2),
  new THREE.Vector3(1.5, 0.2, 1),
  new THREE.Vector3(2, 0, -1),
  new THREE.Vector3(0.5, -0.2, -2),
  new THREE.Vector3(0, 0, 2),
  new THREE.Vector3(1.5, 0.2, 1),

  // TLI - departure from Earth orbit
  new THREE.Vector3(3, 0.5, 3),
  new THREE.Vector3(8, 1, 5),

  // Outbound coast
  new THREE.Vector3(15, 1.5, 4),
  new THREE.Vector3(25, 1, 3),
  new THREE.Vector3(33, 0.5, 2),

  // Lunar flyby - curve behind the Moon (negative z = behind)
  new THREE.Vector3(38, 0.3, 1),
  new THREE.Vector3(40, 0, -2),
  new THREE.Vector3(43, -0.5, -4),
  new THREE.Vector3(44, -0.3, -2),
  new THREE.Vector3(42, 0, 1),

  // Return coast - mirror of outbound but offset in z
  new THREE.Vector3(35, -0.5, -2),
  new THREE.Vector3(25, -1, -3),
  new THREE.Vector3(15, -1.5, -4),

  // Earth approach and re-entry
  new THREE.Vector3(8, -1, -4),
  new THREE.Vector3(3, -0.5, -2),
  new THREE.Vector3(0.5, 0, -0.5),
];

export const TRAJECTORY_CURVE = new THREE.CatmullRomCurve3(
  TRAJECTORY_CONTROL_POINTS,
  false,
  "catmullrom",
  0.5
);

export function getPositionAtMET(met: number, totalDuration: number): THREE.Vector3 {
  const t = Math.max(0, Math.min(1, met / totalDuration));
  return TRAJECTORY_CURVE.getPointAt(t);
}

export function getCurvePoints(segments: number = 500): THREE.Vector3[] {
  return TRAJECTORY_CURVE.getPoints(segments);
}
