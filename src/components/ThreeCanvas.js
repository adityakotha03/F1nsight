import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const ThreeCanvas = ({ imageFile, locData, driverSelected, controls, speedFactor }) => {
  const [driverDetails, setDriverDetails] = useState(null);

  const mountRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(800, 600);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.z = 5;
    const control = new OrbitControls(camera, renderer.domElement);
    control.enablePan = true;
    control.panSpeed = 0.5;
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageFile, texture => {
      const imageWidth = texture.image.width / 100;
      const imageHeight = texture.image.height / 100;
      const geometry = new THREE.PlaneGeometry(imageWidth, imageHeight);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const plane = new THREE.Mesh(geometry, material);
      plane.rotation.z = -Math.PI / 2;
      scene.add(plane);
    });

    let carModel;
    const loader = new GLTFLoader();
    loader.load('/car/scene.gltf', function (gltf) {
      carModel = gltf.scene;
      carModel.scale.set(0.3, 0.3, 0.3);
      carModel.rotation.x = Math.PI / 2;
      carModel.rotation.y = -Math.PI;
      scene.add(carModel);
    }, undefined, function (error) {
      console.error(error);
    });

    const startTime = Date.now();
    let lastRenderTime = startTime;
    
    const animate = () => {

      requestAnimationFrame(animate);
      
      const currentTime = Date.now();
      const elapsedSinceLastRender = currentTime - lastRenderTime;

      const targetFrameDuration = 50 * speedFactor;

      if (elapsedSinceLastRender >= targetFrameDuration || elapsedSinceLastRender > 200) {
        //console.log(elapsedSinceLastRender);
        //console.log(elapsedSinceLastRender);
      if (carModel && locData.length > 0 && driverSelected) {
        const newPosition = locData.shift();
        let oldPosition = carModel.position;
        oldPosition.x = oldPosition.x + 2;
        oldPosition.y = oldPosition.y + 2;
        const angle = Math.atan2(newPosition.y - oldPosition.y, newPosition.x - oldPosition.x);
        const euler = new THREE.Euler(Math.PI / 2, 0, angle + Math.PI / 2, 'YZX');
        const quaternion = new THREE.Quaternion().setFromEuler(euler);
        carModel.quaternion.copy(quaternion);
        carModel.position.set(newPosition.x - 2, newPosition.y - 2, 0);

        lastRenderTime = currentTime;

        if (infoRef.current) {
          setDriverDetails(newPosition.cardata);
        }
      }
    }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.traverse(object => {
          if (object.material) {
              object.material.dispose();
          }
          if (object.geometry) {
              object.geometry.dispose();
          }
          if (object.isMesh) {
              object.geometry.dispose();
              object.material.dispose();
          }
      });
      if (control) {
          control.dispose();
      }
    };
  }, [imageFile, locData, driverSelected, speedFactor]);

  const drsActiveNumbers = [10, 12, 14]; // Define the DRS numbers that activate the message

  return (
    <div ref={mountRef} className="flex flex-col-reverse relative">
      {driverSelected &&
        <div className="w-full" ref={infoRef}>
          {(infoRef.current && driverDetails) ? (
            <div className="">
              <div className="flex flex-col">
                <p className="font-display text-[128px] leading-none">{driverDetails.speed}</p>
                <div className="flex justify-between">
                  <button className="uppercase text-sm tracking-wide">km/h</button>
                  <button className="uppercase text-sm tracking-wide text-neutral-500">mph</button>
                </div>
                {driverDetails.drs && drsActiveNumbers.includes(driverDetails.drs) &&(
                  <p className="border-solid border-2 border-emerald-700 bg-emerald-900 px-16">DRS Enabled</p>
                )}
              </div>
              <div className="flex flex-col">
                <p className="uppercase text-sm tracking-wide">Throttle</p>
                <div className="shadow-lg mb-8 border-solid border-2 border-neutral-800">
                  <div className="bg-emerald-900 h-24" style={{width: `${driverDetails.throttle}%`}} />
                </div>
                <div className="shadow-lg border-solid border-2 border-neutral-800">
                  <div className="bg-rose-900 h-24" style={{width: `${driverDetails.brake}%`}} />
                </div>
                <p className="uppercase text-sm tracking-wide">Brake</p>
              </div>
              <div className="flex flex-col">
                <p className="uppercase text-sm tracking-wide">Gear</p>
                <p className="font-display text-[128px] leading-none">{driverDetails.n_gear}</p>
              </div>
            </div>
          ) : <p>Loading driver details...</p>}
        </div>
      }
      {controls}
    </div>
  );
};