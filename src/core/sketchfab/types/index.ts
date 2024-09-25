export enum SFObjectType {
  Group = 5,
  MeshObject = 22,
  Mesh = 17,
}

export interface SFGenericObject<T extends SFObjectType> {
  getTypeID(): T;
  getInstanceID(): string;
  getName(): string;
  children: SFObject[];
}

export interface SFGroup extends SFGenericObject<SFObjectType.Group> {
  // Textures
}

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
