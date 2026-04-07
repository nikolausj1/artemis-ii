"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EARTH_RADIUS, TEXTURE_PATHS } from "@/lib/constants";
import {
  generateEarthDayTexture,
  generateEarthNightTexture,
  generateCloudTexture,
} from "@/lib/procedural-textures";

// Day/night blending shader
const dayNightVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  void main() {
    vUv = uv;
    vNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const dayNightFragmentShader = `
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform vec3 sunDirection;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vec3 dayColor = texture2D(dayMap, vUv).rgb;
    vec3 nightColor = texture2D(nightMap, vUv).rgb;

    float sunDot = dot(normalize(vNormal), normalize(sunDirection));
    // Soft terminator: blend over a range instead of hard cutoff
    float blend = smoothstep(-0.1, 0.2, sunDot);

    vec3 color = mix(nightColor * 2.0, dayColor, blend);
    // Add some ambient to the dark side so it's not pure black
    color += nightColor * 0.3 * (1.0 - blend);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function loadTextureWithFallback(
  loader: THREE.TextureLoader,
  path: string,
  fallbackGenerator: () => HTMLCanvasElement,
  srgb: boolean = true
): THREE.Texture {
  const tex = loader.load(path, undefined, undefined, () => {
    // Error loading - will be replaced by fallback
  });
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;

  // Also prepare fallback in case file doesn't exist
  try {
    const fallbackCanvas = fallbackGenerator();
    const fallbackTex = new THREE.CanvasTexture(fallbackCanvas);
    if (srgb) fallbackTex.colorSpace = THREE.SRGBColorSpace;
    // We'll check if the main texture loaded; for now return the main one
    // The error callback above fires async, so we can't know yet
    return tex;
  } catch {
    return tex;
  }
}

export default function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);

  const { dayTexture, nightTexture, cloudTexture, shaderMaterial } = useMemo(() => {
    const loader = new THREE.TextureLoader();

    // Day texture
    let dayTexture: THREE.Texture;
    const dayFallback = new THREE.CanvasTexture(generateEarthDayTexture());
    dayFallback.colorSpace = THREE.SRGBColorSpace;
    dayTexture = loader.load(
      TEXTURE_PATHS.earthDay,
      (t) => { t.colorSpace = THREE.SRGBColorSpace; },
      undefined,
      () => {
        // Use fallback
        shaderMaterial.uniforms.dayMap.value = dayFallback;
      }
    );
    dayTexture.colorSpace = THREE.SRGBColorSpace;

    // Night texture
    let nightTexture: THREE.Texture;
    const nightFallback = new THREE.CanvasTexture(generateEarthNightTexture());
    nightFallback.colorSpace = THREE.SRGBColorSpace;
    nightTexture = loader.load(
      TEXTURE_PATHS.earthNight,
      (t) => { t.colorSpace = THREE.SRGBColorSpace; },
      undefined,
      () => {
        shaderMaterial.uniforms.nightMap.value = nightFallback;
      }
    );
    nightTexture.colorSpace = THREE.SRGBColorSpace;

    // Cloud texture
    let cloudTexture: THREE.Texture;
    const cloudFallback = new THREE.CanvasTexture(generateCloudTexture());
    cloudTexture = loader.load(
      TEXTURE_PATHS.earthClouds,
      undefined,
      undefined,
      () => {
        cloudTexture = cloudFallback;
      }
    );

    // Sun direction matches the directional light position
    const sunDir = new THREE.Vector3(100, 10, 50).normalize();

    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader: dayNightVertexShader,
      fragmentShader: dayNightFragmentShader,
      uniforms: {
        dayMap: { value: dayTexture },
        nightMap: { value: nightTexture },
        sunDirection: { value: sunDir },
      },
    });

    return { dayTexture, nightTexture, cloudTexture, shaderMaterial };
  }, []);

  // Axial tilt and slow rotation
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.01;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * 0.011; // 10% faster
    }
  });

  return (
    <group rotation={[0, 0, (23.5 * Math.PI) / 180]}>
      {/* Earth with day/night shader */}
      <mesh ref={meshRef} material={shaderMaterial}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[EARTH_RADIUS * 1.01, 64, 64]} />
        <meshStandardMaterial
          map={cloudTexture}
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>
    </group>
  );
}
