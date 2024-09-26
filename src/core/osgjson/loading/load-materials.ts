import * as THREE from "three";

import type * as osgjson from "../types";
import { traverse } from "../utils/traverse";

export class MaterialLoader {
  constructor(readonly resourcePath: string) {}

  loadMaterials(osgModel: osgjson.RootModel) {
    const stateSets: osgjson.StateSet[] = [];
    for (const [node] of traverse(
      osgModel["osg.Node"],
      (node, nodeType) => nodeType === "osg.Geometry",
    )) {
      const geometry = node as osgjson.Geometry;
      if (
        geometry.StateSet &&
        "osg.StateSet" in geometry.StateSet &&
        "AttributeList" in geometry.StateSet["osg.StateSet"]
      ) {
        const stateSet = geometry.StateSet["osg.StateSet"];
        stateSets.push(stateSet);
      }
    }
    const materials = stateSets.map(this._convertToMaterial);
    return materials;
  }

  private _convertToMaterial = (stateSet: osgjson.StateSet) => {
    const material = new THREE.MeshPhongMaterial();
    material.side = THREE.DoubleSide;

    for (const declaration of stateSet.AttributeList) {
      if ("osg.Material" in declaration) {
        const osgMaterial = declaration["osg.Material"];
        if (osgMaterial.Name) {
          material.name = osgMaterial.Name;
        }
        // osgMaterial.Diffuse
        material.emissive.fromArray(osgMaterial.Emission);
        material.specular.fromArray(osgMaterial.Specular);
        material.shininess = osgMaterial.Shininess;
      } else if ("osg.BlendFunc" in declaration) {
        const osgBlendFunc = declaration["osg.BlendFunc"];
        material.transparent = true;
        material.blending = THREE.CustomBlending;
        if (osgBlendFunc.SourceRGB === "SRC_ALPHA") {
          material.blendSrc = THREE.SrcAlphaFactor;
        }
        if (osgBlendFunc.SourceAlpha === "SRC_ALPHA") {
          material.blendSrcAlpha = THREE.SrcAlphaFactor;
        }
        if (osgBlendFunc.DestinationRGB === "ONE_MINUS_SRC_ALPHA") {
          material.blendDst = THREE.OneMinusSrcAlphaFactor;
        }
        if (osgBlendFunc.DestinationAlpha === "ONE_MINUS_SRC_ALPHA") {
          material.blendDstAlpha = THREE.OneMinusSrcAlphaFactor;
        }
      }
    }

    if (stateSet.TextureAttributeList[0]?.length) {
      const texture = stateSet.TextureAttributeList[0][0]!["osg.Texture"];
      if (texture) {
        const url = new URL(texture.File, this.resourcePath).toString();
        const texture3 = new THREE.TextureLoader().load(url);
        texture3.channel = 1;
        material.map = texture3;
      }
    }
    return material;
  };
}
