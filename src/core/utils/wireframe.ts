import { useEffect } from "react";
import {
  EdgesGeometry,
  LineBasicMaterial,
  type LineBasicMaterialParameters,
  LineSegments,
  Mesh,
  type Object3D,
} from "three";

import { forEach } from "./traverse";

export interface WireframeOptions {
  material?: LineBasicMaterialParameters;
  thresholdAngle?: number;
  wireframeOnly?: boolean;
}

export function wireframe(
  model: Object3D,
  {
    material,
    thresholdAngle = 1,
    wireframeOnly = false,
  }: WireframeOptions = {},
) {
  const meshes: Mesh[] = [];
  forEach(model, (obj) => {
    if (obj instanceof Mesh) {
      const parent = obj.parent!;
      const edgesGeometry = new EdgesGeometry(obj.geometry, thresholdAngle);
      const lineMaterial = new LineBasicMaterial(material);
      const line = new LineSegments(edgesGeometry, lineMaterial);
      parent.add(line);
      meshes.push(obj);
    }
  });

  if (wireframeOnly) {
    for (const mesh of meshes) {
      mesh.removeFromParent();
    }
  }

  return model;
}

export function useWireframe(model: Object3D, options: WireframeOptions = {}) {
  useEffect(() => {
    wireframe(model, options);
  }, [model, options]);
}
