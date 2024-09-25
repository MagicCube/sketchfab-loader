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

import { find, traverse } from "../utils/traverse";

import {
  type I3DMesh,
  I3DObjectType,
  type I3DObject,
  type I3DGroup,
} from "./types";

export function loadModel(model: I3DObject) {
  // traverse(model, (obj) => {
  //   if (obj.type === I3DObjectType.Mesh) {
  //     console.info(obj);
  //   }
  // });
  // const obj = find(model, (obj) => obj.name === "TRUNK_Tesla_Base_0")!;
  const obj = model;
  return parseObject(obj);
}

function parseObject(obj: I3DObject) {
  if (obj.type === I3DObjectType.Group) {
    return parseGroup(obj);
  }
  return parseMesh(obj);
}

function parseGroup(id3Group: I3DGroup) {
  const group = new Group();
  if (id3Group.matrix) {
    group.matrix = new Matrix4();
    group.matrix.fromArray(id3Group.matrix);
    console.info(group.matrix, id3Group.matrix);
  }
  for (const child of id3Group.children) {
    group.add(parseObject(child));
  }
  return group;
}

function parseMesh(id3Mesh: I3DMesh) {
  let geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new BufferAttribute(new Float32Array(id3Mesh.geometry.vertices), 3),
  );
  geometry.setAttribute(
    "normal",
    new BufferAttribute(new Float32Array(id3Mesh.geometry.normals), 3),
  );
  geometry.setAttribute(
    "uv",
    new BufferAttribute(new Float32Array(id3Mesh.geometry.uvs), 2),
  );
  geometry.setIndex(id3Mesh.geometry.primitives[0]!.indices);
  geometry = toTrianglesDrawMode(geometry, 1);
  // geometry.computeVertexNormals();
  // geometry.computeTangents();
  // geometry.computeBoundingBox();

  const material = new MeshStandardMaterial({ color: 0x00ff00 });
  material.side = DoubleSide;

  const mesh = new Mesh(geometry, material);
  mesh.name = id3Mesh.name;
  return mesh;
}
