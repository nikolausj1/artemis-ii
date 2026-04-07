// Generate procedural canvas textures as placeholders until real NASA textures are added
// These are intentionally simple - functional but not pretty

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function generateEarthDayTexture(): HTMLCanvasElement {
  const canvas = createCanvas(2048, 1024);
  const ctx = canvas.getContext("2d")!;

  // Ocean blue base
  ctx.fillStyle = "#1a4a8a";
  ctx.fillRect(0, 0, 2048, 1024);

  // Continents as rough shapes
  ctx.fillStyle = "#3d7a3d";
  // North America
  ctx.beginPath();
  ctx.ellipse(400, 350, 180, 150, -0.3, 0, Math.PI * 2);
  ctx.fill();
  // South America
  ctx.beginPath();
  ctx.ellipse(520, 620, 100, 180, 0.2, 0, Math.PI * 2);
  ctx.fill();
  // Europe/Africa
  ctx.beginPath();
  ctx.ellipse(1050, 350, 80, 120, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(1060, 550, 120, 180, 0, 0, Math.PI * 2);
  ctx.fill();
  // Asia
  ctx.beginPath();
  ctx.ellipse(1350, 330, 250, 150, 0, 0, Math.PI * 2);
  ctx.fill();
  // Australia
  ctx.beginPath();
  ctx.ellipse(1550, 650, 100, 70, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Polar ice caps
  ctx.fillStyle = "#dde8f0";
  ctx.fillRect(0, 0, 2048, 60);
  ctx.fillRect(0, 964, 2048, 60);

  return canvas;
}

export function generateEarthNightTexture(): HTMLCanvasElement {
  const canvas = createCanvas(2048, 1024);
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#000005";
  ctx.fillRect(0, 0, 2048, 1024);

  // City lights as scattered dots on landmasses
  const cityRegions = [
    { cx: 400, cy: 350, r: 150 },  // NA
    { cx: 520, cy: 580, r: 80 },   // SA
    { cx: 1050, cy: 380, r: 100 }, // Europe
    { cx: 1350, cy: 330, r: 200 }, // Asia
    { cx: 1550, cy: 650, r: 60 },  // Australia
  ];

  for (const region of cityRegions) {
    for (let i = 0; i < 200; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * region.r;
      const x = region.cx + Math.cos(angle) * dist;
      const y = region.cy + Math.sin(angle) * dist;
      const brightness = Math.random();
      ctx.fillStyle = `rgba(255, 200, 100, ${brightness * 0.8})`;
      ctx.fillRect(x, y, 2, 2);
    }
  }

  return canvas;
}

export function generateCloudTexture(): HTMLCanvasElement {
  const canvas = createCanvas(2048, 1024);
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "rgba(0, 0, 0, 0)";
  ctx.fillRect(0, 0, 2048, 1024);

  // Wispy cloud bands
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1024;
    const w = 100 + Math.random() * 300;
    const h = 30 + Math.random() * 60;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.3})`;
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}

export function generateMoonColorTexture(): HTMLCanvasElement {
  const canvas = createCanvas(2048, 1024);
  const ctx = canvas.getContext("2d")!;

  // Base grey
  ctx.fillStyle = "#888888";
  ctx.fillRect(0, 0, 2048, 1024);

  // Dark maria
  const maria = [
    { x: 600, y: 400, r: 150 },
    { x: 800, y: 350, r: 120 },
    { x: 500, y: 300, r: 100 },
    { x: 700, y: 500, r: 80 },
    { x: 900, y: 450, r: 110 },
    { x: 400, y: 450, r: 90 },
  ];

  for (const m of maria) {
    ctx.fillStyle = "#666666";
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Craters as subtle circles
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1024;
    const r = 5 + Math.random() * 30;
    ctx.strokeStyle = `rgba(100, 100, 100, ${0.3 + Math.random() * 0.4})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  return canvas;
}

export function generateMoonDisplacementTexture(): HTMLCanvasElement {
  const canvas = createCanvas(2048, 1024);
  const ctx = canvas.getContext("2d")!;

  // Mid-grey base (no displacement)
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, 2048, 1024);

  // Dark spots for craters (lower elevation)
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1024;
    const r = 5 + Math.random() * 25;
    ctx.fillStyle = `rgba(60, 60, 60, ${0.3 + Math.random() * 0.5})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}
