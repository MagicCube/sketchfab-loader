import { type ObjectDeclaration, type NamedObject, type Object } from "./index";

type Vector4 = [number, number, number, number];

export interface StateSet extends Object {
  RenderingHint?: string;
  AttributeList: (
    | ObjectDeclaration<"osg.Material", Material>
    | ObjectDeclaration<"osg.BlendFunc", BlendFunc>
  )[];
  TextureAttributeList: ObjectDeclaration<"osg.Texture", Texture>[][];
  UserDataContainer: UserDataContainer;
}

export interface Material extends NamedObject {
  Ambient: Vector4;
  Diffuse: Vector4;
  Emission: Vector4;
  Shininess: number;
  Specular: Vector4;
}

export interface BlendFunc extends Object {
  DestinationAlpha: string;
  DestinationRGB: string;
  SourceAlpha: string;
  SourceRGB: string;
}

export interface Texture extends Object {
  File: string;
  MagFilter: string;
  MinFilter: string;
  WrapS: string;
  WrapT: string;
}

export interface UserDataContainer extends Object {
  Values: UserDataValue[];
}

export interface UserDataValue extends Object {
  Name:
    | "LambertAmbientColor"
    | "LambertAmbientFactor"
    | "LambertBumpFactor"
    | "LambertDiffuseColor"
    | "LambertDiffuseFactor"
    | "LambertEmissiveColor"
    | "LambertEmissiveFactor"
    | "LambertTransparencyFactor"
    | "PhongReflectionFactor"
    | "PhongShininess"
    | "PhongSpecularColor"
    | "PhongSpecularFactor"
    | "sDiffuse"
    | "source"
    | "UniqueID";
  Value: string;
}
