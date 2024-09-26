import {
  type I3DObject,
  type I3DGroup,
  I3DObjectType,
  type I3DMesh,
  type I3DPrimitive,
} from "~/core/i3d/types";

import {
  type OsgObject,
  OsgObjectType,
  type OsgNode,
  type OsgMatrixTransform,
  type OsgGeometry,
  type OsgJSON,
} from "../types";

const EXPORT_NORMAL = false;
const EXPORT_UV = false;

export function convertModel(model: OsgObject, json: OsgJSON | string) {
  const root = convertObject(model);
  return root;
}

function convertObject(osgObject: OsgObject): I3DObject {
  switch (osgObject.getTypeID()) {
    case OsgObjectType.Node:
    case OsgObjectType.MatrixTransform:
      return convertToGroup(osgObject as OsgNode | OsgMatrixTransform);
    case OsgObjectType.Geometry:
      return convertToMesh(osgObject as OsgGeometry);
    default:
      console.error("Unsupported object type", osgObject);
      throw new Error(`Unsupported object type: ${osgObject.getTypeID()}`);
  }
}

function convertToGroup(osgGroup: OsgNode | OsgMatrixTransform): I3DGroup {
  const id3Group: I3DGroup = {
    type: I3DObjectType.Group,
    id: osgGroup.getInstanceID().toString(),
    name: osgGroup.getName(),
    children: [],
  };
  if (osgGroup.getTypeID() === OsgObjectType.MatrixTransform) {
    const osgMeshObject = osgGroup as OsgMatrixTransform;
    id3Group.matrix = Array.from(osgMeshObject.getMatrix());
  }
  for (const child of osgGroup.children) {
    id3Group.children.push(convertObject(child));
  }
  return id3Group;
}

function convertToMesh(osgMesh: OsgGeometry): I3DMesh {
  const primitives = osgMesh
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
  const attributes = osgMesh.getAttributes();
  return {
    type: I3DObjectType.Mesh,
    id: osgMesh.getInstanceID().toString(),
    name: osgMesh.getName(),
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
