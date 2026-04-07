"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { EARTH_RADIUS } from "@/lib/constants";

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform vec3 glowColor;
  uniform float fresnelPower;

  void main() {
    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - dot(viewDir, vNormal), fresnelPower);
    gl_FragColor = vec4(glowColor, fresnel * 0.6);
  }
`;

export default function Atmosphere() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        glowColor: { value: new THREE.Color("#4488ff") },
        fresnelPower: { value: 4.0 },
      },
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  return (
    <mesh material={material}>
      <sphereGeometry args={[EARTH_RADIUS * 1.08, 64, 64]} />
    </mesh>
  );
}
