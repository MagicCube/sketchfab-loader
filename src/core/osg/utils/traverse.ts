import { type Object, type Node } from "../../osgjson/types";

export function* OsgJSONtraverse(
  node: Object,
  filter: (node: Object, nodeType: string) => boolean = () => true,
  nodeType = "root",
): Iterable<[Object, string]> {
  if (filter(node, nodeType)) {
    yield [node, nodeType];
  }
  if ("Children" in node) {
    const container = node as Node;
    for (const child of container.Children) {
      const childTypes = Object.keys(child) as (keyof typeof child)[];
      for (const childType of childTypes) {
        yield* OsgJSONtraverse(child[childType], filter, childType);
      }
    }
  }
}
