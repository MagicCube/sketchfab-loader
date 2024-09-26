import { type OsgJSONNode, type OsgJSONContainer } from "../types/osg-json";

export function* OsgJSONtraverse(
  node: OsgJSONNode,
  filter: (node: OsgJSONNode, nodeType: string) => boolean = () => true,
  nodeType = "root",
): Iterable<[OsgJSONNode, string]> {
  if (filter(node, nodeType)) {
    yield [node, nodeType];
  }
  if ("Children" in node) {
    const container = node as OsgJSONContainer;
    for (const child of container.Children) {
      const childTypes = Object.keys(child) as (keyof typeof child)[];
      for (const childType of childTypes) {
        yield* OsgJSONtraverse(child[childType], filter, childType);
      }
    }
  }
}
