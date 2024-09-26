import * as THREE from "three";
import { toTrianglesDrawMode } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import * as tip3 from "../types";

const textDecoder = new TextDecoder();

export class Tip3Loader extends THREE.Loader<THREE.Object3D> {
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
    // const resourcePath = this.getResourcePath(url);

    this.manager.itemStart(url);

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
    const BASIC_COLORS = [
      0x00ff00, 0xff0000, 0x0000ff, 0xffff00, 0xffa500, 0x00ffff, 0xff00ff,
    ];
    const material = new THREE.MeshStandardMaterial({
      color: BASIC_COLORS[parseInt(tip3Mesh.id) % BASIC_COLORS.length],
      transparent: true,
      opacity: 1,
      roughness: 0.5,
      metalness: 0.5,
    });
    material.side = THREE.DoubleSide;

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = tip3Mesh.name;
    return mesh;
  }
}
