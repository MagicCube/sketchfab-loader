import {
  type I3DObject,
  type I3DGroup,
  I3DObjectType,
  type I3DMesh,
  type I3DPrimitive,
} from "~/core/i3d/types";

import {
  type SFObject,
  SFObjectType,
  type SFGroup,
  type SFMeshObject,
  type SFMesh,
} from "./types";

const EXPORT_NORMAL = false;
const EXPORT_UV = false;

export function convertModel(model: SFObject) {
  const root = convertObject(model);
  return root;
}

function convertObject(sfObject: SFObject): I3DObject {
  switch (sfObject.getTypeID()) {
    case SFObjectType.Group:
    case SFObjectType.MeshObject:
      return convertGroup(sfObject as SFGroup | SFMeshObject);
    case SFObjectType.Mesh:
      return convertMesh(sfObject as SFMesh);
    default:
      console.error("Unsupported object type", sfObject);
      throw new Error(`Unsupported object type: ${sfObject.getTypeID()}`);
  }
}

function convertGroup(sfGroup: SFGroup | SFMeshObject): I3DGroup {
  const id3Group: I3DGroup = {
    type: I3DObjectType.Group,
    id: sfGroup.getInstanceID().toString(),
    name: sfGroup.getName(),
    children: [],
  };
  if (sfGroup.getTypeID() === SFObjectType.MeshObject) {
    const sfMeshObject = sfGroup as SFMeshObject;
    id3Group.matrix = Array.from(sfMeshObject.getMatrix());
  }
  for (const child of sfGroup.children) {
    id3Group.children.push(convertObject(child));
  }
  return id3Group;
}

function convertMesh(sfMesh: SFMesh): I3DMesh {
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
    id: sfMesh.getInstanceID().toString(),
    name: sfMesh.getName(),
    geometry: {
      vertices: Array.from(attributes.Vertex.getElements()),
      primitives,
      normals: EXPORT_NORMAL
        ? Array.from(attributes.Normal.getElements())
        : undefined,
      uvs: EXPORT_UV
        ? Array.from(attributes.TexCoord0.getElements())
        : undefined,
    },
    children: [],
  };
}
