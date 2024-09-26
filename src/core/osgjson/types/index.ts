import { type StateSet } from "./StateSet";

export * from "./StateSet";

export interface RootModel
  extends ObjectDeclaration<"osg.Node", Pick<Node, "Children">> {
  Generator: string;
  Version: number;
}

export type ObjectDeclaration<K extends string, V> = {
  [key in K]: V;
};

export interface Object {
  UniqueID?: number;
}

export interface NamedObject extends Object {
  Name?: string;
}

export interface Node extends NamedObject {
  Children: (
    | ObjectDeclaration<"osg.Node", Node>
    | ObjectDeclaration<"osg.MatrixTransform", MatrixTransform>
    | ObjectDeclaration<"osg.Geometry", Geometry>
  )[];
}

export interface MatrixTransform extends Node {
  Matrix: number[];
}

export interface Geometry extends NamedObject {
  StateSet?: ObjectDeclaration<"osg.StateSet", StateSet | Object>;
}
