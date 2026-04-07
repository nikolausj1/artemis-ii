"use client";

export default function Lighting() {
  return (
    <>
      <directionalLight
        position={[100, 10, 50]}
        intensity={3.0}
        color="#fff5e6"
      />
      <ambientLight intensity={0.03} />
    </>
  );
}
