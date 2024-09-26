export * from "./osg-json";

export enum OsgObjectType {
  Node = 5,
  MatrixTransform = 22,
  Geometry = 17,
}

export type OsgObject = OsgNode | OsgMatrixTransform | OsgGeometry;

export interface OsgGenericObject<T extends OsgObjectType> {
  getTypeID(): T;
  getInstanceID(): number;
  getName(): string;
  children: OsgObject[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OsgNode extends OsgGenericObject<OsgObjectType.Node> {}

export interface OsgMatrixTransform
  extends OsgGenericObject<OsgObjectType.MatrixTransform> {
  getMatrix(): number[];
}

export interface OsgGeometry extends OsgGenericObject<OsgObjectType.Geometry> {
  getAttributes(): OsgAttributes;
  getPrimitives(): OsgPrimitive[];
}

// Parts of geometry
export interface OsgPrimitive {
  mode: number;
  indices: OsgAttribute<Uint16Array>;
}

export interface OsgAttributes {
  Vertex: OsgAttribute;
  Normal: OsgAttribute;
  TexCoord0: OsgAttribute;
}

export interface OsgAttribute<
  T extends Float32Array | Uint16Array = Float32Array,
> {
  getElements(): T;
}
