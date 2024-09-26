"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense } from "react";

import { Tip3Loader } from "~/core/tip3/loading";

function MainScene() {
  const model = useLoader(Tip3Loader, "/tesla-model-3.tip3.json");

  return (
    <group>
      <primitive object={model} />
    </group>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="text-secondary flex h-screen w-screen items-center justify-center bg-[#17181a] text-white">
          Loading model...
        </div>
      }
    >
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
    </Suspense>
  );
}
