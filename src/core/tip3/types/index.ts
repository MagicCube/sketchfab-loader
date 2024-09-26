export enum ObjectType {
  Mesh = 0x01,
  Group = 0x10,
}

export type Object = Group | Mesh;

export interface Group extends GenericContainer<ObjectType.Group> {
  matrix?: number[];
}

export interface Mesh extends GenericObject<ObjectType.Mesh> {
  geometry: Geometry;
}

export interface GenericObject<T extends ObjectType> {
  id: string;
  name: string;
  type: T;
}

export interface GenericContainer<T extends ObjectType>
  extends GenericObject<T> {
  children: Object[];
}

// 5: TriangleStripDrawMode
// 1: TrianglesDrawMode
export type PrimitiveMode = 1 | 5;

export interface Primitive {
  mode: PrimitiveMode;
  indices: number[];
}

export interface Geometry {
  vertices: number[];
  primitives: Primitive[];
  normals?: number[];
  uvs?: number[];
}
