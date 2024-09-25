import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Group,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
} from "three";
import { toTrianglesDrawMode } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import {
  type I3DMesh,
  I3DObjectType,
  type I3DObject,
  type I3DGroup,
} from "./types";

export function loadModel(model: I3DObject) {
  return parseObject(model);
}

function parseObject(obj: I3DObject) {
  if (obj.type === I3DObjectType.Group) {
    return parseGroup(obj);
  }
  return parseMesh(obj);
}

function parseGroup(id3Group: I3DGroup) {
  const group = new Group();
  for (const child of id3Group.children) {
    if (child.id === "1039") {
      console.info(child);
      continue;
    }
    group.add(parseObject(child));
  }
  if (id3Group.matrix) {
    const matrix = new Matrix4();
    matrix.fromArray(id3Group.matrix);
    group.position.setFromMatrixPosition(matrix);
    group.quaternion.setFromRotationMatrix(matrix);
  }
  return group;
}

function parseMeshGeometry(id3Mesh: I3DMesh) {
  let geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new BufferAttribute(new Float32Array(id3Mesh.geometry.vertices), 3),
  );

  if (id3Mesh.geometry.normals) {
    geometry.setAttribute(
      "normal",
      new BufferAttribute(new Float32Array(id3Mesh.geometry.normals), 3),
    );
  }

  if (id3Mesh.geometry.uvs) {
    geometry.setAttribute(
      "uv",
      new BufferAttribute(new Float32Array(id3Mesh.geometry.uvs), 2),
    );
  }

  geometry.setIndex(id3Mesh.geometry.primitives[0]!.indices);
  if (id3Mesh.geometry.primitives[0]?.mode === 5) {
    geometry = toTrianglesDrawMode(geometry, 1);
  }

  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  return geometry;
}

function parseMesh(id3Mesh: I3DMesh) {
  const geometry = parseMeshGeometry(id3Mesh);
  const BASIC_COLORS = [
    0x00ff00, 0xff0000, 0x0000ff, 0xffff00, 0xffa500, 0x00ffff, 0xff00ff,
  ];
  const material = new MeshStandardMaterial({
    color: BASIC_COLORS[parseInt(id3Mesh.id) % BASIC_COLORS.length],
    transparent: false,
    opacity: 1,
    roughness: 0.5,
    metalness: 0.5,
  });
  material.side = DoubleSide;

  const mesh = new Mesh(geometry, material);
  mesh.name = id3Mesh.name;
  return mesh;
}
