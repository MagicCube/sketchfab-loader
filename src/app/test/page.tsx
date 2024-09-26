"use client";

import { useMemo } from "react";
import type THREE from "three";

import { loadMaterials } from "~/core/osgjson/loading/load-materials";

import osgJSON from "./tesla-model-3.osg.json";

export default function Page() {
  const materialMap = useMemo(() => {
    const materials = loadMaterials(osgJSON);
    const result = new Map<string, THREE.Material>();
    for (const material of materials) {
      result.set(material.name, material);
    }
    return result;
  }, []);
  console.info(materialMap);
  return <div>Hello World</div>;
}
