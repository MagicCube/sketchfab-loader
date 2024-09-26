import * as THREE from "three";
import { toTrianglesDrawMode } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import osgJSON from "~/app/test/tesla-model-3.osg.json";
import { MaterialLoader } from "~/core/osgjson/loading";

import * as tip3 from "../types";

const textDecoder = new TextDecoder();

export class Tip3Loader extends THREE.Loader<THREE.Object3D> {
  private _materials: THREE.Material[] = [];

  constructor() {
    super();
  }

  getResourcePath(url: string) {
    let resourcePath: string;
    if (this.resourcePath !== "") {
      resourcePath = this.resourcePath;
    } else if (this.path !== "") {
      const relativeUrl = THREE.LoaderUtils.extractUrlBase(url);
      resourcePath = THREE.LoaderUtils.resolveURL(relativeUrl, this.path);
    } else {
      resourcePath = THREE.LoaderUtils.extractUrlBase(url);
    }
    return resourcePath;
  }

  load(
    url: string,
    onLoad: (data: THREE.Object3D) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (err: unknown) => void,
  ): void {
    const resourcePath =
      "https://media.sketchfab.com/models/55daee6824b945bb94f9018197b7949d/fc9af78e5ce74c34b38bd5d359649664/";

    this.manager.itemStart(url);

    this._materials = new MaterialLoader(resourcePath).loadMaterials(osgJSON);

    const _onError = (e: unknown) => {
      if (onError) {
        onError(e);
      } else {
        console.error(e);
      }

      this.manager.itemError(url);
      this.manager.itemEnd(url);
    };

    const loader = new THREE.FileLoader(this.manager);

    loader.setPath(this.path);
    loader.setResponseType("arraybuffer");
    loader.setRequestHeader(this.requestHeader);
    loader.setWithCredentials(this.withCredentials);

    loader.load(
      url,
      (data) => {
        try {
          const jsonString =
            typeof data === "string" ? data : textDecoder.decode(data);
          const result = this.parse(JSON.parse(jsonString));
          onLoad(result);
          this.manager.itemEnd(url);
        } catch (e) {
          _onError(e);
        }
      },
      onProgress,
      _onError,
    );
  }

  parse(data: tip3.Group): THREE.Object3D {
    return this._parseObject(data);
  }

  private _parseObject(obj: tip3.Object) {
    if (obj.type === tip3.ObjectType.Group) {
      return this._parseGroup(obj);
    }
    return this._parseMesh(obj);
  }

  private _parseGroup(tip3Group: tip3.Group) {
    const group = new THREE.Group();
    for (const child of tip3Group.children) {
      if (child.name === "BASE") {
        continue;
      }
      group.add(this._parseObject(child));
    }
    if (tip3Group.matrix) {
      const matrix = new THREE.Matrix4();
      matrix.fromArray(tip3Group.matrix);
      group.position.setFromMatrixPosition(matrix);
      group.quaternion.setFromRotationMatrix(matrix);
    }
    return group;
  }

  private _parseMeshGeometry(tip3Mesh: tip3.Mesh) {
    let geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array(tip3Mesh.geometry.vertices),
        3,
      ),
    );

    if (tip3Mesh.geometry.normals) {
      geometry.setAttribute(
        "normal",
        new THREE.BufferAttribute(
          new Float32Array(tip3Mesh.geometry.normals),
          3,
        ),
      );
    }

    if (tip3Mesh.geometry.uvs) {
      geometry.setAttribute(
        "uv",
        new THREE.BufferAttribute(new Float32Array(tip3Mesh.geometry.uvs), 2),
      );
    }

    geometry.setIndex(tip3Mesh.geometry.primitives[0]!.indices);
    if (tip3Mesh.geometry.primitives[0]?.mode === 5) {
      geometry = toTrianglesDrawMode(geometry, 1);
    }

    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    return geometry;
  }

  private _parseMesh(tip3Mesh: tip3.Mesh) {
    const geometry = this._parseMeshGeometry(tip3Mesh);
    let material: THREE.Material | undefined = undefined;
    const foundMaterial = this._findMaterial(tip3Mesh.name);
    if (foundMaterial) {
      material = foundMaterial;
    }
    if (!material) {
      console.warn(`No material found for mesh: ${tip3Mesh.name}`);
      material = new THREE.MeshStandardMaterial();
    }
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = tip3Mesh.name;
    return mesh;
  }

  private _findMaterial(name: string) {
    return this._materials.find(
      (material) => material.name === name || name.includes(material.name),
    );
  }
}
