// Convert NASA Orion STL to GLB using Three.js
import { readFileSync, writeFileSync } from 'fs';

// Parse binary STL
function parseSTL(buffer) {
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  // Skip 80-byte header
  const numTriangles = view.getUint32(80, true);
  console.log(`Triangles: ${numTriangles}`);

  const positions = new Float32Array(numTriangles * 9);
  const normals = new Float32Array(numTriangles * 9);

  let offset = 84;
  for (let i = 0; i < numTriangles; i++) {
    // Normal
    const nx = view.getFloat32(offset, true); offset += 4;
    const ny = view.getFloat32(offset, true); offset += 4;
    const nz = view.getFloat32(offset, true); offset += 4;

    // 3 vertices
    for (let v = 0; v < 3; v++) {
      const idx = i * 9 + v * 3;
      positions[idx]     = view.getFloat32(offset, true); offset += 4;
      positions[idx + 1] = view.getFloat32(offset, true); offset += 4;
      positions[idx + 2] = view.getFloat32(offset, true); offset += 4;
      normals[idx]     = nx;
      normals[idx + 1] = ny;
      normals[idx + 2] = nz;
    }
    offset += 2; // attribute byte count
  }

  return { positions, normals };
}

// Build minimal GLB
function buildGLB(positions, normals) {
  // Calculate bounding box for normalization
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (let i = 0; i < positions.length; i += 3) {
    minX = Math.min(minX, positions[i]);
    minY = Math.min(minY, positions[i+1]);
    minZ = Math.min(minZ, positions[i+2]);
    maxX = Math.max(maxX, positions[i]);
    maxY = Math.max(maxY, positions[i+1]);
    maxZ = Math.max(maxZ, positions[i+2]);
  }

  // Center and normalize to unit size
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const cz = (minZ + maxZ) / 2;
  const scale = 1.0 / Math.max(maxX - minX, maxY - minY, maxZ - minZ);

  const normPositions = new Float32Array(positions.length);
  for (let i = 0; i < positions.length; i += 3) {
    normPositions[i]     = (positions[i] - cx) * scale;
    normPositions[i + 1] = (positions[i + 1] - cy) * scale;
    normPositions[i + 2] = (positions[i + 2] - cz) * scale;
  }

  // Recalculate bounds
  let nMinX = Infinity, nMinY = Infinity, nMinZ = Infinity;
  let nMaxX = -Infinity, nMaxY = -Infinity, nMaxZ = -Infinity;
  for (let i = 0; i < normPositions.length; i += 3) {
    nMinX = Math.min(nMinX, normPositions[i]);
    nMinY = Math.min(nMinY, normPositions[i+1]);
    nMinZ = Math.min(nMinZ, normPositions[i+2]);
    nMaxX = Math.max(nMaxX, normPositions[i]);
    nMaxY = Math.max(nMaxY, normPositions[i+1]);
    nMaxZ = Math.max(nMaxZ, normPositions[i+2]);
  }

  const vertexCount = normPositions.length / 3;
  const posBytes = normPositions.byteLength;
  const normBytes = normals.byteLength;
  const totalBytes = posBytes + normBytes;

  // Pad to 4-byte alignment
  const paddedBytes = Math.ceil(totalBytes / 4) * 4;

  const gltf = {
    asset: { version: "2.0", generator: "artemis-ii-converter" },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0 }],
    meshes: [{
      primitives: [{
        attributes: { POSITION: 0, NORMAL: 1 },
        material: 0
      }]
    }],
    materials: [{
      pbrMetallicRoughness: {
        baseColorFactor: [0.85, 0.85, 0.85, 1.0],
        metallicFactor: 0.3,
        roughnessFactor: 0.6
      }
    }],
    accessors: [
      {
        bufferView: 0,
        componentType: 5126, // FLOAT
        count: vertexCount,
        type: "VEC3",
        min: [nMinX, nMinY, nMinZ],
        max: [nMaxX, nMaxY, nMaxZ]
      },
      {
        bufferView: 1,
        componentType: 5126,
        count: vertexCount,
        type: "VEC3"
      }
    ],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: posBytes, target: 34962 },
      { buffer: 0, byteOffset: posBytes, byteLength: normBytes, target: 34962 }
    ],
    buffers: [{ byteLength: paddedBytes }]
  };

  const jsonStr = JSON.stringify(gltf);
  const jsonBytes = Buffer.from(jsonStr);
  const jsonPadded = Buffer.alloc(Math.ceil(jsonBytes.length / 4) * 4, 0x20); // pad with spaces
  jsonBytes.copy(jsonPadded);

  const binBuffer = Buffer.alloc(paddedBytes);
  Buffer.from(normPositions.buffer).copy(binBuffer, 0);
  Buffer.from(normals.buffer).copy(binBuffer, posBytes);

  // GLB structure: header (12) + JSON chunk (8 + data) + BIN chunk (8 + data)
  const totalLength = 12 + 8 + jsonPadded.length + 8 + binBuffer.length;
  const glb = Buffer.alloc(totalLength);
  let off = 0;

  // Header
  glb.writeUInt32LE(0x46546C67, off); off += 4; // magic "glTF"
  glb.writeUInt32LE(2, off); off += 4; // version
  glb.writeUInt32LE(totalLength, off); off += 4; // total length

  // JSON chunk
  glb.writeUInt32LE(jsonPadded.length, off); off += 4;
  glb.writeUInt32LE(0x4E4F534A, off); off += 4; // "JSON"
  jsonPadded.copy(glb, off); off += jsonPadded.length;

  // BIN chunk
  glb.writeUInt32LE(binBuffer.length, off); off += 4;
  glb.writeUInt32LE(0x004E4942, off); off += 4; // "BIN\0"
  binBuffer.copy(glb, off);

  return glb;
}

// Main
const stlPath = '../inbox/spac3D/orion-capsule/orion_nofbc.stl';
const outPath = './public/models/orion-capsule.glb';

console.log('Reading STL...');
const stlData = readFileSync(stlPath);
const { positions, normals } = parseSTL(stlData);
console.log(`Vertices: ${positions.length / 3}`);

console.log('Building GLB...');
const glb = buildGLB(positions, normals);

// Ensure output dir exists
import { mkdirSync } from 'fs';
try { mkdirSync('./public/models', { recursive: true }); } catch {}

writeFileSync(outPath, glb);
console.log(`Written ${outPath} (${(glb.length / 1024).toFixed(1)} KB)`);
