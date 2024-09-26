import { useEffect } from "react";
import * as THREE from "three";

import { forEach } from "./traverse";

export interface WireframeOptions {
  material?: THREE.LineBasicMaterialParameters;
  thresholdAngle?: number;
  wireframeOnly?: boolean;
}

export function wireframe(
  model: THREE.Object3D,
  {
    material,
    thresholdAngle = 1,
    wireframeOnly = false,
  }: WireframeOptions = {},
) {
  const meshes: THREE.Mesh[] = [];
  forEach(model, (obj) => {
    if (obj instanceof THREE.Mesh) {
      const parent = obj.parent!;
      const edgesGeometry = new THREE.EdgesGeometry(
        obj.geometry,
        thresholdAngle,
      );
      const lineMaterial = new THREE.LineBasicMaterial(material);
      const line = new THREE.LineSegments(edgesGeometry, lineMaterial);
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

export function useWireframe(
  model: THREE.Object3D,
  options: WireframeOptions = {},
) {
  useEffect(() => {
    wireframe(model, options);
  }, [model, options]);
}
