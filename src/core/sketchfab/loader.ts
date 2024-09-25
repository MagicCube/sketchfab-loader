import {
  type I3DObject,
  type I3DGroup,
  I3DObjectType,
  type I3DMesh,
  type I3DPrimitive,
} from '~/loader/i3d';

import {
  type SFObject,
  SFObjectType,
  type SFGroup,
  type SFMeshObject,
  type SFMesh,
} from './types';

export function loadSketchfabModel(rootObject: SFObject) {
  const root = parseObject(rootObject);
  return root;
}

function parseObject(sfObject: SFObject): I3DObject {
  switch (sfObject.getTypeID()) {
    case SFObjectType.Group:
    case SFObjectType.MeshObject:
      return parseGroup(sfObject as SFGroup | SFMeshObject);
    case SFObjectType.Mesh:
      return parseMesh(sfObject as SFMesh);
    default:
      throw new Error(`Unsupported object type: ${sfObject.getTypeID()}`);
  }
}

function parseGroup(sfGroup: SFGroup | SFMeshObject): I3DGroup {
  const id3Group: I3DGroup = {
    type: I3DObjectType.Group,
    id: sfGroup.getInstanceID(),
    name: sfGroup.getName(),
    children: [],
  };
  if (sfGroup.getTypeID() === SFObjectType.MeshObject) {
    const sfMeshObject = sfGroup as SFMeshObject;
    id3Group.matrix = Array.from(sfMeshObject.getMatrix());
  }
  for (const child of sfGroup.children) {
    id3Group.children.push(parseObject(child));
  }
  return id3Group;
}

function parseMesh(sfMesh: SFMesh): I3DMesh {
  const primitives = sfMesh
    .getPrimitives()
    .map((primitive) => {
      if (primitive?.indices) {
        return {
          mode: primitive.mode,
          indices: Array.from(primitive.indices.getElements()),
        } as I3DPrimitive;
      }
      return null;
    })
    .filter((p) => p !== null);
  const attributes = sfMesh.getAttributes();
  return {
    type: I3DObjectType.Mesh,
    id: sfMesh.getInstanceID(),
    name: sfMesh.getName(),
    geometry: {
      vertices: Array.from(attributes.Vertex.getElements()),
      uvs: Array.from(attributes.TexCoord0.getElements()),
      primitives,
    },
  };
}
