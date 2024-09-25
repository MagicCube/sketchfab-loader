import {
  type I3DObject,
  type I3DGroup,
  I3DObjectType,
  type I3DMesh,
  type I3DPrimitive,
} from "~/core/i3d/types";

import {
  type OSGObject,
  OSGObjectType,
  type OSGNode,
  type OSGMatrixTransform,
  type OSGGeometry,
} from "../types";

const EXPORT_NORMAL = false;
const EXPORT_UV = false;

export function convertModel(model: OSGObject) {
  const root = convertObject(model);
  return root;
}

function convertObject(osgObject: OSGObject): I3DObject {
  switch (osgObject.getTypeID()) {
    case OSGObjectType.Node:
    case OSGObjectType.MatrixTransform:
      return convertToGroup(osgObject as OSGNode | OSGMatrixTransform);
    case OSGObjectType.Geometry:
      return convertToMesh(osgObject as OSGGeometry);
    default:
      console.error("Unsupported object type", osgObject);
      throw new Error(`Unsupported object type: ${osgObject.getTypeID()}`);
  }
}

function convertToGroup(osgGroup: OSGNode | OSGMatrixTransform): I3DGroup {
  const id3Group: I3DGroup = {
    type: I3DObjectType.Group,
    id: osgGroup.getInstanceID().toString(),
    name: osgGroup.getName(),
    children: [],
  };
  if (osgGroup.getTypeID() === OSGObjectType.MatrixTransform) {
    const osgMeshObject = osgGroup as OSGMatrixTransform;
    id3Group.matrix = Array.from(osgMeshObject.getMatrix());
  }
  for (const child of osgGroup.children) {
    id3Group.children.push(convertObject(child));
  }
  return id3Group;
}

function convertToMesh(osgMesh: OSGGeometry): I3DMesh {
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
