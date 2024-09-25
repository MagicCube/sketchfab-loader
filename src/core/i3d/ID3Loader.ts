import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  FileLoader,
  Group,
  Loader,
  LoaderUtils,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  type Object3D,
} from "three";
import { toTrianglesDrawMode } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import {
  type I3DMesh,
  type I3DObject,
  I3DObjectType,
  type I3DGroup,
} from "./types";

const textDecoder = new TextDecoder();

export class ID3Loader extends Loader<Object3D> {
  constructor() {
    super();
  }

  getResourcePath(url: string) {
    let resourcePath: string;
    if (this.resourcePath !== "") {
      resourcePath = this.resourcePath;
    } else if (this.path !== "") {
      const relativeUrl = LoaderUtils.extractUrlBase(url);
      resourcePath = LoaderUtils.resolveURL(relativeUrl, this.path);
    } else {
      resourcePath = LoaderUtils.extractUrlBase(url);
    }
    return resourcePath;
  }

  load(
    url: string,
    onLoad: (data: Object3D) => void,
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

    const loader = new FileLoader(this.manager);

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

  parse(data: I3DGroup): Object3D {
    return this._parseObject(data);
  }

  private _parseObject(obj: I3DObject) {
    if (obj.type === I3DObjectType.Group) {
      return this._parseGroup(obj);
    }
    return this._parseMesh(obj);
  }

  private _parseGroup(id3Group: I3DGroup) {
    const group = new Group();
    for (const child of id3Group.children) {
      if (child.id === "1039") {
        continue;
      }
      group.add(this._parseObject(child));
    }
    if (id3Group.matrix) {
      const matrix = new Matrix4();
      matrix.fromArray(id3Group.matrix);
      group.position.setFromMatrixPosition(matrix);
      group.quaternion.setFromRotationMatrix(matrix);
    }
    return group;
  }

  private _parseMeshGeometry(id3Mesh: I3DMesh) {
    let geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(id3Mesh.geometry.vertices), 3),
    );

    if (id3Mesh.geometry.normals) {
      geometry.setAttribute(
        "normal",
        new BufferAttribute(new Float32Array(id3Mesh.geometry.normals), 3),
      );
    }

    if (id3Mesh.geometry.uvs) {
      geometry.setAttribute(
        "uv",
        new BufferAttribute(new Float32Array(id3Mesh.geometry.uvs), 2),
      );
    }

    geometry.setIndex(id3Mesh.geometry.primitives[0]!.indices);
    if (id3Mesh.geometry.primitives[0]?.mode === 5) {
      geometry = toTrianglesDrawMode(geometry, 1);
    }

    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    return geometry;
  }

  private _parseMesh(id3Mesh: I3DMesh) {
    const geometry = this._parseMeshGeometry(id3Mesh);
    const BASIC_COLORS = [
      0x00ff00, 0xff0000, 0x0000ff, 0xffff00, 0xffa500, 0x00ffff, 0xff00ff,
    ];
    const material = new MeshStandardMaterial({
      color: BASIC_COLORS[parseInt(id3Mesh.id) % BASIC_COLORS.length],
      transparent: false,
      opacity: 1,
      roughness: 0.5,
      metalness: 0.5,
    });
    material.side = DoubleSide;

    const mesh = new Mesh(geometry, material);
    mesh.name = id3Mesh.name;
    return mesh;
  }
}
