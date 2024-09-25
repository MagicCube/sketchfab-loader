export enum OSGObjectType {
  Node = 5,
  MatrixTransform = 22,
  Geometry = 17,
}

export type OSGObject = OSGNode | OSGMatrixTransform | OSGGeometry;

export interface OSGGenericObject<T extends OSGObjectType> {
  getTypeID(): T;
  getInstanceID(): number;
  getName(): string;
  children: OSGObject[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OSGNode extends OSGGenericObject<OSGObjectType.Node> {}

export interface OSGMatrixTransform
  extends OSGGenericObject<OSGObjectType.MatrixTransform> {
  getMatrix(): number[];
}

export interface OSGGeometry extends OSGGenericObject<OSGObjectType.Geometry> {
  getAttributes(): OSGAttributes;
  getPrimitives(): OSGPrimitive[];
}

// Parts of geometry
export interface OSGPrimitive {
  mode: number;
  indices: OSGAttribute<Uint16Array>;
}

export interface OSGAttributes {
  Vertex: OSGAttribute;
  Normal: OSGAttribute;
  TexCoord0: OSGAttribute;
}

export interface OSGAttribute<
  T extends Float32Array | Uint16Array = Float32Array,
> {
  getElements(): T;
}
