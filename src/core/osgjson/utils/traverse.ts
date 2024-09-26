import { type Object, type Node } from "../types";

export function* traverse(
  node: Node,
  filter: (node: Object, nodeType: string) => boolean = () => true,
  nodeType = "osg.RootModel",
): Iterable<[Object, string]> {
  if (filter(node, nodeType)) {
    yield [node, nodeType];
  }
  if ("Children" in node) {
    for (const child of node.Children) {
      const childTypes = Object.keys(child) as (keyof typeof child)[];
      for (const childType of childTypes) {
        yield* traverse(child[childType], filter, childType);
      }
    }
  }
}
