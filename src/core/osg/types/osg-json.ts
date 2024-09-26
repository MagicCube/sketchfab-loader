export interface OsgJSON {
  Generator: string;
  Version: number;
  ["osg.Node"]: OsgJSONNode;
}

export type OsgJSONObject<K extends string, V> = {
  [key in K]: V;
};

export interface OsgJSONNode {
  UniqueID: number;
}

export interface OsgJSONNamedNode extends OsgJSONNode {
  Name: string;
}

export interface OsgJSONContainer extends OsgJSONNamedNode {
  Children: (
    | OsgJSONObject<"osg.Node", OsgJSONNode>
    | OsgJSONObject<"osg.MatrixTransform", OsgJSONMatrixTransform>
    | OsgJSONObject<"osg.Geometry", OsgJSONGeometry>
  )[];
}

export interface OsgJSONMatrixTransform extends OsgJSONContainer {
  Matrix: number[];
}

export interface OsgJSONGeometry extends OsgJSONNamedNode {
  StateSet: OsgJSONObject<"osg.StateSet", OsgJSONStateSet | OsgJSONNode>;
}

export interface OsgJSONStateSet extends OsgJSONNode {
  RenderingHint: string;
  AttributeList: [];
  TextureAttributeList: [];
  UserDataContainer: [];
}
