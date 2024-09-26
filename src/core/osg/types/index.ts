export enum ObjectType {
  Node = 5,
  MatrixTransform = 22,
  Geometry = 17,
}

export type Object = Node | MatrixTransform | Geometry;

export interface GenericObject<T extends ObjectType> {
  getTypeID(): T;
  getInstanceID(): number;
  getName(): string;
  children: Object[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Node extends GenericObject<ObjectType.Node> {}

export interface MatrixTransform
  extends GenericObject<ObjectType.MatrixTransform> {
  getMatrix(): number[];
}

export interface Geometry extends GenericObject<ObjectType.Geometry> {
  getAttributes(): Attributes;
  getPrimitives(): Primitive[];
  getStateSet(): StateSet | null | undefined;
}

// Parts of geometry
export interface Primitive {
  mode: number;
  indices: Attribute<Uint16Array>;
}

export interface StateSet {
  getName(): string;
}

export interface Attributes {
  Vertex: Attribute;
  Normal: Attribute;
  TexCoord0: Attribute;
}

export interface Attribute<
  T extends Float32Array | Uint16Array = Float32Array,
> {
  getElements(): T;
}
