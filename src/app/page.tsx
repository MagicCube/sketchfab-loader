"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";

import { type I3DObject, loadModel as loadID3Model } from "~/core/i3d";
import id3Model from "~/models/tesla-model-3.json";

function MainScene() {
  const model = useMemo(() => {
    return loadID3Model(id3Model as I3DObject);
  }, []);
  return (
    <group>
      <primitive object={model} />
    </group>
  );
}

export default function HomePage() {
  return (
    <main className="flex h-screen w-screen bg-[#17181a]">
      <Canvas
        shadows
        orthographic
        camera={{
          zoom: 1.66,
          far: 10000,
          near: 0.00001,
          position: [0, 0, 500],
        }}
        gl={{ antialias: true, alpha: true }}
      >
        <OrbitControls />
        <group name="lights">
          <ambientLight intensity={1} />

          {/* Key Light */}
          <directionalLight
            position={[100, 600, -100]}
            intensity={1}
            castShadow
            shadow-mapSize-width={256}
            shadow-mapSize-height={256}
            shadow-camera-far={10000}
            shadow-camera-left={-1000}
            shadow-camera-right={1000}
            shadow-camera-top={1000}
            shadow-camera-bottom={-1000}
            shadow-radius={10}
          />

          {/* Fill Light */}
          <directionalLight position={[-500, 0, 500]} intensity={0.5} />

          {/* Back Light */}
          <directionalLight position={[0, 500, -500]} intensity={0.75} />
        </group>
        <MainScene />
      </Canvas>
    </main>
  );
}
