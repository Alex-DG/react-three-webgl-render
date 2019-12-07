import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

import image from './assets/js.png';

// @ts-ignore
import threeOrbitControls from 'three-orbit-controls';
const OrbitControls = threeOrbitControls(THREE);

const Cube = () => {
  const canvasRef = useRef(null);

  let scene = new THREE.Scene();

  let renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  let frameId: number;
  let cube;
  let controls: any;
  let camera: THREE.PerspectiveCamera;
  let width;
  let height;

  const initializeOrbits = () => {
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
  };
  const initializeCamera = () => {
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 4;
  };
  const animate = () => {
    frameId = window.requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };

  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      //@ts-ignore
      width = canvasRef.current.clientWidth || 0;
      //@ts-ignore
      height = canvasRef.current.clientHeight || 0;

      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      controls = new OrbitControls(camera, renderer.domElement);
      renderer.setSize(width, height);

      //@ts-ignore
      canvasRef.current.appendChild(renderer.domElement);

      initializeOrbits();
      initializeCamera();

      new THREE.CubeTextureLoader().load(
        // urls of images used in the cube texture
        [image, image, image, image, image, image],

        // what to do when loading is over
        cubeTexture => {
          // Geometry
          var geometry = new THREE.BoxGeometry(1, 1, 1);

          // scale x2 horizontal
          // cubeTexture.repeat.set(0.5, 1);
          // // scale x2 vertical
          cubeTexture.repeat.set(1, 0.5);
          // // scale x2 proportional
          // cubeTexture.repeat.set(0.5, 0.5);

          // Material
          var material = new THREE.MeshBasicMaterial({
            // CUBE TEXTURE can be used with
            // the environment map property of
            // a material.
            envMap: cubeTexture
          });

          // Mesh
          var mesh = new THREE.Mesh(geometry, material);
          scene.add(mesh);

          // CUBE TEXTURE is also an option for a background
          //scene.background = cubeTexture;

          animate();
        }
      );

      return () => {
        cancelAnimationFrame(frameId);
        //@ts-ignore
        canvasRef.current.removeChild(renderer.domElement);
      };
    }
  }, [canvasRef]);

  return (
    <div>
      <div
        id="boardCanvas"
        style={{ width: '80vw', height: '50vw' }}
        ref={canvasRef}
      />
    </div>
  );
};

export default Cube;
