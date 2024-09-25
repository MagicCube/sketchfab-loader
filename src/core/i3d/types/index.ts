export enum I3DObjectType {
  Mesh = 0x01,
  Group = 0x10,
}

export interface I3DGenericObject<T extends I3DObjectType> {
  id: string;
  name: string;
  type: T;
  children: I3DObject[];
}

export interface I3DGroup extends I3DGenericObject<I3DObjectType.Group> {
  matrix?: number[];
}

// 5: TriangleStripDrawMode
// 1: TrianglesDrawMode
export type I3DPrimitiveMode = 1 | 5;

export interface I3DPrimitive {
  mode: I3DPrimitiveMode;
  indices: number[];
}

export interface I3DGeometry {
  vertices: number[];
  primitives: I3DPrimitive[];
  normals?: number[];
  uvs?: number[];
}

export interface I3DMesh extends I3DGenericObject<I3DObjectType.Mesh> {
  geometry: I3DGeometry;
}

export type I3DObject = I3DGroup | I3DMesh;
