import * as tip3 from "~/core/tip3";

import * as osg from "../types";

const EXPORT_NORMAL = false;
const EXPORT_UV = true;

export function convertModel(model: osg.Object) {
  const root = convertObject(model);
  return root;
}

function convertObject(osgObject: osg.Object): tip3.Object {
  switch (osgObject.getTypeID()) {
    case osg.ObjectType.Node:
    case osg.ObjectType.MatrixTransform:
      return convertToGroup(osgObject as osg.Node | osg.MatrixTransform);
    case osg.ObjectType.Geometry:
      return convertToMesh(osgObject as osg.Geometry);
    default:
      console.error("Unsupported object type", osgObject);
      throw new Error(`Unsupported object type: ${osgObject.getTypeID()}`);
  }
}

function convertToGroup(osgGroup: osg.Node | osg.MatrixTransform): tip3.Group {
  const tip3Group: tip3.Group = {
    type: tip3.ObjectType.Group,
    id: osgGroup.getInstanceID().toString(),
    name: osgGroup.getName(),
    children: [],
  };
  if (osgGroup.getTypeID() === osg.ObjectType.MatrixTransform) {
    const osgMeshObject = osgGroup as osg.MatrixTransform;
    tip3Group.matrix = Array.from(osgMeshObject.getMatrix());
  }
  for (const child of osgGroup.children) {
    tip3Group.children.push(convertObject(child));
  }
  return tip3Group;
}

function convertToMesh(osgGeometry: osg.Geometry): tip3.Mesh {
  const primitives = osgGeometry
    .getPrimitives()
    .map((primitive) => {
      if (primitive?.indices) {
        return {
          mode: primitive.mode,
          indices: Array.from(primitive.indices.getElements()),
        } as tip3.Primitive;
      }
      return null;
    })
    .filter((p) => p !== null);
  const attributes = osgGeometry.getAttributes();
  let material: tip3.Material | undefined = undefined;
  if (osgGeometry.getStateSet()?.getName()) {
    material = {
      name: osgGeometry.getStateSet()!.getName(),
    };
  }
  return {
    type: tip3.ObjectType.Mesh,
    id: osgGeometry.getInstanceID().toString(),
    name: osgGeometry.getName(),
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
    material,
  };
}
