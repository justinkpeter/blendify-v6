import React, { Suspense, useRef } from "react";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

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

  const mouse = useRef({ x: 0, y: 0 });
  const interacting = useRef(false);
  const idleTimeout = useRef<NodeJS.Timeout | null>(null);

  // Listen to global mouse movement
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;

      interacting.current = true;

      if (idleTimeout.current) clearTimeout(idleTimeout.current);

      // reset flag after 1.5s of no movement
      idleTimeout.current = setTimeout(() => {
        interacting.current = false;
      }, 1500);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (model.current) {
      const targetX = (mouse.current.x * Math.PI) / 8;
      const targetY = (mouse.current.y * Math.PI) / 8;

      if (interacting.current) {
        // Ease toward mouse rotation
        model.current.rotation.y += (targetX - model.current.rotation.y) * 0.1;
        model.current.rotation.x += (targetY - model.current.rotation.x) * 0.1;
      } else {
        // Ease back to original rotation
        model.current.rotation.y += (0 - model.current.rotation.y) * 0.05;
        model.current.rotation.x += (0 - model.current.rotation.x) * 0.05;
      }
    }
  });

  return (
    <group ref={model} {...props} dispose={null}>
      <group>
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
    </group>
  );
}
export default function Headphones() {
  return (
    <Canvas
      camera={{
        fov: 10,
        zoom: 0.92,
        near: 10,
        far: 2500,
      }}
    >
      <Suspense fallback={null}>
        <Stage
          preset="rembrandt"
          intensity={1.5}
          environment="studio"
          shadows={false}
        >
          <Model position={[0, 5, 0]} />
        </Stage>
      </Suspense>
      <OrbitControls enableRotate={true} enableZoom={false} />
    </Canvas>
  );
}

useGLTF.preload("/models/beats.glb");
