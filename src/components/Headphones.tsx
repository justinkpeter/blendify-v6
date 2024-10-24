import React, { Suspense, useRef } from "react";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";

type GLTFResult = GLTF & {
  nodes: {
    [name: string]: THREE.Mesh;
  };
  materials: {
    [name: string]: THREE.Material;
  };
};

function Model(props: JSX.IntrinsicElements["group"]) {
  const model = useRef<THREE.Group>(null);
  const { nodes, materials } = useGLTF(
    "/models/beats.glb"
  ) as unknown as GLTFResult;

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.B_logo.geometry}
        material={materials.PaletteMaterial001}
        position={[0, 0.028, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Clipping_Part2.geometry}
        material={materials.PaletteMaterial002}
        position={[0, 0.105, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Emission.geometry}
        material={materials.PaletteMaterial003}
        position={[0, 0.027, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Headset001.geometry}
        material={materials.PaletteMaterial004}
        position={[0, 0.042, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Left_Indicator.geometry}
        material={nodes.Left_Indicator.material}
        position={[0.076, 0.093, 0]}
      />
    </group>
  );
}

export default function Headphones() {
  return (
    <Canvas
      camera={{
        fov: 10,
        zoom: 0.55,
        near: 10,
        far: 2500,
        position: [0, 0, 500],
      }}
      style={{
        zIndex: -300,
      }}
    >
      <Suspense fallback={null}>
        <Stage
          preset="rembrandt"
          intensity={1.5}
          environment="studio"
          shadows={false}
        >
          <Model />
        </Stage>
      </Suspense>
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.5}
        enableRotate={false}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}

useGLTF.preload("/models/beats.glb");