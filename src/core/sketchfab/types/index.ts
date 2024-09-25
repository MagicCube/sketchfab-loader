export enum SFObjectType {
  Group = 5,
  MeshObject = 22,
  Mesh = 17,
}

export interface SFGenericObject<T extends SFObjectType> {
  getTypeID(): T;
  getInstanceID(): number;
  getName(): string;
  getStateSet(): SFStateSet | undefined;
  children: SFObject[];
}

export type SFTextureAttributeArray = [];

export interface SFStateSet {
  _textureAttributeArrayList: SFTextureAttributeArray[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SFGroup extends SFGenericObject<SFObjectType.Group> {}

export interface SFMeshObject extends SFGenericObject<SFObjectType.MeshObject> {
  getMatrix(): number[];
}

export interface SFAttribute<
  T extends Float32Array | Uint16Array = Float32Array,
> {
  getElements(): T;
}

export interface SFMeshAttributes {
  Vertex: SFAttribute;
  Normal: SFAttribute;
  TexCoord0: SFAttribute;
}

export interface SFPrimitive {
  mode: number;
  indices: SFAttribute<Uint16Array>;
}

export interface SFMesh extends SFGenericObject<SFObjectType.Mesh> {
  getAttributes(): SFMeshAttributes;
  getPrimitives(): SFPrimitive[];
}

export type SFObject = SFGroup | SFMeshObject | SFMesh;
